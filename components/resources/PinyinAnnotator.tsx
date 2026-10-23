"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_TEXT = "他在银行工作，走路去银行很远，他很行。";

const EXAMPLES = ["他在银行工作，走路去银行很远，他很行。", "睡着了还没睡着，你也要睡觉了。", "你好，欢迎学习中文！"];

const DEBOUNCE_MS = 300;

interface PinyinFn {
  (text: string, options: { type: "array"; toneType: "symbol" }): string[];
}

/** True for CJK Unified Ideographs — only these get a ruby annotation; punctuation, spaces and Latin text pass through unchanged. */
function isHanzi(ch: string): boolean {
  return /[一-鿿]/.test(ch);
}

/** Pinyin line above, original text below — a plain-text fallback for pasting somewhere that can't render ruby annotations. */
function toPlainText(chars: string[], pinyinArr: string[]): string {
  const pinyinLine = chars.map((ch, i) => (isHanzi(ch) ? pinyinArr[i] : ch)).join(" ").replace(/ +/g, " ");
  return `${pinyinLine}\n${chars.join("")}`;
}

export default function PinyinAnnotator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [chars, setChars] = useState<string[]>([]);
  const [pinyinArr, setPinyinArr] = useState<string[] | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pinyinFn = useRef<PinyinFn | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load the pinyin engine once, up front, so typing never has to wait on it.
  useEffect(() => {
    let cancelled = false;
    import("pinyin-pro").then(({ pinyin }) => {
      if (cancelled) return;
      pinyinFn.current = pinyin as unknown as PinyinFn;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function annotate(text: string) {
    const fn = pinyinFn.current;
    if (!fn) return;
    const trimmed = text.trim();
    if (!trimmed) {
      setChars([]);
      setPinyinArr(null);
      return;
    }
    try {
      setChars(Array.from(text));
      setPinyinArr(fn(text, { type: "array", toneType: "symbol" }));
      setError(null);
    } catch {
      setError("Something went wrong generating pinyin. Please try again.");
    }
  }

  // Auto-annotate as the user types or pastes, debounced so fast typing doesn't
  // re-run the (word-segmentation-based) pinyin engine on every keystroke.
  useEffect(() => {
    if (!ready) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => annotate(input), DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, ready]);

  async function handleCopy() {
    if (!pinyinArr || chars.length === 0) return;
    const plain = toPlainText(chars, pinyinArr);
    const html = resultRef.current?.innerHTML ?? "";

    try {
      if (navigator.clipboard && "write" in navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/plain": new Blob([plain], { type: "text/plain" }),
              "text/html": new Blob([html], { type: "text/html" }),
            }),
          ]);
        } catch {
          // Some browsers are stricter about multi-MIME-type writes than plain
          // text — fall back rather than failing outright.
          await navigator.clipboard.writeText(plain);
        }
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy automatically — please select the text and copy it manually.");
    }
  }

  function handleDownloadPdf() {
    if (!resultRef.current) return;

    // Printed from a hidden same-page iframe rather than window.open() — a
    // new window/tab is a "pop-up" to most browsers (and gets blocked even
    // on a genuine click in some setups); an iframe isn't, so this works
    // more reliably. "Download PDF" means "use your browser's Save as PDF
    // in the print dialog" — there's no separate backend PDF generation.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const cleanup = () => {
      setTimeout(() => iframe.remove(), 1000);
    };

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      setError("Couldn't open the print view. Please try again.");
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(`<!doctype html>
      <html><head><meta charset="utf-8"><title>Pinyin Annotation</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; }
        .result { font-size: 24px; line-height: 2.8; }
        ruby { margin: 0 1px; }
        rt { font-size: 12px; color: #B668BD; }
      </style></head>
      <body><div class="result">${resultRef.current.innerHTML}</div></body></html>`);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      cleanup();
    };
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#F8ECE1" }}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={compact ? 2 : 3}
        placeholder={ready ? "Type or paste Chinese text here…" : "Loading…"}
        disabled={!ready}
        className="w-full border rounded-lg px-4 py-3 text-lg leading-relaxed mb-3 disabled:opacity-60"
        style={{ borderColor: "#F8ECE1" }}
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {!ready && <span className="text-xs text-gray-400">Loading pinyin engine…</span>}
        {!compact && ready && <span className="text-xs text-gray-400">Examples:</span>}
        {!compact &&
          ready &&
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

      {pinyinArr && chars.length > 0 && (
        <>
          <div
            ref={resultRef}
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

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#B668BD", color: "#B668BD" }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#CD8136", color: "#CD8136" }}
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
