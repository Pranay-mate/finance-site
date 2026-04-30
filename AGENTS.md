# AGENTS.md

Guidelines for any AI agent (Claude, Copilot, Cursor, etc.) working on this project. **Read this fully before making changes.**

---

## 1. Project Mission

Build a finance-focused web property that **ranks #1 on Google** for high-intent queries around personal finance, investing, growing money, and early retirement (FIRE). Every decision — content, code, UX, performance — must serve that goal.

Target audience (initial): Indian retail investors and FIRE-seekers. Calculators are India-specific (PPF, EPF, SSY, GST, etc.), so default currency is INR and tax rules follow Indian regulations.

---

## 2. Non-Negotiables

These are hard constraints. Do not violate them without explicit user approval.

### 2.1 SEO is mandatory, not optional
Every page MUST ship with:
- **Unique `<title>` and `<meta description>`** via Next.js Metadata API (`generateMetadata` or static `metadata` export)
- **Canonical URL** (`alternates.canonical`)
- **Open Graph + Twitter card** metadata
- **JSON-LD structured data**:
  - Calculator pages → `SoftwareApplication` or `WebApplication` + `FAQPage` if FAQs present
  - Article/blog pages → `Article` + `BreadcrumbList`
  - Homepage → `Organization` + `WebSite` (with `SearchAction`)
- **Semantic HTML**: one `<h1>` per page, logical heading hierarchy, real `<button>` / `<a>` (no clickable divs)
- **Internal linking**: every calculator page links to ≥3 related calculators and ≥1 explainer article
- **Image alt text** on every `<img>` / `next/image`
- **Static pre-rendering** (SSG / ISR) for all public pages — no client-only rendering of indexable content
- **Sitemap.xml + robots.txt** auto-generated (Next.js `app/sitemap.ts` and `app/robots.ts`)

Lighthouse SEO score must stay **100**. Performance, Accessibility, Best Practices must stay **≥95**.

### 2.2 Core Web Vitals budget
- LCP: < 2.0s (target), < 2.5s (max)
- INP: < 200ms
- CLS: < 0.1
- JS shipped per route: < 150KB gzipped (initial load)

If a change pushes any metric over budget, fix it before merging.

### 2.3 UI/UX must be top-notch
- Mobile-first. Test every screen at 375px width before claiming done.
- Accessibility: WCAG 2.2 AA. Keyboard-navigable. Visible focus states. `prefers-reduced-motion` honored. Color contrast ≥ 4.5:1.
- Inputs: numeric inputs use sliders + number fields together (industry pattern for calculators — see ClearTax, Groww). Update results live as user types/drags.
- Results: show the headline number large and immediate, breakdown table below, chart (donut/line) for visualization.
- No layout shift while typing. No janky animations. No modal dialogs unless absolutely required.

### 2.4 Tech stack (locked unless user changes it)
- **Next.js** (latest stable, App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (v4 if stable, else v3)
- **shadcn/ui** for primitive components (button, input, slider, card, tabs)
- **Recharts** or **Visx** for charts (Recharts default — simpler, smaller)
- **Zod** for input validation
- **No database, no API routes** in Phase 1 — calculators are pure client/server functions
- Deploy target: Vercel (assume; confirm with user before adding vercel-specific code)

---

## 3. Code Conventions

- Calculator math lives in `lib/calculators/<name>.ts` as **pure functions**. No React, no DOM.
- Each calculator gets a co-located test file `lib/calculators/<name>.test.ts`. Math correctness is the most important test surface — verify against published examples (e.g., SBI's PPF calculator, official Income Tax department tables).
- UI components in `components/`. Calculator-specific UI in `app/calculators/<slug>/_components/`.
- Route per calculator: `app/calculators/<slug>/page.tsx`. Slug must match the SEO-targeted keyword (e.g., `ppf-calculator`, not `ppf`).
- Server Components by default. Add `"use client"` only when you need state/effects (i.e., the interactive form).
- No barrel files (`index.ts` re-exports) — they bloat bundles.

---

## 4. Content rules

- Every calculator page has, in this order: H1, 1-paragraph intro, the calculator, results, "How it works" section with the formula, "How to use" steps, FAQ (5-8 Qs), related calculators.
- Word count target per calculator page: **800-1500 words** of supporting content. Thin pages don't rank.
- FAQ answers go in JSON-LD `FAQPage` schema verbatim.
- Cite official sources (RBI, India Post, EPFO, Income Tax Department) where applicable, with `rel="noopener"` external links.

---

## 5. What NOT to do

- **Do not** add a database, auth, or API routes in Phase 1. If a feature seems to need it, flag to user — it's probably Phase 2.
- **Do not** add tracking/analytics without asking (privacy + perf cost). When added, prefer Plausible or Vercel Analytics over GA4.
- **Do not** add heavy dependencies (moment.js, lodash full, jQuery, etc.). Use date-fns if needed; native methods first.
- **Do not** ship images without `next/image`, explicit `width`/`height`, and modern format (AVIF/WebP).
- **Do not** create marketing fluff pages without a target keyword. Every indexable page must answer a real search query.
- **Do not** use `useEffect` for derived state. Compute it during render.
- **Do not** generate emojis in code or content unless the user asks.

---

## 6. Working agreement

- Update `PLANNING.md` when scope changes or a phase completes.
- When adding a calculator, copy the pattern of the first one built — don't reinvent layout per calculator.
- Before claiming a calculator is done, verify the math against at least one external reference calculator with 3+ test cases.
- Run `npm run build` and `npm run lint` before reporting work complete. Build failures = not done.
