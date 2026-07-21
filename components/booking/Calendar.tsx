"use client";

import { hasAvailability, toDateKey } from "@/lib/availability";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarProps {
  viewMonth: Date;
  onMonthChange: (next: Date) => void;
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
  durationMinutes: number;
}

export default function Calendar({
  viewMonth,
  onMonthChange,
  selectedDate,
  onSelectDate,
  durationMinutes,
}: CalendarProps) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();

  const today = new Date();
  const todayKey = toDateKey(today);

  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const canGoBack =
    new Date(year, month, 1) >
    new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#F8ECE1" }}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoBack}
          onClick={() => onMonthChange(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <h3 className="font-playfair font-bold text-lg text-gray-900">
          {MONTH_LABELS[month]} {year}
        </h3>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-xs font-semibold text-gray-400 py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;

          const dateKey = toDateKey(date);
          const isPast = dateKey < todayKey;
          const available = !isPast && hasAvailability(date, durationMinutes);
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!available}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square rounded-lg text-sm font-medium transition-colors relative
                ${isSelected ? "text-white" : available ? "text-gray-800 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}
              `}
              style={isSelected ? { backgroundColor: "#B668BD" } : undefined}
            >
              {date.getDate()}
              {isToday && !isSelected && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: "#CD8136" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-gray-400" style={{ borderColor: "#F8ECE1" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#B668BD" }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-gray-200" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
