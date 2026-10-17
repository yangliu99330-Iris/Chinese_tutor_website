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
| HSK Levels Explained | `/guides/hsk-levels` | **drafted** | Live at this URL but `noindex: true`. Owner to verify: classic HSK 1-6 word counts, and the current rollout/coexistence status of the newer three-band (3.0) system — both are presented cautiously/hedged in the draft pending that check. |
| How HSK Exams Work | `/guides/hsk-exam-format` | planned | Format, timing, scoring, how to prepare, when to sit which level. |
| HSK Vocabulary Study Routine | `/guides/hsk-vocabulary-study` | planned | Spaced repetition explained; how lesson vocab maps to HSK lists. Links from the levels guide once that's published. |
| Chinese Character Stroke Order Guide | `/guides/chinese-stroke-order` | planned | Radicals, stroke order rules, how handwriting fits into lessons. |

## Next step
Owner reviews `/guides/hsk-levels` on the live site, confirms or corrects the
HSK figures, then tells Claude to publish it (flip noindex, add to
`PUBLIC_PATHS`, add internal links from `/chinese-lessons`). After that, draft
the next page in the list the same way.
