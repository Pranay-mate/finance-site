import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { EpfForm } from "./_components/epf-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "epf-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is EPF and how does it work?",
    answer:
      "EPF (Employees' Provident Fund) is a mandatory retirement savings scheme run by EPFO for salaried employees of organisations with 20+ employees. You contribute 12% of basic + DA each month; your employer also contributes 12%. The balance earns annual interest (currently 8.25%, set yearly by EPFO). The full corpus is paid out at retirement (age 58/60) — tax-free if you've been a member for 5+ years.",
  },
  {
    question: "Are employee and employer contributions both 12%?",
    answer:
      "Both nominal contributions are 12% of basic + DA. However, of the employer's 12%, 8.33% (capped at ₹1,250/month for the ₹15,000 wage ceiling) goes to the EPS (Employees' Pension Scheme) instead of EPF. Only 3.67% of basic goes to your EPF passbook. For salaries above the ₹15K ceiling, the EPS share stays capped, so the EPF portion of the employer share grows. This calculator simplifies by treating the full 12% as EPF — which slightly overstates the corpus but matches Groww/ClearTax's simplified view. Subtract roughly 8.33% × ₹15,000 × 12 × years for a precise EPS-corrected corpus.",
  },
  {
    question: "What is the current EPF interest rate?",
    answer:
      "8.25% per annum for FY 2024-25, declared by EPFO Central Board of Trustees and notified by the Ministry of Labour & Employment. Historical rates: 8.10% (FY23-24), 8.10% (FY22-23), 8.50% (FY21-22), 8.50% (FY20-21), 8.50% (FY19-20). The rate is reviewed annually and depends on EPFO's investment returns.",
  },
  {
    question: "Is EPF tax-free?",
    answer:
      "Yes, with conditions. (1) Employee contributions qualify for Section 80C (Old regime, up to ₹1.5L). (2) Interest earned is tax-free up to ₹2.5L of contributions per year (₹5L if employer doesn't contribute) — interest on excess is taxable from FY21-22. (3) Maturity is fully tax-free if you've been a member for 5+ continuous years. Withdrawals before 5 years are taxed as salary income, with TDS at 10%.",
  },
  {
    question: "Can I withdraw EPF before retirement?",
    answer:
      "Partial withdrawals are allowed for specific reasons after a minimum service period: home purchase/construction (after 5 years, up to 36× monthly wages), home loan repayment (after 10 years), wedding (after 7 years, up to 50% of employee share), education (after 7 years), medical emergency (any time, up to 6× wages or employee share). Full withdrawal is allowed only after 2 months of unemployment or at retirement. Early full withdrawal before 5 years of service is taxable.",
  },
  {
    question: "What happens to EPF when I change jobs?",
    answer:
      "Use UAN (Universal Account Number) to transfer your EPF balance from the old employer to the new one — never withdraw. Multiple withdrawals over a career break the 5-year continuous-service rule (making the next withdrawal taxable) and break compounding. Online transfer takes 2-15 days. Unclaimed EPF accounts continue to earn interest until age 58, after which they stop accruing if no claim is filed.",
  },
  {
    question: "EPF vs PPF — which is better?",
    answer:
      "EPF wins on rate of return (~8.25% vs PPF's 7.1%) and the employer match is essentially free money. PPF wins on flexibility (open to anyone, voluntary contribution, can extend indefinitely). For salaried employees: max out EPF first (it's automatic and matched), then add PPF and ELSS to fill 80C and grow the corpus. Self-employed and freelancers should rely on PPF + NPS + ELSS instead.",
  },
];

export default function EpfCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="EPF Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Project your Employees&apos; Provident Fund corpus at retirement. EPF combines forced monthly savings with employer match and tax-free compounding — for most salaried Indians, it&apos;s the single largest retirement asset. Default rate (8.25%) matches the latest EPFO notification for FY 2024-25.
        </p>
      }
      calculator={<EpfForm />}
      howItWorks={
        <>
          <p>
            EPF math combines a growing salary, monthly contributions, and annual compounding:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Each year:
  monthly contribution = (12% employee + 12% employer) × monthly basic
  end-of-year balance =
    opening × (1 + r)
    + monthly contribution × ((1 + r/12)^12 − 1) / (r/12) × (1 + r/12)

After year-end:
  monthly basic *= (1 + salary growth)`}</code>
          </pre>
          <p>
            Your contribution is fixed at 12% of basic + DA. Your employer&apos;s 12% is split: 8.33% (capped at ₹1,250/month) goes to the Employees&apos; Pension Scheme; the remainder goes to EPF. This calculator simplifies that — see the FAQ for a precise EPS adjustment.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your current monthly <strong>basic + DA</strong> (not gross). EPF contributions are calculated on basic, not on full CTC.
          </li>
          <li>
            Set your current age and target retirement age (default: 60).
          </li>
          <li>
            Enter your expected annual salary growth. Use 8-10% for typical white-collar roles, 12-15% for fast-track tech/finance, 5-7% for stable PSU jobs.
          </li>
          <li>
            Use the default EPFO rate of 8.25%, or override to model historical or hypothetical scenarios.
          </li>
          <li>
            Enter your current EPF balance (check your last EPFO statement or UAN passbook). Existing balance compounds alongside new contributions.
          </li>
          <li>
            Notice how interest earned typically equals or exceeds total contributions for service longer than 25 years — that&apos;s why staying invested through job changes (transfer, don&apos;t withdraw) matters so much.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
