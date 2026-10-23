import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import PinyinAnnotator from "@/components/resources/PinyinAnnotator";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pinyin Annotator: Add Pinyin to Chinese Text (Free)",
  description:
    "Paste Chinese text and get accurate pinyin above every character, with context-aware handling of multi-pronunciation characters (多音字). Free tool.",
  path: "/resources/pinyin-annotator",
});

export default function PinyinAnnotatorPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Pinyin Annotator",
          description: "A free tool that adds accurate, context-aware pinyin above any Chinese text.",
          path: "/resources/pinyin-annotator",
          dateModified: "2026-10-23",
        })}
      />

      {/* ── Hero ── */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <span
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          拼
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Digital Resource
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Pinyin Annotator
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Paste Chinese text, get accurate pinyin above every character — instantly.
          </p>
        </div>
      </section>

      {/* ── Tool ── */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto">
          <PinyinAnnotator />
        </div>
      </section>

      {/* ── Why this is more accurate ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-4">Why This Gets 多音字 Right</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Some Chinese characters have more than one pronunciation depending on meaning — these are called{" "}
            <strong>多音字 (duōyīnzì)</strong>. The character 行 is read <em>háng</em> in 银行 (bank) but{" "}
            <em>xíng</em> in 他很行 (he&apos;s capable). A printed font or a simple character-by-character lookup
            can&apos;t tell the difference — it has no way to read the sentence around the character.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This tool works differently: it analyses the words around each character to pick the correct reading,
            the same way a fluent reader would. It won&apos;t be perfect on every unusual sentence, but it&apos;s
            built specifically to handle cases like this correctly, rather than always guessing the most common
            reading.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Want to Read With Real Confidence?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          A tool can help you check — a lesson is how you actually learn to read without one.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/booking"
            className="px-6 py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "white", color: "#B668BD" }}
          >
            Book a Lesson
          </Link>
          <Link
            href="/resources"
            className="px-6 py-3 rounded font-bold text-sm border-2 border-white text-white transition-colors hover:bg-white/10"
          >
            More Resources
          </Link>
        </div>
      </section>
    </>
  );
}
