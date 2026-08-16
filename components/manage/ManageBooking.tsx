"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Calendar from "@/components/booking/Calendar";
import TimeSlotGrid from "@/components/booking/TimeSlotGrid";
import { formatTimeLabel } from "@/lib/availability";
import { detectCustomerZone, TUTOR_ZONE, zoneToUk } from "@/lib/timezone";
import { useLocalAvailability } from "@/lib/useLocalAvailability";

interface BookingInfo {
  lessonLabel: string;
  date: string;
  time: string;
  durationMinutes: number;
  customerName: string;
  status: string;
}

function zoneLabel(zone: string): string {
  return zone === TUTOR_ZONE ? "UK time" : zone.replace(/_/g, " ");
}

function formatRange(date: string, time: string, durationMinutes: number, zone: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const start = DateTime.fromObject({ year, month, day, hour, minute }, { zone: TUTOR_ZONE }).setZone(zone);
  if (!start.isValid) return `${date} ${time}`;
  const end = start.plus({ minutes: durationMinutes });
  const startStr = start.toFormat("ccc, LLL d, yyyy 'at' h:mm a");
  const endStr = start.hasSame(end, "day") ? end.toFormat("h:mm a") : end.toFormat("ccc, LLL d, yyyy 'at' h:mm a");
  return `${startStr} – ${endStr} (${zoneLabel(zone)})`;
}

type View = "loading" | "error" | "details" | "rescheduling" | "cancelled" | "rescheduled";

export default function ManageBooking({ token }: { token: string }) {
  const [view, setView] = useState<View>("loading");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [customerZone, setCustomerZone] = useState<string | null>(null);

  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [newDate, setNewDate] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);

  useEffect(() => {
    setCustomerZone(detectCustomerZone());
  }, []);

  useEffect(() => {
    fetch(`/api/manage/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: BookingInfo) => {
        setBooking(data);
        setView(data.status === "confirmed" ? "details" : "cancelled");
      })
      .catch(() => setView("error"));
  }, [token]);

  const { localTimesByDate, availableLocalDates, loading: availabilityLoading } = useLocalAvailability(
    booking?.durationMinutes ?? 60,
    customerZone
  );
  const timesForNewDate = newDate ? localTimesByDate.get(newDate) ?? [] : [];

  async function handleCancel() {
    if (!window.confirm("Cancel this lesson? If a refund is due, Miss Yang will process it separately.")) return;
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/manage/${token}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setView("cancelled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  async function handleConfirmReschedule() {
    if (!newDate || !newTime || !customerZone) return;
    setWorking(true);
    setError(null);
    try {
      const uk = zoneToUk(newDate, newTime, customerZone);
      const res = await fetch(`/api/manage/${token}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: uk.date, time: uk.time }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBooking((prev) => (prev ? { ...prev, date: data.date, time: data.time } : prev));
      setView("rescheduled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  if (view === "loading") {
    return <p className="text-center text-gray-400 py-16">Loading your booking…</p>;
  }

  if (view === "error") {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-2">We couldn&apos;t find this booking.</p>
        <p className="text-gray-400 text-sm">
          The link may have expired or already been used. Reach out at{" "}
          <a href="mailto:chinesetutoryang@gmail.com" className="underline">
            chinesetutoryang@gmail.com
          </a>{" "}
          for help.
        </p>
      </div>
    );
  }

  if (!booking || !customerZone) return null;

  if (view === "cancelled") {
    return (
      <div className="text-center py-16">
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Booking Cancelled</h2>
        <p className="text-gray-500 text-sm">
          This lesson ({formatRange(booking.date, booking.time, booking.durationMinutes, customerZone)}) has been
          cancelled.
        </p>
      </div>
    );
  }

  if (view === "rescheduled") {
    return (
      <div className="text-center py-16">
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Booking Rescheduled</h2>
        <p className="text-gray-500 text-sm">
          Your new lesson time:{" "}
          <strong>{formatRange(booking.date, booking.time, booking.durationMinutes, customerZone)}</strong>
        </p>
      </div>
    );
  }

  if (view === "rescheduling") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setView("details")}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4"
        >
          ‹ Back
        </button>
        <p className="text-sm text-gray-500 mb-4">
          Pick a new time for your <strong>{booking.lessonLabel}</strong> lesson. Your current time (
          {formatRange(booking.date, booking.time, booking.durationMinutes, customerZone)}) will be released once
          confirmed.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Calendar
            viewMonth={viewMonth}
            onMonthChange={setViewMonth}
            selectedDate={newDate}
            onSelectDate={(d) => {
              setNewDate(d);
              setNewTime(null);
            }}
            availableDates={availabilityLoading ? null : availableLocalDates}
          />
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#F8ECE1" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#B668BD" }}>
              Available Times
            </p>
            {newDate ? (
              <TimeSlotGrid
                slots={availabilityLoading ? null : timesForNewDate}
                selectedTimesForDate={newTime ? [newTime] : []}
                onPickTime={setNewTime}
              />
            ) : (
              <p className="text-sm text-gray-400 text-center py-10">Select a date to see open times.</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm rounded-lg px-3 py-2 mt-4" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!newDate || !newTime || working}
          onClick={handleConfirmReschedule}
          className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "#B668BD" }}
        >
          {working
            ? "Confirming…"
            : newDate && newTime
              ? `Confirm ${formatTimeLabel(newTime)} on ${newDate}`
              : "Select a new time"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#B668BD" }}>
        {booking.lessonLabel}
      </p>
      <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-4">{booking.customerName}</h2>
      <p className="text-gray-700 mb-6">
        {formatRange(booking.date, booking.time, booking.durationMinutes, customerZone)}
      </p>

      {error && (
        <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={working}
          onClick={() => setView("rescheduling")}
          className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#B668BD" }}
        >
          Reschedule
        </button>
        <button
          type="button"
          disabled={working}
          onClick={handleCancel}
          className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          Cancel Lesson
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Free reschedule up to 24 hours before your lesson. Cancellations within 24 hours may be subject to the usual
        cancellation fee — Miss Yang will follow up if so.
      </p>
    </div>
  );
}
