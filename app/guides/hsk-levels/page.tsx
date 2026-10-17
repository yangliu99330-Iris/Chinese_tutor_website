import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { articleJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

// Published — owner has confirmed the HSK figures below (2026-10-18).
export const metadata = pageMetadata({
  title: "HSK Levels Explained: Which One Should You Start At?",
  description:
    "A plain-English guide to the HSK Chinese proficiency levels — the classic HSK 1-6 scale and the newer three-band system — and how to pick the right starting level.",
  path: "/guides/hsk-levels",
});

const classicLevels = [
  { level: "HSK 1", words: "~150", summary: "Very basic phrases: greetings, numbers, simple needs." },
  { level: "HSK 2", words: "~300", summary: "Simple, direct exchanges on familiar everyday topics." },
  { level: "HSK 3", words: "~600", summary: "Can handle most daily, academic and work situations while travelling in China." },
  { level: "HSK 4", words: "~1,200", summary: "Converses fluently on a wide range of topics; can discuss opinions." },
  { level: "HSK 5", words: "~2,500", summary: "Reads newspapers and magazines, watches films, gives full presentations." },
  { level: "HSK 6", words: "~5,000+", summary: "Near-native comprehension; reads and writes with ease." },
];

const newBands = [
  {
    band: "Elementary (初等)",
    levels: "Levels 1–3",
    summary: "Roughly comparable to classic HSK 1–3 — everyday phrases and simple daily interactions.",
  },
  {
    band: "Intermediate (中等)",
    levels: "Levels 4–6",
    summary: "Roughly comparable to classic HSK 4–5 — fluent conversation, opinions, workplace topics.",
  },
  {
    band: "Advanced (高等)",
    levels: "Levels 7–9",
    summary: "Tested as a combined band — academic, professional and near-native command of Chinese.",
  },
];

const faqs = [
  {
    q: "Do I need to take the HSK to learn Chinese?",
    a: "No — plenty of students learn Mandarin purely for travel, family, work or personal interest with no exam in mind. HSK matters if you need proof of level for university admission in China, certain work visas, or you simply like having a concrete goal to study towards.",
  },
  {
    q: "Which HSK level should I start at?",
    a: "If you've never studied Chinese, start from the beginning rather than guessing a level — pinyin, tones and basic sentence patterns come before any HSK content makes sense. If you've studied before, a quick assessment lesson is the fastest way to place you accurately; guessing from self-reported experience alone is often wrong in either direction.",
  },
  {
    q: "Is the old HSK 1-6 test still valid?",
    a: "Rules vary by country and test centre, and have been changing as the newer three-band standard rolls out. Check directly with the test centre or institution that needs your result before registering, since requirements can differ by region and by what the result is for (university, visa, employer).",
  },
  {
    q: "How long does it take to reach each level?",
    a: "It depends heavily on study frequency and whether you're also practising outside lessons, so treat any timeline as a rough guide rather than a promise. Consistent weekly lessons plus a little regular review between sessions is what actually moves students up a level — not the number of months that pass.",
  },
];

export default function HskLevelsGuide() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "HSK Levels Explained: Which One Should You Start At?",
          description:
            "A plain-English guide to the HSK Chinese proficiency levels and how to pick the right starting level.",
          path: "/guides/hsk-levels",
          dateModified: "2026-10-17",
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

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
          级
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Learning Guide
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            HSK Levels Explained
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            What each HSK level actually means, and how to work out where you should start.
          </p>
        </div>
      </section>

      {/* ── What is HSK ── */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-6">What is the HSK?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            HSK (汉语水平考试, Hànyǔ Shuǐpíng Kǎoshì — &ldquo;Chinese
            Proficiency Test&rdquo;) is the standardised test of Mandarin Chinese for non-native speakers. It&apos;s
            the test universities, some employers and some visa applications ask for as proof of your Chinese
            level.
          </p>
          <p className="text-gray-600 leading-relaxed">
            You don&apos;t need to be preparing for the exam to find the levels useful — they&apos;re also a handy,
            widely-understood way to describe roughly how much Chinese you know, and a natural set of milestones to
            work towards even if you never actually sit the test.
          </p>
        </div>
      </section>

      {/* ── Classic HSK 1-6 ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-3">The Classic HSK 1–6 Scale</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The original six-level system is still the version most learners and schools refer to. Word counts
            below are approximate and cumulative (each level builds on the last).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "#F8ECE1" }}>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-900">Level</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-900">Vocabulary</th>
                  <th className="py-3 text-sm font-semibold text-gray-900">What you can do</th>
                </tr>
              </thead>
              <tbody>
                {classicLevels.map((l) => (
                  <tr key={l.level} className="border-b" style={{ borderColor: "#F8ECE1" }}>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "#B668BD" }}>
                      {l.level}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-sm">{l.words} words</td>
                    <td className="py-3 text-gray-600 text-sm">{l.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── New three-band system ── */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-3">The Newer Three-Band System</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            A revised standard restructures proficiency into three bands and nine levels, with the top three levels
            (7–9) tested together as one advanced band rather than as separate exams. Rollout and which version a
            given institution asks for varies by country and test centre — always confirm with whoever needs your
            result before you register for either version.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {newBands.map((b) => (
              <div key={b.band} className="rounded-xl p-5 border" style={{ borderColor: "#F8ECE1", backgroundColor: "#FCFCFC" }}>
                <p className="font-semibold text-gray-900 mb-1">{b.band}</p>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#CD8136" }}>
                  {b.levels}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{b.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border" style={{ borderColor: "#F8ECE1" }}>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ color: "#C65C5C" }}>
                  {faq.q}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Not Sure Which Level You&apos;re At?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          A quick lesson with Miss Yang is the fastest way to find out — she&apos;ll place you accurately and tell
          you honestly what to expect.
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
            href="/chinese-lessons"
            className="px-6 py-3 rounded font-bold text-sm border-2 border-white text-white transition-colors hover:bg-white/10"
          >
            See All Courses
          </Link>
        </div>
      </section>
    </>
  );
}
