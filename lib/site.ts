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
