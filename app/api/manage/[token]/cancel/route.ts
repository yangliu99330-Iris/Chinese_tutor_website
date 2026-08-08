import { NextRequest, NextResponse } from "next/server";
import { cancelBookingByToken } from "@/lib/db";
import { sendCustomerCancellationEmails } from "@/lib/send-email";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const cancelled = await cancelBookingByToken(token);

  if (!cancelled) {
    return NextResponse.json(
      { error: "This booking can't be cancelled — it may already be cancelled or no longer exists." },
      { status: 404 }
    );
  }

  try {
    await sendCustomerCancellationEmails(cancelled);
  } catch (err) {
    console.error("Failed to send cancellation emails:", err);
  }

  return NextResponse.json({ ok: true });
}
