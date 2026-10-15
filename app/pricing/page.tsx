import Link from "next/link";
import {
  BULK_DISCOUNT_MIN_LESSONS,
  BULK_DISCOUNT_PERCENT,
  LESSON_TYPES,
  LessonType,
  formatPrice,
} from "@/lib/pricing";
import { faqJsonLd, lowestPriceLabel, pageMetadata, pricingJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Lesson Prices | Online Mandarin & Dance Lessons",
  description: `Clear per-lesson prices in GBP for online Mandarin and Chinese dance lessons with Miss Yang, from ${lowestPriceLabel()}. Save ${BULK_DISCOUNT_PERCENT}% when you book ${BULK_DISCOUNT_MIN_LESSONS} lessons in one order.`,
  path: "/pricing",
});

const languageLessons = LESSON_TYPES.filter((l) => l.id !== "dance" && l.id !== "trial");
const trialLessons = LESSON_TYPES.filter((l) => l.id === "trial");
const danceLessons = LESSON_TYPES.filter((l) => l.id === "dance");

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
    q: "Is there a discount for booking several lessons?",
    a: `Yes — book ${BULK_DISCOUNT_MIN_LESSONS} or more lessons of the same type in a single order and ${BULK_DISCOUNT_PERCENT}% comes off every lesson automatically at checkout. The easiest way is "Select & Make Recurring" on the booking page.`,
  },
  {
    q: "Do you offer group lessons?",
    a: "Yes — bring a language partner along. Group Lessons run 90 minutes for 2-5 people.",
  },
  {
    q: "What ages do you teach?",
    a: "Language lessons are open to ages 6 and above. Dance lessons welcome students from age 4 onwards. There's also a dedicated lesson format for young pupils.",
  },
  {
    q: "Is there a free trial?",
    a: "The Trial Lesson is a low-cost 30-minute introductory session for new students rather than a free call — it lets you experience a real lesson with Miss Yang before committing to regular sessions. Already a student and want a shorter lesson? The Express Lesson is the same 30 minutes at the regular rate. If you would like to chat first, message Miss Yang on WhatsApp, WeChat, or email — details on the Contact page.",
  },
];

function PricingCard({ lesson, accent, highlighted }: {
  lesson: LessonType;
  accent: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl flex flex-col overflow-hidden border transition-shadow hover:shadow-lg ${
        highlighted ? "shadow-xl scale-[1.02]" : "shadow-sm"
      }`}
      style={{
        borderColor: highlighted ? accent : "#F8ECE1",
        backgroundColor: "white",
      }}
    >
      {highlighted && (
        <div
          className="py-2 text-center text-xs font-bold tracking-widest uppercase"
          style={{ backgroundColor: accent, color: "white" }}
        >
          Most Popular
        </div>
      )}

      <div
        className="p-6 border-b"
        style={{ borderColor: "#F8ECE1", backgroundColor: highlighted ? "#FCFCFC" : "white" }}
      >
        <h3 className="font-playfair font-bold text-xl text-gray-900 mb-2">{lesson.label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="font-playfair text-4xl font-bold" style={{ color: accent }}>
            {formatPrice(lesson.priceCents)}
          </span>
          <span className="text-gray-400 text-sm">/ {lesson.durationMinutes} min lesson</span>
        </div>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{lesson.description}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1" />
        <Link
          href="/booking"
          className="mt-6 block text-center py-3 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: highlighted ? accent : "#B668BD", color: "white" }}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <JsonLd data={pricingJsonLd()} />
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
          价
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Transparent Rates
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Simple, honest per-lesson pricing with no hidden fees.
          </p>
          <p
            className="inline-block mt-6 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "white" }}
          >
            Book {BULK_DISCOUNT_MIN_LESSONS} lessons in one order and save {BULK_DISCOUNT_PERCENT}%
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {languageLessons.map((lesson) => (
              <PricingCard
                key={lesson.id}
                lesson={lesson}
                accent="#CD8136"
                highlighted={lesson.id === "private"}
              />
            ))}
          </div>

          {/* Trial sits on its own row, set apart from the regular lessons */}
          <div className="mt-16 pt-12 border-t" style={{ borderColor: "#F8ECE1" }}>
            <p
              className="text-center text-sm font-semibold uppercase tracking-widest mb-8"
              style={{ color: "#B668BD" }}
            >
              New to Miss Yang?
            </p>
            <div className="max-w-sm mx-auto">
              {trialLessons.map((lesson) => (
                <PricingCard key={lesson.id} lesson={lesson} accent="#CD8136" />
              ))}
            </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start max-w-sm mx-auto lg:max-w-none">
            {danceLessons.map((lesson) => (
              <PricingCard key={lesson.id} lesson={lesson} accent="#B668BD" />
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
          Ready to Get Started?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Not sure which lesson type is right for you? Book a Trial Lesson and
          we&apos;ll figure it out together.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-4 rounded font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#CD8136", color: "white" }}
        >
          Book a Lesson →
        </Link>
      </section>
    </>
  );
}
