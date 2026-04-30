export type ArticleCategory = "investing" | "tax" | "retirement" | "savings" | "loans";

export type Article = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: ArticleCategory;
  /** Estimated reading time in minutes. */
  readingTime: number;
  /** Word count, used for the byline. */
  wordCount: number;
  publishedDate: string;
  updatedDate?: string;
  /** Calculator slugs that this article should link to (also drives "see also" block). */
  relatedCalculators: string[];
  /** Other article slugs to cross-link to. */
  relatedArticles?: string[];
  status: "planned" | "live";
};

export const ARTICLES: Article[] = [
  {
    slug: "ppf-vs-epf-vs-elss",
    title: "PPF vs EPF vs ELSS — Which Section 80C Investment Wins?",
    description:
      "A clear, numbers-first comparison of India's three most popular tax-saving instruments under Section 80C, with returns, risk, lock-in, and a decision framework.",
    metaTitle: "PPF vs EPF vs ELSS — Which 80C Investment Wins (2026)",
    metaDescription:
      "Detailed comparison of PPF, EPF and ELSS — returns, lock-in, tax treatment, liquidity. Includes a decision framework and worked examples in INR.",
    keywords: [
      "ppf vs epf",
      "ppf vs elss",
      "epf vs elss",
      "section 80c comparison",
      "best 80c investment",
    ],
    category: "investing",
    readingTime: 9,
    wordCount: 1850,
    publishedDate: "2026-04-30",
    relatedCalculators: ["ppf-calculator", "epf-calculator", "mutual-fund-returns-calculator"],
    relatedArticles: ["new-vs-old-tax-regime-fy-2025-26", "how-much-sip-for-1-crore"],
    status: "live",
  },
  {
    slug: "how-much-sip-for-1-crore",
    title: "How Much SIP Do You Need to Reach ₹1 Crore?",
    description:
      "The exact monthly SIP amount required to hit ₹1 crore at different return rates and time horizons. Includes an inflation-adjusted &apos;real&apos; ₹1 Cr table.",
    metaTitle: "How Much SIP To Reach ₹1 Crore? (Tables for 10-30 yrs)",
    metaDescription:
      "Find the monthly SIP needed to build a ₹1 crore corpus. Tables for 10, 15, 20, 25, 30-year horizons at 10%, 12%, 15% expected returns. Inflation-adjusted real corpus too.",
    keywords: [
      "sip for 1 crore",
      "monthly sip 1 crore",
      "1 crore retirement corpus",
      "sip calculator india",
      "wealth building india",
    ],
    category: "investing",
    readingTime: 11,
    wordCount: 2100,
    publishedDate: "2026-04-30",
    relatedCalculators: [
      "mutual-fund-returns-calculator",
      "lumpsum-calculator",
      "swp-calculator",
    ],
    relatedArticles: ["ppf-vs-epf-vs-elss", "fire-india-rule-of-25"],
    status: "live",
  },
  {
    slug: "new-vs-old-tax-regime-fy-2025-26",
    title: "New vs Old Tax Regime FY 2025-26 — When Each Wins",
    description:
      "Side-by-side income-tax comparison for FY 2025-26 (AY 2026-27) with break-even tables, common scenarios, and a clear decision rule.",
    metaTitle: "New vs Old Tax Regime FY 2025-26 — Which to Choose",
    metaDescription:
      "Compare the New and Old tax regimes for FY 2025-26 with worked examples, break-even deduction tables, and a decision framework. Updated for the latest slabs.",
    keywords: [
      "new vs old tax regime",
      "tax regime comparison 2025",
      "income tax regime fy 2025-26",
      "which tax regime is better",
    ],
    category: "tax",
    readingTime: 10,
    wordCount: 1950,
    publishedDate: "2026-04-30",
    relatedCalculators: ["income-tax-calculator", "epf-calculator", "ppf-calculator"],
    relatedArticles: ["ppf-vs-epf-vs-elss"],
    status: "live",
  },
  {
    slug: "fire-india-rule-of-25",
    title: "FIRE in India — The Rule of 25 (and why 30 might be safer)",
    description:
      "Adapting the FIRE movement&apos;s Rule of 25 for Indian inflation and tax realities. Includes a corpus calculator framework and three FIRE archetypes.",
    metaTitle: "FIRE in India — Rule of 25 Adapted for Indian Inflation",
    metaDescription:
      "How much corpus do you need for FIRE in India? The Rule of 25 (and why Rule of 30 might be safer here), Bengen 4% rule for Indian inflation, and three retirement archetypes.",
    keywords: [
      "fire india",
      "early retirement india",
      "rule of 25",
      "fire calculator",
      "financial independence india",
    ],
    category: "retirement",
    readingTime: 13,
    wordCount: 2400,
    publishedDate: "2026-04-30",
    relatedCalculators: ["swp-calculator", "lumpsum-calculator", "mutual-fund-returns-calculator"],
    relatedArticles: ["how-much-sip-for-1-crore", "mutual-fund-taxation-india"],
    status: "live",
  },
  {
    slug: "epf-withdrawal-rules",
    title: "EPF Withdrawal Rules — Partial, Full & Tax Implications",
    description:
      "When can you withdraw EPF, how much, and what gets taxed. Covers partial withdrawals, retirement, job change, unemployment, and the 5-year continuous service rule.",
    metaTitle: "EPF Withdrawal Rules 2026 — Partial, Full, Tax",
    metaDescription:
      "Complete guide to EPF withdrawal rules: partial withdrawal limits, full withdrawal eligibility, taxation before/after 5 years, online claim process, and common mistakes to avoid.",
    keywords: [
      "epf withdrawal rules",
      "epf partial withdrawal",
      "pf withdrawal tax",
      "epf claim",
      "epfo withdrawal",
    ],
    category: "savings",
    readingTime: 11,
    wordCount: 2050,
    publishedDate: "2026-04-30",
    relatedCalculators: ["epf-calculator", "income-tax-calculator", "ppf-calculator"],
    relatedArticles: ["ppf-vs-epf-vs-elss", "nps-vs-ppf"],
    status: "live",
  },
  {
    slug: "nps-vs-ppf",
    title: "NPS vs PPF — Which Retirement Vehicle Wins?",
    description:
      "NPS vs PPF compared on returns, tax treatment, lock-in, withdrawal flexibility, and retirement income. With a hybrid strategy that uses both.",
    metaTitle: "NPS vs PPF 2026 — Which Retirement Plan Wins",
    metaDescription:
      "Detailed NPS vs PPF comparison: returns, tax savings, lock-in, withdrawal rules, annuity requirement. Includes a hybrid strategy that uses both for maximum benefit.",
    keywords: [
      "nps vs ppf",
      "nps or ppf",
      "national pension scheme vs ppf",
      "best retirement scheme india",
    ],
    category: "retirement",
    readingTime: 10,
    wordCount: 1900,
    publishedDate: "2026-04-30",
    relatedCalculators: ["ppf-calculator", "epf-calculator", "income-tax-calculator"],
    relatedArticles: ["ppf-vs-epf-vs-elss", "fire-india-rule-of-25"],
    status: "live",
  },
  {
    slug: "mutual-fund-taxation-india",
    title: "Mutual Fund Taxation in India — Complete 2026 Guide",
    description:
      "How equity, debt, hybrid and international mutual funds are taxed in India after Budget 2024. STCG, LTCG, indexation rules, SIP-specific taxation, and FIFO mechanics.",
    metaTitle: "Mutual Fund Taxation India 2026 — Complete Guide",
    metaDescription:
      "Complete tax guide for mutual fund investors in India. Equity vs debt vs hybrid taxation, LTCG/STCG rates post-Budget 2024, SIP tax mechanics, FIFO method explained.",
    keywords: [
      "mutual fund tax india",
      "ltcg mutual fund",
      "mutual fund stcg",
      "sip tax",
      "debt fund tax",
    ],
    category: "tax",
    readingTime: 12,
    wordCount: 2200,
    publishedDate: "2026-04-30",
    relatedCalculators: ["mutual-fund-returns-calculator", "xirr-calculator", "income-tax-calculator"],
    relatedArticles: ["new-vs-old-tax-regime-fy-2025-26", "how-much-sip-for-1-crore"],
    status: "live",
  },
  {
    slug: "how-much-home-loan-can-i-afford",
    title: "How Much Home Loan Can I Afford?",
    description:
      "A realistic affordability framework for Indian home loans. Goes beyond the bank's 50%-of-income rule to include hidden costs and stress tests.",
    metaTitle: "How Much Home Loan Can I Afford? (Realistic Framework)",
    metaDescription:
      "Calculate the right home loan size for your salary. EMI-to-income ratio, hidden costs, registration, stamp duty, maintenance — plus stress tests for rate hikes.",
    keywords: [
      "home loan affordability",
      "how much home loan",
      "home loan eligibility",
      "emi to income ratio",
      "home loan calculator",
    ],
    category: "loans",
    readingTime: 11,
    wordCount: 2100,
    publishedDate: "2026-04-30",
    relatedCalculators: ["emi-calculator", "income-tax-calculator", "lumpsum-calculator"],
    relatedArticles: ["new-vs-old-tax-regime-fy-2025-26"],
    status: "live",
  },
  {
    slug: "esop-rsu-taxation-india",
    title: "ESOP & RSU Taxation in India — A Tech Employee's Guide",
    description:
      "How ESOPs and RSUs are taxed at exercise and at sale, including foreign-company stocks. Covers listed vs unlisted, FMV vs strike price, and the dual-tax trap.",
    metaTitle: "ESOP & RSU Taxation India 2026 — Complete Guide",
    metaDescription:
      "Detailed ESOP/RSU tax guide for Indian tech employees. Exercise tax (perquisite), sale tax (capital gains), foreign-stock-specific rules, double-taxation avoidance.",
    keywords: [
      "esop tax india",
      "rsu tax india",
      "esop perquisite",
      "rsu capital gains",
      "foreign stock tax india",
    ],
    category: "tax",
    readingTime: 13,
    wordCount: 2300,
    publishedDate: "2026-04-30",
    relatedCalculators: ["income-tax-calculator", "xirr-calculator", "lumpsum-calculator"],
    relatedArticles: ["mutual-fund-taxation-india", "new-vs-old-tax-regime-fy-2025-26"],
    status: "live",
  },
  {
    slug: "tax-saving-for-freelancers",
    title: "Tax-Saving Guide for Freelancers & Self-Employed (India)",
    description:
      "Section 44ADA presumptive taxation, expense deductions, advance tax, and GST thresholds — everything an Indian freelancer needs to optimise tax legally.",
    metaTitle: "Tax-Saving for Freelancers India — 44ADA, Deductions",
    metaDescription:
      "Complete tax guide for freelancers and consultants in India. Section 44ADA presumptive scheme, allowable expenses, advance tax dates, GST registration thresholds.",
    keywords: [
      "freelancer tax india",
      "section 44ada",
      "self employed tax",
      "consultant tax india",
      "presumptive taxation",
    ],
    category: "tax",
    readingTime: 12,
    wordCount: 2150,
    publishedDate: "2026-04-30",
    relatedCalculators: ["income-tax-calculator", "gst-calculator", "ppf-calculator"],
    relatedArticles: ["new-vs-old-tax-regime-fy-2025-26", "ppf-vs-epf-vs-elss"],
    status: "live",
  },
  {
    slug: "elss-vs-index-funds",
    title: "ELSS vs Index Funds — Does the 80C Benefit Justify the Cost?",
    description:
      "Numbers-first comparison of ELSS funds and Nifty index funds. When the tax deduction outweighs the higher expense ratio — and when it doesn't.",
    metaTitle: "ELSS vs Index Funds — Which Wins After Tax (2026)",
    metaDescription:
      "ELSS vs Nifty index funds compared on expense ratio, performance, tax treatment, and post-tax returns. Includes break-even analysis for Old vs New regime.",
    keywords: [
      "elss vs index fund",
      "elss vs nifty index",
      "tax saver vs index fund",
      "best 80c equity",
    ],
    category: "investing",
    readingTime: 10,
    wordCount: 1900,
    publishedDate: "2026-04-30",
    relatedCalculators: ["mutual-fund-returns-calculator", "xirr-calculator", "income-tax-calculator"],
    relatedArticles: ["ppf-vs-epf-vs-elss", "mutual-fund-taxation-india", "how-much-sip-for-1-crore"],
    status: "live",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string): Article[] {
  const article = getArticle(slug);
  if (!article?.relatedArticles) return [];
  return article.relatedArticles
    .map(getArticle)
    .filter((a): a is Article => a !== undefined && a.status === "live");
}

export function liveArticles(): Article[] {
  return ARTICLES.filter((a) => a.status === "live");
}

export function articlesByCategory(): Record<ArticleCategory, Article[]> {
  const groups = {} as Record<ArticleCategory, Article[]>;
  for (const article of liveArticles()) {
    (groups[article.category] ??= []).push(article);
  }
  return groups;
}
