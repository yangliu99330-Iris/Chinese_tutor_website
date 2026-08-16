import { useEffect, useMemo, useState } from "react";
import { BOOKING_WINDOW_DAYS, toDateKey } from "@/lib/availability";
import { ukToZone } from "@/lib/timezone";

/**
 * Fetches UK-wall-clock availability for the whole booking window in one
 * request, then converts + re-buckets it by the customer's local date. A UK
 * time can only ever land on the customer's local date, the day before, or
 * the day after (max real-world zone offset from UK is well under 24h), so
 * a 1-day buffer on each side of the fetch range is enough to catch every
 * slot that could spill across a local date boundary.
 */
export function useLocalAvailability(durationMinutes: number, customerZone: string | null) {
  const [byUkDate, setByUkDate] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 1);
    const end = new Date(today);
    end.setDate(end.getDate() + BOOKING_WINDOW_DAYS + 1);

    fetch(`/api/availability/range?start=${toDateKey(start)}&end=${toDateKey(end)}&duration=${durationMinutes}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setByUkDate(data.availability ?? {});
      })
      .catch(() => {
        if (!cancelled) setByUkDate({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [durationMinutes]);

  const localTimesByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!customerZone) return map;

    for (const [ukDate, ukTimes] of Object.entries(byUkDate)) {
      for (const ukTime of ukTimes) {
        const local = ukToZone(ukDate, ukTime, customerZone);
        const list = map.get(local.date) ?? [];
        list.push(local.time);
        map.set(local.date, list);
      }
    }
    for (const list of map.values()) list.sort();
    return map;
  }, [byUkDate, customerZone]);

  const availableLocalDates = useMemo(() => new Set(localTimesByDate.keys()), [localTimesByDate]);

  return { localTimesByDate, availableLocalDates, loading: loading || !customerZone };
}
