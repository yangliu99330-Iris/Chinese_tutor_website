"use client";

import { useState } from "react";
import Calendar from "./Calendar";
import TimeSlotGrid from "./TimeSlotGrid";
import SlotActionModal from "./SlotActionModal";
import SelectionSummary from "./SelectionSummary";
import CheckoutForm from "./CheckoutForm";
import { RecurrenceFrequency, SlotSelection } from "@/lib/availability";
import { getLessonType, LessonTypeId } from "@/lib/pricing";

type Step = "time" | "checkout";

export default function BookingFlow() {
  const [step, setStep] = useState<Step>("time");
  const [lessonType, setLessonType] = useState<LessonTypeId>("private");
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SlotSelection[]>([]);
  const [activeSlot, setActiveSlot] = useState<{ date: string; time: string } | null>(null);
  const [skippedNotice, setSkippedNotice] = useState<string | null>(null);

  const durationMinutes = getLessonType(lessonType).durationMinutes;

  const selectedTimesForDate = selectedDate
    ? selectedSlots.filter((s) => s.date === selectedDate).map((s) => s.time)
    : [];

  function addSlot(slot: SlotSelection) {
    setSelectedSlots((prev) => [...prev, slot]);
  }

  function handleRemoveSlot(index: number) {
    setSelectedSlots((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSelectContinue() {
    if (activeSlot) addSlot(activeSlot);
    setActiveSlot(null);
    setStep("checkout");
  }

  function handleSelectAddAnother() {
    if (activeSlot) addSlot(activeSlot);
    setActiveSlot(null);
  }

  async function handleSelectRecurring(frequency: RecurrenceFrequency, occurrences: number) {
    if (!activeSlot) return;
    setActiveSlot(null);

    const res = await fetch("/api/availability/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...activeSlot, frequency, occurrences, duration: durationMinutes }),
    });
    const { added, skipped } = await res.json();

    setSelectedSlots((prev) => [...prev, ...(added ?? [])]);
    setSkippedNotice(
      skipped?.length > 0
        ? `${skipped.length} of ${occurrences} recurring lessons landed on unavailable times and were skipped. You can add those manually.`
        : null
    );
  }

  if (step === "checkout") {
    return (
      <CheckoutForm
        lessonType={lessonType}
        slots={selectedSlots}
        onBack={() => setStep("time")}
      />
    );
  }

  return (
    <div>
      {skippedNotice && (
        <div
          className="mb-6 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "#FCF9F5", color: "#C65C5C", border: "1px solid #F8ECE1" }}
        >
          {skippedNotice}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Calendar
            viewMonth={viewMonth}
            onMonthChange={setViewMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            durationMinutes={durationMinutes}
          />

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#F8ECE1" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#B668BD" }}>
              Available Times {selectedDate ? `· ${durationMinutes} min` : ""}
            </p>
            {selectedDate ? (
              <TimeSlotGrid
                dateKey={selectedDate}
                durationMinutes={durationMinutes}
                selectedTimesForDate={selectedTimesForDate}
                onPickTime={(time) => setActiveSlot({ date: selectedDate, time })}
              />
            ) : (
              <p className="text-sm text-gray-400 text-center py-10">
                Select a date on the calendar to see open times.
              </p>
            )}
          </div>
        </div>

        <SelectionSummary
          lessonType={lessonType}
          onChangeLessonType={(id) => {
            setLessonType(id);
            setSelectedSlots([]);
          }}
          slots={selectedSlots}
          onRemove={handleRemoveSlot}
          onContinue={() => setStep("checkout")}
        />
      </div>

      {activeSlot && (
        <SlotActionModal
          dateKey={activeSlot.date}
          time={activeSlot.time}
          onClose={() => setActiveSlot(null)}
          onSelectContinue={handleSelectContinue}
          onSelectAddAnother={handleSelectAddAnother}
          onSelectRecurring={handleSelectRecurring}
        />
      )}
    </div>
  );
}
