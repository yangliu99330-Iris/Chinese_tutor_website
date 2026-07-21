"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SessionInfo {
  status: string;
  customerEmail: string | null;
  amountTotal: number | null;
  metadata: Record<string, string> | null;
}

export default function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      return;
    }
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setInfo)
      .catch(() => setError(true));
  }, [sessionId]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
          We couldn&apos;t find that booking
        </h1>
        <p className="text-gray-500 mb-8">
          If you completed a payment, please check your email for a Stripe receipt, or contact us directly.
        </p>
        <Link href="/booking" className="px-6 py-3 rounded font-bold text-sm text-white" style={{ backgroundColor: "#B668BD" }}>
          Back to Booking
        </Link>
      </div>
    );
  }

  if (!info) {
    return <div className="text-center py-20 text-gray-400">Loading your booking…</div>;
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <span className="text-5xl block mb-4">✅</span>
      <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thanks{info.customerEmail ? `, we've sent a receipt to ${info.customerEmail}` : ""}. Tutor Yang will
        reach out to confirm any final details.
      </p>

      {info.metadata?.slots_summary && (
        <div className="bg-white rounded-2xl border p-6 text-left mb-8" style={{ borderColor: "#F8ECE1" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#B668BD" }}>
            Your Lessons
          </p>
          <p className="text-sm text-gray-700">{info.metadata.slots_summary}</p>
        </div>
      )}

      <Link href="/" className="inline-block px-6 py-3 rounded font-bold text-sm text-white" style={{ backgroundColor: "#B668BD" }}>
        Back to Home
      </Link>
    </div>
  );
}
