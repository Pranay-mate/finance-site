import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { XirrForm } from "./_components/xirr-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "xirr-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is XIRR?",
    answer:
      "XIRR (Extended Internal Rate of Return) is the annualised return on a series of irregular cashflows — investments and withdrawals on different dates and in different amounts. It's the right metric to use whenever your contributions or redemptions aren't perfectly regular: top-up SIPs, lump-sum additions, partial redemptions, missed instalments, or evaluating a portfolio of different funds bought at different times.",
  },
  {
    question: "How is XIRR different from CAGR?",
    answer:
      "CAGR (Compound Annual Growth Rate) assumes a single investment and a single redemption — it can only handle two cashflows. XIRR generalises CAGR to any number of cashflows on any dates. For a one-time investment held to a final date, XIRR equals CAGR. For SIPs, top-ups, or any irregular pattern, XIRR is the correct number; CAGR doesn't apply.",
  },
  {
    question: "How does the calculator find XIRR?",
    answer:
      "It uses Newton-Raphson iteration on the Net Present Value equation: find the rate `r` such that the discounted sum of all cashflows equals zero. NPV(r) = sum of cashflow_i / (1 + r)^(days_i / 365). The math is identical to Excel's XIRR function — same convention, same day-count basis. If Newton's method fails to converge for unusual cashflow patterns, the calculator falls back to bisection on the interval (-99.9%, 1000%), which always finds a solution if one exists.",
  },
  {
    question: "What sign convention should I use?",
    answer:
      "Money you invest (out of your pocket) is negative; money you receive (redemptions, dividends, current portfolio value) is positive. Example: a ₹10,000 SIP entry should be -10000; a ₹17,000 redemption should be +17000. To find your portfolio's XIRR right now, list all past cashflows with their signs, then add today's portfolio value as a positive final entry.",
  },
  {
    question: "Why does XIRR sometimes return an error?",
    answer:
      "XIRR requires at least one negative and one positive cashflow — without both, there's no rate that balances the equation. Common mistakes: forgetting to add the current portfolio value as a positive entry, entering all amounts as positive, or using only positive (income) cashflows. The calculator shows an em-dash with a hint if the inputs aren't valid.",
  },
  {
    question: "What's a good XIRR for an Indian equity portfolio?",
    answer:
      "Long-run averages: 12-15% for diversified equity funds over 10+ years. 10-12% for hybrid/balanced. 7-9% for debt. If your XIRR over 5+ years is below the index XIRR for the same period (Nifty 50 / Sensex), consider whether your fund choices, timing, or withdrawal pattern is dragging returns. Don't compare year-1 XIRR — it's noise.",
  },
  {
    question: "Does XIRR account for taxes?",
    answer:
      "No — XIRR uses the gross cashflows you provide. To get a post-tax XIRR, enter redemptions net of capital gains tax. For most equity-heavy portfolios with long holding periods, the difference is small (LTCG at 12.5% only on gains above ₹1.25L per year). For debt or short-term equity (taxed at slab), the post-tax XIRR can be significantly lower than the gross.",
  },
];

export default function XirrCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="XIRR Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Calculate the true annualised return on irregular cashflows — exactly what Excel&apos;s XIRR function does. Perfect for evaluating SIPs with top-ups, partial redemptions, mutual fund portfolios bought at different times, or any sequence of investments and withdrawals on uneven dates.
        </p>
      }
      calculator={<XirrForm />}
      howItWorks={
        <>
          <p>
            XIRR finds the discount rate <code>r</code> that makes the net present value of all cashflows equal to zero:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`NPV(r) = Σ cashflow_i / (1 + r)^(days_i / 365) = 0

where:
  cashflow_i = each cashflow (negative for outflows, positive for inflows)
  days_i = days between cashflow_i and the first cashflow
  r = annualised rate (XIRR)`}</code>
          </pre>
          <p>
            There&apos;s no closed-form solution — it&apos;s solved iteratively. We use <strong>Newton-Raphson</strong> as the primary method (typically converges in 5-15 iterations), with <strong>bisection</strong> as a fallback for edge cases. The result matches Excel&apos;s XIRR to at least 6 decimal places.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter every contribution as a negative number (money you put in) with its date.
          </li>
          <li>
            Enter every redemption as a positive number (money you took out) with its date.
          </li>
          <li>
            For a portfolio you still hold, add today&apos;s value as the <em>final positive cashflow</em>. Without this, XIRR can&apos;t see the unrealised gain.
          </li>
          <li>
            Add or remove rows as needed. The calculator updates the XIRR as you type.
          </li>
          <li>
            For a typical SIP analysis: 36 monthly entries of -₹X each, then one final positive entry for the current portfolio value.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
