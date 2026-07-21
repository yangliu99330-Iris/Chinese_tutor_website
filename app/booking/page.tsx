import type { Metadata } from "next";
import Link from "next/link";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Lesson | Chinese Tutor Yang",
  description:
    "Book your Mandarin or Chinese Dance lesson with Tutor Yang. Select a time that suits you directly from the calendar below.",
};


export default function Booking() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <span
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          约
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#CD8136" }}
          >
            Schedule Your Session
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Book a Lesson
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Select a time that works for you. First lesson includes a free
            20-minute introductory chat.
          </p>
        </div>
      </section>

      {/* ── Booking Flow ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Live Availability
            </p>
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              Pick a Lesson Time
            </h2>
          </div>

          <BookingFlow />
        </div>
      </section>

      {/* ── Alternative Contact ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#B668BD" }}
          >
            Prefer to Chat First?
          </p>
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-4">
            Get in Touch Directly
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            Have questions before booking? Send a message or email and Tutor
            Yang will respond within one business day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#B668BD", color: "white" }}
            >
              Send a Message
            </Link>
            <a
              href="mailto:chinesetutoryang@gmail.com"
              className="px-6 py-3 rounded font-bold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#B668BD", color: "#B668BD" }}
            >
              chinesetutoryang@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Policies ── */}
      <section className="py-10 px-4" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 text-center text-sm">
            {[
              { icon: "🔄", title: "Free Reschedule", desc: "Change your booking up to 24 hrs before at no cost." },
              { icon: "🔒", title: "Secure Booking", desc: "Your details are protected and never shared." },
              { icon: "✅", title: "No Upfront Payment", desc: "Pay after your first session — no commitment required." },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#F8ECE1" }}>
                <span className="text-2xl block mb-2">{p.icon}</span>
                <p className="font-semibold text-gray-900 mb-1">{p.title}</p>
                <p className="text-gray-400 text-xs">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
