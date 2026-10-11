"use client";

import { formatTimeLabel, minutesToTime, parseDateKey, SlotSelection, timeToMinutes } from "@/lib/availability";
import {
  BULK_DISCOUNT_MIN_LESSONS,
  BULK_DISCOUNT_PERCENT,
  calculateOrderPricing,
  formatPrice,
  LESSON_TYPES,
  LessonTypeId,
} from "@/lib/pricing";
import { ukRangeToZone } from "@/lib/timezone";

interface SelectionSummaryProps {
  lessonType: LessonTypeId;
  onChangeLessonType: (id: LessonTypeId) => void;
  slots: SlotSelection[];
  /** Slots are stored UK-canonical; this is used to display them in the customer's own zone. */
  customerZone: string | null;
  onRemove: (index: number) => void;
  onContinue: () => void;
}

export default function SelectionSummary({
  lessonType,
  onChangeLessonType,
  slots,
  customerZone,
  onRemove,
  onContinue,
}: SelectionSummaryProps) {
  const lesson = LESSON_TYPES.find((l) => l.id === lessonType)!;
  const pricing = calculateOrderPricing(lesson.priceCents, slots.length);

  return (
    <div className="bg-white rounded-2xl border p-6 sticky top-24" style={{ borderColor: "#F8ECE1" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#B668BD" }}>
        Lesson Type
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {LESSON_TYPES.map((type) => (
          <div key={type.id} className={type.id === "trial" ? "mt-4 pt-4 border-t" : undefined} style={type.id === "trial" ? { borderColor: "#F8ECE1" } : undefined}>
            {type.id === "trial" && (
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">New students</p>
            )}
          <button
            type="button"
            onClick={() => onChangeLessonType(type.id)}
            className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-left ${
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
          </div>
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
          {slots.map((slot, i) => {
            const { start, end } = customerZone
              ? ukRangeToZone(slot.date, slot.time, lesson.durationMinutes, customerZone)
              : {
                  start: { date: slot.date, time: slot.time },
                  end: { date: slot.date, time: minutesToTime(timeToMinutes(slot.time) + lesson.durationMinutes) },
                };
            return (
              <li
                key={`${slot.date}-${slot.time}-${i}`}
                className="flex items-center justify-between text-sm rounded-lg px-3 py-2"
                style={{ backgroundColor: "#FCFCFC" }}
              >
                <span className="text-gray-700">
                  {parseDateKey(start.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {formatTimeLabel(start.time)}–{formatTimeLabel(end.time)}
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
            );
          })}
        </ul>
      )}

      <div className="mb-5 pt-4 border-t" style={{ borderColor: "#F8ECE1" }}>
        {pricing.discountCents > 0 && (
          <>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal</span>
              <span>{formatPrice(pricing.subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold mb-2" style={{ color: "#2F855A" }}>
              <span>{pricing.discountPercent}% off {BULK_DISCOUNT_MIN_LESSONS}+ lessons</span>
              <span>−{formatPrice(pricing.discountCents)}</span>
            </div>
          </>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">
            Total ({slots.length} lesson{slots.length === 1 ? "" : "s"})
          </span>
          <span className="font-playfair text-2xl font-bold" style={{ color: "#B668BD" }}>
            {formatPrice(pricing.totalCents)}
          </span>
        </div>
        {pricing.lessonsToDiscount > 0 ? (
          <p className="text-xs text-gray-400 mt-2">
            Book {BULK_DISCOUNT_MIN_LESSONS} lessons in one order and save {BULK_DISCOUNT_PERCENT}% — add{" "}
            {pricing.lessonsToDiscount} more.
          </p>
        ) : null}
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
