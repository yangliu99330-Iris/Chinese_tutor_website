import { NextRequest, NextResponse } from "next/server";
import { getExcludedSlots } from "@/lib/db";
import { generateTimeSlots, parseDateKey } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const dateKey = req.nextUrl.searchParams.get("date");
  const duration = Number(req.nextUrl.searchParams.get("duration"));

  if (!dateKey || !Number.isFinite(duration)) {
    return NextResponse.json({ error: "Invalid query params." }, { status: 400 });
  }

  const excluded = await getExcludedSlots(dateKey, dateKey);
  const times = generateTimeSlots(parseDateKey(dateKey), duration, excluded);

  return NextResponse.json({ times });
}
