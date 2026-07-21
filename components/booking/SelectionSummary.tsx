"use client";

import { formatTimeLabel, parseDateKey, SlotSelection } from "@/lib/availability";
import { formatPrice, LESSON_TYPES, LessonTypeId } from "@/lib/pricing";

interface SelectionSummaryProps {
  lessonType: LessonTypeId;
  onChangeLessonType: (id: LessonTypeId) => void;
  slots: SlotSelection[];
  onRemove: (index: number) => void;
  onContinue: () => void;
}

export default function SelectionSummary({
  lessonType,
  onChangeLessonType,
  slots,
  onRemove,
  onContinue,
}: SelectionSummaryProps) {
  const lesson = LESSON_TYPES.find((l) => l.id === lessonType)!;
  const totalCents = lesson.priceCents * slots.length;

  return (
    <div className="bg-white rounded-2xl border p-6 sticky top-24" style={{ borderColor: "#F8ECE1" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#B668BD" }}>
        Lesson Type
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {LESSON_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChangeLessonType(type.id)}
            className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-left ${
              lessonType === type.id ? "text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            style={
              lessonType === type.id
                ? { backgroundColor: "#B668BD", borderColor: "#B668BD" }
                : { borderColor: "#F8ECE1" }
            }
          >
            <span>
              {type.label}
              <span className={`block text-xs font-normal ${lessonType === type.id ? "text-white/75" : "text-gray-400"}`}>
                {type.durationMinutes} min
              </span>
            </span>
            <span className="shrink-0">{formatPrice(type.priceCents)}</span>
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#B668BD" }}>
        Selected Times
      </p>

      {slots.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">
          Pick a date and time from the calendar to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 mb-6 max-h-64 overflow-y-auto">
          {slots.map((slot, i) => (
            <li
              key={`${slot.date}-${slot.time}-${i}`}
              className="flex items-center justify-between text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: "#FCFCFC" }}
            >
              <span className="text-gray-700">
                {parseDateKey(slot.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {formatTimeLabel(slot.time)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove"
                className="text-gray-400 hover:text-red-500 font-bold px-1"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mb-5 pt-4 border-t" style={{ borderColor: "#F8ECE1" }}>
        <span className="text-sm font-semibold text-gray-600">
          Total ({slots.length} lesson{slots.length === 1 ? "" : "s"})
        </span>
        <span className="font-playfair text-2xl font-bold" style={{ color: "#B668BD" }}>
          {formatPrice(totalCents)}
        </span>
      </div>

      <button
        type="button"
        disabled={slots.length === 0}
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#B668BD" }}
      >
        Continue →
      </button>
    </div>
  );
}
