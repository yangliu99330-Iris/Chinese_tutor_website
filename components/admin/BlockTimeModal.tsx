"use client";

import { useEffect, useState } from "react";
import { addDaysToKey, firstWeekdayOnOrAfter, formatTimeLabel, parseDateKey, toDateKey } from "@/lib/availability";

interface RecurringBlock {
  id: number;
  weekday: number;
  startTime: string;
  endTime: string;
  reason: string | null;
  startDate: string | null;
  endDate: string | null;
}

type UntilMode = "never" | "date" | "weeks";

function formatDay(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function describeRange(b: RecurringBlock): string {
  if (b.startDate && b.endDate) return `${formatDay(b.startDate)} – ${formatDay(b.endDate)}`;
  if (b.startDate) return `from ${formatDay(b.startDate)}, no end date`;
  if (b.endDate) return `until ${formatDay(b.endDate)}`;
  return "every week, no start or end date";
}

interface SlotRow {
  start: string;
  end: string;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BlockTimeModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [blocks, setBlocks] = useState<RecurringBlock[] | null>(null);
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [slots, setSlots] = useState<SlotRow[]>([{ start: "09:00", end: "10:00" }]);
  const [repeat, setRepeat] = useState<"none" | "weekly">("none");
  const [weekday, setWeekday] = useState<number | null>(null); // null = same weekday as the start date
  const [untilMode, setUntilMode] = useState<UntilMode>("weeks");
  const [untilDate, setUntilDate] = useState("");
  const [weeks, setWeeks] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refreshBlocks() {
    fetch("/api/admin/block")
      .then((res) => res.json())
      .then((data) => setBlocks(data.recurringBlocks ?? []));
  }

  useEffect(() => {
    refreshBlocks();
  }, []);

  function updateSlot(index: number, field: "start" | "end", value: string) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slots,
          repeat,
          weekday: effectiveWeekday,
          until: untilMode === "date" ? { mode: "date", date: untilDate } : untilMode === "weeks" ? { mode: "weeks", weeks } : { mode: "never" },
          reason: repeat === "weekly" ? "Weekly block" : "Blocked by admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSlots([{ start: "09:00", end: "10:00" }]);
      refreshBlocks();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: number) {
    await fetch(`/api/admin/block?recurring=${id}`, { method: "DELETE" });
    refreshBlocks();
    onSaved();
  }

  const effectiveWeekday = weekday ?? parseDateKey(date).getDay();
  const firstDate = date ? firstWeekdayOnOrAfter(date, effectiveWeekday) : "";
  const lastDate =
    untilMode === "date" ? untilDate : untilMode === "weeks" && firstDate ? addDaysToKey(firstDate, 7 * (Math.max(weeks, 1) - 1)) : "";
  const summary =
    repeat === "weekly" && firstDate
      ? `Blocks every ${WEEKDAY_NAMES[effectiveWeekday]} from ${formatDay(firstDate)}${
          lastDate ? ` to ${formatDay(lastDate)}` : ", with no end date"
        }. Earlier dates are not affected.`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1">Block Time</h3>
        <p className="text-xs text-gray-400 mb-4">
          Close off time that would otherwise be bookable. Existing bookings are not cancelled.
        </p>

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          {repeat === "weekly" ? "Start date" : "Date"}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
          style={{ borderColor: "#F8ECE1" }}
        />

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Time ranges
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
                  onClick={() => setSlots((prev) => prev.filter((_, j) => j !== i))}
                  aria-label="Remove time range"
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
          onClick={() => setSlots((prev) => [...prev, { start: "09:00", end: "10:00" }])}
          className="text-sm font-semibold mb-4"
          style={{ color: "#B668BD" }}
        >
          + Add time range
        </button>

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Repeat</label>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as "none" | "weekly")}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
          style={{ borderColor: "#F8ECE1" }}
        >
          <option value="none">Does not repeat (this date only)</option>
          <option value="weekly">Weekly</option>
        </select>

        {repeat === "weekly" && (
          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: "#FCF9F5", border: "1px solid #F8ECE1" }}>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Day of week
            </label>
            <select
              value={effectiveWeekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3 bg-white"
              style={{ borderColor: "#F8ECE1" }}
            >
              {WEEKDAY_NAMES.map((name, i) => (
                <option key={name} value={i}>
                  {name}
                </option>
              ))}
            </select>

            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Until</label>
            <select
              value={untilMode}
              onChange={(e) => setUntilMode(e.target.value as UntilMode)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              style={{ borderColor: "#F8ECE1" }}
            >
              <option value="weeks">For a number of weeks</option>
              <option value="date">Until a date (inclusive)</option>
              <option value="never">No end date</option>
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
                <span className="text-sm text-gray-500">weeks (one block per week)</span>
              </div>
            )}
            {untilMode === "date" && (
              <input
                type="date"
                value={untilDate}
                min={firstDate || undefined}
                onChange={(e) => setUntilDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white mt-3"
                style={{ borderColor: "#F8ECE1" }}
              />
            )}

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
            {saving ? "Saving…" : "Block"}
          </button>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: "#F8ECE1" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Weekly blocks</p>
          {blocks === null ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : blocks.length === 0 ? (
            <p className="text-sm text-gray-400">No weekly blocks set.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {blocks.map((b) => (
                <li key={b.id} className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {WEEKDAY_NAMES[b.weekday]} · {formatTimeLabel(b.startTime)}–{formatTimeLabel(b.endTime)}
                    <span className="block text-xs text-gray-400">{describeRange(b)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(b.id)}
                    className="text-gray-400 hover:text-red-500 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
