import type { Metadata } from "next";
import ManageBooking from "@/components/manage/ManageBooking";

export const metadata: Metadata = {
  title: "Manage Your Booking | Chinese Tutor Yang",
  robots: { index: false, follow: false },
};

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#B668BD" }}>
            Manage Your Booking
          </p>
          <h1 className="font-playfair text-3xl font-bold text-gray-900">Chinese Tutor Yang</h1>
        </div>
        <ManageBooking token={token} />
      </div>
    </section>
  );
}
