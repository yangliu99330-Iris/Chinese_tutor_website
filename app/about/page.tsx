import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Me | Chinese Tutor Yang",
  description:
    "Learn about Tutor Yang's background, teaching philosophy, credentials, and passion for sharing Chinese language and dance.",
};

const pillars = [
  {
    char: "心",
    title: "Heart-Centred Teaching",
    desc: "Every student is unique. Lessons are adapted to your personality, pace, and goals — never a one-size-fits-all approach.",
  },
  {
    char: "文",
    title: "Language & Culture Together",
    desc: "Mandarin is inseparable from its culture. We weave history, traditions, and stories into every lesson.",
  },
  {
    char: "恒",
    title: "Consistency Builds Fluency",
    desc: "Short, regular practice beats sporadic long sessions. Structured habit-building is at the core of all programs.",
  },
  {
    char: "乐",
    title: "Learning Should Be Joyful",
    desc: "From games to songs to dance, enjoyment fuels retention. Lessons are engaging, encouraging, and fun.",
  },
];

const credentials = [
  "Bachelor of Arts in Chinese Language & Literature",
  "Certificate in Mandarin Language Teaching (CTCSOL)",
  "Certified Chinese Classical Dance Instructor",
  "HSK 6 (Highest Proficiency Level)",
  "5+ years of professional Mandarin teaching experience",
  "Trained at the Beijing Dance Academy",
];

export default function About() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)",
        }}
      >
        <span
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          师
        </span>
        <div className="relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#F8ECE1" }}
          >
            Meet Your Tutor
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            About Tutor Yang
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Passionate educator, cultural ambassador, and lifelong learner.
          </p>
        </div>
      </section>

      {/* ── Profile ── */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile photo */}
            <div
              className="relative rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto w-full shadow-xl"
              style={{ border: "3px solid #CD8136" }}
            >
              <Image
                src="/tutor-yang.jpg"
                alt="Tutor Yang"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 384px"
                priority
              />
            </div>

            {/* Bio */}
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#B668BD" }}
              >
                My Story
              </p>
              <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-5">
                A Lifelong Love of Language &amp; Art
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Born and raised in China, I grew up immersed in the richness
                  of Mandarin and the elegance of classical Chinese dance.
                  Language and movement were never just subjects to me — they
                  were the way I understood the world.
                </p>
                <p>
                  I obtained my bachelor&apos;s degree from a Normal University
                  in China, specialising in education, and received my
                  Putonghua Teaching Certification in 2015. I later earned a
                  master&apos;s degree from a university in Japan in 2021,
                  which deepened my passion for cross-cultural connection.
                </p>
                <p>
                  Now based in the UK and working at a local school in
                  Scotland, I bring 12 years of teaching experience to every
                  lesson. I have had the privilege of teaching Mandarin to
                  over 200 students — from curious children to busy
                  professionals preparing for HSK exams. My greatest reward is
                  watching students light up during their first real
                  conversation in Mandarin, or nail a performance after weeks
                  of dedicated practice. That moment makes every lesson
                  worthwhile.
                </p>
              </div>

              <Link
                href="/booking"
                className="inline-block mt-8 px-6 py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#B668BD", color: "white" }}
              >
                Book a Lesson with Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Teaching Philosophy ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Teaching Philosophy
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Four Pillars of My Approach
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-xl p-6 text-center shadow-sm border"
                style={{ borderColor: "#F8ECE1" }}
              >
                <span
                  className="font-playfair text-5xl font-bold block mb-3"
                  style={{ color: "#B668BD" }}
                >
                  {p.char}
                </span>
                <h3
                  className="font-playfair font-bold text-lg mb-2"
                  style={{ color: "#C65C5C" }}
                >
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Qualifications
            </p>
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              Credentials &amp; Training
            </h2>
          </div>

          <ul className="space-y-3">
            {credentials.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{ backgroundColor: "#FCFCFC", border: "1px solid #F8ECE1" }}
              >
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#CD8136" }}
                >
                  ✓
                </span>
                <span className="text-gray-700">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Let&apos;s Learn Together
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Book a Trial Lesson and experience the Tutor Yang difference for
          yourself.
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
