import { NextRequest, NextResponse } from "next/server";
import { cancelBookingById } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isFinite(bookingId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const cancelled = await cancelBookingById(bookingId);
  if (!cancelled) {
    return NextResponse.json({ error: "Booking not found or already cancelled." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
