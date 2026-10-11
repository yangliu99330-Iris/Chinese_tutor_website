import { NextRequest, NextResponse } from "next/server";
import {
  addRecurringBlock,
  blockSlot,
  blockTimeRange,
  getRecurringBlocks,
  removeRecurringBlock,
  unblockSlot,
} from "@/lib/db";
import { addDaysToKey, firstWeekdayOnOrAfter, parseDateKey } from "@/lib/availability";

interface SlotInput {
  start: string;
  end: string;
}

export async function GET() {
  const recurringBlocks = await getRecurringBlocks();
  return NextResponse.json({ recurringBlocks });
}

/**
 * Two shapes:
 *  - { date, time, reason }            single-click block of one 15-min slot (unchanged)
 *  - { date, slots: [{start,end}], repeat: "none" | "weekly", reason,
 *      weekday?: 0-6, until?: { mode: "never" } | { mode: "date", date } | { mode: "weeks", weeks } }
 *      a time range. "weekly" starts at the first `weekday` (default: date's own weekday)
 *      on or after `date` and never touches earlier dates; `until` bounds the end
 *      (inclusive). "weeks": N weeks = N occurrences.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, time, reason } = body;
  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }

  if (!Array.isArray(body.slots)) {
    await blockSlot(date, time ?? null, reason ?? "");
    return NextResponse.json({ ok: true });
  }

  const slots: SlotInput[] = body.slots;
  const repeat: "none" | "weekly" = body.repeat === "weekly" ? "weekly" : "none";
  const label: string = reason || (repeat === "weekly" ? "Weekly block" : "Blocked by admin");

  if (slots.length === 0 || slots.some((s) => !s?.start || !s?.end || s.start >= s.end)) {
    return NextResponse.json({ error: "Each time range needs a start time before its end time." }, { status: 400 });
  }

  if (repeat === "weekly") {
    const weekdayInput = body.weekday;
    const weekday =
      Number.isInteger(weekdayInput) && weekdayInput >= 0 && weekdayInput <= 6
        ? (weekdayInput as number)
        : parseDateKey(date).getDay();
    const firstDate = firstWeekdayOnOrAfter(date, weekday);

    let endDate: string | null = null;
    const until = body.until;
    if (until?.mode === "date") {
      if (!until.date || until.date < firstDate) {
        return NextResponse.json({ error: "The end date is before the first blocked day." }, { status: 400 });
      }
      endDate = until.date;
    } else if (until?.mode === "weeks") {
      const weeks = Number(until.weeks);
      if (!Number.isInteger(weeks) || weeks < 1 || weeks > 520) {
        return NextResponse.json({ error: "Number of weeks must be between 1 and 520." }, { status: 400 });
      }
      endDate = addDaysToKey(firstDate, 7 * (weeks - 1));
    }

    for (const s of slots) {
      await addRecurringBlock({
        weekday,
        startTime: s.start,
        endTime: s.end,
        reason: label,
        startDate: firstDate,
        endDate,
      });
    }
  } else {
    for (const s of slots) {
      await blockTimeRange(date, s.start, s.end, label);
    }
  }

  return NextResponse.json({ ok: true });
}

/** ?id= removes a single blocked slot; ?recurring= removes a weekly block (every week). */
export async function DELETE(req: NextRequest) {
  const recurringParam = req.nextUrl.searchParams.get("recurring");
  if (recurringParam !== null) {
    const recurringId = Number(recurringParam);
    if (!Number.isFinite(recurringId)) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }
    await removeRecurringBlock(recurringId);
    return NextResponse.json({ ok: true });
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await unblockSlot(id);
  return NextResponse.json({ ok: true });
}
