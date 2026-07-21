import Link from "next/link";

const stats = [
  { value: "200+", label: "Students Taught" },
  { value: "6+", label: "Years Experience" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "Recommend Rate" },
];

const features = [
  {
    icon: "🎓",
    title: "Expert Instruction",
    desc: "Native-level Mandarin fluency with formal training in teaching methodology and Chinese classical arts.",
  },
  {
    icon: "📐",
    title: "Structured Curriculum",
    desc: "Clear, progressive lessons from pinyin to fluency — aligned with HSK standards and practical conversation.",
  },
  {
    icon: "🎭",
    title: "Cultural Immersion",
    desc: "Go beyond vocabulary — learn the customs, history, and artistry woven into Chinese language and dance.",
  },
  {
    icon: "📅",
    title: "Flexible Scheduling",
    desc: "Online and in-person sessions available seven days a week to fit around your busy life.",
  },
];

const programs = [
  {
    char: "中",
    title: "Chinese Language Lessons",
    subtitle: "普通话",
    desc: "From absolute beginner to advanced — Miss Yang offers one-on-one Mandarin lessons covering speaking, reading, writing, and HSK exam preparation.",
    href: "/chinese-lessons",
    cta: "Explore Lessons",
  },
  {
    char: "舞",
    title: "Chinese Dance Lessons",
    subtitle: "中国舞蹈",
    desc: "Discover the grace and beauty of Chinese classical, folk, and contemporary dance. Open to all ages and experience levels.",
    href: "/chinese-dance-lessons",
    cta: "Explore Dance",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Beginner Mandarin Student",
    quote:
      "Learning Mandarin with Miss Yang has been the best decision I've made. Her patience and structured approach made the tones click in just weeks!",
  },
  {
    name: "David L.",
    role: "HSK 3 Candidate",
    quote:
      "I went from zero Chinese to passing HSK 3 in eight months. Miss Yang's enthusiasm and systematic teaching is truly unmatched.",
  },
  {
    name: "Jennifer K.",
    role: "Parent",
    quote:
      "My daughter's confidence in dance has blossomed beautifully. She now performs traditional Chinese dances with real grace and joy.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center"
        style={{
          background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)",
        }}
      >
        {/* Decorative characters */}
        <span
          className="absolute -right-8 top-1/2 -translate-y-1/2 text-[18rem] font-bold select-none pointer-events-none hidden md:block"
          style={{ color: "rgba(212,175,55,0.08)", fontFamily: "serif" }}
          aria-hidden
        >
          学
        </span>
        <span
          className="absolute left-4 bottom-4 text-8xl font-bold select-none pointer-events-none"
          style={{ color: "rgba(255,255,255,0.05)", fontFamily: "serif" }}
          aria-hidden
        >
          福
        </span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 relative z-10">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#F8ECE1" }}
          >
            杨老师 — Miss Yang
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mb-6 text-shadow">
            Master Chinese Language &amp; Culture
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-10 leading-relaxed">
            Professional Mandarin and Chinese Dance lessons tailored to your
            goals — for children, teens, and adults at every level.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="px-7 py-3.5 rounded font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#CD8136", color: "white" }}
            >
              Book a Trial Lesson
            </Link>
            <Link
              href="/chinese-lessons"
              className="px-7 py-3.5 rounded font-bold text-sm border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p
                  className="font-playfair text-4xl font-bold"
                  style={{ color: "#B668BD" }}
                >
                  {s.value}
                </p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Our Programs
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              Two Paths, One Rich Culture
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((p) => (
              <div
                key={p.title}
                className="relative rounded-2xl overflow-hidden shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)",
                }}
              >
                <span
                  className="absolute right-4 top-4 text-9xl font-bold select-none pointer-events-none"
                  style={{ color: "rgba(212,175,55,0.15)", fontFamily: "serif" }}
                  aria-hidden
                >
                  {p.char}
                </span>
                <div className="relative z-10 p-8 md:p-10">
                  <p
                    className="font-playfair text-5xl font-bold mb-2"
                    style={{ color: "#F8ECE1" }}
                  >
                    {p.char}
                  </p>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#F8ECE1" }}>
                    {p.subtitle}
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    {p.desc}
                  </p>
                  <Link
                    href={p.href}
                    className="inline-block px-5 py-2.5 rounded font-bold text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#CD8136", color: "white" }}
                  >
                    {p.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Why Miss Yang
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              The Miss Yang Difference
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 text-center border transition-shadow hover:shadow-md"
                style={{ borderColor: "#F8ECE1" }}
              >
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3
                  className="font-playfair font-bold text-lg mb-2"
                  style={{ color: "#C65C5C" }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Preview ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#B668BD" }}
            >
              Student Stories
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              What Our Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 shadow-sm border"
                style={{ borderColor: "#F8ECE1" }}
              >
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{ color: "#CD8136" }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-block px-6 py-2.5 rounded border-2 font-semibold text-sm transition-colors hover:bg-chinese-red hover:text-white"
              style={{ borderColor: "#B668BD", color: "#B668BD" }}
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <p
          className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 text-shadow"
        >
          Ready to Start Your Chinese Journey?
        </p>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">
          Book a Trial Lesson, or message Miss Yang first on WhatsApp, WeChat,
          or email to find the right program for you.
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
