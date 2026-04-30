import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { FireForm } from "./_components/fire-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "fire-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What does this calculator do that the SWP calculator doesn't?",
    answer:
      "The SWP calculator only models the drawdown phase with a fixed monthly withdrawal. The FIRE calculator models both the accumulation phase (your SIP years before retirement) and the drawdown phase together, with proper inflation adjustment on both your retirement expenses and the withdrawal amounts. It also separates accumulation return (typically equity-heavy) from retirement return (typically more conservative) — a real-world detail most calculators miss.",
  },
  {
    question: "Why is the corpus number so much larger than I expected?",
    answer:
      "Because of inflation. If your current monthly expenses are ₹50,000 and you FIRE in 20 years at 6% inflation, your monthly expenses at FIRE date will be ~₹1,60,000 — and they keep growing through retirement. The corpus needs to fund 25-35 years of those inflated expenses, not your current ₹50,000. This is why naive 'multiply expenses by 25' calculations underestimate so badly.",
  },
  {
    question: "What inflation rate should I use for India?",
    answer:
      "6% is the central case for India based on long-run RBI inflation data and the inflation-targeting framework (4% with ±2% band). Use 7% for a stress test — Indian inflation has hit double digits multiple times in the last 30 years. Don't use the US standard of 3% — that produces dangerously optimistic Indian retirement plans.",
  },
  {
    question: "What withdrawal rate is safe for FIRE in India?",
    answer:
      "Bengen's 4% rule was developed on US market history. For India, 3-3.5% is more defensible because (a) Indian inflation is higher, (b) we have less long-run equity history to validate against, and (c) sequence-of-returns risk in volatile emerging markets bites harder. Aim for an initial withdrawal rate at or below 3.5%. The colour-coded warning above tells you whether your plan is in safe territory.",
  },
  {
    question: "Should I use the same return rate for accumulation and retirement?",
    answer:
      "No. During accumulation, you can stomach 70-100% equity exposure because you're not withdrawing yet. Aim for 11-12% expected return. During retirement, your portfolio should shift toward 40-60% equity to reduce sequence-of-returns risk — that drops the expected return to 7-9%. Modelling them separately gives you a more realistic plan than assuming one rate forever.",
  },
  {
    question: "What is sequence-of-returns risk?",
    answer:
      "It's the risk that the order of market returns matters in retirement. If equity averages 10% but happens as -30% / -10% / +20% / +18% / +15%, your retirement is devastated because you withdrew during the early losses. The same returns in reverse order leave you wealthy. This calculator uses an average return assumption — to see worst-case scenarios, run it with a return 2-3% below your central estimate, especially for the retirement phase.",
  },
  {
    question: "How do I use the step-up SIP feature?",
    answer:
      "A step-up SIP increases your monthly contribution by a fixed percentage each year. If you start at ₹50,000/month with 8% step-up, year 2 is ₹54,000, year 3 is ₹58,320, and so on. This typically matches salary growth and dramatically increases the FIRE corpus without requiring an unrealistic upfront commitment. Even a 5-10% step-up can compress your time-to-FIRE by 3-5 years.",
  },
  {
    question: "Does this calculator factor in taxes?",
    answer:
      "No — outputs are pre-tax. For a more accurate retirement plan, reduce your retirement return assumption by 1-2% to approximate the drag of LTCG (12.5% on equity gains above ₹1.25L/yr) and slab-rate taxation on debt-fund withdrawals. The accumulation phase is largely tax-deferred if you stay invested, so the accumulation return doesn't need adjustment.",
  },
];

export default function FireCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="FIRE Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          A proper FIRE (Financial Independence, Retire Early) calculator built for Indian realities — 6% inflation, separate accumulation and retirement return assumptions, and a corpus survival check across full retirement years. Unlike basic SWP calculators, this one models both phases together so the numbers actually add up.
        </p>
      }
      calculator={<FireForm />}
      howItWorks={
        <>
          <p>
            The calculator runs two phases sequentially:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Accumulation phase (years 1 to yearsToFire):
  for each month:
    balance = (balance + monthly_SIP) × (1 + accumulation_rate / 12)
  monthly_SIP *= (1 + step_up)   // applied yearly

Drawdown phase (years 1 to yearsInRetirement):
  yearly_withdrawal = current_expenses × (1 + inflation)^yearsToFire × 12
  for each year:
    balance = balance × (1 + retirement_rate)
    balance = balance − yearly_withdrawal
    yearly_withdrawal *= (1 + inflation)`}</code>
          </pre>
          <p>
            The withdrawal grows with inflation each year — that&apos;s the realistic part. The retirement return is typically lower than the accumulation return because near-retirement portfolios shift to debt for lower volatility.
          </p>
          <p>
            The <strong>initial withdrawal rate</strong> shown is the first year&apos;s withdrawal divided by the FIRE-date corpus. For India, keeping this below 3.5% is generally safe. Above 4% is aggressive. Above 5% is risky.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>current monthly expenses</strong> in today&apos;s rupees. The calculator will inflate this forward to the FIRE date automatically.
          </li>
          <li>
            Enter any <strong>existing corpus</strong> you already have (mutual funds, PF, FDs combined).
          </li>
          <li>
            Set your <strong>monthly SIP</strong> and the annual <strong>step-up rate</strong> you can sustain. 8-10% step-up matches typical Indian salary growth.
          </li>
          <li>
            Pick years until you want to FIRE, and how long retirement should fund. (Life expectancy minus current age plus a 10-year buffer is conservative.)
          </li>
          <li>
            Use 12% accumulation return / 8% retirement return / 6% inflation as defaults. Stress-test by running again at 10% / 6% / 7%.
          </li>
          <li>
            Read the colour-coded safety verdict. Green means sustainable; amber means moderate risk; red means depletion likely. Adjust SIP, step-up, or accumulation years until you&apos;re green.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
