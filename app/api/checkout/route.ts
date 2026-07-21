import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getLessonType, LessonTypeId } from "@/lib/pricing";
import { formatTimeLabel, isSlotAvailable, parseDateKey, SlotSelection } from "@/lib/availability";

interface CheckoutRequestBody {
  lessonType: LessonTypeId;
  slots: SlotSelection[];
  customer: { name: string; email: string; phone: string; notes?: string };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutRequestBody;
  const { lessonType, slots, customer } = body;

  if (!Array.isArray(slots) || slots.length === 0) {
    return NextResponse.json({ error: "No lesson times selected." }, { status: 400 });
  }
  if (!customer?.name || !customer?.email || !customer?.phone) {
    return NextResponse.json({ error: "Missing customer details." }, { status: 400 });
  }

  let lesson;
  try {
    lesson = getLessonType(lessonType);
  } catch {
    return NextResponse.json({ error: "Invalid lesson type." }, { status: 400 });
  }

  const invalidSlot = slots.find(
    (slot) =>
      !slot?.date || !slot?.time || !isSlotAvailable(slot.date, slot.time, lesson.durationMinutes)
  );
  if (invalidSlot) {
    return NextResponse.json(
      { error: "One of the selected times is no longer available. Please go back and choose another." },
      { status: 409 }
    );
  }

  const slotsSummary = slots
    .map(
      (s) =>
        `${parseDateKey(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${formatTimeLabel(s.time)}`
    )
    .join("; ")
    .slice(0, 480);

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: [
        {
          quantity: slots.length,
          price_data: {
            currency: "usd",
            unit_amount: lesson.priceCents,
            product_data: {
              name: lesson.label,
              description: slotsSummary,
            },
          },
        },
      ],
      metadata: {
        lesson_type: lesson.id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        notes: (customer.notes ?? "").slice(0, 480),
        slots_summary: slotsSummary,
        slot_count: String(slots.length),
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again in a moment." },
      { status: 500 }
    );
  }
}
