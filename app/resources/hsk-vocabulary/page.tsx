import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import VocabularyTable from "@/components/resources/VocabularyTable";
import { HSK1_VOCAB } from "@/lib/hsk-vocab";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "HSK 1 Vocabulary List (150 Words, Free & Searchable)",
  description:
    "The complete official HSK 1 vocabulary list — 150 words with pinyin and English meaning, searchable. Free resource from Chinese Tutor Yang.",
  path: "/resources/hsk-vocabulary",
});

export default function HskVocabularyPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "HSK 1 Vocabulary List",
          description: "The complete official HSK 1 vocabulary list, searchable, with pinyin and English meaning.",
          path: "/resources/hsk-vocabulary",
          dateModified: "2026-10-20",
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
          词
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Digital Resource
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            HSK Vocabulary
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            The complete HSK 1 word list — 150 words, searchable by character, pinyin or English.
          </p>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto">
          <VocabularyTable words={HSK1_VOCAB} />
          <p className="text-xs text-gray-400 mt-4 text-center">
            More levels (HSK 2 and 3) are being added — check back soon, or{" "}
            <Link href="/guides/hsk-levels" className="underline" style={{ color: "#B668BD" }}>
              read the HSK levels guide
            </Link>{" "}
            in the meantime.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Ready to Put These Words to Use?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          A word list gets you started — real conversation is how it sticks.
        </p>
        <Link
          href="/booking"
          className="inline-block px-6 py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "white", color: "#B668BD" }}
        >
          Book a Lesson
        </Link>
      </section>
    </>
  );
}
