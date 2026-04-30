# finance-site

A finance calculators + content site targeting #1 Google rankings for personal finance queries (India). Niche: investing, growing money, early retirement (FIRE).

## Status

Phase 0 (Foundation) — **substantially complete**. Bootstrapped on 2026-04-29. Production build is green; tests pass; CI workflows ready.

Phase 1 (12 calculators) starts next.

## Read first

- **[AGENTS.md](./AGENTS.md)** — non-negotiable rules. SEO requirements, perf budget, tech stack, code conventions.
- **[PLANNING.md](./PLANNING.md)** — phased roadmap. Live progress.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · shadcn/ui · Vitest + RTL · pnpm 10 · Node 22 (CI) / 24 LTS (local). No DB or APIs in Phase 1.

## Getting started

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # 14 tests passing
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` once a real domain exists.

## Project layout

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx            # Homepage (Hero + CalculatorGrid + FAQ)
│   ├── not-found.tsx       # Custom 404
│   ├── sitemap.ts          # Auto-generated from registry
│   ├── robots.ts
│   └── manifest.ts
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── hero.tsx
│   ├── calculator-grid.tsx
│   └── faq-section.tsx
└── lib/
    ├── site.ts             # Site config (name, URL, locale)
    ├── seo.ts              # generateMetadata helper
    ├── jsonld.ts           # Schema.org JSON-LD helpers
    └── calculators/
        └── registry.ts     # Single source of truth for all 12 calculators
```

## CI

- `.github/workflows/ci.yml` — lint · typecheck · test · build on PR + push to `main`
- `.github/workflows/lighthouse.yml` — Lighthouse audit; fails if SEO < 100, Perf < 95, A11y < 95, Best-Practices < 95

## Open questions (need decisions before Vercel deploy)

1. Domain name
2. Brand name / logo
3. Vercel hosting confirmed?
4. Analytics: Plausible vs Vercel Analytics vs none
5. Newsletter day 1 or Phase 2?
