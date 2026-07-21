"use client";

import { useState } from "react";
import { formatTimeLabel, parseDateKey, RecurrenceFrequency } from "@/lib/availability";

interface SlotActionModalProps {
  dateKey: string;
  time: string;
  onClose: () => void;
  onSelectContinue: () => void;
  onSelectAddAnother: () => void;
  onSelectRecurring: (frequency: RecurrenceFrequency, occurrences: number) => void;
}

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Every month" },
];

export default function SlotActionModal({
  dateKey,
  time,
  onClose,
  onSelectContinue,
  onSelectAddAnother,
  onSelectRecurring,
}: SlotActionModalProps) {
  const [showRecurring, setShowRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("weekly");
  const [occurrences, setOccurrences] = useState(4);

  const dateLabel = parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#B668BD" }}>
          {dateLabel}
        </p>
        <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-5">
          {formatTimeLabel(time)}
        </h3>

        {!showRecurring ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onSelectContinue}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#B668BD" }}
            >
              Select &amp; Continue
            </button>
            <button
              type="button"
              onClick={onSelectAddAnother}
              className="w-full py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#B668BD", color: "#B668BD" }}
            >
              Select &amp; Add Another Time
            </button>
            <button
              type="button"
              onClick={() => setShowRecurring(true)}
              className="w-full py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#CD8136", color: "#C65C5C" }}
            >
              Select &amp; Make Recurring
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Repeat
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                style={{ borderColor: "#F8ECE1" }}
              >
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Number of Lessons
              </label>
              <select
                value={occurrences}
                onChange={(e) => setOccurrences(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                style={{ borderColor: "#F8ECE1" }}
              >
                {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                  <option key={n} value={n}>
                    {n} lessons total
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onSelectRecurring(frequency, occurrences)}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#B668BD" }}
            >
              Add Recurring Lessons
            </button>
            <button
              type="button"
              onClick={() => setShowRecurring(false)}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              ‹ Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
