import { NextRequest, NextResponse } from "next/server";
import { addAvailabilityWindow, getAvailabilityWindows, removeAvailabilityWindow } from "@/lib/db";
import { parseDateKey } from "@/lib/availability";

interface SlotInput {
  start: string;
  end: string;
}

export async function GET() {
  const windows = await getAvailabilityWindows();
  return NextResponse.json({ windows });
}

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

  const weekday = repeat === "weekly" ? parseDateKey(date).getDay() : null;

  await Promise.all(
    slots.map((s) =>
      addAvailabilityWindow({
        weekday,
        specificDate: repeat === "weekly" ? null : date,
        startTime: s.start,
        endTime: s.end,
      })
    )
  );

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
