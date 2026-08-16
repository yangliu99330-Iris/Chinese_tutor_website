import Stripe from "stripe";
import { DateTime } from "luxon";
import { getResend, BOOKING_FROM_EMAIL, TUTOR_NOTIFY_EMAIL } from "@/lib/resend";
import { getLessonType, LessonType, LessonTypeId } from "@/lib/pricing";
import { claimBookingEmail, releaseBookingEmailClaim, BookingRecord } from "@/lib/db";
import { SlotSelection } from "@/lib/availability";
import { manageTokenFor, manageUrlFor } from "@/lib/manage-token";

const TUTOR_ZONE = "Europe/London";
const FALLBACK_LESSON: LessonType = {
  id: "private",
  label: "Lesson",
  priceCents: 0,
  durationMinutes: 60,
  description: "",
};

function lessonFor(metadata: Stripe.Metadata): LessonType {
  try {
    return getLessonType(metadata.lesson_type as LessonTypeId);
  } catch {
    return FALLBACK_LESSON;
  }
}

function lessonForId(id: string): LessonType {
  try {
    return getLessonType(id as LessonTypeId);
  } catch {
    return FALLBACK_LESSON;
  }
}

function customerEmailFor(session: Stripe.Checkout.Session): string {
  // After checkout completes, Stripe often moves the actual submitted email
  // to customer_details.email and leaves customer_email null.
  return session.customer_details?.email ?? session.customer_email ?? "";
}

function parseSlots(metadata: Stripe.Metadata): SlotSelection[] {
  try {
    return JSON.parse(metadata.slots_json ?? "[]");
  } catch {
    return [];
  }
}

function zoneLabelFor(zone: string): string {
  return zone === TUTOR_ZONE ? "UK time" : zone.replace(/_/g, " ");
}

/**
 * Slot dates/times are stored as wall-clock time in the tutor's own timezone
 * (Europe/London). This converts a single slot into `zone` and renders the
 * full start–end range, so the reader always knows how long the lesson runs.
 */
function formatSlotRangeInZone(date: string, time: string, durationMinutes: number, zone: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const asLondonTime = DateTime.fromObject({ year, month, day, hour, minute }, { zone: TUTOR_ZONE });
  if (!asLondonTime.isValid) return `${date} ${time}`;

  const start = asLondonTime.setZone(zone);
  const end = start.plus({ minutes: durationMinutes });
  if (!start.isValid || !end.isValid) return `${date} ${time}`;

  const startStr = start.toFormat(`ccc, LLL d, yyyy 'at' h:mm a`);
  const endStr = start.hasSame(end, "day") ? end.toFormat("h:mm a") : end.toFormat(`ccc, LLL d, yyyy 'at' h:mm a`);
  return `${startStr} – ${endStr}`;
}

function formatSlotsInZone(slots: SlotSelection[], durationMinutes: number, zone: string): string {
  const items = slots.map((s) => formatSlotRangeInZone(s.date, s.time, durationMinutes, zone));

  return `
    <ul style="padding-left:20px;margin:8px 0;">
      ${items.map((i) => `<li style="margin:4px 0;">${i}</li>`).join("")}
    </ul>
    <p style="color:#9ca3af;font-size:12px;margin:-4px 0 12px;">Times shown in ${zoneLabelFor(zone)}.</p>
  `;
}

/** Per-slot "manage this lesson" links using the same deterministic token stored on each booking row (see lib/db.ts#createBookings). */
function formatManageLinks(sessionId: string, slots: SlotSelection[], durationMinutes: number, zone: string): string {
  const items = slots.map((s) => {
    const token = manageTokenFor(sessionId, s.date, s.time);
    const url = manageUrlFor(token);
    const label = formatSlotRangeInZone(s.date, s.time, durationMinutes, zone);
    return `<li style="margin:4px 0;">${label} — <a href="${url}" style="color:#B668BD;">Cancel or reschedule</a></li>`;
  });

  return `
    <div style="margin:16px 0;padding-top:12px;border-top:1px solid #F8ECE1;">
      <p style="font-weight:600;margin:0 0 6px;">Need to make a change?</p>
      <ul style="padding-left:20px;margin:0;">
        ${items.join("")}
      </ul>
      <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">Free reschedule up to 24 hours before your lesson.</p>
    </div>
  `;
}

