---
name: seo-geo-audit
description: Audit and maintain SEO and GEO (AI-assistant visibility) for chinesetutoryang.com. Runs a scripted health check of sitemap, robots, per-page metadata, structured data and llms.txt, cross-checks facts (prices, ratings, credentials) for contradictions, and fixes problems. Use when pages, lesson types, prices, reviews or credentials change, after a deploy, or for the monthly check-up.
---

# SEO / GEO audit for chinesetutoryang.com

Strategy reference: the pinned Artifact "SEO/GEO 优化战略方案". This skill covers the
parts that live in the codebase. It cannot do account-bound work (see the end).

## 1. Run the scripted check

```bash
# live site
node .claude/skills/seo-geo-audit/audit.mjs
# or a local dev server (start it with preview_start first)
node .claude/skills/seo-geo-audit/audit.mjs http://localhost:3000
```

It reads `/sitemap.xml`, then for every listed page checks: HTTP 200, title and
description present and sensibly sized, unique across pages, canonical pointing at the
page itself, Open Graph tags incl. image, exactly one `<h1>`, `<img>` alt text, valid
JSON-LD, not accidentally `noindex`. It also checks `/robots.txt`, `/llms.txt`, that
prices in structured data match `/llms.txt`, and that the review count in structured
data is visible on the page.

FAIL = fix. WARN = look and decide; some are acceptable.

## 2. Where facts live (edit here, nowhere else)

| What | File |
|---|---|
| Site name, contact, profile links, review summary, **credentials**, public page list | `lib/site.ts` |
| Page metadata helper, all JSON-LD builders | `lib/seo.ts` |
| Lesson types and prices (feeds booking, pricing page, JSON-LD, llms.txt) | `lib/pricing.ts` |
| sitemap / robots / llms.txt / social image | `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `app/opengraph-image.tsx` |

Credentials and the review rating are rendered from `lib/site.ts` on the About page,
in structured data and in llms.txt — change them once, in `lib/site.ts`.

## 3. Content consistency sweep (the script can't judge wording)

Grep the copy for claims that must agree with the sources above and report any mismatch:
- years of experience / number of students (`12+`, `200+`) — About page, home page stats
- review counts and rating (`33`, `5.0`) — home, testimonials, `REVIEW_SUMMARY`
- hard-coded prices (`£`) in page copy vs `lib/pricing.ts`
- qualifications mentioned anywhere vs `TUTOR_CREDENTIALS`
- lesson names in copy vs `LESSON_TYPES` labels

## 4. When something changed

- **New public page**: add it to `PUBLIC_PATHS` in `lib/site.ts`, give it
  `export const metadata = pageMetadata({ title, description, path })` (client components
  need a sibling `layout.tsx` for this, like `app/contact/layout.tsx`), one `<h1>`, and
  JSON-LD from `lib/seo.ts` if a fitting type exists.
- **New / changed lesson type or price**: edit `lib/pricing.ts` only; JSON-LD and llms.txt
  follow. Re-run the audit.
- **New private/transactional route**: add it to `disallow` in `app/robots.ts`.

## 5. Rules — do not break these

- **Never invent** credentials, ratings, review counts, student numbers or dates. If a
  source disagrees with another, stop and ask the owner which is right.
- Individual student reviews on the site are paraphrased, so they are **not** marked up as
  `Review` items. Only the aggregate (from `REVIEW_SUMMARY`) is.
- Titles ~30–60 chars, descriptions ~110–160, one `<h1>` per page, canonical on the `www` host.
- Don't add keyword stuffing; write for the student first.

## 6. After changing code

1. `npx tsc --noEmit`, then `rm -rf .next && npm run build`.
2. Start the dev server, run the audit against it, fix FAILs.
3. Commit **only the SEO-related files by explicit path** (the working tree may hold
   unrelated work), push, wait for the deploy, then run the audit against the live site.

## 7. Report to the owner

Plain Chinese, short: what failed, what you fixed, what still needs her. Always end with
the human-only checklist below, marking what's still open.

## Human-only tasks (cannot be automated here)

1. Google Search Console: verify the domain, submit `https://www.chinesetutoryang.com/sitemap.xml`, check the Pages report monthly.
2. Google Business Profile (service-area business, no street address).
3. Backlinks: put the website link on the italki, Preply and YouTube profiles; seek mentions from language-learning sites.
4. Content: owner supplies the expertise; Claude can draft pages (tone guides, HSK levels, FAQs) for her review.
5. PageSpeed Insights (home + /booking) — send results back to optimise LCP/CLS.
