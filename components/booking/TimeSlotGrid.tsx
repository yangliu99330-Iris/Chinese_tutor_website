"use client";

import { formatTimeLabel, generateTimeSlots, parseDateKey } from "@/lib/availability";

interface TimeSlotGridProps {
  dateKey: string;
  durationMinutes: number;
  selectedTimesForDate: string[];
  onPickTime: (time: string) => void;
}

export default function TimeSlotGrid({
  dateKey,
  durationMinutes,
  selectedTimesForDate,
  onPickTime,
}: TimeSlotGridProps) {
  const date = parseDateKey(dateKey);
  const slots = generateTimeSlots(date, durationMinutes);

  if (slots.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        No open times left on this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((time) => {
        const isPicked = selectedTimesForDate.includes(time);
        return (
          <button
            key={time}
            type="button"
            onClick={() => onPickTime(time)}
            className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
              isPicked ? "text-white" : "text-gray-700 hover:border-gray-300"
            }`}
            style={
              isPicked
                ? { backgroundColor: "#B668BD", borderColor: "#B668BD" }
                : { borderColor: "#F8ECE1" }
            }
          >
            {formatTimeLabel(time)}
          </button>
        );
      })}
    </div>
  );
}
