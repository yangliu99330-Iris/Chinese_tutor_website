import { sql } from "@vercel/postgres";
import { ExcludedSlots, OccupiedRange, SLOT_INTERVAL_MINUTES, SlotSelection, timeToMinutes } from "./availability";
import { manageTokenFor } from "./manage-token";

export interface BookingRecord {
  id: number;
  stripeSessionId: string;
  manageToken: string;
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
): Promise<(SlotSelection & { durationMinutes: number })[]> {
  const { rows } = await sql<{ lesson_date: string; lesson_time: string; duration_minutes: number }>`
    SELECT lesson_date::text, lesson_time, duration_minutes FROM bookings
    WHERE status = 'confirmed'
      AND lesson_date >= ${startDate}
      AND lesson_date <= ${endDate}
  `;
  return rows.map((r) => ({ date: r.lesson_date, time: r.lesson_time, durationMinutes: r.duration_minutes }));
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
  stripePaymentIntentId: string | null;
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
    input.slots.map((slot) => {
      const manageToken = manageTokenFor(input.stripeSessionId, slot.date, slot.time);
      return sql`
        INSERT INTO bookings (
          stripe_session_id, stripe_payment_intent_id, manage_token, lesson_type, lesson_date, lesson_time, duration_minutes,
          customer_name, customer_email, customer_phone, notes, amount_paid_cents
        ) VALUES (
          ${input.stripeSessionId}, ${input.stripePaymentIntentId}, ${manageToken}, ${input.lessonType}, ${slot.date}, ${slot.time}, ${input.durationMinutes},
          ${input.customerName}, ${input.customerEmail}, ${input.customerPhone}, ${input.notes}, ${input.amountPaidPerSlotCents}
        )
        ON CONFLICT (stripe_session_id, lesson_date, lesson_time) DO NOTHING
      `;
    })
  );
}

