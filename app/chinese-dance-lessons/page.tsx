import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chinese Dance Lessons | Chinese Tutor Yang",
  description:
    "Learn Chinese classical, folk, and contemporary dance with Tutor Yang. Open to all ages and experience levels.",
};

const danceStyles = [
  {
    char: "典",
    title: "Classical Chinese Dance",
    subtitle: "中国古典舞",
    desc: "Rooted in thousands of years of tradition, classical Chinese dance combines flowing movements, expressive storytelling, and precise technique. Learn the foundational postures, hand gestures, and the art of embodying characters through movement.",
    highlights: ["Basic body coordination & posture", "Hand, eye, and body harmony", "Classical repertoire pieces", "Fan, ribbon, and sleeve choreography"],
    suitedFor: "All levels welcome",
    duration: "60 min / session",
  },
  {
    char: "民",
    title: "Chinese Folk Dance",
    subtitle: "民族民间舞",
    desc: "Celebrate the vibrant diversity of China's 56 ethnic groups through energetic, colourful folk dances. From the Mongolian grasslands to Yunnan province, each style tells a unique cultural story.",
    highlights: ["Uyghur, Mongolian, Tibetan styles", "Hanfu dance traditions", "Prop work: fans, umbrellas, drums", "Performance choreography"],
    suitedFor: "Beginners & Intermediate",
    duration: "60 min / session",
  },
  {
    char: "现",
    title: "Contemporary Chinese Dance",
    subtitle: "中国当代舞",
    desc: "A modern fusion of classical Chinese movement vocabulary with contemporary techniques. Express emotion, narrative, and creativity while honouring the depth of Chinese movement aesthetics.",
    highlights: ["Modern floor work & improvisation", "Chinese contemporary repertoire", "Creative expression & storytelling", "Audition & competition prep"],
    suitedFor: "Intermediate & Advanced",
    duration: "75 min / session",
  },
];

const benefits = [
  { icon: "🧠", title: "Cognitive Development", desc: "Dance training sharpens memory, focus, and spatial awareness at any age." },
  { icon: "🌸", title: "Cultural Connection", desc: "Each movement carries history — students gain deep appreciation for Chinese heritage." },
  { icon: "💪", title: "Physical Fitness", desc: "Improve flexibility, balance, core strength, and body awareness through structured training." },
  { icon: "🎭", title: "Performance Confidence", desc: "Regular performance opportunities build stage presence and self-assurance." },
];

export default function ChineseDanceLessons() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
      >
        <span
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          舞
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#D4AF37" }}
          >
            中国舞蹈课
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Chinese Dance Lessons
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Discover the grace, storytelling, and cultural depth of Chinese
            dance — for all ages and levels.
          </p>
        </div>
      </section>

      {/* ── Dance Styles ── */}
      <section className="section-padding" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#C41E3A" }}
            >
              Dance Programs
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Three Styles, One Rich Tradition
            </h2>
          </div>

          <div className="space-y-8">
            {danceStyles.map((style, idx) => (
              <div
                key={style.title}
                className={`rounded-2xl overflow-hidden shadow-sm flex flex-col ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Colour panel */}
                <div
                  className="md:w-1/3 flex items-center justify-center py-12 px-6 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)",
                  }}
                >
                  <div>
                    <span
                      className="font-playfair text-7xl font-bold block mb-3"
                      style={{ color: "#D4AF37" }}
                    >
                      {style.char}
                    </span>
                    <h3 className="font-playfair text-xl font-bold text-white">
                      {style.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "#D4AF37" }}>
                      {style.subtitle}
                    </p>
                  </div>
                </div>

                {/* Content panel */}
                <div
                  className="md:w-2/3 bg-white p-8 md:p-10"
                >
                  <p className="text-gray-600 leading-relaxed mb-5">{style.desc}</p>

                  <div className="grid sm:grid-cols-2 gap-2 mb-6">
                    {style.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2 text-sm text-gray-600">
                        <span style={{ color: "#D4AF37" }} className="mt-0.5">✦</span>
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#FFF8F0", border: "1px solid #F5E6C8" }}
                    >
                      ⏱ {style.duration}
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#FFF8F0", border: "1px solid #F5E6C8" }}
                    >
                      🎯 {style.suitedFor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#C41E3A" }}
            >
              Why Dance?
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Benefits of Chinese Dance
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl p-6 text-center border"
                style={{ borderColor: "#F5E6C8", backgroundColor: "#FFF8F0" }}
              >
                <span className="text-4xl mb-4 block">{b.icon}</span>
                <h3
                  className="font-playfair font-bold text-lg mb-2"
                  style={{ color: "#9B1830" }}
                >
                  {b.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ages & Levels ── */}
      <section className="section-padding" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#C41E3A" }}
          >
            Who It&apos;s For
          </p>
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-6">
            Dance Lessons for Every Age
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From age 4 to adult, Tutor Yang tailors every lesson to the
            student&apos;s physical ability, age, and goals. No prior dance
            experience is needed — only enthusiasm!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Ages 4–7", "Ages 8–12", "Teens 13–17", "Adults 18+"].map((age) => (
              <div
                key={age}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)",
                  color: "#D4AF37",
                }}
              >
                {age}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Ready to Take the Stage?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Book a trial dance lesson and take your first step into the beautiful
          world of Chinese dance.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
        >
          Book a Dance Trial →
        </Link>
      </section>
    </>
  );
}
