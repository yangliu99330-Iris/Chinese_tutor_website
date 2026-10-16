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

/** Public pages that belong in the sitemap. */
export const PUBLIC_PATHS = [
  "/",
  "/chinese-lessons",
  "/chinese-dance-lessons",
  "/pricing",
  "/booking",
  "/about",
  "/testimonials",
  "/contact",
] as const;
