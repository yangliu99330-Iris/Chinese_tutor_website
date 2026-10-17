import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import StrokeOrderTool from "@/components/resources/StrokeOrderTool";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Chinese Character Stroke Order Tool (Free, Interactive)",
  description:
    "Type any Chinese character and see its correct stroke order animated step by step, then quiz yourself. Free interactive tool from Chinese Tutor Yang.",
  path: "/resources/hanzi-stroke-order",
});

export default function StrokeOrderPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Chinese Character Stroke Order Tool",
          description: "An interactive tool for learning correct Chinese character stroke order.",
          path: "/resources/hanzi-stroke-order",
          dateModified: "2026-10-20",
        })}
      />

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
          写
        </span>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#F8ECE1" }}>
            Digital Resource
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Stroke Order Tool
          </h1>
          <p className="text-white/75 max-w-xl mx-auto text-lg">
            Type a character to see exactly how it&apos;s written — stroke by stroke, in the right order.
          </p>
        </div>
      </section>

      {/* ── Tool ── */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto">
          <StrokeOrderTool />
        </div>
      </section>

      {/* ── Why stroke order matters ── */}
      <section className="section-padding" style={{ backgroundColor: "#FCFCFC" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-4">Why Stroke Order Matters</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Chinese characters follow consistent stroke order rules — top to bottom, left to right, horizontal
            before vertical, outside before inside. Writing characters the correct way isn&apos;t just tradition: it
            makes handwriting faster, more legible, and easier to remember, and it&apos;s what Chinese speakers
            instinctively expect to see.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Use this tool to check any character before you practise writing it, or to quiz yourself once
            you&apos;ve learned it.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)" }}>
        <h2 className="font-playfair text-3xl font-bold text-white mb-4">Want Proper Feedback on Your Writing?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          A tool can show you stroke order — a real lesson is how you actually fix your handwriting.
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
            href="/resources"
            className="px-6 py-3 rounded font-bold text-sm border-2 border-white text-white transition-colors hover:bg-white/10"
          >
            More Resources
          </Link>
        </div>
      </section>
    </>
  );
}
