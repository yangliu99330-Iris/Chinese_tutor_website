import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getResend, BOOKING_FROM_EMAIL, TUTOR_NOTIFY_EMAIL } from "@/lib/resend";

function lessonListHtml(slotsSummary: string): string {
  const items = slotsSummary
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  return `<ul style="padding-left:20px;margin:8px 0;">${items
    .map((i) => `<li style="margin:4px 0;">${i}</li>`)
    .join("")}</ul>`;
}

async function sendCustomerEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lessonLabel = m.lesson_type === "chinese-dance" ? "Chinese Dance Lesson" : "Chinese Language Lesson";
  const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "";

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: session.customer_email ?? "",
    subject: "Your lesson booking is confirmed!",
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">Booking Confirmed</h2>
        <p>Hi ${m.customer_name ?? ""},</p>
        <p>Thanks for booking with Chinese Tutor Yang! Here are your lesson details:</p>
        <p><strong>${lessonLabel}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"})</p>
        ${lessonListHtml(m.slots_summary ?? "")}
        <p><strong>Total paid:</strong> ${amount}</p>
        <p>Tutor Yang will reach out if any details need confirming. If you have questions, just reply to this email or reach chinesetutoryang@gmail.com.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">学无止境 — Learning Has No Limits</p>
      </div>
    `,
  });
}

async function sendTutorEmail(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const lessonLabel = m.lesson_type === "chinese-dance" ? "Chinese Dance Lesson" : "Chinese Language Lesson";
  const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "";

  await getResend().emails.send({
    from: BOOKING_FROM_EMAIL,
    to: TUTOR_NOTIFY_EMAIL,
    subject: `New booking: ${m.customer_name ?? "a student"} (${lessonLabel})`,
    html: `
      <div style="font-family:sans-serif;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="color:#B668BD;">New Lesson Booking</h2>
        <p><strong>Student:</strong> ${m.customer_name ?? ""}</p>
        <p><strong>Email:</strong> ${session.customer_email ?? ""}</p>
        <p><strong>Phone:</strong> ${m.customer_phone ?? ""}</p>
        ${m.notes ? `<p><strong>Notes:</strong> ${m.notes}</p>` : ""}
        <p><strong>${lessonLabel}</strong> (${m.slot_count ?? ""} lesson${m.slot_count === "1" ? "" : "s"})</p>
        ${lessonListHtml(m.slots_summary ?? "")}
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
    try {
      await Promise.all([sendCustomerEmail(session), sendTutorEmail(session)]);
    } catch (err) {
      console.error("Failed to send booking confirmation emails:", err);
      return NextResponse.json({ error: "Email send failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
