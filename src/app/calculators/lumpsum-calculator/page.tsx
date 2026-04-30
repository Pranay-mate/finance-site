import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { LumpsumForm } from "./_components/lumpsum-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "lumpsum-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is the future value of a lumpsum investment calculated?",
    answer:
      "Future value uses annual compounding: A = P × (1 + r)^t, where P is the investment amount, r is the expected annual return as a decimal (12% → 0.12), and t is the investment horizon in years. This is the standard convention used by Groww, ClearTax, and other Indian fund platforms when projecting mutual-fund returns.",
  },
  {
    question: "What expected return should I use?",
    answer:
      "Long-run averages for Indian markets: equity mutual funds ~12% (CAGR over 15+ years for a diversified large-cap or flexi-cap fund), hybrid funds ~10%, debt funds ~7%, gold ~8-9%. These are not guarantees — actual returns vary year to year and can be negative in bad markets. Use 10-12% as a reasonable equity assumption and stress-test with 8% for conservative planning.",
  },
  {
    question: "Is lumpsum better than SIP?",
    answer:
      "If you have the money up front, lumpsum mathematically wins because all of your principal is earning compound returns from day one. However, SIP wins behaviourally: it averages your purchase price across market cycles (rupee-cost averaging), removes the 'when to invest' anxiety, and forces a savings habit. For most people without strong market-timing conviction, SIP is the safer default. If you've inherited or earned a windfall, consider STP (Systematic Transfer Plan) — park the lumpsum in a liquid fund and transfer to equity over 6-12 months.",
  },
  {
    question: "Are returns guaranteed?",
    answer:
      "No. Mutual fund returns are market-linked and can be negative in any given year. The 12% equity assumption is a long-run historical average, not a promise. Always invest with a horizon of at least 5-7 years for equity funds to ride out volatility.",
  },
  {
    question: "How are mutual fund gains taxed?",
    answer:
      "Equity mutual funds (≥65% equity allocation): gains over 1 year are Long-Term Capital Gains, taxed at 12.5% above ₹1.25L per year (post-July 2024). Within 1 year are Short-Term, taxed at 20%. Debt mutual funds (post April 2023): all gains taxed at slab rate regardless of holding period. Hybrid funds depend on equity allocation. The future value shown is pre-tax.",
  },
  {
    question: "Does this calculator account for inflation?",
    answer:
      "No, it shows nominal future value. To estimate real (inflation-adjusted) wealth, subtract India's long-run inflation (~5-6%) from your assumed return. For a 12% nominal return at 6% inflation, the real return is ~5.7% (using the precise formula (1.12 / 1.06) − 1).",
  },
  {
    question: "What's the difference between CAGR and absolute return?",
    answer:
      "CAGR (Compound Annual Growth Rate) is the constant rate that would have produced the final value if compounded annually — it's what we use here. Absolute return is just (final − initial) / initial × 100 over the entire period, ignoring time. CAGR is the right metric for comparing investments across different durations.",
  },
];

export default function LumpsumCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Lumpsum Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          See what a one-time investment could grow into. Useful for planning where to park a windfall, projecting the future value of a single mutual-fund purchase, or stress-testing how different return assumptions affect your retirement corpus.
        </p>
      }
      calculator={<LumpsumForm />}
      howItWorks={
        <>
          <p>
            Lumpsum future value uses the standard <strong>compound interest formula</strong> with annual compounding (the convention for mutual-fund return projections):
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`A = P × (1 + r) ^ t

P = principal (one-time investment)
r = expected annual return (decimal: 12% → 0.12)
t = investment horizon in years`}</code>
          </pre>
          <p>
            The same formula doubles your money roughly every <code>72 / r</code> years (the &quot;rule of 72&quot;): at 12%, money doubles every 6 years; at 8%, every 9 years. Compounding is non-linear — most of your final value comes from the last few years. Don&apos;t cut your horizon short.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your one-time investment amount.
          </li>
          <li>
            Pick a realistic annual return. For long-horizon equity SIPs/lumpsums in India, 10-12% is reasonable; use 8% as a conservative stress test.
          </li>
          <li>
            Choose your investment horizon. Equity funds need at least 5-7 years to absorb market volatility.
          </li>
          <li>
            Look at the gain vs invested split — at 12% over 20 years, more than 80% of your final value is gain, not principal.
          </li>
          <li>
            Try the same numbers in the SIP / Mutual Fund Returns calculator to compare lumpsum vs SIP for the same total commitment.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
