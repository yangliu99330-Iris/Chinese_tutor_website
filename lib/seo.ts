import type { Metadata } from "next";
import { LESSON_TYPES, formatPrice } from "./pricing";
import {
  CONTACT_EMAIL,
  PROFILE_LINKS,
  REVIEW_SUMMARY,
  SITE_NAME,
  SITE_URL,
  TUTOR_CREDENTIALS,
  TUTOR_NAME,
  WHATSAPP_NUMBER,
} from "./site";

// A page that sets its own `openGraph` replaces the layout's wholesale, which
// drops the file-convention image from app/opengraph-image.tsx — so every page
// must name the image explicitly.
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Chinese Tutor Yang — online Mandarin and Chinese dance lessons",
};

/** Per-page metadata with a canonical URL and matching Open Graph / Twitter tags. */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  /** True for content still awaiting the owner's fact-check — reachable by direct URL but kept out of search results until approved. */
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${input.path === "/" ? "" : input.path}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_GB",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [SHARE_IMAGE.url],
    },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#tutor`;
const SITE_ID = `${SITE_URL}/#website`;

const sameAs = [PROFILE_LINKS.italki, PROFILE_LINKS.preply, PROFILE_LINKS.youtube];

/**
 * Site-wide entities. Credentials come from TUTOR_CREDENTIALS (lib/site.ts) —
 * never add a qualification here that isn't in that list.
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
        description:
          "Mandarin Chinese teacher and certified Chinese classical dance instructor with 12+ years of teaching experience, based in the UK and teaching online worldwide.",
        hasCredential: TUTOR_CREDENTIALS.filter((c) => c.kind !== "experience").map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.label,
          credentialCategory: c.kind,
        })),
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

/**
 * Article/guide content (e.g. the HSK and stroke-order guides). `faq`
 * is optional — include it when the page has a genuine Q&A section, and
 * it's rendered as its own FAQPage block alongside this one.
 */
export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  /** ISO date the page's facts were last checked against official sources. */
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    dateModified: input.dateModified,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
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
