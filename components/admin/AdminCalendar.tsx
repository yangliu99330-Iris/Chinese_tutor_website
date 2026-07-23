"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BUSINESS_HOURS,
  SLOT_INTERVAL_MINUTES,
  formatTimeLabel,
  minutesToTime,
  timeToMinutes,
  toDateKey,
} from "@/lib/availability";

interface BookingRecord {
  id: number;
  lessonType: string;
  date: string;
  time: string;
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  amountPaidCents: number;
  status: string;
}

interface BlockedSlotRecord {
  id: number;
  date: string;
  time: string | null;
  reason: string | null;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getRowTimes(): string[] {
  let minStart = 24 * 60;
  let maxEnd = 0;
  for (const day of Object.values(BUSINESS_HOURS)) {
    if (!day) continue;
    minStart = Math.min(minStart, timeToMinutes(day.start));
    maxEnd = Math.max(maxEnd, timeToMinutes(day.end));
  }
  const times: string[] = [];
  for (let m = minStart; m < maxEnd; m += SLOT_INTERVAL_MINUTES) times.push(minutesToTime(m));
  return times;
}

const ROW_TIMES = getRowTimes();

export default function AdminCalendar() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = weekDays[6];

  const refresh = useCallback(() => {
    setLoading(true);
    const start = toDateKey(weekStart);
    const end = toDateKey(weekEnd);
    fetch(`/api/admin/bookings?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings ?? []);
        setBlockedSlots(data.blockedSlots ?? []);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const bookingMap = new Map<string, BookingRecord>();
  for (const b of bookings) bookingMap.set(`${b.date}T${b.time}`, b);

  const blockedTimeMap = new Map<string, BlockedSlotRecord>();
  const fullyBlockedDates = new Set<string>();
  for (const b of blockedSlots) {
    if (b.time === null) fullyBlockedDates.add(b.date);
    else blockedTimeMap.set(`${b.date}T${b.time}`, b);
  }

  async function handleBlockSlot(date: string, time: string) {
    await fetch("/api/admin/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time, reason: "Blocked by admin" }),
    });
    refresh();
  }

  async function handleUnblockSlot(id: number) {
    await fetch(`/api/admin/block?id=${id}`, { method: "DELETE" });
    refresh();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl font-bold text-gray-900">Schedule</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Log out
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, -7))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-gray-700">
          {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
          {weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, 7))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded inline-block" style={{ backgroundColor: "#B668BD" }} /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded inline-block bg-gray-300" /> Blocked
        </span>
        <span>Click an empty slot to block it. Click a booking for details.</span>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border" style={{ borderColor: "#F8ECE1" }}>
        <div className="grid grid-cols-8 min-w-[900px]">
          <div className="border-b border-r p-2" style={{ borderColor: "#F8ECE1" }} />
          {weekDays.map((d) => (
            <div
              key={toDateKey(d)}
              className="border-b border-r p-2 text-center text-xs font-semibold text-gray-600"
              style={{ borderColor: "#F8ECE1" }}
            >
              {WEEKDAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]}
              <div className="text-gray-400 font-normal">{d.getDate()}</div>
            </div>
          ))}

          {ROW_TIMES.map((time) => (
            <div key={time} className="contents">
              <div
                className="border-b border-r px-2 py-1.5 text-[11px] text-gray-400 text-right"
                style={{ borderColor: "#F8ECE1" }}
              >
                {formatTimeLabel(time)}
              </div>
              {weekDays.map((d) => {
                const dateKey = toDateKey(d);
                const key = `${dateKey}T${time}`;
                const booking = bookingMap.get(key);
                const blocked = blockedTimeMap.get(key);
                const dayFullyBlocked = fullyBlockedDates.has(dateKey);

                let content: React.ReactNode = null;
                let cellStyle: React.CSSProperties = {};
                let onClick: (() => void) | undefined;

                if (booking) {
                  cellStyle = { backgroundColor: "#B668BD" };
                  content = (
                    <span className="text-white text-[10px] leading-tight px-1 block truncate">
                      {booking.customerName}
                    </span>
                  );
                  onClick = () => setActiveBooking(booking);
                } else if (blocked || dayFullyBlocked) {
                  cellStyle = { backgroundColor: "#e5e7eb" };
                  if (blocked) {
                    content = <span className="text-gray-500 text-[10px]">Blocked</span>;
                    onClick = () => handleUnblockSlot(blocked.id);
                  }
                } else {
                  onClick = () => handleBlockSlot(dateKey, time);
                }

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={loading || dayFullyBlocked || (!booking && !blocked && loading)}
                    onClick={onClick}
                    className="border-b border-r h-7 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    style={{ borderColor: "#F8ECE1", ...cellStyle }}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {activeBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setActiveBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#B668BD" }}>
              {activeBooking.date} · {formatTimeLabel(activeBooking.time)}
            </p>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-4">
              {activeBooking.customerName}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p><strong>Email:</strong> {activeBooking.customerEmail}</p>
              {activeBooking.customerPhone && <p><strong>Phone:</strong> {activeBooking.customerPhone}</p>}
              <p><strong>Lesson:</strong> {activeBooking.lessonType} ({activeBooking.durationMinutes} min)</p>
              <p><strong>Paid:</strong> £{(activeBooking.amountPaidCents / 100).toFixed(2)}</p>
              {activeBooking.notes && <p><strong>Notes:</strong> {activeBooking.notes}</p>}
            </div>
            <button
              type="button"
              onClick={() => setActiveBooking(null)}
              className="w-full py-2.5 rounded-xl font-bold text-sm border-2"
              style={{ borderColor: "#B668BD", color: "#B668BD" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
