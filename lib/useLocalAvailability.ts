import { useEffect, useMemo, useState } from "react";
import { toDateKey } from "@/lib/availability";
import { ukToZone } from "@/lib/timezone";

function monthKey(month: Date): string {
  return `${month.getFullYear()}-${month.getMonth()}`;
}

/**
 * Fetches UK-wall-clock availability for the month being viewed (there is no
 * booking-window limit, so months are loaded on demand as the customer pages
 * forward) and converts + re-buckets it by the customer's local date. A UK
 * time can only ever land on the customer's local date, the day before, or
 * the day after (max real-world zone offset from UK is well under 24h), so
 * a 1-day buffer on each side of the month is enough to catch every slot
 * that could spill across a local date boundary.
 *
 * Months already fetched are kept, so a date picked in one month still has
 * its times after the customer pages to another. Changing `durationMinutes`
 * starts over, since which slots fit depends on lesson length.
 */
export function useLocalAvailability(
  durationMinutes: number,
  customerZone: string | null,
  viewMonth: Date
) {
  const [byUkDate, setByUkDate] = useState<Record<string, string[]>>({});
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [loadedDuration, setLoadedDuration] = useState(durationMinutes);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const currentKey = `${year}-${month}`;

  useEffect(() => {
    let cancelled = false;

    const start = new Date(year, month, 1);
    start.setDate(start.getDate() - 1);
    const end = new Date(year, month + 1, 0);
    end.setDate(end.getDate() + 1);

    fetch(`/api/availability/range?start=${toDateKey(start)}&end=${toDateKey(end)}&duration=${durationMinutes}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const fetched: Record<string, string[]> = data.availability ?? {};
        const sameDuration = loadedDuration === durationMinutes;
        setByUkDate((prev) => ({ ...(sameDuration ? prev : {}), ...fetched }));
        setLoadedMonths((prev) => new Set([...(sameDuration ? prev : []), currentKey]));
        setLoadedDuration(durationMinutes);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadedMonths((prev) => new Set([...prev, currentKey]));
      });

    return () => {
      cancelled = true;
    };
    // loadedDuration is intentionally read, not a trigger: refetch only when the month or duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, durationMinutes]);

  const localTimesByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!customerZone || loadedDuration !== durationMinutes) return map;

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
  }, [byUkDate, customerZone, loadedDuration, durationMinutes]);

  const availableLocalDates = useMemo(() => new Set(localTimesByDate.keys()), [localTimesByDate]);

  const loading =
    !customerZone || loadedDuration !== durationMinutes || !loadedMonths.has(monthKey(viewMonth));

  return { localTimesByDate, availableLocalDates, loading };
}
