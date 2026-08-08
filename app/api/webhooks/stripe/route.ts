import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getLessonType, LessonTypeId } from "@/lib/pricing";
import { createBookings } from "@/lib/db";
import { SlotSelection } from "@/lib/availability";
import { sendBookingEmails } from "@/lib/send-email";

function customerEmailFor(session: Stripe.Checkout.Session): string {
  // After checkout completes, Stripe often moves the actual submitted email
  // to customer_details.email and leaves customer_email null.
  return session.customer_details?.email ?? session.customer_email ?? "";
}

async function persistBooking(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lesson = getLessonType(m.lesson_type as LessonTypeId);

  let slots: SlotSelection[] = [];
  try {
    slots = JSON.parse(m.slots_json ?? "[]");
  } catch {
    slots = [];
  }
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
    // in one must not prevent the other from running. sendBookingEmails is
    // itself idempotent (see lib/send-email.ts), so retried/resent webhook
    // deliveries never send duplicate emails.
    const [persistResult, emailResult] = await Promise.allSettled([
      persistBooking(session),
      sendBookingEmails(session),
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
