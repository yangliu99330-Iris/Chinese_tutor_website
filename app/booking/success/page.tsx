import { Suspense } from "react";
import type { Metadata } from "next";
import BookingSuccessContent from "@/components/booking/BookingSuccessContent";

export const metadata: Metadata = {
  title: "Booking Confirmed | Chinese Tutor Yang",
};

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading…</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
