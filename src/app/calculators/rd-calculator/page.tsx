import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { RdForm } from "./_components/rd-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "rd-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is RD maturity calculated?",
    answer:
      "Recurring deposits use quarterly compounding on a monthly contribution. The standard formula treats each month's deposit as growing for the remaining tenure at the equivalent monthly rate m = (1 + r/4)^(1/3) − 1. The closed-form maturity is A = R × (1 + m) × ((1 + m)^N − 1) / m, where R is the monthly deposit and N is the tenure in months.",
  },
  {
    question: "What's the difference between RD and FD?",
    answer:
      "An FD is a single lump-sum deposit; an RD is a series of monthly deposits. RDs are perfect for building a habit of saving when you don't have a lump sum to invest. FDs typically earn slightly more for the same tenure because the entire principal is earning interest from day one, whereas in an RD only the early deposits enjoy the full tenure of compounding.",
  },
  {
    question: "Can I miss an RD installment?",
    answer:
      "Most banks allow you to miss one or two payments but charge a small late-payment penalty (often ₹1.50 per ₹100 per month of default). If you miss more than 6 consecutive payments, the bank may close the RD and pay only savings-account-rate interest. Set up auto-debit to avoid this.",
  },
  {
    question: "How is RD interest taxed?",
    answer:
      "RD interest is taxed at your income-tax slab rate, just like FD interest. Banks deduct TDS at 10% if total interest from RDs and FDs at that bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). You can submit Form 15G/15H to avoid TDS if your total income is below the taxable limit.",
  },
  {
    question: "What is the minimum and maximum RD tenure?",
    answer:
      "Most Indian banks offer RD tenures from 6 months to 10 years, in multiples of 3 months. Post Office RDs are fixed at 5 years. The most popular tenures are 1, 3, and 5 years.",
  },
  {
    question: "Can I withdraw an RD before maturity?",
    answer:
      "Yes, but with a penalty. Most banks pay interest at the rate applicable for the actual tenure completed, minus a 1% penalty. So a 5-year RD broken at year 2 might earn you the 2-year rate minus 1%. You'll get back your principal plus reduced interest. Some banks allow partial withdrawals; check your bank's specific rules.",
  },
  {
    question: "Why does this calculator's value differ slightly from my bank's?",
    answer:
      "Banks use different internal rounding rules for partial-quarter interest (some pro-rate by days, some by months). Our calculator uses the mathematically clean equivalent-monthly-rate model, which typically lands within ±0.1% of any bank's actual maturity figure. The difference is usually a few hundred rupees on a multi-lakh maturity.",
  },
];

export default function RdCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="RD Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Calculate the maturity value of a recurring deposit. RDs are great for building a savings habit — you commit to a fixed monthly deposit, and the bank pays compound interest at quarterly rests (the same convention SBI, HDFC and India Post follow).
        </p>
      }
      calculator={<RdForm />}
      howItWorks={
        <>
          <p>
            Banks compound RD interest <strong>quarterly</strong>, but you deposit monthly. The clean way to model this is with an equivalent monthly rate <code>m</code> that, when compounded for 3 months, equals the quarterly rate:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`m = (1 + r/4)^(1/3) − 1

Each monthly deposit R grows for the remaining months at rate m:
A = R × (1 + m) + R × (1 + m)^2 + ... + R × (1 + m)^N

Closed form (annuity-due):
A = R × (1 + m) × ((1 + m)^N − 1) / m

R = monthly deposit, r = annual rate (decimal), N = tenure in months.`}</code>
          </pre>
          <p>
            The first deposit grows for the full tenure; the last deposit grows for just one month. That&apos;s why the same monthly amount in an RD earns less than the same lump sum in an FD over the same tenure.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your monthly deposit. Most banks accept ₹500-₹1L per month.
          </li>
          <li>
            Enter the RD interest rate offered by your bank for the chosen tenure. Senior citizens get an extra 0.25-0.50%.
          </li>
          <li>
            Pick the tenure. Common choices: 1 year, 3 years, 5 years.
          </li>
          <li>
            Read the maturity, total invested, and total interest earned. The year-by-year table shows how interest accelerates as the balance grows.
          </li>
          <li>
            Compare against the FD calculator for the same total commitment — for many goals, an FD&apos;s lump-sum convenience and slightly higher returns make it the better choice if you have the money up front.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
