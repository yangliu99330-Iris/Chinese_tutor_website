import { NextRequest, NextResponse } from "next/server";
import { getBookingsInRange, getBlockedSlotsList } from "@/lib/db";

export async function GET(req: NextRequest) {
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end." }, { status: 400 });
  }

  const [bookings, blockedSlots] = await Promise.all([
    getBookingsInRange(start, end),
    getBlockedSlotsList(start, end),
  ]);

  return NextResponse.json({ bookings, blockedSlots });
}
