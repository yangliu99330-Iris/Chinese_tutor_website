import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { GUIDES, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mandarin Learning Guides | Chinese Tutor Yang",
  description:
    "Free guides on learning Mandarin Chinese — HSK levels, exam prep, vocabulary study and more — from Miss Yang.",
  path: "/guides",
});

function guidesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mandarin Learning Guides",
    url: `${SITE_URL}/guides`,
    hasPart: GUIDES.map((g) => ({
      "@type": "Article",
      headline: g.title,
      description: g.description,
      url: `${SITE_URL}${g.path}`,
    })),
  };
}

export default function GuidesIndex() {
  return (
    <>
      <JsonLd data={guidesJsonLd()} />

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
          学
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Free Resources
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Learning Guides
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Plain-English guides to Mandarin Chinese, written by Miss Yang — no login, no catch.
          </p>
        </div>
      </section>

      {/* ── Guides list ── */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          {GUIDES.map((g) => (
            <Link
              key={g.path}
              href={g.path}
              className="block rounded-xl p-6 border hover:shadow-md transition-shadow"
              style={{ borderColor: "#F8ECE1" }}
            >
              <h2 className="font-playfair font-bold text-xl text-gray-900 mb-2">{g.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{g.description}</p>
              <span className="inline-block mt-4 text-sm font-semibold" style={{ color: "#B668BD" }}>
                Read the guide →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          These guides are free — a real lesson with Miss Yang is the fastest way to actually make progress.
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
