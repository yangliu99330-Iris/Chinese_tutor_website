"use client";

import { useState } from "react";
import { formatTimeLabel, parseDateKey, SlotSelection } from "@/lib/availability";
import { formatPrice, getLessonType, LessonTypeId } from "@/lib/pricing";

interface CheckoutFormProps {
  lessonType: LessonTypeId;
  slots: SlotSelection[];
  onBack: () => void;
}

export default function CheckoutForm({ lessonType, slots, onBack }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lesson = getLessonType(lessonType);
  const totalCents = lesson.priceCents * slots.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonType, slots, customer: { name, email, phone, notes } }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-2xl border p-6 flex flex-col gap-5"
        style={{ borderColor: "#F8ECE1" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 self-start"
        >
          ‹ Back to calendar
        </button>

        <h2 className="font-playfair text-2xl font-bold text-gray-900">Your Details</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Full Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            style={{ borderColor: "#F8ECE1" }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            style={{ borderColor: "#F8ECE1" }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Phone
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            style={{ borderColor: "#F8ECE1" }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            style={{ borderColor: "#F8ECE1" }}
          />
        </div>

        {error && (
          <p className="text-sm rounded-lg px-3 py-2" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#B668BD" }}
        >
          {submitting ? "Redirecting to payment…" : `Pay ${formatPrice(totalCents)} & Confirm`}
        </button>
        <p className="text-xs text-gray-400 text-center -mt-2">
          You&apos;ll be redirected to Stripe to complete payment securely.
        </p>
      </form>

      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#B668BD" }}>
          Order Summary
        </p>
        <p className="font-semibold text-gray-900 mb-3">{lesson.label}</p>
        <ul className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
          {slots.map((slot, i) => (
            <li
              key={`${slot.date}-${slot.time}-${i}`}
              className="text-sm text-gray-600 rounded-lg px-3 py-2"
              style={{ backgroundColor: "#FCFCFC" }}
            >
              {parseDateKey(slot.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              · {formatTimeLabel(slot.time)}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#F8ECE1" }}>
          <span className="text-sm font-semibold text-gray-600">
            Total ({slots.length} lesson{slots.length === 1 ? "" : "s"})
          </span>
          <span className="font-playfair text-2xl font-bold" style={{ color: "#B668BD" }}>
            {formatPrice(totalCents)}
          </span>
        </div>
      </div>
    </div>
  );
}