async function sendCustomerEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lesson = lessonFor(m);
  const amount = session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : "";
  const slots = parseSlots(m);
  const customerZone = m.customer_timezone || TUTOR_ZONE;

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: customerEmailFor(session),
    subject: "Your lesson booking is confirmed!",
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">Booking Confirmed</h2>
        <p>Hi ${m.customer_name ?? ""},</p>
        <p>Thanks for booking with Chinese Tutor Yang! Here are your lesson details:</p>
        <p><strong>${lesson.label}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"}, ${lesson.durationMinutes} min each)</p>
        ${formatSlotsInZone(slots, lesson.durationMinutes, customerZone)}
        <p><strong>Total paid:</strong> ${amount}</p>
        ${formatManageLinks(session.id, slots, lesson.durationMinutes, customerZone)}
        <p>Miss Yang will reach out if any details need confirming. If you have questions, just reply to this email or reach chinesetutoryang@gmail.com.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
      </div>
    `,
  });
}

async function sendTutorEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lesson = lessonFor(m);
  const amount = session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : "";
  const slots = parseSlots(m);

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: TUTOR_NOTIFY_EMAIL,
    subject: `New booking: ${m.customer_name ?? "a student"} (${lesson.label})`,
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">New Lesson Booking</h2>
        <p><strong>Student:</strong> ${m.customer_name ?? ""}</p>
        <p><strong>Email:</strong> ${customerEmailFor(session)}</p>
        <p><strong>Phone:</strong> ${m.customer_phone ?? ""}</p>
        ${m.notes ? `<p><strong>Notes:</strong> ${m.notes}</p>` : ""}
        <p><strong>${lesson.label}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"}, ${lesson.durationMinutes} min each)</p>
        ${formatSlotsInZone(slots, lesson.durationMinutes, TUTOR_ZONE)}
        <p><strong>Amount paid:</strong> ${amount}</p>
      </div>
    `,
  });
}

/**
 * Sends the customer + tutor booking confirmation emails for a completed
 * Stripe checkout session — exactly once per session, no matter how many
 * times Stripe (re)delivers the webhook or someone clicks "Resend" in the
 * dashboard.
 *
 * Idempotency works via a DB row keyed on the session id (see
 * lib/db.ts#claimBookingEmail): the first caller to insert that row "wins"
 * and proceeds to send; every other caller sees the row already exists and
 * skips. If sending fails, the claim is released so a later retry can try
 * again instead of the email being silently lost.
 */
export async function sendBookingEmails(session: Stripe.Checkout.Session): Promise<void> {
  const claimed = await claimBookingEmail(session.id);
  if (!claimed) {
    console.log(`Booking emails already sent for session ${session.id}; skipping duplicate send.`);
    return;
  }

  try {
    await Promise.all([sendCustomerEmail(session), sendTutorEmail(session)]);
  } catch (err) {
    await releaseBookingEmailClaim(session.id);
    throw err;
  }
}

/**
 * A refund was processed on Stripe's side (tutor-initiated), which already
 * released the booking's slot (see cancelBookingsByPaymentIntent in
 * lib/db.ts). Only the customer is notified here — the tutor doesn't need
 * telling about a refund they just issued themselves.
 */
