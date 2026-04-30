import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { FdForm } from "./_components/fd-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "fd-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is FD maturity calculated?",
    answer:
      "Bank FDs use compound interest: Maturity = P × (1 + r/n)^(n×t), where P is the deposit, r is the annual rate, n is the compounding frequency per year, and t is the tenure in years. Most Indian banks compound quarterly (n=4). The interest you earn each quarter is added to the balance, so the next quarter's interest is calculated on a slightly larger amount — that's the magic of compounding.",
  },
  {
    question: "Which compounding frequency do banks use?",
    answer:
      "By default, almost all Indian banks (SBI, HDFC, ICICI, Axis, etc.) compound FD interest quarterly. Some small finance banks and corporate FDs offer monthly compounding, which gives slightly higher returns. Yearly compounding is rare for cumulative FDs but is the default for some senior-citizen schemes. Use the toggle above to compare.",
  },
  {
    question: "What is the difference between nominal and effective rate?",
    answer:
      "The nominal rate is the headline rate the bank advertises (e.g., 7% per annum). The effective annual yield is what you actually earn after compounding (e.g., 7.186% for 7% nominal compounded quarterly). Always compare effective yields, not nominal rates, when shopping across compounding frequencies.",
  },
  {
    question: "How is FD interest taxed?",
    answer:
      "FD interest is taxed as 'income from other sources' at your slab rate. Banks deduct TDS at 10% if interest exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). You can submit Form 15G (15H for seniors) to avoid TDS if your total income is below the taxable limit. Important: TDS is not the final tax — you may owe more or get a refund based on your slab.",
  },
  {
    question: "Are FD returns guaranteed?",
    answer:
      "Yes, FD returns are fixed at the time of booking. Even if interest rates change later, your existing FD continues at the locked-in rate. Deposits are insured up to ₹5 lakh per bank per depositor by DICGC (a subsidiary of RBI). For amounts above ₹5L, consider splitting across banks.",
  },
  {
    question: "Should I pick a cumulative or non-cumulative FD?",
    answer:
      "Cumulative FDs reinvest interest each quarter, paying the full amount at maturity — best for wealth building. Non-cumulative FDs pay out interest monthly, quarterly, half-yearly, or yearly — best if you need regular income (e.g., retirees). This calculator shows cumulative maturity. For a non-cumulative payout calculation, just multiply the principal by the periodic rate.",
  },
  {
    question: "What is premature withdrawal penalty?",
    answer:
      "If you break an FD before maturity, banks usually pay interest at the rate that would have applied for the actual tenure completed, minus a 0.5%-1% penalty. So a 5-year FD broken at year 2 might earn you the 2-year FD rate minus a penalty — almost always less than the original rate. Check the bank's specific premature-withdrawal policy before booking.",
  },
];

export default function FdCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="FD Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Find your fixed-deposit maturity in seconds. Pick a deposit amount, interest rate, tenure, and compounding frequency — see your maturity amount, total interest, and the effective annual yield (what you actually earn after compounding). Defaults match how Indian banks like SBI, HDFC and ICICI calculate FDs.
        </p>
      }
      calculator={<FdForm />}
      howItWorks={
        <>
          <p>
            FD maturity uses the standard <strong>compound interest formula</strong>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`A = P × (1 + r / n) ^ (n × t)

P = principal (deposit amount)
r = annual interest rate (in decimal: 7% → 0.07)
n = compounding periods per year
    monthly = 12, quarterly = 4, half-yearly = 2, yearly = 1
t = tenure in years`}</code>
          </pre>
          <p>
            More frequent compounding gives a higher maturity for the same nominal rate. The <em>effective annual yield</em> tells you what your money is really earning each year:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Effective yield = (1 + r/n)^n − 1`}</code>
          </pre>
          <p>
            For example: 7% nominal compounded quarterly = <strong>7.186%</strong> effective yield. That&apos;s the apples-to-apples number to compare across banks.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>Enter the FD amount you&apos;re planning to deposit.</li>
          <li>
            Enter the interest rate the bank is offering for your tenure bucket. Senior-citizen rates are typically 0.25-0.5% higher.
          </li>
          <li>
            Pick a tenure — most Indian banks support FD tenures from 7 days to 10 years.
          </li>
          <li>
            Choose compounding frequency. <strong>Quarterly is the default</strong> for most banks; switch to monthly only if your bank explicitly offers it.
          </li>
          <li>
            Compare the effective annual yield across different rates and compounding options to find the genuinely best deal.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
