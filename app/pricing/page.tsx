import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Chinese Tutor Yang",
  description:
    "Transparent pricing for Mandarin Chinese and Chinese Dance lessons. Single sessions and discounted lesson bundles available.",
};

const languagePlans = [
  {
    name: "Single Lesson",
    price: "$65",
    period: "per lesson",
    desc: "Perfect for trying out lessons or booking occasional top-up sessions.",
    features: [
      "60-minute one-on-one session",
      "Personalised lesson plan",
      "Digital study materials",
      "Post-session feedback",
      "WhatsApp support",
    ],
    cta: "Book Now",
    highlighted: false,
  },
  {
    name: "Starter Bundle",
    price: "$280",
    period: "5 lessons",
    save: "Save $45",
    desc: "Great for building momentum and establishing a consistent study habit.",
    features: [
      "5 × 60-minute lessons",
      "Full learning roadmap",
      "Customised flashcard decks",
      "Homework & exercises",
      "Progress report at end",
      "WhatsApp support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Intensive Bundle",
    price: "$480",
    period: "10 lessons",
    save: "Save $170",
    desc: "Best value for serious learners aiming for fluency or HSK preparation.",
    features: [
      "10 × 60-minute lessons",
      "Comprehensive study plan",
      "HSK mock test included",
      "Bonus vocabulary lists",
      "Bi-weekly progress reports",
      "Priority scheduling",
      "WhatsApp support",
    ],
    cta: "Best Value",
    highlighted: false,
  },
];

const dancePlans = [
  {
    name: "Trial Lesson",
    price: "$55",
    period: "per lesson",
    desc: "Try a single session and experience the joy of Chinese dance firsthand.",
    features: [
      "60-minute private lesson",
      "Level assessment",
      "Basic movement guidance",
      "Recommended style pairing",
    ],
    cta: "Book a Trial",
    highlighted: false,
  },
  {
    name: "Monthly Rhythm",
    price: "$220",
    period: "4 lessons / month",
    save: "Save $20",
    desc: "A consistent monthly schedule to develop technique and confidence.",
    features: [
      "4 × 60-minute lessons/month",
      "Choreography notes",
      "Video references provided",
      "Cultural context included",
      "Performance prep guidance",
    ],
    cta: "Start Monthly",
    highlighted: true,
  },
  {
    name: "Performance Pack",
    price: "$390",
    period: "8 lessons",
    save: "Save $50",
    desc: "Ideal for students preparing for recitals, competitions, or showcases.",
    features: [
      "8 × 75-minute lessons",
      "Full performance choreography",
      "Costume & styling guidance",
      "Video review of technique",
      "Mock performance session",
      "Priority scheduling",
    ],
    cta: "Prepare to Perform",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Are online lessons available?",
    a: "Yes! All language lessons are available online via Zoom or Google Meet. Dance lessons can also be conducted online with adequate space at home.",
  },
  {
    q: "How do I reschedule or cancel a lesson?",
    a: "Please provide at least 24 hours notice to reschedule at no charge. Cancellations within 24 hours may be subject to a 50% session fee.",
  },
  {
    q: "Do lesson bundles expire?",
    a: "Lesson bundles are valid for 6 months from the date of purchase, giving you plenty of flexibility.",
  },
  {
    q: "What ages do you teach?",
    a: "Language lessons are open to ages 6 and above. Dance lessons welcome students from age 4 onwards.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — book a free 20-minute introductory call to discuss your goals and find the right program before committing.",
  },
];

function PricingCard({ plan, accent }: {
  plan: typeof languagePlans[0];
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl flex flex-col overflow-hidden border transition-shadow hover:shadow-lg ${
        plan.highlighted ? "shadow-xl scale-[1.02]" : "shadow-sm"
      }`}
      style={{
        borderColor: plan.highlighted ? accent : "#F8ECE1",
        backgroundColor: "white",
      }}
    >
      {plan.highlighted && (
        <div
          className="py-2 text-center text-xs font-bold tracking-widest uppercase"
          style={{ backgroundColor: accent, color: "white" }}
        >
          Most Popular
        </div>
      )}

      <div
        className="p-6 border-b"
        style={{ borderColor: "#F8ECE1", backgroundColor: plan.highlighted ? "#FCFCFC" : "white" }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-playfair font-bold text-xl text-gray-900">{plan.name}</h3>
          {plan.save && (
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: "#CD8136", color: "white" }}
            >
              {plan.save}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="font-playfair text-4xl font-bold"
            style={{ color: accent }}
          >
            {plan.price}
          </span>
          <span className="text-gray-400 text-sm">/ {plan.period}</span>
        </div>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{plan.desc}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <ul className="space-y-2.5 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <span style={{ color: "#CD8136" }} className="mt-0.5 shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/booking"
          className="mt-6 block text-center py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={
            plan.highlighted
              ? { backgroundColor: accent, color: "white" }
              : { backgroundColor: "#B668BD", color: "white" }
          }
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );
}

export default function Pricing() {
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
          价
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#CD8136" }}>
            Transparent Rates
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Simple, honest pricing with no hidden fees. Save more with lesson
            bundles.
          </p>
        </div>
      </section>

      {/* ── Language Pricing ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-playfair text-3xl font-bold" style={{ color: "#B668BD" }}>中</span>
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mt-1">
              Chinese Language Lessons
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {languagePlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} accent="#CD8136" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Dance Pricing ── */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-playfair text-3xl font-bold" style={{ color: "#B668BD" }}>舞</span>
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mt-1">
              Chinese Dance Lessons
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {dancePlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} accent="#B668BD" />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#B668BD" }}>
              Questions
            </p>
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-xl p-6 border"
                style={{ borderColor: "#F8ECE1" }}
              >
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
      <section
        className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}
      >
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">
          Start with a Free Trial
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Not sure which plan is right for you? Book a free introductory call
          and we&apos;ll figure it out together.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#CD8136", color: "white" }}
        >
          Book My Free Trial →
        </Link>
      </section>
    </>
  );
}
