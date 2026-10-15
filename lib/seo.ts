import type { Metadata } from "next";
import { LESSON_TYPES, formatPrice } from "./pricing";
import {
  CONTACT_EMAIL,
  PROFILE_LINKS,
  REVIEW_SUMMARY,
  SITE_NAME,
  SITE_URL,
  TUTOR_NAME,
  WHATSAPP_NUMBER,
} from "./site";

/** Per-page metadata with a canonical URL and matching Open Graph / Twitter tags. */
export function pageMetadata(input: { title: string; description: string; path: string }): Metadata {
  const url = `${SITE_URL}${input.path === "/" ? "" : input.path}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#tutor`;
const SITE_ID = `${SITE_URL}/#website`;

const sameAs = [PROFILE_LINKS.italki, PROFILE_LINKS.preply, PROFILE_LINKS.youtube];

/**
 * Site-wide entities. Deliberately limited to facts stated consistently on the
 * site — no credentials/years of experience here until those are confirmed.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "One-to-one online Mandarin Chinese and Chinese dance lessons with Miss Yang, for children, teenagers and adults.",
        image: `${SITE_URL}/tutor-yang.jpg`,
        founder: { "@id": PERSON_ID },
        areaServed: "Worldwide",
        knowsLanguage: ["en", "zh"],
        sameAs,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: CONTACT_EMAIL,
          telephone: WHATSAPP_NUMBER,
          availableLanguage: ["English", "Chinese"],
        },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: TUTOR_NAME,
        jobTitle: "Mandarin Chinese tutor and Chinese dance teacher",
        url: `${SITE_URL}/about`,
        image: `${SITE_URL}/tutor-yang.jpg`,
        worksFor: { "@id": ORG_ID },
        knowsLanguage: ["en", "zh"],
        address: { "@type": "PostalAddress", addressCountry: "GB" },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
    ],
  };
}

/** One Service+Offer per lesson type, priced from the same source the checkout uses. */
export function pricingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lesson types and prices",
    itemListElement: LESSON_TYPES.map((lesson, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: lesson.label,
        description: lesson.description,
        serviceType: lesson.id === "dance" ? "Chinese dance lesson" : "Mandarin Chinese lesson",
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
        offers: {
          "@type": "Offer",
          price: (lesson.priceCents / 100).toFixed(2),
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/booking`,
        },
      },
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function courseJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    courseMode: "online",
    provider: { "@id": ORG_ID },
    instructor: { "@id": PERSON_ID },
  };
}

/** Rating summary only — individual reviews on the site are paraphrased, so they're not marked up as Review items. */
export function reviewSummaryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: SITE_NAME,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_SUMMARY.ratingValue,
      bestRating: "5",
      worstRating: "1",
      reviewCount: REVIEW_SUMMARY.reviewCount,
    },
  };
}

export function aboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": PERSON_ID },
  };
}

export function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/contact`,
    mainEntity: { "@id": ORG_ID },
  };
}

/** Cheapest lesson, for "from £X" in descriptions. */
export function lowestPriceLabel(): string {
  return formatPrice(Math.min(...LESSON_TYPES.map((l) => l.priceCents)));
}
