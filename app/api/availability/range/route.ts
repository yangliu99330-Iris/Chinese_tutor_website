import { NextRequest, NextResponse } from "next/server";
import { getExcludedSlots } from "@/lib/db";
import { generateTimeSlots, parseDateKey, toDateKey } from "@/lib/availability";

/**
 * Returns UK-wall-clock available times for every date in [start, end] that
 * has at least one slot. Unlike /availability/day (single date) or
 * /availability/month (booleans only), this hands back the full time lists
 * for a date range in one request so the client can convert them into the
 * customer's own timezone and re-bucket by their local date — a single UK
 * date's times can spill into the customer's adjacent local day.
 */
export async function GET(req: NextRequest) {
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");
  const duration = Number(req.nextUrl.searchParams.get("duration"));

  if (!start || !end || !Number.isFinite(duration)) {
    return NextResponse.json({ error: "Invalid query params." }, { status: 400 });
  }

  const excluded = await getExcludedSlots(start, end);

  const availability: Record<string, string[]> = {};
  const cursor = parseDateKey(start);
  while (toDateKey(cursor) <= end) {
    const dateKey = toDateKey(cursor);
    const times = generateTimeSlots(new Date(cursor), duration, excluded);
    if (times.length > 0) availability[dateKey] = times;
    cursor.setDate(cursor.getDate() + 1);
  }

  return NextResponse.json({ availability });
}
