"use client";

import { useState } from "react";
import Link from "next/link";

const contactDetails = [
  { icon: "✉", label: "Email", value: "contact@chinesetutoryang.com", href: "mailto:contact@chinesetutoryang.com" },
  { icon: "⏰", label: "Hours", value: "Monday – Saturday: 9 AM – 7 PM", href: null },
  { icon: "💻", label: "Lessons", value: "Online (Zoom) & In-Person", href: null },
  { icon: "📍", label: "Location", value: "Local area & worldwide via Zoom", href: null },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;

    /*
      ── PRODUCTION: set up a free Formspree form ──
      1. Create a free account at https://formspree.io
      2. Create a new form and copy your form endpoint ID
      3. Replace YOUR_FORM_ID below with the ID
      The endpoint will look like: https://formspree.io/f/abcdefgh
    */
    const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });

    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please email us directly.");
    }
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
      >
        <span
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          联
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>
            Get in Touch
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Tutor Yang
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Have a question or want to discuss a program? Send a message and
            expect a reply within one business day.
          </p>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="section-padding" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Contact Info */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C41E3A" }}>
                Contact Details
              </p>
              <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">
                How to Reach Us
              </h2>

              <ul className="space-y-4 mb-8">
                {contactDetails.map((d) => (
                  <li key={d.label} className="flex items-start gap-4">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: "#C41E3A", color: "#D4AF37" }}
                    >
                      {d.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{d.label}</p>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="text-gray-700 hover:underline"
                          style={{ color: "#C41E3A" }}
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="text-gray-700">{d.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Response time badge */}
              <div
                className="rounded-xl p-5 border"
                style={{ backgroundColor: "white", borderColor: "#F5E6C8" }}
              >
                <p className="font-semibold text-gray-900 mb-1">⚡ Quick Response</p>
                <p className="text-gray-500 text-sm">
                  Tutor Yang typically replies within a few hours on weekdays.
                  For urgent booking enquiries, please email directly.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/booking"
                  className="inline-block px-6 py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#C41E3A", color: "white" }}
                >
                  Or Book Directly →
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="bg-white rounded-2xl shadow-sm p-8 border"
              style={{ borderColor: "#F5E6C8" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <span className="text-5xl mb-4" style={{ color: "#D4AF37" }}>✓</span>
                  <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Thank you for reaching out. Tutor Yang will be in touch
                    within one business day.
                  </p>
                </div>
              ) : (
                <>
                  <h3
                    className="font-playfair text-xl font-bold mb-6"
                    style={{ color: "#9B1830" }}
                  >
                    Send a Message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          placeholder="Jane"
                          className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition"
                          style={{ borderColor: "#F5E6C8", focusRingColor: "#C41E3A" } as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          placeholder="Smith"
                          className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition"
                          style={{ borderColor: "#F5E6C8" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="jane@example.com"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition"
                        style={{ borderColor: "#F5E6C8" }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Interested In
                      </label>
                      <select
                        name="interest"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition bg-white"
                        style={{ borderColor: "#F5E6C8" }}
                      >
                        <option value="">Select a program…</option>
                        <option value="mandarin-beginner">Mandarin – Beginner</option>
                        <option value="mandarin-intermediate">Mandarin – Intermediate / Advanced</option>
                        <option value="mandarin-hsk">Mandarin – HSK Preparation</option>
                        <option value="mandarin-business">Mandarin – Business Chinese</option>
                        <option value="dance-classical">Dance – Classical Chinese</option>
                        <option value="dance-folk">Dance – Folk Dance</option>
                        <option value="dance-contemporary">Dance – Contemporary</option>
                        <option value="general">General Enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us a bit about your goals, experience level, or any questions…"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition resize-none"
                        style={{ borderColor: "#F5E6C8" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: "#C41E3A", color: "white" }}
                    >
                      {loading ? "Sending…" : "Send Message →"}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      Your information is never shared with third parties.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Ready to Begin?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Skip the wait — book your free trial lesson directly from the calendar.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
        >
          Book a Lesson Now →
        </Link>
      </section>
    </>
  );
}
