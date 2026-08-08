import { NextRequest, NextResponse } from "next/server";
import { getBookingByToken, getExcludedSlots, rescheduleBookingByToken } from "@/lib/db";
import { isSlotAvailable, RESCHEDULE_MIN_NOTICE_HOURS, parseDateKey } from "@/lib/availability";
import { sendRescheduleEmails } from "@/lib/send-email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await req.json();
  const newDate: string | undefined = body?.date;
  const newTime: string | undefined = body?.time;

  if (!newDate || !newTime) {
    return NextResponse.json({ error: "Missing new date/time." }, { status: 400 });
  }

  const oldBooking = await getBookingByToken(token);
  if (!oldBooking || oldBooking.status !== "confirmed") {
    return NextResponse.json(
      { error: "This booking can't be rescheduled — it may already be cancelled or no longer exists." },
      { status: 404 }
    );
  }

  const oldStart = parseDateKey(oldBooking.date);
  oldStart.setHours(0, 0, 0, 0);
  const [h, m] = oldBooking.time.split(":").map(Number);
  const oldLessonStart = new Date(oldStart);
  oldLessonStart.setHours(h, m, 0, 0);
  const cutoff = new Date(Date.now() + RESCHEDULE_MIN_NOTICE_HOURS * 60 * 60 * 1000);
  if (oldLessonStart < cutoff) {
    return NextResponse.json(
      {
        error: `This lesson starts too soon to reschedule online (at least ${RESCHEDULE_MIN_NOTICE_HOURS} hours' notice is needed). Please email chinesetutoryang@gmail.com.`,
      },
      { status: 409 }
    );
  }

  const excluded = await getExcludedSlots(newDate, newDate);
  if (!isSlotAvailable(newDate, newTime, oldBooking.durationMinutes, excluded)) {
    return NextResponse.json(
      { error: "That time is no longer available. Please pick another." },
      { status: 409 }
    );
  }

  const newBooking = await rescheduleBookingByToken(token, newDate, newTime);
  if (!newBooking) {
    return NextResponse.json({ error: "Could not reschedule this booking." }, { status: 409 });
  }

  try {
    await sendRescheduleEmails(oldBooking, newBooking);
  } catch (err) {
    console.error("Failed to send reschedule emails:", err);
  }

  return NextResponse.json({ ok: true, date: newBooking.date, time: newBooking.time });
}
