import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { SsyForm } from "./_components/ssy-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "sukanya-samriddhi-yojana-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is Sukanya Samriddhi Yojana?",
    answer:
      "SSY is a Government of India small-savings scheme launched in 2015 specifically for the girl child. Parents/guardians can open an account in the daughter's name before she turns 10. The scheme offers one of the highest guaranteed rates among Indian small-savings products (currently 8.2%) and full EEE tax benefits — making it one of the best long-term savings vehicles for funding a daughter's higher education or marriage.",
  },
  {
    question: "What is the current SSY interest rate?",
    answer:
      "8.2% per annum, compounded annually. The rate is reviewed quarterly by the Ministry of Finance. SSY rates are typically pegged 0.50-0.75% above the 10-year G-Sec yield, making it more attractive than PPF (currently 7.1%) and FDs.",
  },
  {
    question: "What are the deposit limits?",
    answer:
      "Minimum ₹250 per year. Maximum ₹1,50,000 per year. Deposits can be made in any number of instalments (no minimum frequency). The total deposit limit is per beneficiary (the girl child), not per parent — so opening multiple accounts for the same daughter doesn't increase the cap.",
  },
  {
    question: "When can I withdraw the SSY balance?",
    answer:
      "The account matures 21 years after opening, regardless of the daughter's age. After that, the entire balance is paid out — tax-free. Premature partial withdrawal: up to 50% of the previous year's balance is allowed after the daughter turns 18, specifically for higher education or marriage. Premature closure is allowed for genuinely exceptional reasons (death of holder, medical emergency, account holder's marriage after 18).",
  },
  {
    question: "How is SSY taxed?",
    answer:
      "Full EEE — Exempt-Exempt-Exempt: (1) Deposits qualify for Section 80C deduction up to ₹1.5L (Old regime only — the New regime doesn't allow this). (2) Interest earned is tax-free every year. (3) Maturity proceeds are tax-free. This is the same tax category as PPF and EPF — among the most generous treatments in Indian tax law.",
  },
  {
    question: "How many SSY accounts can a family open?",
    answer:
      "One account per girl child, maximum two girl children per family. An exception is granted for twins/triplets — proof required. So a typical family with two daughters can have two SSY accounts; a family with twins as the second pregnancy can have three. Each account gets its own ₹1.5L deposit limit.",
  },
  {
    question: "SSY vs PPF for a daughter — which is better?",
    answer:
      "SSY usually wins for daughters under 10: higher rate (8.2% vs 7.1% PPF), same EEE tax treatment, and goal-aligned (matures around the time you'd need money for higher education or marriage). PPF wins on flexibility — no age restriction, can be opened for anyone, can be extended in 5-year blocks. A common strategy: open SSY for daughters under 10 and PPF for additional contributions or for sons.",
  },
];

export default function SsyCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Sukanya Samriddhi Yojana Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Plan your daughter&apos;s future with India&apos;s most attractive girl-child savings scheme. SSY combines a high government-backed rate (8.2%), full EEE tax treatment, and a 21-year goal-aligned tenure that matures right when you&apos;ll likely need funds for higher education or marriage.
        </p>
      }
      calculator={<SsyForm />}
      howItWorks={
        <>
          <p>
            SSY uses annual compounding with deposits made for the first 15 years only. From year 16 to year 21, the balance keeps compounding without any further contributions:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Years 1-15:
  closing_balance = (opening + annual_deposit) × (1 + r)

Years 16-21 (no deposits):
  closing_balance = opening × (1 + r)

r = annual rate (decimal: 8.2% → 0.082)
Maturity = closing balance after year 21`}</code>
          </pre>
          <p>
            Like PPF, the calculator assumes deposits at the start of the financial year — the optimal strategy because the full amount earns interest for all 12 months. The official rule is that interest is calculated on the lowest balance between the 5th and last day of each month, so depositing early in April maximises returns.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Set the annual deposit amount. Most families max it out at ₹1.5L for the full Section 80C benefit.
          </li>
          <li>
            Enter your daughter&apos;s current age. SSY accounts must be opened before age 10.
          </li>
          <li>
            Use the default rate (8.2%) or override it. Historical SSY rates have varied from 7.6% to 9.2%.
          </li>
          <li>
            Read the maturity figure — that&apos;s what your daughter receives at year 21 from account opening.
          </li>
          <li>
            Compare with PPF Calculator at ₹1.5L/year — SSY typically returns 30-40% more over the same horizon thanks to the rate differential.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
