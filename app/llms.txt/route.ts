import { LESSON_TYPES, formatPrice, BULK_DISCOUNT_MIN_LESSONS, BULK_DISCOUNT_PERCENT } from "@/lib/pricing";
import {
  CONTACT_EMAIL,
  PROFILE_LINKS,
  REVIEW_SUMMARY,
  SITE_NAME,
  SITE_URL,
  TUTOR_CREDENTIALS,
  TUTOR_NAME,
  WHATSAPP_NUMBER,
} from "@/lib/site";

// Plain-text summary for AI assistants and answer engines, following the
// llms.txt convention (llmstxt.org): H1 title, then Markdown link lists —
// `- [label](url): description` — not bare URLs in prose, which some
// checkers (e.g. the PageSpeed Insights "Agentic Browsing" audit) parse for.
// Prices come from LESSON_TYPES, so this never disagrees with the booking page.
export function GET() {
  const lessons = LESSON_TYPES.map(
    (l) => `- ${l.label}: ${formatPrice(l.priceCents)} for ${l.durationMinutes} minutes. ${l.description}`
  ).join("\n");

  const credentials = TUTOR_CREDENTIALS.map((c) => `- ${c.label}`).join("\n");

  const body = `# ${SITE_NAME}

> One-to-one online Mandarin Chinese lessons and Chinese dance lessons with ${TUTOR_NAME}, for children, teenagers and adults. Lessons are taught live online; students book and pay on the website.

## Who teaches
- ${TUTOR_NAME} is a Mandarin Chinese teacher and dance teacher based in the UK, teaching students worldwide.
${credentials}
- Student reviews: ${REVIEW_SUMMARY.ratingValue} average across ${REVIEW_SUMMARY.reviewCount} reviews on [italki](${PROFILE_LINKS.italki}) and [Preply](${PROFILE_LINKS.preply}).
- Video introduction: [YouTube](${PROFILE_LINKS.youtube})

## Lessons and prices (GBP)
${lessons}

Book ${BULK_DISCOUNT_MIN_LESSONS} or more lessons of the same type in one order and save ${BULK_DISCOUNT_PERCENT}%.

## Booking and policies
- [Book a lesson](${SITE_URL}/booking) — a live calendar of open times, shown in the visitor's own timezone.
- Free reschedule with at least 24 hours' notice. Cancellations within 24 hours may be subject to a 50% session fee.
- Payment is taken securely by card at booking.

## Pages
- [Home](${SITE_URL}/)
- [Chinese language lessons](${SITE_URL}/chinese-lessons)
- [Chinese dance lessons](${SITE_URL}/chinese-dance-lessons)
- [Pricing and FAQ](${SITE_URL}/pricing)
- [About ${TUTOR_NAME}](${SITE_URL}/about)
- [Student reviews](${SITE_URL}/testimonials)
- [Contact](${SITE_URL}/contact)

## Contact
- [Email](mailto:${CONTACT_EMAIL})
- WhatsApp: ${WHATSAPP_NUMBER}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
