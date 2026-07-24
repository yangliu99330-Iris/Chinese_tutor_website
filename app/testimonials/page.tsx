import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonials | Chinese Tutor Yang",
  description:
    "Read what students and parents say about Chinese Tutor Yang's Mandarin and dance lessons.",
};

// Real student reviews from Miss Yang's italki and Preply tutor profiles,
// paraphrased from the originals (not verbatim quotes). Source ratings:
// italki 5.0★ (21 reviews) · Preply 5.0★ (12 reviews) — 33 reviews total.
const testimonials = [
  {
    name: "魏冬袅",
    role: "43 Lessons · via italki",
    quote:
      "Her lessons are so well organized — especially helpful as a beginner. I've progressed faster than I ever did studying on my own.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Will",
    role: "47 Lessons · via italki",
    quote:
      "Her teaching method is highly effective. I'd strongly recommend her to anyone serious about learning Chinese.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Juan",
    role: "18 Lessons · via italki",
    quote:
      "Miss Yang is incredibly engaged — she quickly figures out exactly what you need and keeps lessons sharp and fun with her sense of humor.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Kelly",
    role: "Student · via Preply",
    quote:
      "I was so happy after my first lesson that I booked ten more right away.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Adam",
    role: "Student · via Preply",
    quote:
      "Always well-prepared, endlessly patient, and creates such a positive learning environment.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Peter",
    role: "Student · via Preply",
    quote:
      "An exceptionally capable teacher — every lesson delivered more than I expected.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Titan",
    role: "2 Lessons · via italki",
    quote:
      "You can tell she genuinely loves teaching. Always approachable and happy to accommodate what I needed to work on.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Verified Student",
    role: "via Preply",
    quote: "Lessons are engaging and interactive from start to finish. Highly recommend.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Verified Student",
    role: "via Preply",
    quote: "Amazing teacher with such a positive attitude in every single lesson.",
    program: "Chinese Lessons",
    rating: 5,
  },
  {
    name: "Anthony",
    role: "2 Lessons · via italki",
    quote: "Great lessons, would recommend.",
    program: "Chinese Lessons",
    rating: 5,
  },
];

const programColors: Record<string, { bg: string; text: string }> = {
  "Chinese Lessons": { bg: "#FCF9F5", text: "#C65C5C" },
  "Dance Lessons": { bg: "#F0F4FF", text: "#1e40af" },
  "Both Programs": { bg: "#F8ECE1", text: "#C65C5C" },
};

export default function Testimonials() {
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
          誉
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#F8ECE1" }}
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
              <p className="font-playfair text-4xl font-bold text-white">5.0</p>
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: "#F8ECE1" }}>★</span>
                ))}
              </div>
            </div>
            <div className="text-left text-white/80 text-sm border-l border-white/20 pl-4">
              <p className="font-semibold text-white">33 Reviews</p>
              <p>italki &amp; Preply</p>
            </div>
          </div>

          <p className="mt-4 text-white/60 text-xs">
            <a href="https://www.italki.com/en/teacher/8870926" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              21 reviews on italki
            </a>
            {" · "}
            <a href="https://preply.com/en/tutor/1582754" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              12 reviews on Preply
            </a>
          </p>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#B668BD" }}>
            See Miss Yang Teach
          </p>
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-8">
            Watch a Lesson in Action
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: "#F8ECE1" }}>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/vGdOw9P-aK8"
              title="12 Chinese Slang You Must Know | Miss Yang"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a
            href="https://www.youtube.com/@ChineseTutorYang/featured"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm underline"
            style={{ color: "#B668BD" }}
          >
            More videos on YouTube →
          </a>
        </div>
      </section>

      {/* ── Testimonials Grid ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, i) => {
              const progColor = programColors[t.program] ?? { bg: "#FCFCFC", text: "#C65C5C" };
              return (
                <div
                  key={`${t.name}-${i}`}
                  className="break-inside-avoid bg-white rounded-xl p-6 shadow-sm border"
                  style={{ borderColor: "#F8ECE1" }}
                >
                  {/* Stars */}
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={{ color: "#CD8136" }}>★</span>
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
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Your Success Story Starts Here
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join the growing community of students learning Mandarin and Chinese
          dance with Miss Yang.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#CD8136", color: "white" }}
        >
          Book a Trial Lesson →
        </Link>
      </section>
    </>
  );
}
