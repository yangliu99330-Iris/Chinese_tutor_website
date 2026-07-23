import { NextRequest, NextResponse } from "next/server";
import { getExcludedSlots } from "@/lib/db";
import { hasAvailability, toDateKey } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));
  const duration = Number(req.nextUrl.searchParams.get("duration"));

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(duration)) {
    return NextResponse.json({ error: "Invalid query params." }, { status: 400 });
  }

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const excluded = await getExcludedSlots(toDateKey(firstOfMonth), toDateKey(lastOfMonth));

  const availableDates: string[] = [];
  for (let d = new Date(firstOfMonth); d <= lastOfMonth; d.setDate(d.getDate() + 1)) {
    if (hasAvailability(d, duration, excluded)) availableDates.push(toDateKey(d));
  }

  return NextResponse.json({ availableDates });
}
