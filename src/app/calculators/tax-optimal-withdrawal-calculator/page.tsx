import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { TaxOptimalForm } from "./_components/tax-optimal-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "tax-optimal-withdrawal-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "Why does the order of withdrawal matter?",
    answer:
      "Different buckets have different effective tax rates. Tax-free buckets (PPF, EPF maturity, SSY) cost 0%. Equity withdrawal within the ₹1.25L LTCG exemption is free; above the exemption it's 12.5% on the gain portion. Debt MF gains (post-April 2023) are taxed at your full slab rate — anywhere from 0% to 30%+. The optimal order maximises the use of zero-tax and exempt capacity before reaching for tax-heavy buckets.",
  },
  {
    question: "How does the ₹1.25L LTCG exemption work?",
    answer:
      "Every financial year, the first ₹1.25 lakh of long-term capital gains from equity mutual funds is tax-free. So if you have a 50% unrealized gain in your equity MF, you can withdraw up to ₹2.5 lakh per year without paying any tax (50% of ₹2.5L = ₹1.25L gain, all exempt). Above ₹1.25L of gain, the rest is taxed at 12.5%. This calculator uses the full exemption every year before reaching for taxable buckets.",
  },
  {
    question: "What's a 'naive proportional' plan?",
    answer:
      "It's what most retirees default to without thinking — withdraw from each bucket in proportion to its size. If you have ₹30L tax-free, ₹100L equity, and ₹50L debt, a naive plan takes 16.7% / 55.6% / 27.8% from each. This pays tax on equity and debt unnecessarily when the tax-free bucket could have covered the entire withdrawal.",
  },
  {
    question: "Is the optimal order the same for every retiree?",
    answer:
      "The first two steps are universal: drain tax-free, then use the equity LTCG exemption. The third step depends on your slab. If your marginal slab is above 12.5%, equity above the exemption (taxed at 12.5%) is cheaper than debt (taxed at slab). If your slab is below 12.5% (e.g., low pension income), debt becomes cheaper and should be drawn before equity above exemption.",
  },
  {
    question: "What does 'unrealized gain %' mean?",
    answer:
      "Of every rupee in your equity (or debt) bucket, what fraction is unrealized profit vs original principal? If you invested ₹50L that grew to ₹1Cr, your unrealized gain is ₹50L = 50% of the current balance. When you withdraw ₹10L, only ₹5L (50%) is taxable gain; the other ₹5L is principal returning to you tax-free. This is determined by FIFO at the fund-house level — they track each unit's cost basis.",
  },
  {
    question: "How does this calculator differ from the SWP calculator?",
    answer:
      "The SWP calculator shows whether your corpus survives a fixed withdrawal. The Tax-Optimal Withdrawal Planner shows how to *split* a single year's withdrawal across multiple buckets to minimise tax. They're complementary — use SWP to size your corpus, then use this calculator each year of retirement to optimise the actual draw.",
  },
  {
    question: "Should I always pick the optimal plan?",
    answer:
      "Mostly yes, but consider rebalancing too. If your portfolio is 90% equity and 10% debt and you draw equity-first to use the exemption, your portfolio gets even more equity-heavy over time. The optimal-tax plan can conflict with optimal-allocation. A hybrid approach: use this calculator to find the tax-optimal plan, then if your asset allocation has drifted significantly, take 1-2% extra from the over-weight bucket as a rebalancing tax cost.",
  },
];

export default function TaxOptimalWithdrawalPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Tax-Optimal Withdrawal Planner"
      description={cal.metaDescription}
      intro={
        <p>
          Find the cheapest way to fund your annual retirement expenses across PPF/EPF, equity mutual funds, and debt mutual funds. Most retirees draw proportionally from every bucket — losing thousands to avoidable tax. This calculator shows the tax-minimising split that uses your ₹1.25L LTCG exemption and your slab position correctly.
        </p>
      }
      calculator={<TaxOptimalForm />}
      howItWorks={
        <>
          <p>
            The calculator finds the optimal split using a simple but powerful priority order:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Order of withdrawal:
  1. Tax-free corpus (PPF / EPF / SSY) — 0% tax always
  2. Equity within ₹1.25L LTCG exemption window — 0% tax
  3. If slab > 12.5%:
       Equity above exemption (12.5%) BEFORE debt (slab%)
     If slab ≤ 12.5%:
       Debt (slab%) BEFORE equity above exemption (12.5%)
  4. The more expensive bucket comes last`}</code>
          </pre>
          <p>
            For each bucket, the tax depends on the unrealized-gain fraction of withdrawal. If only 30% of your equity balance is gain, only 30% of your withdrawal is taxable — the other 70% is just principal returning to you.
          </p>
          <p>
            The naive plan takes proportionally from each bucket. The savings shown is the difference between the naive and optimal plans on this year&apos;s withdrawal alone — multiply by your retirement years to see lifetime impact.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>annual expenses needed (post-tax)</strong>. The calculator works backwards to find the gross withdrawal that nets you this amount.
          </li>
          <li>
            Set your <strong>marginal income tax slab</strong>. For most retirees on pension or business income this is 5%, 20%, or 30%.
          </li>
          <li>
            Enter your three bucket balances. <strong>Tax-free</strong> is PPF maturity + EPF withdrawal + SSY. <strong>Equity MF</strong> is your total equity allocation. <strong>Debt MF</strong> is liquid + short-duration + corporate bond funds.
          </li>
          <li>
            Estimate the <strong>unrealized gain percentage</strong> for each non-tax-free bucket. If you bought units 10 years ago at ₹100 and they&apos;re worth ₹250 today, gain % = 60%. Most fund platforms show this in your &quot;P&amp;L&quot; view.
          </li>
          <li>
            Read the optimal split. The &quot;Annual tax saved&quot; headline is what this strategy beats the naive plan by — over a 25-year retirement, multiply by 25 for lifetime impact (it&apos;s typically lakhs to tens of lakhs).
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
