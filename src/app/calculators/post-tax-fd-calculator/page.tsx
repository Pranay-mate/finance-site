import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { PostTaxFdForm } from "./_components/post-tax-fd-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "post-tax-fd-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is FD interest taxed in India?",
    answer:
      "FD interest is taxed as 'Income from other sources' at your marginal slab rate (the rate applied to your topmost rupee of income). Unlike equity LTCG, there's no special 10% concessional rate for FDs — every rupee of interest is taxed at your full slab. A 4% Health & Education Cess is added on top of the tax. So a 30%-slab depositor effectively pays 31.2% on FD interest.",
  },
  {
    question: "How is this different from a regular FD calculator?",
    answer:
      "A regular FD calculator shows the gross maturity amount — what the bank pays you. But you don't keep all of it: tax is owed each year on the interest accrued. This calculator shows what's actually left in your hand after tax, plus your real post-tax CAGR. For a 30%-slab depositor, the post-tax return on a 7% FD is closer to 4.8% — a number most calculators hide.",
  },
  {
    question: "Is FD interest taxed each year, or only at maturity?",
    answer:
      "Income tax law treats FD interest on an accrual basis — you owe tax each year on that year's interest, even though you receive it only at maturity (for cumulative FDs). The bank reports the accrued interest in your Form 26AS / AIS each year. This calculator follows the same accrual model.",
  },
  {
    question: "What is TDS on FDs and is it the same as my tax liability?",
    answer:
      "TDS (Tax Deducted at Source) is an advance tax the bank withholds — 10% if your annual interest exceeds ₹40,000 (₹50,000 for senior citizens), or 20% if you haven't submitted a PAN. TDS is not your final tax. Your actual liability is at your slab rate; the difference shows up when you file your return — you either pay extra or get a refund. This calculator shows your final liability, not TDS.",
  },
  {
    question: "What is the 80TTB benefit for senior citizens?",
    answer:
      "Section 80TTB lets senior citizens (60+) deduct up to ₹50,000/year of interest income (savings accounts + FDs + RDs combined) — but only under the Old tax regime. Under the New regime, 80TTB is not allowed. Toggle 'Senior citizen + Old regime' in the calculator to apply this exemption. Note: Section 80TTA (the ₹10,000 deduction for non-seniors) applies only to savings-account interest, not FDs.",
  },
  {
    question: "Should I prefer FDs or debt mutual funds post-tax?",
    answer:
      "After the April-2023 amendment, debt mutual funds bought on or after 1 April 2023 are taxed exactly like FDs — at your slab rate, on the gain when redeemed. So the post-tax return is similar. The differences are: FDs offer guaranteed returns and DICGC insurance up to ₹5L; debt MFs are slightly more liquid and can be timed for tax-year planning. For most retail investors with a 5-year horizon, FDs and debt MFs are close to a tie post-tax.",
  },
  {
    question: "How can I reduce tax on my FD interest legally?",
    answer:
      "Three options. (1) Hold FDs in the name of a non-earning family member (spouse, parent) so interest is taxed at their lower slab — note clubbing rules apply for spouse income. (2) For senior parents, put their FDs in their name to use 80TTB exemption. (3) Invest in tax-saving 5-year FDs under Section 80C (Old regime only) — but interest is still taxed; only the principal up to ₹1.5L gets a one-time deduction.",
  },
  {
    question: "Does this calculator account for indexation or inflation?",
    answer:
      "No — indexation never applied to FDs (only to debt mutual funds before April 2023, and only to long-term gains). For inflation-adjusted real return, use our Real Return Calculator with the post-tax CAGR shown here as input. A 7% pre-tax FD at a 30% slab against 6% inflation has a real post-tax return of roughly -1% — i.e., the saver is losing purchasing power.",
  },
];

export default function PostTaxFdCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Post-tax FD Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          See what your fixed deposit <em>actually</em> earns after income tax.
          Most FD calculators show the gross maturity amount and quietly skip the
          tax — but FD interest is taxed at your full slab rate plus 4% cess.
          Plug in your slab and see your real post-tax CAGR, including the
          80TTB exemption for senior citizens.
        </p>
      }
      calculator={<PostTaxFdForm />}
      howItWorks={
        <>
          <p>
            FD interest is taxed each year as <strong>Income from other sources</strong> at your marginal slab rate, plus 4% Health &amp; Education Cess.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Effective tax rate = slab × 1.04
Yearly tax         = (yearly interest − 80TTB exemption) × effective rate
Post-tax maturity  = principal + (gross interest − total tax)
Post-tax CAGR      = (post-tax maturity / principal)^(1/years) − 1`}</code>
          </pre>
          <p>
            The FD itself keeps compounding gross — tax is paid each year from outside the deposit. The depositor&apos;s net wealth is the maturity amount minus all tax paid over the tenure.
          </p>
          <p>
            <strong>80TTB</strong> lets senior citizens (60+) deduct up to ₹50,000/year of interest income — but only under the Old tax regime. Toggle the Senior Citizen option to apply it.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter the deposit amount, annual rate, and tenure (same inputs as a regular FD).
          </li>
          <li>
            Pick your tax slab. Most salaried earners are in the 20% or 30% slab; retirees with lower income may be in the 5% or 10% slab.
          </li>
          <li>
            Toggle <strong>Senior Citizen</strong> if you&apos;re 60+ and on the <strong>Old</strong> regime — applies the ₹50k 80TTB exemption per year.
          </li>
          <li>
            Read the <strong>Post-tax maturity</strong> and <strong>Post-tax CAGR</strong>. Compare with the gross effective yield to see the real impact of tax.
          </li>
          <li>
            For real-world planning, plug the post-tax CAGR into our Real Return Calculator to see what&apos;s left after inflation.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
