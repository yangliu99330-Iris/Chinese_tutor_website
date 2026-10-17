import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { RESOURCES, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Digital Resources for Learning Mandarin | Chinese Tutor Yang",
  description:
    "Free interactive tools and reference material for learning Mandarin Chinese — stroke order, HSK vocabulary, and more.",
  path: "/resources",
});

function resourcesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Digital Resources",
    url: `${SITE_URL}/resources`,
    hasPart: RESOURCES.map((r) => ({
      "@type": "WebApplication",
      name: r.title,
      description: r.description,
      url: `${SITE_URL}${r.path}`,
      applicationCategory: "EducationalApplication",
      isAccessibleForFree: true,
    })),
  };
}

export default function ResourcesIndex() {
  return (
    <>
      <JsonLd data={resourcesJsonLd()} />

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
          资
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Free Tools
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Digital Resources
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Free interactive tools to support your Mandarin study — from Miss Yang.
          </p>
        </div>
      </section>

      {/* ── Resources list ── */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          {RESOURCES.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              className="block rounded-xl p-6 border hover:shadow-md transition-shadow"
              style={{ borderColor: "#F8ECE1" }}
            >
              <h2 className="font-playfair font-bold text-xl text-gray-900 mb-2">{r.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{r.description}</p>
              <span className="inline-block mt-4 text-sm font-semibold" style={{ color: "#B668BD" }}>
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Want More Guidance?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          These tools are free for everyone — a real lesson with Miss Yang is how you actually make progress.
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
            href="/guides"
            className="px-6 py-3 rounded font-bold text-sm border-2 border-white text-white transition-colors hover:bg-white/10"
          >
            Learning Guides
          </Link>
        </div>
      </section>
    </>
  );
}
