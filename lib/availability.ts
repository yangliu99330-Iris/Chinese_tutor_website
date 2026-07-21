export type RecurrenceFrequency = "weekly" | "biweekly" | "monthly";

export interface SlotSelection {
  /** yyyy-mm-dd, local time */
  date: string;
  /** HH:mm, 24h, local time */
  time: string;
}

// ── Editable configuration ──────────────────────────────────────────────
// Business hours per weekday (0 = Sunday ... 6 = Saturday). `null` = closed.
export const BUSINESS_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null, // Sunday - closed
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "18:00" },
  6: { start: "10:00", end: "15:00" },
};

export const SLOT_INTERVAL_MINUTES = 15;
export const BOOKING_WINDOW_DAYS = 45;
export const MIN_NOTICE_HOURS = 12;

// Fully closed dates (holidays, time off), format yyyy-mm-dd.
export const BLOCKED_DATES: string[] = [];

// Demo data representing lessons already booked by other students.
export const BOOKED_SLOTS: SlotSelection[] = [
  { date: "2026-07-08", time: "10:00" },
  { date: "2026-07-08", time: "14:00" },
  { date: "2026-07-10", time: "16:00" },
];
// ─────────────────────────────────────────────────────────────────────────

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function isWithinBookingWindow(date: Date): boolean {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(startOfToday);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);
  return date >= startOfToday && date <= maxDate;
}

export function isDateBookable(date: Date): boolean {
  const dateKey = toDateKey(date);
  if (BLOCKED_DATES.includes(dateKey)) return false;
  if (!isWithinBookingWindow(date)) return false;
  return BUSINESS_HOURS[date.getDay()] !== null;
}

/** Returns available start times (HH:mm) for a lesson of `durationMinutes` on `date`. */
export function generateTimeSlots(date: Date, durationMinutes: number): string[] {
  if (!isDateBookable(date)) return [];

  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const dateKey = toDateKey(date);
  const bookedTimes = new Set(
    BOOKED_SLOTS.filter((b) => b.date === dateKey).map((b) => b.time)
  );

  const startMinutes = timeToMinutes(hours.start);
  const endMinutes = timeToMinutes(hours.end);

  const now = new Date();
  const isToday = toDateKey(now) === dateKey;
  const earliestAllowed = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);

  const slots: string[] = [];
  for (
    let m = startMinutes;
    m + durationMinutes <= endMinutes;
    m += SLOT_INTERVAL_MINUTES
  ) {
    const time = minutesToTime(m);
    if (bookedTimes.has(time)) continue;

    if (isToday) {
      const slotDateTime = new Date(date);
      slotDateTime.setHours(Math.floor(m / 60), m % 60, 0, 0);
      if (slotDateTime < earliestAllowed) continue;
    }

    slots.push(time);
  }
  return slots;
}

export function hasAvailability(date: Date, durationMinutes: number): boolean {
  return generateTimeSlots(date, durationMinutes).length > 0;
}

export function isSlotAvailable(dateKey: string, time: string, durationMinutes: number): boolean {
  const date = parseDateKey(dateKey);
  return generateTimeSlots(date, durationMinutes).includes(time);
}

/**
 * Builds a recurring set of slots starting from `first`, repeating at the given
 * frequency for `occurrences` total lessons. Skips dates that end up unavailable
 * and reports them so the UI can inform the customer.
 */
export function buildRecurringSlots(
  first: SlotSelection,
  frequency: RecurrenceFrequency,
  occurrences: number,
  durationMinutes: number
): { added: SlotSelection[]; skipped: SlotSelection[] } {
  const added: SlotSelection[] = [];
  const skipped: SlotSelection[] = [];

  const startDate = parseDateKey(first.date);

  for (let i = 0; i < occurrences; i++) {
    const candidate = new Date(startDate);
    if (frequency === "weekly") candidate.setDate(candidate.getDate() + 7 * i);
    else if (frequency === "biweekly") candidate.setDate(candidate.getDate() + 14 * i);
    else candidate.setMonth(candidate.getMonth() + i);

    const candidateKey = toDateKey(candidate);
    const slot = { date: candidateKey, time: first.time };

    if (i === 0 || isSlotAvailable(candidateKey, first.time, durationMinutes)) {
      added.push(slot);
    } else {
      skipped.push(slot);
    }
  }

  return { added, skipped };
}
