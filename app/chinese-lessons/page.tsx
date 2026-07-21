import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chinese Language Lessons | Chinese Tutor Yang",
  description:
    "One-on-one Mandarin lessons for beginners to advanced learners. Conversational Chinese, HSK prep, Business Mandarin, and more.",
};

const courses = [
  {
    level: "Beginner",
    char: "一",
    title: "Mandarin for Beginners",
    desc: "Start from zero with pinyin, tones, essential vocabulary, and basic conversational phrases. Build the foundation you need to grow.",
    topics: ["Pinyin & tones", "Greetings & introductions", "Numbers, dates, time", "Basic sentence patterns"],
    duration: "60 min / session",
    suitable: "Absolute beginners",
  },
  {
    level: "Elementary",
    char: "二",
    title: "Elementary Chinese",
    desc: "Expand your vocabulary, tackle everyday situations, and start reading simplified characters with confidence.",
    topics: ["Shopping & dining", "Travel Chinese", "Character recognition", "Listening comprehension"],
    duration: "60 min / session",
    suitable: "After ~30 hours of study",
  },
  {
    level: "Intermediate",
    char: "三",
    title: "Intermediate Mandarin",
    desc: "Sharpen grammar, tackle complex topics, and hold fluent conversations on a wide range of subjects.",
    topics: ["Complex grammar structures", "News & media Chinese", "Debate & opinion", "HSK 3-4 preparation"],
    duration: "75 min / session",
    suitable: "HSK 2 equivalent",
  },
  {
    level: "Advanced",
    char: "四",
    title: "Advanced Chinese",
    desc: "Polish your fluency, master nuanced expressions, and engage with authentic Chinese texts and media.",
    topics: ["Classical literature excerpts", "Idiomatic expressions (成语)", "Advanced writing", "HSK 5-6 preparation"],
    duration: "75 min / session",
    suitable: "HSK 4 equivalent",
  },
  {
    level: "Conversational",
    char: "话",
    title: "Conversational Mandarin",
    desc: "Focus exclusively on natural, flowing spoken Chinese. Perfect for travelers, expats, and heritage speakers.",
    topics: ["Real-world dialogues", "Slang & colloquialisms", "Pronunciation refinement", "Cultural context"],
    duration: "60 min / session",
    suitable: "Elementary level and above",
  },
  {
    level: "Business",
    char: "商",
    title: "Business Mandarin",
    desc: "Professional Chinese for the workplace — presentations, negotiations, emails, and corporate etiquette.",
    topics: ["Professional vocabulary", "Business writing", "Meeting & negotiation language", "Chinese business culture"],
    duration: "75 min / session",
    suitable: "Intermediate level and above",
  },
];

const included = [
  { icon: "📋", title: "Personalised Learning Plan", desc: "A custom roadmap built around your specific goals, timeline, and current level." },
  { icon: "📚", title: "Study Materials Provided", desc: "Curated PDFs, flashcard decks, and exercises — no need to buy textbooks." },
  { icon: "✏️", title: "Homework & Practice Sheets", desc: "Targeted exercises after each session to cement what you learned." },
  { icon: "🎙️", title: "Pronunciation Feedback", desc: "Detailed tone correction and accent coaching every session." },
  { icon: "📊", title: "Progress Reports", desc: "Regular check-ins to track growth and adjust the curriculum." },
  { icon: "💬", title: "WhatsApp Support", desc: "Ask quick questions between sessions via message." },
];

const levelColors: Record<string, string> = {
  Beginner: "#22c55e",
  Elementary: "#3b82f6",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
  Conversational: "#8b5cf6",
  Business: "#0ea5e9",
};

export default function ChineseLessons() {
  return (
    <>
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
          文
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#CD8136" }}
          >
            普通话课程
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Chinese Language Lessons
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            One-on-one Mandarin lessons from absolute beginner to HSK mastery —
            tailored entirely to you.
          </p>
        </div>
      </section>

      {/* ── Courses Grid ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              All Levels Welcome
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Choose Your Course
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                style={{ borderColor: "#F8ECE1" }}
              >
                <div
                  className="px-6 py-5 flex items-center gap-4"
                  style={{
                    background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)",
                  }}
                >
                  <span
                    className="font-playfair text-4xl font-bold"
                    style={{ color: "#CD8136" }}
                  >
                    {c.char}
                  </span>
                  <div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: levelColors[c.level] ?? "#6b7280",
                        color: "white",
                      }}
                    >
                      {c.level}
                    </span>
                    <h3 className="font-playfair font-bold text-white text-lg mt-1">
                      {c.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.desc}</p>

                  <ul className="space-y-1.5 mb-5">
                    {c.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                        <span style={{ color: "#CD8136" }}>✦</span>
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400"
                    style={{ borderTop: "1px solid #F8ECE1" }}
                  >
                    <span>⏱ {c.duration}</span>
                    <span>🎯 {c.suitable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Every Lesson Includes
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Full Support from Day One
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-xl border"
                style={{ borderColor: "#F8ECE1", backgroundColor: "#FCFCFC" }}
              >
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Not Sure Which Level to Start?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Book a free 20-minute assessment and Tutor Yang will recommend the
          perfect course for your current level and goals.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/booking"
            className="px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#CD8136", color: "white" }}
          >
            Book a Free Assessment
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded font-bold text-sm border-2 text-white hover:bg-white/10 transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            View Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
