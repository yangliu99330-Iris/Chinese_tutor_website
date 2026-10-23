// Single source of truth for site-wide identity used by metadata, structured
// data, robots/sitemap and llms.txt, so they can't drift apart.
export const SITE_URL = process.env.SITE_URL ?? "https://www.chinesetutoryang.com";
export const SITE_NAME = "Chinese Tutor Yang";
export const TUTOR_NAME = "Miss Yang";
export const CONTACT_EMAIL = "chinesetutoryang@gmail.com";
export const WHATSAPP_NUMBER = "+44 7422 541081";

export const PROFILE_LINKS = {
  italki: "https://www.italki.com/en/teacher/8870926",
  preply: "https://preply.com/en/tutor/1582754",
  youtube: "https://www.youtube.com/@ChineseTutorYang",
} as const;

/**
 * Qualifications as confirmed by Miss Yang. The About page, structured data
 * and llms.txt all read this list, so they can't contradict each other.
 * Add or remove credentials here only.
 */
export const TUTOR_CREDENTIALS: { label: string; kind: "degree" | "certification" | "experience" }[] = [
  { label: "Bachelor of Arts (Normal University in China, specialising in education)", kind: "degree" },
  { label: "Master's degree from a university in Japan (2021)", kind: "degree" },
  { label: "Putonghua Teaching Certification (2015)", kind: "certification" },
  { label: "Certified Chinese Classical Dance Instructor", kind: "certification" },
  { label: "12+ years of teaching experience", kind: "experience" },
];

// Source ratings, as stated on /testimonials (italki 5.0★ × 21, Preply 5.0★ × 12).
export const REVIEW_SUMMARY = { ratingValue: "5.0", reviewCount: 33 } as const;

/**
 * Published learning guides (content-pipeline.md tracks what's planned vs.
 * drafted vs. published). Both the /guides index page and the sitemap read
 * this list, so a guide only has to be added in one place.
 */
export const GUIDES = [
  {
    path: "/guides/hsk-levels",
    title: "HSK Levels Explained",
    description:
      "A plain-English guide to the HSK Chinese proficiency levels and how to pick the right starting level.",
  },
] as const;

/**
 * Published interactive/reference tools under the "Digital Resources" nav
 * menu — distinct from GUIDES (long-form prose) in being tool- or
 * data-driven. Both /resources and the sitemap read this list.
 */
export const RESOURCES = [
  {
    path: "/resources/pinyin-annotator",
    title: "Pinyin Annotator",
    description: "Paste Chinese text and get accurate, context-aware pinyin above every character.",
  },
  {
    path: "/resources/hanzi-stroke-order",
    title: "Stroke Order Tool",
    description: "Type any Chinese character and see its correct stroke order animated step by step.",
  },
  {
    path: "/resources/hsk-vocabulary",
    title: "HSK Vocabulary",
    description: "The complete HSK 1 word list — searchable, with pinyin and English meaning.",
  },
] as const;

const FIXED_PUBLIC_PATHS = [
  "/",
  "/chinese-lessons",
  "/chinese-dance-lessons",
  "/pricing",
  "/booking",
  "/about",
  "/testimonials",
  "/contact",
  "/guides",
  "/resources",
] as const;

/** Public pages that belong in the sitemap. */
export const PUBLIC_PATHS = [
  ...FIXED_PUBLIC_PATHS,
  ...GUIDES.map((g) => g.path),
  ...RESOURCES.map((r) => r.path),
];
