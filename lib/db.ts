import { sql } from "@vercel/postgres";
import { ExcludedSlots, slotKey, SlotSelection } from "./availability";

export interface BookingRecord {
  id: number;
  stripeSessionId: string;
  lessonType: string;
  date: string;
  time: string;
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  amountPaidCents: number;
  status: string;
}

export interface BlockedSlotRecord {
  id: number;
  date: string;
  time: string | null;
  reason: string | null;
}

// Postgres DATE columns come back from @vercel/postgres as JS Date objects
// (serialized to full ISO timestamps by JSON.stringify), not plain
// "YYYY-MM-DD" strings. Casting to ::text in every query below keeps dates
// as plain strings all the way through, matching what lib/availability.ts expects.

export async function getBookedSlotsInRange(
  startDate: string,
  endDate: string
): Promise<SlotSelection[]> {
  const { rows } = await sql<{ lesson_date: string; lesson_time: string }>`
    SELECT lesson_date::text, lesson_time FROM bookings
    WHERE status = 'confirmed'
      AND lesson_date >= ${startDate}
      AND lesson_date <= ${endDate}
  `;
  return rows.map((r) => ({ date: r.lesson_date, time: r.lesson_time }));
}

export async function getBlockedSlotsInRange(
  startDate: string,
  endDate: string
): Promise<{ date: string; time: string | null }[]> {
  const { rows } = await sql<{ blocked_date: string; blocked_time: string | null }>`
    SELECT blocked_date::text, blocked_time FROM blocked_slots
    WHERE blocked_date >= ${startDate} AND blocked_date <= ${endDate}
  `;
  return rows.map((r) => ({ date: r.blocked_date, time: r.blocked_time }));
}

export async function createBookings(input: {
  stripeSessionId: string;
  lessonType: string;
  slots: SlotSelection[];
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  amountPaidPerSlotCents: number;
}): Promise<void> {
  await Promise.all(
    input.slots.map((slot) =>
      sql`
        INSERT INTO bookings (
          stripe_session_id, lesson_type, lesson_date, lesson_time, duration_minutes,
          customer_name, customer_email, customer_phone, notes, amount_paid_cents
        ) VALUES (
          ${input.stripeSessionId}, ${input.lessonType}, ${slot.date}, ${slot.time}, ${input.durationMinutes},
          ${input.customerName}, ${input.customerEmail}, ${input.customerPhone}, ${input.notes}, ${input.amountPaidPerSlotCents}
        )
        ON CONFLICT (stripe_session_id, lesson_date, lesson_time) DO NOTHING
      `
    )
  );
}

export async function getBookingsInRange(
  startDate: string,
  endDate: string
): Promise<BookingRecord[]> {
  const { rows } = await sql`
    SELECT id, stripe_session_id, lesson_type, lesson_date::text, lesson_time, duration_minutes,
           customer_name, customer_email, customer_phone, notes, amount_paid_cents, status
    FROM bookings
    WHERE lesson_date >= ${startDate} AND lesson_date <= ${endDate}
    ORDER BY lesson_date, lesson_time
  `;
  return rows.map((r) => ({
    id: r.id,
    stripeSessionId: r.stripe_session_id,
    lessonType: r.lesson_type,
    date: r.lesson_date,
    time: r.lesson_time,
    durationMinutes: r.duration_minutes,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    notes: r.notes,
    amountPaidCents: r.amount_paid_cents,
    status: r.status,
  }));
}

export async function getBlockedSlotsList(
  startDate: string,
  endDate: string
): Promise<BlockedSlotRecord[]> {
  const { rows } = await sql`
    SELECT id, blocked_date::text, blocked_time, reason FROM blocked_slots
    WHERE blocked_date >= ${startDate} AND blocked_date <= ${endDate}
    ORDER BY blocked_date, blocked_time
  `;
  return rows.map((r) => ({
    id: r.id,
    date: r.blocked_date,
    time: r.blocked_time,
    reason: r.reason,
  }));
}

/** Combines confirmed bookings + admin blocks into the shape lib/availability.ts needs. */
export async function getExcludedSlots(startDate: string, endDate: string): Promise<ExcludedSlots> {
  const [booked, blocked] = await Promise.all([
    getBookedSlotsInRange(startDate, endDate),
    getBlockedSlotsInRange(startDate, endDate),
  ]);

  const fullyBlockedDates = new Set<string>();
  const takenSlots = new Set<string>();

  for (const b of booked) takenSlots.add(slotKey(b.date, b.time));

  for (const b of blocked) {
    if (b.time === null) fullyBlockedDates.add(b.date);
    else takenSlots.add(slotKey(b.date, b.time));
  }

  return { fullyBlockedDates, takenSlots };
}

export async function blockSlot(date: string, time: string | null, reason: string): Promise<void> {
  await sql`INSERT INTO blocked_slots (blocked_date, blocked_time, reason) VALUES (${date}, ${time}, ${reason})`;
}

export async function unblockSlot(id: number): Promise<void> {
  await sql`DELETE FROM blocked_slots WHERE id = ${id}`;
}
