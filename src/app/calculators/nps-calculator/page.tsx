import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { NpsForm } from "./_components/nps-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "nps-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is NPS?",
    answer:
      "NPS (National Pension System) is a voluntary, defined-contribution retirement scheme run by PFRDA. You contribute monthly; the corpus is managed across equity, corporate debt, and government bond funds based on your chosen mix. At age 60, 60% can be withdrawn lump-sum (tax-free) and the remaining 40% must convert to an annuity that pays a monthly pension for life.",
  },
  {
    question: "How are NPS returns generated?",
    answer:
      "NPS Tier 1 lets you choose an asset mix across equity (max 75% till age 50), corporate debt, and government bonds. Long-run returns: equity-heavy mix ~10-12% CAGR, debt-heavy ~7-8%. Pick a Pension Fund Manager (SBI, HDFC, ICICI, Aditya Birla, LIC are common); fees are uniformly low across all PFMs.",
  },
  {
    question: "Why do I have to convert 40% to an annuity?",
    answer:
      "PFRDA rules require at least 40% of the maturity corpus to be converted into a pension annuity at age 60. The annuity provides regular income for life, structured similarly to a pension. You can pick the type — lifetime annuity for self only (highest payout), joint with spouse, with or without return of purchase price (ROP).",
  },
  {
    question: "What's the tax treatment?",
    answer:
      "Contributions: deductible under 80CCD(1) within the ₹1.5L 80C cap, plus an additional ₹50K under 80CCD(1B) — both Old regime only. Employer contribution under 80CCD(2) is deductible up to 14% of basic + DA, available in both regimes. Maturity: 60% lump sum is fully tax-free; 40% annuity is taxable as 'income from other sources' at slab rate when received.",
  },
  {
    question: "Can I withdraw NPS before age 60?",
    answer:
      "Premature exit before 60 requires 80% of the corpus to convert to annuity (only 20% tax-free lump sum). Partial withdrawals up to 25% of contributions are allowed after 3 years for specific reasons (kids' education or marriage, home purchase, medical emergency, disability). For most people, treat NPS as fully locked till 60.",
  },
  {
    question: "What's a typical annuity rate in India?",
    answer:
      "6-7% per annum is common for life-only annuity from major Indian ASPs (LIC, HDFC Life, SBI Life, ICICI Pru, Bajaj Allianz). Joint-life annuities and those with return-of-purchase-price pay 0.5-1% lower. Higher rates exist but often skip the ROP — meaning when you and your spouse die, no money goes to heirs.",
  },
  {
    question: "Is NPS better than PPF?",
    answer:
      "Different goals. PPF: 7.1% fixed, 15-year flexible lock, full EEE, fully liquid at maturity. NPS: market-linked higher expected return (~10-11%), locked till 60, 40% mandatory annuity. NPS wins on return potential and the extra ₹50K deduction; PPF wins on simplicity, certainty, and full liquidity. Most thoughtful Indian investors use both.",
  },
  {
    question: "How do I open an NPS account?",
    answer:
      "Online via eNPS (enps.nsdl.com or the official NPS Trust website). You'll need PAN, Aadhaar, bank details, and a small initial contribution (₹500 minimum). Pick a PFM and asset allocation (or use the lifecycle 'Auto' option — it shifts equity exposure down with age automatically). Annual maintenance is minimal.",
  },
];

export default function NpsCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="NPS Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Project your National Pension System corpus at retirement, the 60% tax-free lump sum, and the monthly pension from the mandatory 40% annuity. Includes employer contribution under Section 80CCD(2) — one of the most underused tax deductions for salaried employees.
        </p>
      }
      calculator={<NpsForm />}
      howItWorks={
        <>
          <p>
            NPS combines monthly contributions with market-linked returns during accumulation, then a forced split at retirement:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Each month (until age 60):
  i = annual_return / 12
  balance = (balance + monthly_contribution) × (1 + i)

At retirement (age 60):
  lump_sum = retirement_corpus × 0.60  // tax-free
  annuity_corpus = retirement_corpus × 0.40

Monthly pension:
  annual_pension = annuity_corpus × annuity_rate
  monthly_pension = annual_pension / 12`}</code>
          </pre>
          <p>
            Monthly contribution includes both your share and (optionally) your employer&apos;s — the latter qualifies for an additional Section 80CCD(2) deduction up to 14% of basic + DA, which works under both tax regimes.
          </p>
          <p>
            The accumulation return depends on your asset mix. PFRDA caps equity at 75% till age 50; the &quot;Auto&quot; lifecycle mode shifts toward debt as you age, which lowers the effective return in your final accumulation years. For projections, use 10% as a balanced default.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>current age</strong> and <strong>retirement age</strong> (default 60). You can extend NPS contributions till 75.
          </li>
          <li>
            Set your <strong>monthly self contribution</strong> — minimum ₹500 to keep the account active, but ₹2K-5K is more typical for retirement-relevant accumulation.
          </li>
          <li>
            If your employer offers NPS under 80CCD(2), enter the monthly contribution. This is essentially free deduction over and above 80C.
          </li>
          <li>
            Choose an expected return: 8% conservative, 10% balanced (75% equity in early years), 12% aggressive.
          </li>
          <li>
            Pick an annuity rate (default 7%). Run scenarios with 6% to stress-test — annuity rates can drop in low-interest-rate environments.
          </li>
          <li>
            Read the corpus, lump sum, and monthly pension. Compare against the <a href="/calculators/ppf-calculator">PPF Calculator</a> with the same monthly contribution to see which retirement vehicle wins for your situation.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
