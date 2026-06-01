import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonials | Chinese Tutor Yang",
  description:
    "Read what students and parents say about Chinese Tutor Yang's Mandarin and dance lessons.",
};

const testimonials = [
  {
    name: "Sarah M.",
    role: "Beginner Mandarin Student",
    quote:
      "Learning Mandarin with Tutor Yang has been an absolute joy. Her patience and structured approach made the tones click in just a few weeks. I went from dreading the language to genuinely loving it!",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "David L.",
    role: "HSK 3 Candidate",
    quote:
      "I went from zero Chinese to passing HSK 3 in eight months. Tutor Yang's methodical approach and genuine enthusiasm for teaching is truly unmatched. She made every session engaging and productive.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Jennifer K.",
    role: "Parent",
    quote:
      "My daughter started dance lessons at age 7. The transformation has been incredible — she performs classical Chinese dances with such grace and confidence now. Tutor Yang has a special gift for working with children.",
    program: "Dance Lessons",
    rating: 5,
  },
  {
    name: "Michael T.",
    role: "Business Professional",
    quote:
      "I needed Mandarin for work with our Chinese partners. Tutor Yang designed a Business Mandarin curriculum that was immediately practical. Within three months I was holding simple meetings in Chinese.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Emma W.",
    role: "Heritage Language Learner",
    quote:
      "My parents are from Guangzhou but I grew up speaking only English. Tutor Yang helped me reconnect with my roots. My grandparents cried the first time I spoke to them in Mandarin.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Lily Z.",
    role: "Teen Dance Student",
    quote:
      "I&apos;ve tried other dance schools but nothing compares. Tutor Yang explains the cultural meaning behind every movement, which makes me feel connected to something much bigger than just steps.",
    program: "Dance Lessons",
    rating: 5,
  },
  {
    name: "Robert & Amy C.",
    role: "Parents of Two Students",
    quote:
      "Both our children — one takes Mandarin, the other dance — look forward to their lessons every week. That&apos;s not easy to achieve! Tutor Yang is patient, professional, and genuinely invested in their progress.",
    program: "Both Programs",
    rating: 5,
  },
  {
    name: "Priya N.",
    role: "Intermediate Student",
    quote:
      "I had hit a plateau with self-study apps. Tutor Yang identified exactly where my gaps were in the first lesson and built a plan around them. My speaking confidence has gone through the roof.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "James R.",
    role: "Adult Dance Beginner",
    quote:
      "I&apos;m 42 and never danced in my life. Tutor Yang made me feel comfortable from day one. I now perform in community showcases — something I&apos;d never have dreamed of a year ago!",
    program: "Dance Lessons",
    rating: 5,
  },
];

const programColors: Record<string, { bg: string; text: string }> = {
  "Chinese Lessons": { bg: "#FEF9E7", text: "#9B1830" },
  "Dance Lessons": { bg: "#F0F4FF", text: "#1e40af" },
  "Both Programs": { bg: "#F5E6C8", text: "#9B1830" },
};

export default function Testimonials() {
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
          誉
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#D4AF37" }}
          >
            Student Reviews
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Students Say
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Real stories from students and families whose lives have been
            enriched through Chinese language and dance.
          </p>

          {/* Rating summary */}
          <div className="mt-10 inline-flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3">
            <div>
              <p className="font-playfair text-4xl font-bold text-white">4.9</p>
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: "#D4AF37" }}>★</span>
                ))}
              </div>
            </div>
            <div className="text-left text-white/80 text-sm border-l border-white/20 pl-4">
              <p className="font-semibold text-white">200+ Students</p>
              <p>98% recommend rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Grid ── */}
      <section className="section-padding" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t) => {
              const progColor = programColors[t.program] ?? { bg: "#FFF8F0", text: "#9B1830" };
              return (
                <div
                  key={t.name}
                  className="break-inside-avoid bg-white rounded-xl p-6 shadow-sm border"
                  style={{ borderColor: "#F5E6C8" }}
                >
                  {/* Stars */}
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={{ color: "#D4AF37" }}>★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: progColor.bg, color: progColor.text }}
                    >
                      {t.program}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #C41E3A 0%, #9B1830 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Your Success Story Starts Here
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join the growing community of students learning Mandarin and Chinese
          dance with Tutor Yang.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
        >
          Book My Free Trial →
        </Link>
      </section>
    </>
  );
}
