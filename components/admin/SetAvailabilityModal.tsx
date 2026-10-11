"use client";

import { useEffect, useState } from "react";
import { addDaysToKey, formatTimeLabel, parseDateKey, toDateKey } from "@/lib/availability";

interface AvailabilityWindow {
  id: number;
  weekday: number | null;
  specificDate: string | null;
  startTime: string;
  endTime: string;
  startDate: string | null;
  endDate: string | null;
}

type UntilMode = "never" | "date" | "weeks";
type Combine = "replace" | "add";

function formatDay(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function describeRange(w: AvailabilityWindow): string {
  if (w.startDate && w.endDate) return `${formatDay(w.startDate)} – ${formatDay(w.endDate)}`;
  if (w.startDate) return `from ${formatDay(w.startDate)}, no end date`;
  if (w.endDate) return `until ${formatDay(w.endDate)}`;
  return "every week, no end date";
}

// Monday-first display order; values are JS weekdays (0 = Sunday).
const WEEKDAY_CHIPS: { value: number; label: string }[] = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

interface SlotRow {
  start: string;
  end: string;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SetAvailabilityModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [windows, setWindows] = useState<AvailabilityWindow[] | null>(null);
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [slots, setSlots] = useState<SlotRow[]>([{ start: "09:00", end: "18:00" }]);
  const [repeat, setRepeat] = useState<"none" | "weekly">("weekly");
  const [weekdays, setWeekdays] = useState<number[] | null>(null); // null = same weekday as the start date
  const [untilMode, setUntilMode] = useState<UntilMode>("never");
  const [untilDate, setUntilDate] = useState("");
  const [weeks, setWeeks] = useState(2);
  const [combine, setCombine] = useState<Combine>("replace");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refreshWindows() {
    fetch("/api/admin/availability")
      .then((res) => res.json())
      .then((data) => setWindows(data.windows ?? []));
  }

  useEffect(() => {
    refreshWindows();
  }, []);

  function updateSlot(index: number, field: "start" | "end", value: string) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSlotRow() {
    setSlots((prev) => [...prev, { start: "09:00", end: "18:00" }]);
  }

  function removeSlotRow(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slots,
          repeat,
          weekdays: effectiveWeekdays,
          until:
            untilMode === "date"
              ? { mode: "date", date: untilDate }
              : untilMode === "weeks"
                ? { mode: "weeks", weeks }
                : { mode: "never" },
          combine,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSlots([{ start: "09:00", end: "18:00" }]);
      refreshWindows();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: number) {
    await fetch(`/api/admin/availability?id=${id}`, { method: "DELETE" });
    refreshWindows();
    onSaved();
  }

  const startWeekday = date ? parseDateKey(date).getDay() : 0;
  const effectiveWeekdays = weekdays ?? [startWeekday];
  const lastDate =
    untilMode === "date"
      ? untilDate
      : untilMode === "weeks" && date
        ? addDaysToKey(date, 7 * Math.max(weeks, 1) - 1)
        : "";

  function toggleWeekday(day: number) {
    setWeekdays((prev) => {
      const current = prev ?? [startWeekday];
      if (current.includes(day)) return current.length === 1 ? current : current.filter((d) => d !== day);
      return [...current, day];
    });
  }

  const summary = (() => {
    if (repeat !== "weekly" || !date) return null;
    const days = WEEKDAY_CHIPS.filter((c) => effectiveWeekdays.includes(c.value)).map((c) => c.label).join(", ");
    const hours = slots.map((s) => `${formatTimeLabel(s.start)}–${formatTimeLabel(s.end)}`).join(" and ");
    const period = lastDate ? `${formatDay(date)} to ${formatDay(lastDate)}` : `${formatDay(date)} onwards`;
    const effect =
      combine === "replace"
        ? "This replaces your existing weekly hours on those days during that period; hours before and after it stay as they are."
        : "This is added on top of your existing weekly hours.";
    return `${days}: open ${hours}, ${period}. ${effect}`;
  })();

  const recurring = (windows ?? [])
    .filter((w) => w.weekday !== null)
    .sort(
      (a, b) =>
        (a.weekday! - b.weekday!) ||
        (a.startDate ?? "").localeCompare(b.startDate ?? "") ||
        a.startTime.localeCompare(b.startTime)
    );
  const oneOff = (windows ?? [])
    .filter((w) => w.specificDate !== null)
    .sort((a, b) => a.specificDate!.localeCompare(b.specificDate!) || a.startTime.localeCompare(b.startTime));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-playfair text-xl font-bold text-gray-900 mb-4">Set Availability</h3>

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          {repeat === "weekly" ? "Start date (nothing before this date changes)" : "Date"}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
          style={{ borderColor: "#F8ECE1" }}
        />

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Time slots
        </label>
        <div className="flex flex-col gap-2 mb-2">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={slot.start}
                onChange={(e) => updateSlot(i, "start", e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: "#F8ECE1" }}
              />
              <span className="text-gray-400">–</span>
              <input
                type="time"
                value={slot.end}
                onChange={(e) => updateSlot(i, "end", e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: "#F8ECE1" }}
              />
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlotRow(i)}
                  aria-label="Remove time slot"
                  className="text-gray-400 hover:text-red-500 font-bold px-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSlotRow}
          className="text-sm font-semibold mb-4"
          style={{ color: "#B668BD" }}
        >
          + Add time slot
        </button>

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Repeat
        </label>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as "none" | "weekly")}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
          style={{ borderColor: "#F8ECE1" }}
        >
          <option value="weekly">Weekly</option>
          <option value="none">Does not repeat (this date only)</option>
        </select>

        {repeat === "weekly" && (
          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: "#FCF9F5", border: "1px solid #F8ECE1" }}>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Days of the week
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {WEEKDAY_CHIPS.map((c) => {
                const on = effectiveWeekdays.includes(c.value);
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleWeekday(c.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${on ? "text-white" : "text-gray-600 bg-white"}`}
                    style={on ? { backgroundColor: "#B668BD", borderColor: "#B668BD" } : { borderColor: "#F8ECE1" }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Until</label>
            <select
              value={untilMode}
              onChange={(e) => setUntilMode(e.target.value as UntilMode)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              style={{ borderColor: "#F8ECE1" }}
            >
              <option value="never">No end date</option>
              <option value="weeks">For a number of weeks</option>
              <option value="date">Until a date (inclusive)</option>
            </select>

            {untilMode === "weeks" && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="number"
                  min={1}
                  max={520}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-24 border rounded-lg px-3 py-2 text-sm bg-white"
                  style={{ borderColor: "#F8ECE1" }}
                />
                <span className="text-sm text-gray-500">weeks from the start date</span>
              </div>
            )}
            {untilMode === "date" && (
              <input
                type="date"
                value={untilDate}
                min={date || undefined}
                onChange={(e) => setUntilDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white mt-3"
                style={{ borderColor: "#F8ECE1" }}
              />
            )}

            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mt-4 mb-2">
              How this combines with your current hours
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="combine"
                  checked={combine === "replace"}
                  onChange={() => setCombine("replace")}
                  className="mt-1"
                />
                <span>
                  <strong>Replace</strong> my hours on these days for this period
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="combine"
                  checked={combine === "add"}
                  onChange={() => setCombine("add")}
                  className="mt-1"
                />
                <span>
                  <strong>Add</strong> to my existing hours
                </span>
              </label>
            </div>

            {summary && <p className="text-xs text-gray-500 mt-3">{summary}</p>}
          </div>
        )}

        {error && (
          <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </p>
        )}

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm border-2"
            style={{ borderColor: "#F8ECE1", color: "#6b7280" }}
          >
            Close
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
            style={{ backgroundColor: "#B668BD" }}
          >
            {saving ? "Saving…" : "Confirm"}
          </button>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: "#F8ECE1" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Weekly schedule</p>
          {recurring.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">No recurring open hours set yet.</p>
          ) : (
            <ul className="flex flex-col gap-1 mb-4">
              {recurring.map((w) => (
                <li key={w.id} className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {WEEKDAY_NAMES[w.weekday!]} · {formatTimeLabel(w.startTime)}–{formatTimeLabel(w.endTime)}
                    <span className="block text-xs text-gray-400">{describeRange(w)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(w.id)}
                    className="text-gray-400 hover:text-red-500 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {oneOff.length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">One-off dates</p>
              <ul className="flex flex-col gap-1">
                {oneOff.map((w) => (
                  <li key={w.id} className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {w.specificDate} · {formatTimeLabel(w.startTime)}–{formatTimeLabel(w.endTime)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(w.id)}
                      className="text-gray-400 hover:text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
