import type { Metadata } from "next";
import Link from "next/link";

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
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
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
            style={{ color: "#D4AF37" }}
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

      {/* ── Two Steps ── */}
      <section className="section-padding" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#C41E3A" }}
            >
              How It Works
            </p>
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              Two Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Step 1 — Book */}
            <div
              className="bg-white rounded-2xl p-8 shadow-sm border flex flex-col items-center text-center"
              style={{ borderColor: "#F5E6C8" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-playfair font-bold text-2xl mb-5"
                style={{ backgroundColor: "#C41E3A", color: "white" }}
              >
                1
              </div>
              <span className="text-4xl mb-4 block">📅</span>
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">
                Choose Your Time
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Browse Tutor Yang&apos;s live availability and select a lesson
                slot that fits your schedule. Takes less than a minute.
              </p>
              <a
                href="https://calendar.app.google/iUER8MZA2s2FFU8r5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 shadow-md w-full justify-center"
                style={{ backgroundColor: "#C41E3A", color: "white" }}
              >
                📅 Book a Lesson Now
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Opens Google Calendar in a new tab
              </p>
            </div>

            {/* Step 2 — Pay */}
            <div
              className="bg-white rounded-2xl p-8 shadow-sm border flex flex-col items-center text-center"
              style={{ borderColor: "#F5E6C8" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-playfair font-bold text-2xl mb-5"
                style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
              >
                2
              </div>
              <span className="text-4xl mb-4 block">💳</span>
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">
                Secure Your Spot
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Complete your payment to confirm the booking. All transactions
                are processed securely through Stripe.
              </p>
              <a
                href="https://buy.stripe.com/14A28s2i045g0on3pa6wE00"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 shadow-md w-full justify-center"
                style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
              >
                💳 Pay for Lesson Now
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Secure payment via Stripe
              </p>
            </div>

          </div>

          {/* Connector hint */}
          <div className="flex items-center justify-center mt-8 gap-3 text-sm text-gray-400">
            <div className="h-px flex-1" style={{ backgroundColor: "#F5E6C8" }} />
            <span>Complete both steps to confirm your lesson</span>
            <div className="h-px flex-1" style={{ backgroundColor: "#F5E6C8" }} />
          </div>
        </div>
      </section>

      {/* ── Alternative Contact ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#C41E3A" }}
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
              style={{ backgroundColor: "#C41E3A", color: "white" }}
            >
              Send a Message
            </Link>
            <a
              href="mailto:contact@chinesetutoryang.com"
              className="px-6 py-3 rounded font-bold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#C41E3A", color: "#C41E3A" }}
            >
              contact@chinesetutoryang.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Policies ── */}
      <section className="py-10 px-4" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 text-center text-sm">
            {[
              { icon: "🔄", title: "Free Reschedule", desc: "Change your booking up to 24 hrs before at no cost." },
              { icon: "🔒", title: "Secure Booking", desc: "Your details are protected and never shared." },
              { icon: "✅", title: "No Upfront Payment", desc: "Pay after your first session — no commitment required." },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#F5E6C8" }}>
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
