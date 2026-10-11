"use client";

import { useEffect, useState } from "react";
import { formatTimeLabel, parseDateKey, toDateKey } from "@/lib/availability";

interface RecurringBlock {
  id: number;
  weekday: number;
  startTime: string;
  endTime: string;
  reason: string | null;
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
        body: JSON.stringify({ date, slots, repeat, reason: repeat === "weekly" ? "Weekly block" : "Blocked by admin" }),
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

  const weekdayName = WEEKDAY_NAMES[parseDateKey(date).getDay()];

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

        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Date</label>
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
          <option value="weekly">Weekly (every {weekdayName})</option>
        </select>

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
