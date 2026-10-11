import { NextRequest, NextResponse } from "next/server";
import {
  addRecurringBlock,
  blockSlot,
  blockTimeRange,
  getRecurringBlocks,
  removeRecurringBlock,
  unblockSlot,
} from "@/lib/db";
import { parseDateKey } from "@/lib/availability";

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
 *  - { date, slots: [{start,end}], repeat: "none" | "weekly", reason }
 *      a time range; "weekly" repeats on that date's weekday forever (until removed)
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
    const weekday = parseDateKey(date).getDay();
    for (const s of slots) {
      await addRecurringBlock({ weekday, startTime: s.start, endTime: s.end, reason: label });
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
