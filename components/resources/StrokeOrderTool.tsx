"use client";

import { useEffect, useRef, useState } from "react";
import type HanziWriterType from "hanzi-writer";

// Common first characters to try, so the box isn't empty on first load.
const SUGGESTIONS = ["你", "好", "学", "中", "文", "爱", "谢", "家", "水", "火"];

export default function StrokeOrderTool() {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterType | null>(null);
  const [char, setChar] = useState("你");
  const [inputValue, setInputValue] = useState("你");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);

    import("hanzi-writer").then(({ default: HanziWriter }) => {
      if (cancelled || !targetRef.current) return;
      targetRef.current.innerHTML = "";

      try {
        writerRef.current = HanziWriter.create(targetRef.current, char, {
          width: 280,
          height: 280,
          padding: 16,
          strokeAnimationSpeed: speed,
          delayBetweenStrokes: 300,
          showOutline: true,
          strokeColor: "#B668BD",
          outlineColor: "#F8ECE1",
          onLoadCharDataSuccess: () => {
            if (cancelled) return;
            setLoading(false);
            writerRef.current?.loopCharacterAnimation();
          },
          onLoadCharDataError: () => {
            if (cancelled) return;
            setLoading(false);
            setError(`Couldn't load stroke data for "${char}". Try a different character.`);
          },
        });
      } catch {
        setLoading(false);
        setError(`Couldn't load stroke data for "${char}". Try a different character.`);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [char, speed]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    const first = Array.from(trimmed)[0];
    if (!first) return;
    if (!/[一-鿿]/.test(first)) {
      setError("That doesn't look like a Chinese character — try pasting or typing one.");
      return;
    }
    setChar(first);
  }

  function handleQuiz() {
    writerRef.current?.quiz();
  }

  function handleReplay() {
    writerRef.current?.animateCharacter();
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type or paste a Chinese character, e.g. 学"
          maxLength={4}
          className="flex-1 border rounded-lg px-4 py-2.5 text-lg"
          style={{ borderColor: "#F8ECE1" }}
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#B668BD" }}
        >
          Show Stroke Order
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setInputValue(s);
              setChar(s);
            }}
            className="w-10 h-10 rounded-lg border text-lg font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor: s === char ? "#B668BD" : "#F8ECE1", color: s === char ? "#B668BD" : "#4b5563" }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div
          ref={targetRef}
          className="rounded-xl border flex items-center justify-center"
          style={{ borderColor: "#F8ECE1", width: 280, height: 280, backgroundColor: "#FCF9F5" }}
        />
        {loading && <p className="text-sm text-gray-400 mt-3">Loading stroke data…</p>}
        {error && (
          <p className="text-sm rounded-lg px-3 py-2 mt-3" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            onClick={handleReplay}
            className="px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: "#B668BD", color: "#B668BD" }}
          >
            ↻ Replay
          </button>
          <button
            type="button"
            onClick={handleQuiz}
            className="px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: "#CD8136", color: "#CD8136" }}
          >
            ✏️ Quiz Me
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            Speed
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
              style={{ borderColor: "#F8ECE1" }}
            >
              <option value={0.5}>Slow</option>
              <option value={1}>Normal</option>
              <option value={2}>Fast</option>
            </select>
          </label>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Stroke data from the open-source{" "}
        <a
          href="https://github.com/chanind/hanzi-writer"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Hanzi Writer
        </a>{" "}
        project. Works for most common simplified characters — some rare characters may not have data available.
      </p>
    </div>
  );
}
