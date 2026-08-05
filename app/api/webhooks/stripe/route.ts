import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { DateTime } from "luxon";
import { getStripe } from "@/lib/stripe";
import { getResend, BOOKING_FROM_EMAIL, TUTOR_NOTIFY_EMAIL } from "@/lib/resend";
import { getLessonType, LessonTypeId } from "@/lib/pricing";
import { createBookings } from "@/lib/db";
import { SlotSelection } from "@/lib/availability";

const TUTOR_ZONE = "Europe/London";

function lessonLabelFor(metadata: Stripe.Metadata): string {
  try {
    return getLessonType(metadata.lesson_type as LessonTypeId).label;
  } catch {
    return "Lesson";
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

/**
 * Slot dates/times are stored as wall-clock time in the tutor's own timezone
 * (Europe/London). This converts each slot into `zone` and renders a label
 * that includes the zone name, so the reader always knows whose time it is.
 */
function formatSlotsInZone(slots: SlotSelection[], zone: string): string {
  const zoneLabel = zone === TUTOR_ZONE ? "UK time" : zone.replace(/_/g, " ");

  const items = slots.map((s) => {
    const [year, month, day] = s.date.split("-").map(Number);
    const [hour, minute] = s.time.split(":").map(Number);
    const asLondonTime = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: TUTOR_ZONE }
    );
    const converted = asLondonTime.isValid ? asLondonTime.setZone(zone) : null;
    return converted?.isValid
      ? converted.toFormat(`ccc, LLL d, yyyy 'at' h:mm a`)
      : `${s.date} ${s.time}`;
  });

  return `
    <ul style="padding-left:20px;margin:8px 0;">
      ${items.map((i) => `<li style="margin:4px 0;">${i}</li>`).join("")}
    </ul>
    <p style="color:#9ca3af;font-size:12px;margin:-4px 0 12px;">Times shown in ${zoneLabel}.</p>
  `;
}

async function persistBooking(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lesson = getLessonType(m.lesson_type as LessonTypeId);
  const slots = parseSlots(m);
  if (slots.length === 0) return;

  const amountPaidPerSlotCents = session.amount_total
    ? Math.round(session.amount_total / slots.length)
    : lesson.priceCents;

  await createBookings({
    stripeSessionId: session.id,
    lessonType: lesson.id,
    slots,
    durationMinutes: lesson.durationMinutes,
    customerName: m.customer_name ?? "",
    customerEmail: customerEmailFor(session),
    customerPhone: m.customer_phone ?? "",
    notes: m.notes ?? "",
    amountPaidPerSlotCents,
  });
}

async function sendCustomerEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lessonLabel = lessonLabelFor(m);
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
        <p><strong>${lessonLabel}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"})</p>
        ${formatSlotsInZone(slots, customerZone)}
        <p><strong>Total paid:</strong> ${amount}</p>
        <p>Miss Yang will reach out if any details need confirming. If you have questions, just reply to this email or reach chinesetutoryang@gmail.com.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
      </div>
    `,
  });
}

async function sendTutorEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lessonLabel = lessonLabelFor(m);
  const amount = session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : "";
  const slots = parseSlots(m);

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: TUTOR_NOTIFY_EMAIL,
    subject: `New booking: ${m.customer_name ?? "a student"} (${lessonLabel})`,
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">New Lesson Booking</h2>
        <p><strong>Student:</strong> ${m.customer_name ?? ""}</p>
        <p><strong>Email:</strong> ${customerEmailFor(session)}</p>
        <p><strong>Phone:</strong> ${m.customer_phone ?? ""}</p>
        ${m.notes ? `<p><strong>Notes:</strong> ${m.notes}</p>` : ""}
        <p><strong>${lessonLabel}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"})</p>
        ${formatSlotsInZone(slots, TUTOR_ZONE)}
        <p><strong>Amount paid:</strong> ${amount}</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Persisting the booking and sending emails are independent — a failure
    // in one must not prevent the other from running.
    const [persistResult, emailResult] = await Promise.allSettled([
      persistBooking(session),
      Promise.all([sendCustomerEmail(session), sendTutorEmail(session)]),
    ]);

    if (persistResult.status === "rejected") {
      console.error("Failed to persist booking:", persistResult.reason);
    }
    if (emailResult.status === "rejected") {
      console.error("Failed to send booking confirmation emails:", emailResult.reason);
    }

    if (persistResult.status === "rejected" || emailResult.status === "rejected") {
      return NextResponse.json({ error: "Partial failure — see logs." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
