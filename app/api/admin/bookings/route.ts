import { NextRequest, NextResponse } from "next/server";
import { getBookingsInRange, getBlockedSlotsList, getOpenRangesInRange } from "@/lib/db";

export async function GET(req: NextRequest) {
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end." }, { status: 400 });
  }

  const [bookings, blockedSlots, openRangesMap] = await Promise.all([
    getBookingsInRange(start, end),
    getBlockedSlotsList(start, end),
    getOpenRangesInRange(start, end),
  ]);

  // Maps don't survive JSON.stringify — send as a plain date -> ranges object.
  const openRanges = Object.fromEntries(openRangesMap);

  return NextResponse.json({ bookings, blockedSlots, openRanges });
}
