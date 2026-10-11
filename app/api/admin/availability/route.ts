import { NextRequest, NextResponse } from "next/server";
import { addAvailabilityWindow, getAvailabilityWindows, removeAvailabilityWindow, setWeeklyHours } from "@/lib/db";
import { addDaysToKey, parseDateKey } from "@/lib/availability";

interface SlotInput {
  start: string;
  end: string;
}

export async function GET() {
  const windows = await getAvailabilityWindows();
  return NextResponse.json({ windows });
}

/**
 * { date, slots: [{start,end}], repeat: "none" | "weekly",
 *   weekdays?: number[]        // weekly: default [date's own weekday]
 *   until?: { mode: "never" } | { mode: "date", date } | { mode: "weeks", weeks }
 *   combine?: "replace" | "add" // weekly: default "add"
 * }
 * "none" opens `date` only (always additive). "weekly" starts on `date` (nothing
 * before it is touched) and runs until `until`. "weeks": N weeks = the N*7 days
 * starting at `date`.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const date: string | undefined = body?.date;
  const slots: SlotInput[] | undefined = body?.slots;
  const repeat: "none" | "weekly" = body?.repeat === "weekly" ? "weekly" : "none";

  if (!date || !Array.isArray(slots) || slots.length === 0) {
    return NextResponse.json({ error: "Missing date or time slots." }, { status: 400 });
  }

  const invalid = slots.find((s) => !s?.start || !s?.end || s.start >= s.end);
  if (invalid) {
    return NextResponse.json({ error: "Each time slot needs a start time before its end time." }, { status: 400 });
  }

  if (repeat === "none") {
    await Promise.all(
      slots.map((s) =>
        addAvailabilityWindow({ weekday: null, specificDate: date, startTime: s.start, endTime: s.end })
      )
    );
    return NextResponse.json({ ok: true });
  }

  const rawWeekdays: unknown = body.weekdays;
  const weekdays =
    Array.isArray(rawWeekdays) && rawWeekdays.length > 0
      ? Array.from(new Set(rawWeekdays.map(Number)))
      : [parseDateKey(date).getDay()];
  if (weekdays.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
    return NextResponse.json({ error: "Invalid day of week." }, { status: 400 });
  }

  let endDate: string | null = null;
  const until = body.until;
  if (until?.mode === "date") {
    if (!until.date || until.date < date) {
      return NextResponse.json({ error: "The end date is before the start date." }, { status: 400 });
    }
    endDate = until.date;
  } else if (until?.mode === "weeks") {
    const weeks = Number(until.weeks);
    if (!Number.isInteger(weeks) || weeks < 1 || weeks > 520) {
      return NextResponse.json({ error: "Number of weeks must be between 1 and 520." }, { status: 400 });
    }
    endDate = addDaysToKey(date, 7 * weeks - 1);
  }

  await setWeeklyHours({
    weekdays,
    slots,
    startDate: date,
    endDate,
    mode: body.combine === "replace" ? "replace" : "add",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await removeAvailabilityWindow(id);
  return NextResponse.json({ ok: true });
}
