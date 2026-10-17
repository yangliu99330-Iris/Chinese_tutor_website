# Content pipeline

Tracks the guide pages planned in SKILL.md section 8 (inspired by baulchino.com,
excluding its Tools/Channels and About pages). Status values: **planned** →
**drafted** → **owner-reviewed** → **published**.

A page is "published" once: the owner has confirmed its facts, `noindex` is
removed from its `pageMetadata()` call, and it's added to `PUBLIC_PATHS` in
`lib/site.ts` (which puts it in the sitemap) with internal links pointing to it
from at least one relevant existing page.

| Page | Path | Status | Notes |
|---|---|---|---|
| HSK Levels Explained | `/guides/hsk-levels` | **published** | Owner confirmed the figures 2026-10-18. Indexed, in `PUBLIC_PATHS`, linked from `/guides`, the Navbar ("Guides"), and `/chinese-lessons`. |
| How HSK Exams Work | `/guides/hsk-exam-format` | planned | Format, timing, scoring, how to prepare, when to sit which level. |
| HSK Vocabulary Study Routine | `/guides/hsk-vocabulary-study` | planned | Spaced repetition explained; how lesson vocab maps to HSK lists. Links from the levels guide once that's published. |
| Chinese Character Stroke Order Guide | `/guides/chinese-stroke-order` | planned | Radicals, stroke order rules, how handwriting fits into lessons. |

## Next step
Owner reviews `/guides/hsk-levels` on the live site, confirms or corrects the
HSK figures, then tells Claude to publish it (flip noindex, add to
`PUBLIC_PATHS`, add internal links from `/chinese-lessons`). After that, draft
the next page in the list the same way.

## Digital Resources section (separate from /guides)

New "Digital Resources" nav menu, built from legitimately open sources only —
see the 2026-10-20 conversation for the copyright boundary this respects
(no rehosted official HSK textbooks, audio, or past papers; see below for what
was explicitly declined and why).

| Resource | Path | Status | Source |
|---|---|---|---|
| Stroke Order Tool | `/resources/hanzi-stroke-order` | **published** | Interactive, built on the MIT-licensed [Hanzi Writer](https://github.com/chanind/hanzi-writer) library (character data under the permissive Arphic Public License) |
| HSK Vocabulary (HSK 1) | `/resources/hsk-vocabulary` | **published** | Complete official 150-word HSK 1 list (public syllabus data) with independently-written short glosses. HSK 2 (300) and HSK 3 (600) not yet added. |
| HSK (nav item) | links to `/guides/hsk-levels` | published | Reuses the existing guide |
| New HSK 3.0 (nav item) | links to `/guides/hsk-levels#new-system` | published | Anchor into the same guide's new-syllabus section |

**Declined**: rehosting official HSK textbook PDFs, official listening audio, or
official/past exam papers as public downloads (what baulchino.com does) — the
owner proposed this and was told no, even after pushing back citing her own
local copies and non-commercial intent. The reasoning given: this is a
commercial website, "free" and "I own a copy" don't establish a right to
publicly redistribute someone else's copyrighted work, and the absence of a
copyright notice on the official site doesn't mean the opposite. The owner
can revisit this if she finds an explicit open-license statement on an
official page — Claude would look at the actual page before reconsidering.

Next: HSK 2/3 vocabulary, then the mock-test and Anki-deck categories (both
still need the owner's input per the "needed content support" list from
2026-10-20 — mock tests use original questions only, not official past papers).
