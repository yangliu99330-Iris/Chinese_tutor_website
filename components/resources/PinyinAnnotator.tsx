"use client";

import { useState } from "react";

const DEFAULT_TEXT = "他在银行工作，走路去银行很远，他很行。";

const EXAMPLES = ["他在银行工作，走路去银行很远，他很行。", "睡着了还没睡着，你也要睡觉了。", "你好，欢迎学习中文！"];

interface PinyinFn {
  (text: string, options: { type: "array"; toneType: "symbol" }): string[];
}

/** True for CJK Unified Ideographs — only these get a ruby annotation; punctuation, spaces and Latin text pass through unchanged. */
function isHanzi(ch: string): boolean {
  return /[一-鿿]/.test(ch);
}

export default function PinyinAnnotator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [chars, setChars] = useState<string[]>(() => Array.from(DEFAULT_TEXT));
  const [pinyinArr, setPinyinArr] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnnotate() {
    const text = input.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      const { pinyin } = (await import("pinyin-pro")) as unknown as { pinyin: PinyinFn };
      const nextChars = Array.from(text);
      setChars(nextChars);
      setPinyinArr(pinyin(text, { type: "array", toneType: "symbol" }));
    } catch {
      setError("Something went wrong generating pinyin. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={compact ? 2 : 3}
        placeholder="Paste or type Chinese text here…"
        className="w-full border rounded-lg px-4 py-3 text-lg leading-relaxed mb-3"
        style={{ borderColor: "#F8ECE1" }}
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          type="button"
          onClick={handleAnnotate}
          disabled={loading}
          className="px-5 py-2 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#B668BD" }}
        >
          {loading ? "Adding pinyin…" : "Add Pinyin"}
        </button>
        {!compact && <span className="text-xs text-gray-400">Examples:</span>}
        {!compact &&
          EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
              style={{ borderColor: "#F8ECE1", color: "#6b7280" }}
            >
              {ex.slice(0, 6)}…
            </button>
          ))}
      </div>

      {error && (
        <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
          {error}
        </p>
      )}

      {pinyinArr && (
        <div
          className="rounded-xl p-5 leading-[2.6] text-2xl"
          style={{ backgroundColor: "#FCF9F5", border: "1px solid #F8ECE1" }}
          lang="zh-Hans"
        >
          {chars.map((ch, i) =>
            isHanzi(ch) ? (
              <ruby key={i} className="mx-0.5">
                {ch}
                <rt className="text-xs" style={{ color: "#B668BD" }}>
                  {pinyinArr[i]}
                </rt>
              </ruby>
            ) : (
              <span key={i} className="whitespace-pre-wrap">
                {ch}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
