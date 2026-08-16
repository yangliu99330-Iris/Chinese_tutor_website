import { DateTime } from "luxon";

// Every stored/admin-configured time (availability windows, bookings, DB
// columns) is wall-clock time in the tutor's own zone. This module is the
// single place that converts between that and whatever zone a browsing
// customer is in, purely for display/input — it never touches storage.
export const TUTOR_ZONE = "Europe/London";

export function detectCustomerZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || TUTOR_ZONE;
  } catch {
    return TUTOR_ZONE;
  }
}

interface DateTimeKey {
  date: string;
  time: string;
}

function convert(date: string, time: string, fromZone: string, toZone: string): DateTimeKey {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const source = DateTime.fromObject({ year, month, day, hour, minute }, { zone: fromZone });
  if (!source.isValid) return { date, time };
  const target = source.setZone(toZone);
  return { date: target.toFormat("yyyy-MM-dd"), time: target.toFormat("HH:mm") };
}

/** Converts a UK wall-clock date+time into the same instant's wall-clock date+time in `zone`. */
export function ukToZone(date: string, time: string, zone: string): DateTimeKey {
  return convert(date, time, TUTOR_ZONE, zone);
}

/** Inverse of ukToZone — converts a customer-local wall-clock date+time back to UK wall-clock date+time. */
export function zoneToUk(date: string, time: string, zone: string): DateTimeKey {
  return convert(date, time, zone, TUTOR_ZONE);
}

/** Converts a UK slot's full start+end range into `zone`, computing the end from duration in `zone` (not UK) so DST transitions during the lesson can't skew it. */
export function ukRangeToZone(
  date: string,
  time: string,
  durationMinutes: number,
  zone: string
): { start: DateTimeKey; end: DateTimeKey } {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const startUk = DateTime.fromObject({ year, month, day, hour, minute }, { zone: TUTOR_ZONE });
  const startLocal = startUk.setZone(zone);
  const endLocal = startLocal.plus({ minutes: durationMinutes });
  return {
    start: { date: startLocal.toFormat("yyyy-MM-dd"), time: startLocal.toFormat("HH:mm") },
    end: { date: endLocal.toFormat("yyyy-MM-dd"), time: endLocal.toFormat("HH:mm") },
  };
}