export async function getBookingsInRange(
  startDate: string,
  endDate: string
): Promise<BookingRecord[]> {
  const { rows } = await sql`
    SELECT id, stripe_session_id, manage_token, lesson_type, lesson_date::text, lesson_time, duration_minutes,
           customer_name, customer_email, customer_phone, notes, amount_paid_cents, status
    FROM bookings
    WHERE lesson_date >= ${startDate} AND lesson_date <= ${endDate}
    ORDER BY lesson_date, lesson_time
  `;
  return rows.map((r) => ({
    id: r.id,
    stripeSessionId: r.stripe_session_id,
    manageToken: r.manage_token,
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

interface BookingRow {
  id: number;
  stripe_session_id: string;
  manage_token: string;
  lesson_type: string;
  lesson_date: string;
  lesson_time: string;
  duration_minutes: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  amount_paid_cents: number;
  status: string;
}

function mapBookingRow(r: BookingRow): BookingRecord {
  return {
    id: r.id,
    stripeSessionId: r.stripe_session_id,
    manageToken: r.manage_token,
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
  };
}

const BOOKING_COLUMNS = `id, stripe_session_id, manage_token, lesson_type, lesson_date::text, lesson_time, duration_minutes,
           customer_name, customer_email, customer_phone, notes, amount_paid_cents, status`;

/** Looks up a single booking by its customer-facing manage link token. */
export async function getBookingByToken(token: string): Promise<BookingRecord | null> {
  const { rows } = await sql.query<BookingRow>(
    `SELECT ${BOOKING_COLUMNS} FROM bookings WHERE manage_token = $1`,
    [token]
  );
  return rows[0] ? mapBookingRow(rows[0]) : null;
}

/** Customer self-service cancel via their manage link. Only affects confirmed bookings. */
export async function cancelBookingByToken(token: string): Promise<BookingRecord | null> {
  const { rows } = await sql.query<BookingRow>(
    `UPDATE bookings SET status = 'cancelled' WHERE manage_token = $1 AND status = 'confirmed' RETURNING ${BOOKING_COLUMNS}`,
    [token]
  );
  return rows[0] ? mapBookingRow(rows[0]) : null;
}

/** Customer self-service reschedule via their manage link. Caller must validate the new slot is available first. */
export async function rescheduleBookingByToken(
  token: string,
  newDate: string,
  newTime: string
): Promise<BookingRecord | null> {
  const { rows } = await sql.query<BookingRow>(
    `UPDATE bookings SET lesson_date = $2, lesson_time = $3
     WHERE manage_token = $1 AND status = 'confirmed'
     RETURNING ${BOOKING_COLUMNS}`,
    [token, newDate, newTime]
  );
  return rows[0] ? mapBookingRow(rows[0]) : null;
}

/** Admin manual cancel (e.g. covering a partial refund the automatic webhook handler can't attribute to one slot). */
export async function cancelBookingById(id: number): Promise<BookingRecord | null> {
  const { rows } = await sql.query<BookingRow>(
    `UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND status = 'confirmed' RETURNING ${BOOKING_COLUMNS}`,
    [id]
  );
  return rows[0] ? mapBookingRow(rows[0]) : null;
}

/**
 * Fires on a Stripe `charge.refunded` webhook event for a *full* refund —
 * releases every still-confirmed booking tied to that payment so the slot(s)
 * reopen automatically. Partial refunds are intentionally not handled here
 * (Stripe doesn't tell us which specific lesson a partial refund covers);
 * those need a manual cancel from the admin calendar instead.
 */
export async function cancelBookingsByPaymentIntent(paymentIntentId: string): Promise<BookingRecord[]> {
  const { rows } = await sql.query<BookingRow>(
    `UPDATE bookings SET status = 'cancelled'
     WHERE stripe_payment_intent_id = $1 AND status = 'confirmed'
     RETURNING ${BOOKING_COLUMNS}`,
    [paymentIntentId]
  );
  return rows.map((r) => mapBookingRow(r));
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
  const occupiedRanges = new Map<string, OccupiedRange[]>();

  function addRange(date: string, startMinutes: number, endMinutes: number) {
    const list = occupiedRanges.get(date) ?? [];
    list.push({ startMinutes, endMinutes });
    occupiedRanges.set(date, list);
  }

  // A booking occupies its full duration, not just its 15-minute start slot.
  for (const b of booked) {
    const start = timeToMinutes(b.time);
    addRange(b.date, start, start + b.durationMinutes);
  }

  for (const b of blocked) {
    if (b.time === null) {
      fullyBlockedDates.add(b.date);
    } else {
      const start = timeToMinutes(b.time);
      addRange(b.date, start, start + SLOT_INTERVAL_MINUTES);
    }
  }

  return { fullyBlockedDates, occupiedRanges };
}

export async function blockSlot(date: string, time: string | null, reason: string): Promise<void> {
  await sql`INSERT INTO blocked_slots (blocked_date, blocked_time, reason) VALUES (${date}, ${time}, ${reason})`;
}

export async function unblockSlot(id: number): Promise<void> {
  await sql`DELETE FROM blocked_slots WHERE id = ${id}`;
}

/**
 * Atomically claims the right to send confirmation emails for a Stripe
 * session. Returns true only for the caller that wins the race (first
 * successful insert) — everyone else (retries, manual "Resend" clicks,
 * concurrent deliveries) gets false and must skip sending.
 */
export async function claimBookingEmail(stripeSessionId: string): Promise<boolean> {
  const { rowCount } = await sql`
    INSERT INTO booking_emails (stripe_session_id) VALUES (${stripeSessionId})
    ON CONFLICT (stripe_session_id) DO NOTHING
  `;
  return (rowCount ?? 0) > 0;
}

/** Releases a claim so a future retry can send after a failed attempt. */
export async function releaseBookingEmailClaim(stripeSessionId: string): Promise<void> {
  await sql`DELETE FROM booking_emails WHERE stripe_session_id = ${stripeSessionId}`;
}
