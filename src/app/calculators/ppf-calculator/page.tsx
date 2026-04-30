import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { PpfForm } from "./_components/ppf-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "ppf-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is the current PPF interest rate?",
    answer:
      "The Public Provident Fund interest rate is set quarterly by the Ministry of Finance. The current rate is 7.1% per annum, compounded annually. The rate has been steady at 7.1% since April 2020. You can override the default rate above to model older or hypothetical scenarios.",
  },
  {
    question: "How much can I deposit in PPF?",
    answer:
      "Minimum ₹500 per financial year, maximum ₹1.5 lakh per year (across all your PPF accounts combined — including those for minor children). You can deposit in lump sum or in instalments (up to 12 per year). Deposits beyond ₹1.5L don't earn interest and are returned without interest.",
  },
  {
    question: "When should I deposit to maximise interest?",
    answer:
      "Interest in a PPF is calculated on the lowest balance between the 5th and last day of each month. To get full interest on a deposit, make it before the 5th of the month. The most-tax-efficient strategy is to deposit your full ₹1.5L on or before April 5th of each financial year — that way the entire amount earns interest for all 12 months. Our calculator assumes start-of-year deposits, matching this best practice.",
  },
  {
    question: "Is PPF tax-free?",
    answer:
      "Yes. PPF qualifies for the most generous Indian tax treatment — EEE (Exempt-Exempt-Exempt): (1) Deposits up to ₹1.5L qualify for Section 80C deduction (Old regime only), (2) Interest earned each year is tax-free, and (3) Maturity amount is tax-free. This makes it one of the best risk-free instruments in India for long-horizon savings.",
  },
  {
    question: "Can I extend my PPF beyond 15 years?",
    answer:
      "Yes. After the 15-year maturity, you can extend the account in 5-year blocks indefinitely. You can extend with or without further contributions. With contributions, you can keep depositing up to ₹1.5L/year. Without contributions, the existing balance keeps earning interest tax-free. Extension is a strong option in retirement — most people don't realise how powerful continued compounding is at year 20+.",
  },
  {
    question: "Can I withdraw or take a loan from PPF?",
    answer:
      "Loans: From year 3 to year 6, you can take a loan up to 25% of the balance at the end of year 2. Partial withdrawals: From year 7 onwards, you can withdraw up to 50% of the balance at the end of year 4 or the end of the previous year (whichever is lower), once per year. The full balance is only accessible at maturity (year 15) or in extension blocks.",
  },
  {
    question: "PPF vs ELSS vs NPS — which is best?",
    answer:
      "All three qualify for Section 80C. PPF is risk-free and predictable (~7.1% guaranteed by GoI). ELSS is equity (12-15% expected long-run, but volatile, 3-year lock-in). NPS adds equity exposure plus an extra ₹50K deduction under 80CCD(1B), but locks money till 60. A balanced approach: max ELSS for growth, fill the rest with PPF for guaranteed compounding. PPF is also a great way to diversify away from market risk inside an otherwise equity-heavy portfolio.",
  },
];

export default function PpfCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="PPF Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          See exactly what your Public Provident Fund will be worth at maturity. PPF is India&apos;s most tax-efficient risk-free savings vehicle — deposits qualify for Section 80C, interest is tax-free, and maturity is tax-free (the rare EEE category). The default rate (7.1%) matches the latest government notification.
        </p>
      }
      calculator={<PpfForm />}
      howItWorks={
        <>
          <p>
            PPF compounds <strong>annually</strong>. If you deposit at the start of the year, the standard closed-form is:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`A = R × (1 + r) × ((1 + r)^N − 1) / r

R = annual deposit
r = annual interest rate (decimal: 7.1% → 0.071)
N = tenure in years (minimum 15)`}</code>
          </pre>
          <p>
            Real PPF interest is calculated on the <em>minimum balance between the 5th and the last day of each month</em>. The simplest way to maximise this is to deposit your annual contribution on or before April 5th — the full amount then earns interest for all 12 months. If you spread deposits through the year, each instalment only earns interest from the month following deposit.
          </p>
          <p>
            Our calculator assumes start-of-year deposits, which matches the optimal strategy and what India Post / SBI / ClearTax PPF calculators show.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Set your annual deposit (₹500 to ₹1,50,000). Most savers max it out at ₹1.5L for the full Section 80C benefit.
          </li>
          <li>
            Use the default rate of 7.1% — or override it to model what-ifs. Historical PPF rates have ranged from 7.1% to 12% since 1968.
          </li>
          <li>
            Pick a tenure. The legal minimum is 15 years; extending in 5-year blocks is where most of the long-term magic happens.
          </li>
          <li>
            Try a 25-year PPF: at ₹1.5L/year and 7.1%, you&apos;ll cross ₹1 crore — entirely tax-free. That&apos;s the power of EEE compounding.
          </li>
          <li>
            Compare the &quot;deposited vs interest earned&quot; donut. After 15 years interest typically equals deposits; after 25 years interest is 2-3× the deposits.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
