import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { EmiForm } from "./_components/emi-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "emi-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is EMI calculated?",
    answer:
      "EMI uses the reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the tenure in months. Each EMI keeps you paying both interest on the outstanding balance and a portion of the principal — early EMIs are mostly interest, later EMIs are mostly principal.",
  },
  {
    question: "What's the difference between flat and reducing-balance EMI?",
    answer:
      "Reducing-balance (used by all banks for home, car and personal loans) charges interest only on the outstanding balance, which decreases each month. Flat-rate EMI charges interest on the original principal for the entire tenure, making the effective rate roughly 1.7–1.9× the quoted rate. Reducing-balance is always better for the borrower. This calculator uses the reducing-balance method.",
  },
  {
    question: "Can I prepay my loan? How does it affect EMI?",
    answer:
      "Yes. Most floating-rate loans allow free prepayment. A prepayment reduces your outstanding principal, which can either lower your EMI (keeping tenure the same) or shorten your tenure (keeping EMI the same). Shortening tenure typically saves more interest. Fixed-rate loans may charge a 2–4% prepayment penalty — check your sanction letter.",
  },
  {
    question: "Should I pick a longer or shorter tenure?",
    answer:
      "Shorter tenure means higher EMI but significantly less total interest paid. Longer tenure lowers the EMI but you pay more interest overall. As a rule of thumb, keep total EMIs across all loans below 40–50% of monthly take-home income, and pick the shortest tenure you can comfortably afford.",
  },
  {
    question: "Does this calculator include processing fees, GST, or insurance?",
    answer:
      "No. The output is the pure principal-and-interest EMI based on the reducing-balance formula. Banks may add a one-time processing fee (0.5–2% of the loan), GST on the processing fee, and optional loan-protection insurance. Ask your lender for the all-inclusive APR/effective cost.",
  },
  {
    question: "Are home loan EMIs tax-deductible?",
    answer:
      "Under the Old tax regime (Indian Income Tax Act): principal repayment qualifies under Section 80C (up to ₹1.5L/year, shared with PPF/EPF/ELSS), and interest paid qualifies under Section 24(b) (up to ₹2L/year for self-occupied property). The New regime does not allow these deductions. Use our Income Tax Calculator to compare regimes.",
  },
  {
    question: "Is the result accurate to the rupee?",
    answer:
      "The math is exact. Banks may show rupee-level differences because of rounding rules in their core banking systems (some round monthly EMI up, others round the last EMI to clear the principal). The total interest you actually pay will match this calculator within a few rupees over the loan tenure.",
  },
];

export default function EmiCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="EMI Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Find your monthly EMI for any home loan, car loan, or personal loan in India. Adjust principal, interest rate and tenure — the math updates instantly, with a full year-by-year breakdown of how much principal and interest you&apos;ll pay.
        </p>
      }
      calculator={<EmiForm />}
      howItWorks={
        <>
          <p>
            EMI uses the standard <strong>reducing-balance formula</strong>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`EMI = P × r × (1 + r)^n
       ─────────────────
        (1 + r)^n − 1

P = principal (loan amount)
r = monthly interest rate = annual rate ÷ 12 ÷ 100
n = tenure in months`}</code>
          </pre>
          <p>
            Interest each month is charged only on the <em>outstanding</em> balance — so as you pay down the principal, the interest portion shrinks and more of your EMI goes toward principal. Early in the loan you&apos;re mostly paying interest; in the final years you&apos;re mostly paying down principal. The total EMI stays constant.
          </p>
          <p>
            If the rate is exactly 0%, EMI is simply <code>P / n</code>.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter the loan amount you&apos;re planning to borrow (e.g., ₹25 lakh for a home loan).
          </li>
          <li>
            Set the annual interest rate quoted by the lender. For floating-rate loans, this is the current rate.
          </li>
          <li>
            Choose the loan tenure in years. Shorter tenure = higher EMI but lower total interest.
          </li>
          <li>
            Read the headline EMI, total interest, and total payment. Use the year-by-year table to see how your principal-vs-interest mix shifts over time.
          </li>
          <li>
            Try shortening the tenure by 5 years — notice how much total interest you save versus how much the EMI rises. This is the classic prepayment trade-off.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