export async function sendRefundCancellationEmail(booking: BookingRecord): Promise<void> {
  const lesson = lessonForId(booking.lessonType);
  const zone = booking.customerTimezone || TUTOR_ZONE;
  const timeRange = formatSlotRangeInZone(booking.date, booking.time, booking.durationMinutes, zone);

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: booking.customerEmail,
    subject: "Your lesson has been cancelled and refunded",
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">Booking Cancelled &amp; Refunded</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Your refund has been processed, and the following lesson has been cancelled:</p>
        <p><strong>${lesson.label}</strong> — ${timeRange} (${zoneLabelFor(zone)})</p>
        <p>If this wasn't expected, or you'd like to book a new time, just reply to this email or reach chinesetutoryang@gmail.com.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
      </div>
    `,
  });
}

/**
 * The customer cancelled via their manage link. No refund is issued
 * automatically (late-cancellation fees depend on the 24-hour policy, which
 * needs a human judgment call) — the tutor is notified to handle it via
 * Stripe directly, and the customer gets a plain confirmation.
 */
export async function sendCustomerCancellationEmails(booking: BookingRecord): Promise<void> {
  const lesson = lessonForId(booking.lessonType);
  const zone = booking.customerTimezone || TUTOR_ZONE;
  const customerLocalRange = formatSlotRangeInZone(booking.date, booking.time, booking.durationMinutes, zone);
  const ukRange = formatSlotRangeInZone(booking.date, booking.time, booking.durationMinutes, TUTOR_ZONE);

  await Promise.all([
    getResend().emails.send({
      from: BOOKING_FROM_EMAIL,
      to: booking.customerEmail,
      subject: "Your lesson has been cancelled",
      html: `
        <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
          <h2 style="color:#B668BD;">Booking Cancelled</h2>
          <p>Hi ${booking.customerName},</p>
          <p>As requested, this lesson has been cancelled:</p>
          <p><strong>${lesson.label}</strong> — ${customerLocalRange} (${zoneLabelFor(zone)})</p>
          <p>If a refund is due under the cancellation policy, Miss Yang will process it separately. Questions? Reply to this email or reach chinesetutoryang@gmail.com.</p>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
        </div>
      `,
    }),
    getResend().emails.send({
      from: BOOKING_FROM_EMAIL,
      to: TUTOR_NOTIFY_EMAIL,
      subject: `Cancellation: ${booking.customerName} (${lesson.label})`,
      html: `
        <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
          <h2 style="color:#B668BD;">Student Cancelled a Lesson</h2>
          <p><strong>Student:</strong> ${booking.customerName} (${booking.customerEmail})</p>
          <p><strong>${lesson.label}</strong> — ${ukRange} (UK time)</p>
          <p><strong>Paid:</strong> £${(booking.amountPaidCents / 100).toFixed(2)}</p>
          <p style="color:#9ca3af;font-size:13px;">No refund has been issued automatically — check your 24-hour cancellation policy and refund via Stripe if appropriate. The slot has already been freed up on your schedule.</p>
        </div>
      `,
    }),
  ]);
}

/** The customer rescheduled via their manage link — confirms the new time to both parties. */
export async function sendRescheduleEmails(oldBooking: BookingRecord, newBooking: BookingRecord): Promise<void> {
  const lesson = lessonForId(newBooking.lessonType);
  const zone = newBooking.customerTimezone || TUTOR_ZONE;

  const oldRangeLocal = formatSlotRangeInZone(oldBooking.date, oldBooking.time, oldBooking.durationMinutes, zone);
  const newRangeLocal = formatSlotRangeInZone(newBooking.date, newBooking.time, newBooking.durationMinutes, zone);
  const oldRangeUk = formatSlotRangeInZone(oldBooking.date, oldBooking.time, oldBooking.durationMinutes, TUTOR_ZONE);
  const newRangeUk = formatSlotRangeInZone(newBooking.date, newBooking.time, newBooking.durationMinutes, TUTOR_ZONE);

  await Promise.all([
    getResend().emails.send({
      from: BOOKING_FROM_EMAIL,
      to: newBooking.customerEmail,
      subject: "Your lesson has been rescheduled",
      html: `
        <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
          <h2 style="color:#B668BD;">Booking Rescheduled</h2>
          <p>Hi ${newBooking.customerName},</p>
          <p><strong>${lesson.label}</strong> has been moved:</p>
          <p style="text-decoration:line-through;color:#9ca3af;">${oldRangeLocal}</p>
          <p><strong>${newRangeLocal}</strong> (${zoneLabelFor(zone)})</p>
          <p><a href="${manageUrlFor(newBooking.manageToken)}" style="color:#B668BD;">Manage this booking</a></p>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
        </div>
      `,
    }),
    getResend().emails.send({
      from: BOOKING_FROM_EMAIL,
      to: TUTOR_NOTIFY_EMAIL,
      subject: `Rescheduled: ${newBooking.customerName} (${lesson.label})`,
      html: `
        <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
          <h2 style="color:#B668BD;">Student Rescheduled a Lesson</h2>
          <p><strong>Student:</strong> ${newBooking.customerName} (${newBooking.customerEmail})</p>
          <p><strong>${lesson.label}</strong> moved from:</p>
          <p style="text-decoration:line-through;color:#9ca3af;">${oldRangeUk}</p>
          <p><strong>${newRangeUk}</strong> (UK time)</p>
        </div>
      `,
    }),
  ]);
}
