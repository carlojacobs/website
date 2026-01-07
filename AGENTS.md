---
created: 2026-01-07T15:42
updated: 2026-01-07T15:42
---
# agent.md

## Project Overview

This project is a **text-first personal website** inspired by academic writing, scientific journals, and minimal personal sites (e.g. Steph Ango–style clarity without imitation).

The site prioritizes:
- clarity over novelty
- reading over browsing
- structure over decoration
- longevity over trends

It should feel closer to a **journal issue or collected essays** than to a blog or portfolio.

---

## Core Principles

### 1. Text is the interface
- Content is primary; UI is secondary.
- No decorative UI components without editorial justification.
- Visual hierarchy should come from typography, spacing, and rules — not color blocks or cards.

### 2. Minimal, but not sterile
- Minimal does not mean blank or cold.
- Warm paper backgrounds, ink-like text, subtle rules.
- Design should feel *considered*, not “default Tailwind”.

### 3. Academic / journal-inspired
- Visual language should evoke:
  - medical or scientific journals
  - tables of contents
  - abstracts
  - citations
  - margin notes
- Use journal conventions where they make sense:
  - “Table of Contents”
  - “Featured Article”
  - “Abstract”
  - Volume / Issue / Date metaphors

### 4. Structure over cleverness
- Prefer explicit structure over magic.
- Avoid CSS hacks, negative margins, or fragile tricks.
- Layout decisions should be explainable in prose.

### 5. Responsiveness is non-negotiable
- Desktop may use multi-column layouts.
- Mobile must collapse cleanly into a single readable column.
- No horizontal scrolling. Ever.

---

## Technology Constraints

- Framework: **Next.js (App Router)**
- Content: **Fumadocs MDX collections**
- Writing source: **Obsidian**
- Hosting: Vercel or Netlify
- Styling: Tailwind + small, intentional global CSS
- No heavy UI frameworks
- No client-side interactivity unless strictly necessary

---

## Content Model

### Writing
- Lives in `src/content/writing/*.md(x)`
- Sorted reverse-chronologically
- Dates are authoritative; no algorithmic ordering

### Topics
- Derived from frontmatter `categories`
- Categories may be missing; schema must handle this gracefully
- Topics are navigational, not taxonomic overkill

---

## URL Structure

- `/` → front page (journal cover / issue view)
- `/writing` → full index (table of contents)
- `/writing/[slug]` → individual article
- `/topics/[topic]` → topic index

URLs should be:
- stable
- readable
- not UI-driven

---

## Layout Philosophy

### Front Page
- Functions like a **journal issue cover**
- Two-column layout on wide screens:
  - Left: Featured article, abstract, topics index
  - Right: Table of Contents
- Single column on small screens

### Writing Lists
- Dense but readable
- Dates aligned in a narrow column
- Titles aligned to a common baseline
- No redundant metadata (e.g. categories on topic pages)

### Article Pages (future)
- Centered reading column
- Margin space reserved for:
  - dates
  - categories
  - notes
- Margin notes should collapse below content on mobile

---

## Typography Rules

### Dates
Dates have **roles**, not just formats:

- Citation dates (full dates): italic
- Index dates (YYYY-MM): upright
- Metadata dates (issue info): quiet, upright

Always use `<time>` with role-based classes:
- `.time-citation`
- `.time-index`
- `.time-meta`

Never style `<time>` globally.

### Numbers
- Use `font-variant-numeric: tabular-nums` for dates and indexes.

---

## Styling Guidelines

- Background: warm paper tones (not pure white)
- Text: ink-like near-black
- Links:
  - inherit text color by default
  - change color on hover (institutional blue or muted academic tone)
- Use rules (`<hr>`, borders) instead of boxes or cards
- Avoid visual noise

---

## Things to Avoid

- Sidebars that compete with reading
- Infinite scroll
- Feed algorithms
- Decorative animations
- Trend-driven design patterns
- Overuse of color
- Per-page layout hacks

---

## Long-Term Direction

Planned / acceptable evolutions:
- Margin notes
- Abstract-style summaries
- Footnote-style references
- Print-friendly layouts
- Serif typography for prose
- Issue-based grouping (volumes)

Non-goals:
- Becoming a “blog platform”
- SEO tricks at the expense of clarity
- Social-media-style engagement features

---

## Decision Heuristic

When unsure, ask:

> “Would this feel at home in a quiet academic journal?”

If the answer is no, it probably doesn’t belong.
