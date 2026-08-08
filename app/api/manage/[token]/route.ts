import { NextRequest, NextResponse } from "next/server";
import { getBookingByToken } from "@/lib/db";
import { getLessonType, LessonTypeId } from "@/lib/pricing";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getBookingByToken(token);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  let lessonLabel = booking.lessonType;
  try {
    lessonLabel = getLessonType(booking.lessonType as LessonTypeId).label;
  } catch {
    // Fall back to the raw stored type if it no longer matches a known lesson.
  }

  return NextResponse.json({
    lessonLabel,
    date: booking.date,
    time: booking.time,
    durationMinutes: booking.durationMinutes,
    customerName: booking.customerName,
    status: booking.status,
  });
}
