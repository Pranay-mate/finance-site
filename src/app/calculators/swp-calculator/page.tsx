import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { SwpForm } from "./_components/swp-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "swp-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is a Systematic Withdrawal Plan (SWP)?",
    answer:
      "An SWP is the mirror image of a SIP — instead of investing a fixed amount each month, you withdraw a fixed amount from an existing mutual fund or investment corpus. The remaining balance continues to earn returns. SWPs are popular for retirees who want a regular monthly income from their accumulated corpus while still earning growth on what's left.",
  },
  {
    question: "How does this calculator simulate withdrawals?",
    answer:
      "Each month, the corpus first grows at the monthly equivalent of the annual return rate, then your fixed monthly withdrawal is deducted. The cycle continues until the corpus runs out (depletion) or until the project tenure ends. The math is the inverse of a SIP — early withdrawals leave more money to compound, just as early SIP contributions get more time to compound.",
  },
  {
    question: "What's the safe withdrawal rate?",
    answer:
      "Roughly 3.5% to 4% of your initial corpus per year is considered sustainable for a 30-year retirement at typical equity returns. This 'safe withdrawal rate' (SWR) comes from William Bengen's research on US markets. For India — where inflation is structurally higher than the US — many planners suggest staying closer to 3.5%, especially in early retirement, and adjusting upward only after 3-5 years of confirmed corpus growth.",
  },
  {
    question: "How is SWP from mutual funds taxed?",
    answer:
      "Each withdrawal is treated as a redemption. Equity funds (≥65% equity): gains over ₹1.25L/year held >1 year are LTCG at 12.5%; held ≤1 year are STCG at 20%. Debt funds (post April 2023): gains taxed at slab rate. SWP is more tax-efficient than dividend plans because (a) only the gain portion of each withdrawal is taxable (FIFO method), and (b) you control the realisation timing. For a ₹50K monthly SWP from an equity fund, you might pay zero tax for the first few years thanks to the ₹1.25L LTCG threshold.",
  },
  {
    question: "SWP vs FD interest payout — which is better for retirees?",
    answer:
      "SWP advantages: potentially higher long-run returns (10-12% equity vs 7% FD), tax efficiency (only gain taxed, not principal), capital preservation if return > withdrawal rate. FD interest advantages: zero risk, predictable monthly amount, no chance of corpus depletion. A common retirement strategy: keep 3-5 years of expenses in FDs and short-term debt, the rest in equity funds with an SWP for long-term inflation protection.",
  },
  {
    question: "What happens if the corpus runs out?",
    answer:
      "The calculator stops withdrawals when the balance hits zero and reports the year of depletion. In real life, this is the worst-case retirement outcome — running out of money. To avoid it: start with a realistic withdrawal rate, allocate enough to growth assets (equity), and re-evaluate each year. If markets crash early in retirement, consider temporarily reducing withdrawals — this 'sequence-of-returns risk' is the single biggest threat to a successful SWP.",
  },
  {
    question: "Should I increase my SWP each year for inflation?",
    answer:
      "Yes — and this calculator currently models a flat withdrawal. In reality, you'd want to step the withdrawal up by ~5-6% per year to maintain purchasing power. The flat model here gives you the maximum possible duration; an inflation-adjusted SWP will deplete faster. A safe starting point is to withdraw 0.5-1% less than your assumed real (after-inflation) return.",
  },
];

export default function SwpCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="SWP Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Plan a retirement income from your investment corpus. The Systematic Withdrawal Plan calculator shows how long your money lasts (or how much grows) at a chosen monthly withdrawal and expected return — the essential math for retirement planning, FIRE corpus design, and any SWP strategy.
        </p>
      }
      calculator={<SwpForm />}
      howItWorks={
        <>
          <p>
            SWP simulates monthly withdrawals against a corpus that earns returns each month:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Each month:
  i = annual return / 12
  balance = balance × (1 + i)
  balance = balance − monthly_withdrawal

Repeat for tenure × 12 months, or until balance ≤ 0.`}</code>
          </pre>
          <p>
            If your <em>annual withdrawal</em> is less than the expected annual return, the corpus grows over time. If it&apos;s greater, the corpus shrinks. The break-even point depends on the volatility of returns — in a flat-return model, withdrawals up to the return rate are sustainable forever.
          </p>
          <p>
            Real markets aren&apos;t flat — sequence-of-returns risk (a market crash early in your withdrawal phase) can deplete a corpus much faster than the flat-rate model suggests. Stress-test your plan by running the calculator with a return 2-3% below your central assumption.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your initial corpus — the amount you have at the start of withdrawals.
          </li>
          <li>
            Set the monthly withdrawal you need (factor in expected post-tax inflows).
          </li>
          <li>
            Pick an expected return. <strong>Be conservative.</strong> Use 8% for a balanced (50:50) portfolio, 10% for equity-heavy.
          </li>
          <li>
            Set the projection tenure — typically the number of years you&apos;ll need income (e.g., life expectancy minus current age, plus a 5-10 year buffer).
          </li>
          <li>
            Watch the result: is the final balance positive, or does the corpus deplete? Adjust the withdrawal until you&apos;re comfortable with both the income and the longevity.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
