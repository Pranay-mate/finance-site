import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { RealReturnForm } from "./_components/real-return-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "real-return-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What's the difference between nominal and real return?",
    answer:
      "Nominal return is the headline number — the rate you see on a fixed deposit certificate or in a mutual fund factsheet. Real return is what's left after subtracting inflation, i.e., the actual increase in your purchasing power. A 7% FD at 6% inflation has a nominal return of 7% but a real return of just ~0.94%. The real return is what determines whether you're actually getting wealthier.",
  },
  {
    question: "How is real return calculated?",
    answer:
      "Using the Fisher equation: real_return = (1 + nominal) / (1 + inflation) − 1. The simpler approximation 'nominal − inflation' gets you close but is mathematically off by a few basis points. For a 12% nominal at 6% inflation, the precise real return is 5.66%, not the approximated 6%.",
  },
  {
    question: "Why does this matter?",
    answer:
      "Most Indian financial calculators show only nominal returns, which makes everything look better than it is. A ₹1 crore corpus in 25 years sounds great, but at 6% inflation, ₹1 crore in 2050 will only buy what ₹23 lakh buys today. Real-return thinking forces you to plan for actual purchasing power, not just bank balances. This is especially critical for retirement planning, where you'll be drawing down for 25-35 years against ever-rising prices.",
  },
  {
    question: "What should I assume for inflation in India?",
    answer:
      "6% is the central case based on long-run RBI data and the inflation-targeting framework (4% target with ±2% band). Use 7% for a conservative stress test. The US default of 2-3% does not apply to Indian planning — assuming low inflation in India is one of the biggest mistakes in retirement projections.",
  },
  {
    question: "Which Indian investments deliver positive real returns?",
    answer:
      "Long-term equity (mutual funds / index funds): typically 5-7% real return assuming 11-12% nominal at 6% inflation. PPF/EPF: 1-2% real return at 7-8% nominal. FDs: often 0-1% real, sometimes negative after tax. Savings account: deeply negative real return. The further down this list you go, the more your money is losing ground to inflation in real terms.",
  },
  {
    question: "Should I worry about inflation if I'm in equity?",
    answer:
      "Less so during your accumulation years — equity has historically beaten Indian inflation by 5-7% per year over long periods. But at retirement, when you switch to debt-heavy portfolios for stability, real returns shrink dramatically. Your retirement corpus needs to be sized for ongoing inflation drag during the drawdown phase, which is what makes the FIRE Calculator's combined accumulation + drawdown model essential.",
  },
  {
    question: "What does the '₹100 buys X' column mean?",
    answer:
      "It shows how much 'year-1 stuff' your ₹100 will buy in each future year, given the assumed inflation. After 20 years at 6% inflation, ₹100 buys only what ₹31 of year-1 goods would buy. It's a tangible way to visualise inflation's slow erosion of purchasing power.",
  },
];

export default function RealReturnCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Real Return Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          See what your investments are <em>really</em> earning after inflation. Most Indian financial calculators show only nominal returns — the headline numbers that make every investment look good. This calculator shows the truth: nominal value, real (inflation-adjusted) value, and exactly how much of your future wealth will be eaten by rising prices.
        </p>
      }
      calculator={<RealReturnForm />}
      howItWorks={
        <>
          <p>
            The real annual return uses the <strong>Fisher equation</strong>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`real_return = (1 + nominal_return) / (1 + inflation) − 1

Example: 12% nominal, 6% inflation
  real = (1.12 / 1.06) − 1
       = 1.0566 − 1
       = 5.66%`}</code>
          </pre>
          <p>
            The simple approximation <code>nominal − inflation = 6%</code> gets you close but is off by ~34 basis points. Over a 25-year horizon, that approximation error compounds to a meaningful underestimate of inflation drag.
          </p>
          <p>
            The <strong>real future value</strong> shown is what your investment will buy in <em>today&apos;s</em> rupees — the same purchasing power, just at a future date. The <strong>nominal future value</strong> is what your bank statement will read on that day. The gap between them is everything inflation eats.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter the investment amount.
          </li>
          <li>
            Enter the nominal return rate. For Indian context: FDs ~6.5-7.5%, PPF 7.1%, equity MF expected 11-13%, debt MF 6-8%.
          </li>
          <li>
            Use 6% for inflation as a default. Stress-test with 7% for conservative planning.
          </li>
          <li>
            Pick a horizon. The longer the horizon, the larger the gap between nominal and real values — and the more inflation matters.
          </li>
          <li>
            Compare the headline real return to alternatives. A 7% FD at 6% inflation has barely a 1% real return — meaning your purchasing power grows almost imperceptibly. Equity at 12% gives ~5.7% real return — meaningfully growing wealth.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
