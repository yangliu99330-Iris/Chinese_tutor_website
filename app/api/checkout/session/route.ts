import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      metadata: session.metadata,
    });
  } catch (err) {
    console.error("Failed to retrieve checkout session:", err);
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
}
