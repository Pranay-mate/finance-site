import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { IncomeTaxForm } from "./_components/income-tax-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "income-tax-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What are the New Regime tax slabs for FY 2025-26?",
    answer:
      "Up to ₹4L: nil. ₹4-8L: 5%. ₹8-12L: 10%. ₹12-16L: 15%. ₹16-20L: 20%. ₹20-24L: 25%. Above ₹24L: 30%. Standard deduction is ₹75,000 (auto-applied for salaried). Section 87A rebate makes income up to ₹12L taxable (i.e., ₹12.75L gross for salaried) effectively tax-free. The New Regime is the default for most people from FY 2024-25 onwards.",
  },
  {
    question: "What are the Old Regime slabs?",
    answer:
      "Below 60: ₹0-2.5L nil, ₹2.5-5L at 5%, ₹5-10L at 20%, above ₹10L at 30%. Senior (60-80): ₹3L exemption. Super-senior (80+): ₹5L exemption. Standard deduction is ₹50,000. Section 87A rebate makes income up to ₹5L tax-free. The Old Regime is only worth it if you have substantial deductions (80C + 80D + HRA + home loan interest, etc.) — typically more than ₹4-5L of total deductions.",
  },
  {
    question: "Which regime should I choose?",
    answer:
      "Run the comparison above. Rule of thumb: if your total deductions (80C + 80D + HRA + home loan interest, etc.) are below ~₹4L, the New Regime almost always wins. Above ₹6-7L of deductions, Old Regime usually wins. In between, it depends on your income — higher incomes need fewer deductions to make Old Regime worthwhile because the slab-rate differences are larger.",
  },
  {
    question: "What is the Section 87A rebate?",
    answer:
      "It's a rebate that zeroes out your tax if your taxable income is below a threshold. New Regime: ₹60,000 rebate, fully covering tax up to ₹12L taxable income. Old Regime: ₹12,500 rebate, covering tax up to ₹5L taxable. With the New Regime's ₹75K standard deduction, salaried earners with gross up to ₹12.75L pay zero tax. With the Old Regime's ₹50K standard deduction + ₹1.5L 80C, salaried earners with gross up to ₹7L can pay zero tax.",
  },
  {
    question: "How does surcharge work?",
    answer:
      "Surcharge is an additional percentage levied on the tax (not on income) for high earners: 10% if taxable income is ₹50L-₹1Cr, 15% for ₹1Cr-₹2Cr, 25% for ₹2Cr-₹5Cr. The Old Regime adds 37% above ₹5Cr; the New Regime caps surcharge at 25%. Real-life calculations also include 'marginal relief' to ensure crossing a surcharge threshold doesn't reduce your post-tax income — most calculators (including this one) approximate this without explicitly modelling it. The 4% Health & Education Cess is then applied on (tax + surcharge).",
  },
  {
    question: "What deductions still apply under the New Regime?",
    answer:
      "Very few. The New Regime allows: standard deduction (₹75K for salaried), employer's NPS contribution under 80CCD(2), and family pension deduction. It does NOT allow: 80C (PPF/ELSS), 80D (medical insurance), HRA exemption, LTA, home loan interest (Section 24), 80E (education loan), and most other Chapter VIA deductions. This is why the Old Regime can still win for people with significant deductions.",
  },
  {
    question: "Are this year's numbers locked in?",
    answer:
      "Slabs above are for FY 2025-26 (AY 2026-27), as per Finance Act 2024. The government can change slabs in the next Union Budget. Always cross-verify against the latest IT Department notification before filing. We update this calculator within a few days of any official rate change.",
  },
];

export default function IncomeTaxCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Income Tax Calculator (FY 2025-26)"
      description={cal.metaDescription}
      intro={
        <p>
          Compare your tax under the New Regime and Old Regime — side by side — for the current financial year. Enter your gross income and deductions, and we&apos;ll show the slab-by-slab tax, the 87A rebate, surcharge, the 4% cess, and a clear recommendation on which regime to pick.
        </p>
      }
      calculator={<IncomeTaxForm />}
      howItWorks={
        <>
          <p>
            Indian income tax is calculated in <strong>slabs</strong>: each slice of income is taxed at a different rate. The tax on your income is the sum of tax on each slab you cross.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`1. Taxable income = gross − standard deduction − (80C + 80D + ... if Old)
2. Slab tax = sum across slabs (income_in_slab × slab_rate)
3. If taxable ≤ rebate threshold:
     tax = 0 (Section 87A)
   Else:
     tax = slab tax
4. If taxable > ₹50L: add surcharge (10% to 37%)
5. Add 4% Health & Education Cess on (tax + surcharge)
6. Take-home = gross − total tax`}</code>
          </pre>
          <p>
            The big change in recent budgets: the New Regime now wins for most people because of the wider slabs, ₹75K standard deduction, and full 87A rebate up to ₹12L taxable income. The Old Regime only beats the New Regime if your deductions stack high (typically ₹4L+).
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>gross annual income</strong> — total CTC minus employer&apos;s PF and gratuity contributions, plus any other income (rental, interest, freelance).
          </li>
          <li>
            Enter your Section 80C investments (PPF, ELSS, EPF, life insurance, principal repayment on home loan). Capped at ₹1.5L.
          </li>
          <li>
            Enter Section 80D — medical insurance premium for self, family, parents.
          </li>
          <li>
            Add up HRA exemption + LTA + home loan interest under Section 24 + 80E (education loan) + 80G (donations) into &quot;other exemptions&quot;.
          </li>
          <li>
            Read the side-by-side comparison and pick the regime with lower tax. You can switch regimes each year (salaried) or stay locked once you opt out (business income).
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
