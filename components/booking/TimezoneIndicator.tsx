"use client";

import { describeZone } from "@/lib/timezone";

export default function TimezoneIndicator({ zone }: { zone: string | null }) {
  if (!zone) return null;

  const { label, currentTime } = describeZone(zone);

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 mb-4"
      style={{ backgroundColor: "#FCF9F5", border: "1px solid #F8ECE1" }}
    >
      <span>🌍</span>
      <span>
        Times shown in your local timezone — <strong className="text-gray-700">{label}</strong>
        {currentTime ? <> · it&apos;s currently {currentTime} for you</> : null}
      </span>
    </div>
  );
}
