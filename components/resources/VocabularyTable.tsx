"use client";

import { useMemo, useState } from "react";
import type { VocabEntry } from "@/lib/hsk-vocab";

export default function VocabularyTable({ words }: { words: VocabEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (w) => w.hz.includes(q) || w.py.toLowerCase().includes(q) || w.en.toLowerCase().includes(q)
    );
  }, [words, query]);

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by character, pinyin, or English…"
        className="w-full border rounded-lg px-4 py-2.5 text-sm mb-5"
        style={{ borderColor: "#F8ECE1" }}
      />

      <p className="text-xs text-gray-400 mb-4">
        {filtered.length} of {words.length} words
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "#F8ECE1" }}>
              <th className="py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-gray-500">汉字</th>
              <th className="py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Pinyin</th>
              <th className="py-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => (
              <tr key={`${w.hz}-${i}`} className="border-b" style={{ borderColor: "#F8ECE1" }}>
                <td className="py-2.5 pr-4 text-xl font-semibold" style={{ color: "#B668BD" }}>
                  {w.hz}
                </td>
                <td className="py-2.5 pr-4 text-gray-600 text-sm whitespace-nowrap">{w.py}</td>
                <td className="py-2.5 text-gray-500 text-sm">{w.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No words match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
