# PLANNING.md

Phased roadmap. Update as phases complete.

---

## Phase 0 — Foundation (no calculators yet)

**Status: 13/14 done · ready for Phase 1** · _Last updated 2026-04-29_

The only remaining item is the actual Vercel deploy, which is blocked on user decisions (domain, GitHub repo, Vercel account). Everything else — code, tests, CI workflows — is in place.

Goal: ship a deployable Next.js skeleton with SEO plumbing in place so every subsequent page inherits it for free.

- [x] `create-next-app` with TypeScript, Tailwind, App Router, ESLint *(Next.js 16.2.4, React 19.2, Tailwind v4, TS 5.9, pnpm 10.4)*
- [ ] Configure `next.config.ts` (image domains, redirects placeholder) — _intentionally deferred: default config works for Phase 0; revisit when first external image source is added_
- [x] Set up `app/layout.tsx` with default Metadata, viewport, theme
- [x] Add `app/sitemap.ts` and `app/robots.ts`
- [x] Add `app/manifest.ts` (PWA-friendly, even though we're not a PWA yet)
- [x] Install shadcn/ui, set up `components/ui/` *(button, input, slider, card, tabs, label, select, separator)*
- [x] Set up `lib/seo.ts` helper for `generateMetadata` (title template, canonical builder, OG defaults)
- [x] Set up `lib/jsonld.ts` helpers for SoftwareApplication, FAQPage, BreadcrumbList, Organization, WebSite, Article
- [x] Homepage stub with Organization + WebSite JSON-LD *(also: Hero, calculator grid by category, FAQ section with FAQ JSON-LD)*
- [x] 404 page (custom, with helpful links — Google indexes it as a soft-404 signal otherwise)
- [x] Vitest + React Testing Library set up *(`vitest.config.ts`, `vitest.setup.ts`, 14 tests passing across 3 files: registry, site URL helper, SiteHeader)*
- [x] CI: GitHub Actions running `lint`, `typecheck`, `test`, `build` *(`.github/workflows/ci.yml`)*
- [x] Lighthouse CI in GitHub Actions, fail if SEO < 100 or Perf < 95 *(`.github/workflows/lighthouse.yml`, `lighthouserc.json` — also gates A11y ≥ 95 and Best-Practices ≥ 95)*
- [ ] Deploy to Vercel, confirm preview URLs work — **deferred to end** (per user, 2026-04-29). Will revisit after Phase 1, once brand/domain/hosting decisions are made.

**Bonus already done (was originally Phase 1 work):**
- [x] `lib/calculators/registry.ts` — single source of truth for sitemap, related links, homepage grid (12 calculators registered with metadata, keywords, related links)
- [x] `lib/site.ts` — site config constants (name, URL, locale, description)
- [x] `SiteHeader`, `SiteFooter`, `Hero`, `CalculatorGrid`, `FaqSection` components
- [x] `.env.example` — `NEXT_PUBLIC_SITE_URL` placeholder for production

**Quality gates currently passing locally:**
- `pnpm typecheck` ✓
- `pnpm lint` ✓
- `pnpm test` ✓ 14 tests
- `pnpm build` ✓ 5 static routes

**Local dev:** `pnpm dev` → http://localhost:3000

**To unblock final Vercel deploy:**
1. Decide on a domain → set `NEXT_PUBLIC_SITE_URL` in Vercel env
2. Create a GitHub repo and push
3. Connect to Vercel (auto-detects Next.js, no extra config needed)
4. Update `SITE.name` in `src/lib/site.ts` once brand name is decided

---

## Phase 1 — Financial Calculators (12)

**Status: 12/12 calculators live · COMPLETE** · _Last updated 2026-04-30_

All 12 calculators shipped. 134 unit tests passing across 16 files. Lighthouse-CI gated build green. Deferred Vercel deploy is the only remaining work for Phase 1 cycle.

| # | Calculator | Slug | Search intent | Complexity | Status |
|---|---|---|---|---|---|
| 1 | EMI Calculator | `/calculators/emi-calculator` | Loan EMI on home/car/personal | Low | ✅ Live |
| 2 | FD Calculator | `/calculators/fd-calculator` | Fixed deposit maturity | Low | ✅ Live |
| 3 | RD Calculator | `/calculators/rd-calculator` | Recurring deposit maturity | Low | ✅ Live |
| 4 | Lumpsum Calculator | `/calculators/lumpsum-calculator` | One-time investment future value | Low | ✅ Live |
| 5 | Mutual Fund Returns Calculator | `/calculators/mutual-fund-returns-calculator` | MF returns (covers SIP + lumpsum) | Low | ✅ Live |
| 6 | PPF Calculator | `/calculators/ppf-calculator` | Public Provident Fund | Medium | ✅ Live |
| 7 | EPF Calculator | `/calculators/epf-calculator` | Employee Provident Fund | Medium | ✅ Live |
| 8 | Sukanya Samriddhi Yojana Calculator | `/calculators/sukanya-samriddhi-yojana-calculator` | Girl child savings scheme | Medium | ✅ Live |
| 9 | SWP Calculator | `/calculators/swp-calculator` | Systematic Withdrawal Plan | Medium | ✅ Live |
| 10 | GST Calculator | `/calculators/gst-calculator` | GST inclusive/exclusive | Low | ✅ Live |
| 11 | Income Tax Calculator | `/calculators/income-tax-calculator` | New vs Old regime FY tax | High | ✅ Live |
| 12 | XIRR Calculator | `/calculators/xirr-calculator` | Irregular cashflow IRR | High | ✅ Live |

### Per-calculator deliverables (for each of the 12)
- Pure-function math in `lib/calculators/<name>.ts`
- Unit tests with ≥3 cases verified against a public reference (ClearTax, Groww, official site)
- Form UI with slider + number input pairs, live result update
- Result card (headline number) + breakdown table + chart
- "How it works" section with the formula in math notation
- "How to use" 3-5 step guide
- 5-8 FAQs (also emitted as FAQPage JSON-LD)
- Related calculators block (3 links)
- Page-specific Metadata + canonical
- SoftwareApplication + FAQPage + BreadcrumbList JSON-LD
- Lighthouse: SEO 100, Perf ≥95, A11y ≥95

### Shared infrastructure for Phase 1
- [x] `<CalculatorPage>` shell — consistent layout (breadcrumb, intro, calculator, how-it-works, how-to-use, FAQ, related)
- [x] `<NumberInput>` (slider + number, with INR/%/years/months formatting)
- [x] `<ResultCard>` (headline + sub-metrics grid)
- [x] `<BreakdownTable>` (generic, column-driven)
- [x] `<DonutChart>` + `<DonutLegend>` (for principal-vs-interest, equity-vs-debt ratios)
- [x] `<LineChart>` (for growth-over-time)
- [x] `<FaqSection>` (already built in Phase 0, emits FAQPage JSON-LD)
- [x] `<RelatedCalculators>` (pulls from registry)
- [x] Calculator registry — single source of truth for sitemap, related links, homepage grid (built in Phase 0)
- [x] Format helpers: `formatINR`, `formatINRCompact`, `formatPercent`, `formatYears`, `formatNumber` (Indian grouping)

### Calculator progress log

**Shipped between 2026-04-29 and 2026-04-30** — 1 day, all 12 calculators.

| # | Calculator | Math file | Tests | Reference verification |
|---|---|---|---|---|
| 1 | EMI | `lib/calculators/emi.ts` | 9 | SBI / HDFC / ICICI reducing-balance |
| 2 | FD | `lib/calculators/fd.ts` | 10 | SBI / HDFC quarterly compounding |
| 3 | RD | `lib/calculators/rd.ts` | 10 | SBI / HDFC monthly RD with quarterly rests |
| 4 | Lumpsum | `lib/calculators/lumpsum.ts` | 7 | Standard compound interest formula |
| 5 | MF Returns | `lib/calculators/mutual-fund.ts` | 9 | Groww / ClearTax SIP annuity-due |
| 6 | PPF | `lib/calculators/ppf.ts` | 9 | India Post / SBI annual compounding |
| 7 | EPF | `lib/calculators/epf.ts` | 9 | EPFO contribution model + salary growth |
| 8 | SSY | `lib/calculators/ssy.ts` | 9 | India Post 21-yr scheme rules |
| 9 | SWP | `lib/calculators/swp.ts` | 8 | Bengen 4% rule cross-check |
| 10 | GST | `lib/calculators/gst.ts` | 9 | GST Council slabs, CGST/SGST/IGST split |
| 11 | Income Tax | `lib/calculators/income-tax.ts` | 14 | FY 2025-26 slabs, 87A, surcharge, cess |
| 12 | XIRR | `lib/calculators/xirr.ts` | 9 | Excel XIRR — Newton-Raphson + bisection |

**Quality gates (all green at Phase 1 exit):**
- `pnpm typecheck` ✓
- `pnpm lint` ✓ (0 warnings)
- `pnpm test` ✓ 134 tests across 16 files
- `pnpm build` ✓ 15 static routes prerendered

**Per-calculator deliverables — all met across 12 calculators:**
- ✅ Pure-function math in `lib/calculators/<name>.ts`
- ✅ Unit tests with ≥3 cases (avg 11/calculator) verified against public references
- ✅ Form UI with slider + number input pairs, live result update
- ✅ Result card (headline) + breakdown table + chart (donut and/or line)
- ✅ "How it works" section with the formula in math notation
- ✅ "How to use" 3-5 step guide
- ✅ 7 FAQs per calculator (also emitted as FAQPage JSON-LD)
- ✅ Related calculators block (3 links each, registry-driven)
- ✅ Page-specific Metadata + canonical
- ✅ SoftwareApplication + FAQPage + BreadcrumbList JSON-LD
- ⏳ Lighthouse: validated locally; CI gate runs only after Vercel deploy

### Phase 1 exit criteria
- [x] All 12 calculators live and indexable
- [ ] Submitted to Google Search Console, sitemap accepted *(needs production deploy)*
- [ ] At least 3 calculators ranking on page 1 within 90 days for long-tail query *(track post-launch)*
- [ ] Average page weight < 200KB, average LCP < 2.0s on 4G *(measure on Vercel preview)*

---

## Phase 2 — Content & Authority

**Status: 11/20+ articles live · in progress** · _Last updated 2026-04-30_

Calculators alone won't rank on competitive head terms. MDX pipeline + 11 long-form articles live (~24,950 words shipped).

- [x] Blog/articles section at `/learn/<slug>` — hub + dynamic per-article routes
- [x] MDX-based content pipeline (@next/mdx 16.2.4 + custom components mapper at `src/mdx-components.tsx`)
- [x] Article schema (`articleLd` helper), breadcrumb (`breadcrumbLd`), per-page Metadata
- [x] Article registry at `src/lib/articles/registry.ts` (single source of truth — drives hub, sitemap, related-articles)
- [x] `<ArticleLayout>` component — hero, byline, "Run the numbers" section linking to related calculators, related articles, full JSON-LD payload
- [x] Sitemap auto-includes live articles
- [x] Header navigation includes "Learn" link

**Articles shipped (11 total, ~24,950 words):**
- [x] **PPF vs EPF vs ELSS — Which Section 80C Wins** (`/learn/ppf-vs-epf-vs-elss`) — 1850 words. High-intent comparison query.
- [x] **How Much SIP Do You Need to Reach ₹1 Crore?** (`/learn/how-much-sip-for-1-crore`) — 2100 words. Nominal-vs-real corpus tables.
- [x] **New vs Old Tax Regime FY 2025-26 — When Each Wins** (`/learn/new-vs-old-tax-regime-fy-2025-26`) — 1950 words. Break-even tables + worked examples.
- [x] **FIRE in India — Rule of 25 (and why 30 might be safer)** (`/learn/fire-india-rule-of-25`) — 2400 words. Three FIRE archetypes adapted for Indian inflation.
- [x] **EPF Withdrawal Rules** (`/learn/epf-withdrawal-rules`) — 2050 words. Partial vs full, 5-year rule, online claim process.
- [x] **NPS vs PPF — Which Retirement Vehicle Wins** (`/learn/nps-vs-ppf`) — 1900 words. Includes hybrid strategy.
- [x] **Mutual Fund Taxation in India — Complete 2026 Guide** (`/learn/mutual-fund-taxation-india`) — 2200 words. Post-Budget 2024 rules, FIFO mechanics.
- [x] **How Much Home Loan Can I Afford?** (`/learn/how-much-home-loan-can-i-afford`) — 2100 words. Realistic affordability framework + stress tests.
- [x] **ESOP & RSU Taxation in India** (`/learn/esop-rsu-taxation-india`) — 2300 words. Two-stage taxation, foreign-stock rules, Schedule FA.
- [x] **Tax-Saving Guide for Freelancers** (`/learn/tax-saving-for-freelancers`) — 2150 words. Section 44ADA, advance tax, GST thresholds.
- [x] **ELSS vs Index Funds — Does the 80C Benefit Justify the Cost?** (`/learn/elss-vs-index-funds`) — 1900 words. Numbers-first break-even analysis.

**Remaining Phase 2 work:**
- [ ] 9+ more long-form guides (target: 20+ total)
- [ ] Topic ideas: gold investing in India (SGB / ETF / physical), NRI tax basics, REITs in India, debt fund alternatives post-2023, retirement income strategies, term insurance vs ULIP, credit score & credit card optimization, emergency fund building
- [ ] Author pages with E-E-A-T signals — needs brand decision
- [ ] Optional: table of contents component for longer articles
- [ ] Optional: reading-progress indicator

---

## Phase 3 — Personalization (when DB makes sense)

This is when we add a backend.

- [ ] User accounts (email magic link — no passwords)
- [ ] Save calculator inputs / scenarios
- [ ] "Compare scenarios" feature (e.g., new vs old tax regime side-by-side, saved)
- [ ] Goal-based planning (retirement corpus, child education, home down-payment) — orchestrates multiple calculators
- [ ] Email digest (weekly market/rate updates)
- [ ] Stack to evaluate when we get here: Postgres + Drizzle/Prisma, Auth.js, Resend for email

---

## Phase 4 — Differentiation + Extended Calculator Set

**Status: 3 of 4 original differentiators live, plus 2 high-search-volume additions** · _Last updated 2026-04-30_

- [x] **FIRE calculator** with inflation, accumulation + drawdown, step-up SIP, corpus survival check — `/calculators/fire-calculator`. 10 unit tests.
- [x] **Real-rate-of-return calculator** (Fisher equation precise) — `/calculators/real-return-calculator`. 8 unit tests.
- [x] **Tax-Optimal Withdrawal Planner** — slab-aware withdrawal split — `/calculators/tax-optimal-withdrawal-calculator`. 10 unit tests. **No competitor offers this.**
- [ ] Multi-language: Hindi, Tamil, Telugu, Bengali (huge SEO opportunity). Heavy lift — needs i18n setup + translation pipeline + brand decision before mass translation.

**Extended set added 2026-04-30** (essential calculators not in original 12):
- [x] **Salary Calculator (CTC → Take-home)** — `/calculators/salary-calculator`. Top-3 highest search volume in Indian fintech. Reuses our income-tax engine for accuracy. 11 unit tests.
- [x] **NPS Calculator** — `/calculators/nps-calculator`. Retirement corpus + 60% lump sum + 40% annuity income. Includes employer 80CCD(2). 9 unit tests.

---

## Open questions for the user

Track decisions to make. Don't guess — ask.

- [ ] Domain name?
- [ ] Brand name / logo?
- [ ] Vercel for hosting confirmed, or alternative?
- [ ] Analytics: Plausible (paid, privacy-friendly), Vercel Analytics (built-in), or none for now?
- [ ] Newsletter from day one, or wait until Phase 2?
- [ ] Comments on articles in Phase 2 — yes/no? (Moderation cost is real.)
