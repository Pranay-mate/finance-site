import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { SalaryForm } from "./_components/salary-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "salary-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "Why is my take-home so much less than CTC / 12?",
    answer:
      "CTC includes everything the employer pays — including ₹X to your EPF, gratuity provisions, sometimes group insurance and meal coupons. None of that hits your bank monthly. Then your share of EPF (12% of basic), professional tax (₹200/month), and income tax (TDS) are deducted. Typical take-home is 65-75% of CTC depending on your income bracket.",
  },
  {
    question: "How is basic salary determined?",
    answer:
      "Indian companies typically set basic at 40-50% of CTC. Higher basic means higher EPF (good for retirement) but also higher gratuity provisions and professional tax. Lower basic gives you more in-hand cash but less retirement saving. The default in this calculator is 40%, but you can override to match your offer letter.",
  },
  {
    question: "What's the difference between New and Old regime here?",
    answer:
      "Both calculate income tax differently. New regime: wider slabs, higher standard deduction (₹75K), but no 80C, 80D, or HRA exemption. Old regime: tighter slabs, ₹50K standard deduction, but allows 80C/80D/HRA. For most salaried earners with no significant deductions, New regime gives higher take-home. The 'Auto' option picks whichever produces less tax for your specific inputs.",
  },
  {
    question: "How does HRA exemption work?",
    answer:
      "HRA exemption (Old regime only) = minimum of: (a) actual HRA received, (b) 50% of basic in metros / 40% in non-metros, (c) annual rent − 10% of basic. Enter your annual rent paid to claim it. If you don't pay rent (own home, live with parents without rent receipts), you can't claim HRA exemption — your full HRA is taxable.",
  },
  {
    question: "What is professional tax?",
    answer:
      "A small state-level tax on professional income, typically ₹200/month (₹2,400/year) in most states. Some states (Karnataka, Maharashtra, Tamil Nadu, Andhra Pradesh, Telangana, Kerala, West Bengal) charge it. North Indian states like Delhi and UP don't have professional tax. This calculator assumes ₹2,400/year — adjust your expectation if your state has a different rate or no PT at all.",
  },
  {
    question: "Does this account for variable pay / bonus?",
    answer:
      "If your CTC includes variable pay (target bonus / RSUs / commissions), enter your full CTC including that. The calculator treats it as part of the cash CTC. In reality, variable pay is taxed as salary in the year it's actually paid — so if your year-1 actual variable is below target, your take-home will be slightly higher than the calculator shows.",
  },
  {
    question: "What about meal coupons, NPS, and other CTC components?",
    answer:
      "Most companies offer flexi-benefit components (meal coupons, fuel reimbursement, employer NPS under 80CCD(2), broadband, etc.) that can save tax in the Old regime. This calculator uses a simplified structure (basic + HRA + special allowance + employer EPF). For exact numbers, talk to your HR — companies offer significant flexibility in how CTC is structured for tax efficiency.",
  },
];

export default function SalaryCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Salary Calculator (CTC to Take-home)"
      description={cal.metaDescription}
      intro={
        <p>
          Convert your annual CTC into actual monthly take-home. The calculator breaks CTC into basic, HRA, special allowance, and retirals; then deducts your EPF share, professional tax, and income tax under either regime — showing exactly what hits your bank account each month.
        </p>
      }
      calculator={<SalaryForm />}
      howItWorks={
        <>
          <p>
            CTC has three layers — only the bottom one reaches your bank monthly:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Annual CTC
  − Employer EPF (12% of basic)
  − Gratuity provision (4.81% of basic)
  = Annual gross salary on payroll

Annual gross salary
  − Employee EPF (12% of basic)
  − Professional tax (₹2,400/yr)
  − Income tax (per chosen regime)
  = Annual take-home

Monthly take-home = Annual take-home / 12`}</code>
          </pre>
          <p>
            The calculator uses a typical CTC structure: basic = 40% of CTC (configurable), HRA = 50% of basic in metros / 40% in non-metros, and special allowance = whatever&apos;s left. Income tax is computed using our full income-tax engine, which handles slabs, rebates, surcharge, and the 4% cess for both regimes.
          </p>
          <p>
            For Old regime, the calculator can include HRA exemption (Section 10(13A)), 80C investments, and 80D medical insurance — all of which reduce taxable income.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>annual CTC</strong> from your offer letter or appraisal.
          </li>
          <li>
            Set <strong>basic as % of CTC</strong>. Most Indian companies use 40%; some use 50% for senior roles. Check your salary structure document.
          </li>
          <li>
            Pick <strong>metro</strong> if you live in Mumbai / Delhi / Kolkata / Chennai / Bengaluru / Hyderabad / Pune — HRA exemption is more generous in metros.
          </li>
          <li>
            Use <strong>Auto</strong> regime to see which is cheaper. Switch to <strong>Old</strong> if you want to see the deductions effect; the calculator will recommend which to actually pick.
          </li>
          <li>
            For Old regime: add your 80C (PPF/ELSS/insurance), 80D (medical insurance), and annual rent paid. The HRA exemption math runs automatically.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
