import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { EligibilityForm } from "./_components/eligibility-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "home-loan-eligibility-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "What is FOIR and why does it matter?",
    answer:
      "FOIR (Fixed Obligations to Income Ratio) is the percentage of your net monthly income that lenders allow to go toward all loan EMIs combined — including the new home loan. Most Indian banks cap FOIR at 50% for incomes ₹50k–₹1L, 55% for ₹1L–₹2L, and 60–65% for ₹2L+. If your existing EMIs already use 30% of income, only 20% is left for a new home loan EMI.",
  },
  {
    question: "How is the maximum loan amount calculated?",
    answer:
      "First, the bank computes the maximum EMI you can afford = (income × FOIR) − existing EMIs. Then it reverses the standard reducing-balance EMI formula to find the principal that produces that EMI at the given rate and tenure: max loan = max EMI × ((1+r)^n − 1) / (r × (1+r)^n), where r is the monthly rate and n is tenure in months.",
  },
  {
    question: "What's a typical FOIR cap by Indian banks?",
    answer:
      "HDFC: 50% standard, 55–65% for high earners. SBI: 50–60% based on income. ICICI: 50% standard. Bank of Baroda: 40–50%. PNB: 50%. Salaried with ₹10L+ annual income usually get the higher caps. Self-employed are typically 5–10 percentage points lower than salaried at the same income.",
  },
  {
    question: "Do banks include credit card outstanding as 'existing EMI'?",
    answer:
      "Banks count 5% of your credit card limit (or your actual minimum due, whichever is higher) as a recurring monthly obligation, even if you pay your card off in full each month. So a ₹5L credit limit reduces your eligibility by ₹25,000 of monthly EMI capacity. To maximise eligibility before applying, request a temporary credit limit reduction or close unused cards.",
  },
  {
    question: "Why does longer tenure increase eligibility?",
    answer:
      "A longer tenure spreads the principal over more EMIs, so each EMI becomes smaller. Since the bank checks whether the EMI fits in your FOIR cap, a smaller EMI means a larger principal can fit. A 30-year tenure typically increases eligibility by 30–40% versus a 20-year tenure at the same rate. The trade-off is much higher total interest paid.",
  },
  {
    question: "Should I borrow my maximum eligibility?",
    answer:
      "No. Eligibility is a ceiling, not a recommendation. A common rule: keep total EMIs (including the new home loan) under 40% of net income — well below the bank's 50–60% cap. This leaves room for emergencies, prepayments, and lifestyle spending. The number this calculator shows is what banks will lend; what you can comfortably afford is usually 60–80% of that.",
  },
  {
    question: "What income do banks consider — gross or net?",
    answer:
      "Indian banks use net monthly income — that is, take-home salary after tax, EPF, and other deductions. They start from gross CTC, subtract income tax (under whichever regime applies), employee EPF contribution, and professional tax. Some banks also subtract LTA, voluntary EPF, or NPS contributions. Use our Salary Calculator to estimate your net income from a CTC figure before plugging it in here.",
  },
  {
    question: "What about co-applicants?",
    answer:
      "Adding a co-applicant (spouse / parent / sibling) lets the bank pool both incomes. Each person's existing EMIs are subtracted, then the combined FOIR cap is applied. Two earners with ₹1L each and no existing EMIs typically qualify for ~75% more loan than one earner with ₹1L. To model this, use the combined net monthly income and combined existing EMIs as inputs.",
  },
  {
    question: "Is processing fee or stamp duty included in the loan?",
    answer:
      "No. Banks lend up to 80% of property value (sometimes 85–90% for first-time buyers / Pradhan Mantri Awas Yojana borrowers) of the agreement value. Stamp duty (5–7% of property), registration (1%), processing fee (0.5–1% of loan), and GST on processing fee are paid separately by the buyer. Budget for these on top of the down payment.",
  },
];

export default function HomeLoanEligibilityPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Home Loan Eligibility Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Find the maximum home loan you can borrow based on your salary, existing EMIs, and the lender&apos;s FOIR cap. Uses the same model as HDFC, SBI, and ICICI — net monthly income × FOIR percentage minus existing EMIs, reverse-engineered to a principal at your interest rate and tenure.
        </p>
      }
      calculator={<EligibilityForm />}
      howItWorks={
        <>
          <p>
            Lenders use the <strong>FOIR</strong> (Fixed Obligations to Income Ratio) framework:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`max EMI    = (net monthly income × FOIR%) − existing EMIs

max loan   = max EMI × ((1 + r)^n − 1)
             ─────────────────────────
                 r × (1 + r)^n

r = monthly interest rate = annual rate ÷ 12 ÷ 100
n = tenure in months`}</code>
          </pre>
          <p>
            FOIR caps vary by bank and income tier — typically <strong>50%</strong> for ₹50k–₹1L net income, <strong>55%</strong> for ₹1L–₹2L, and <strong>60–65%</strong> for ₹2L+. The default 50% is the safe baseline most lenders apply.
          </p>
          <p>
            The property budget assumes a <strong>20%</strong> down payment by default — banks typically lend up to 80% of property value. Adjust the slider for first-time-buyer schemes that allow 85–90% LTV.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Enter your <strong>net monthly income</strong> (take-home salary, not CTC). Use our Salary Calculator if you only know your CTC.
          </li>
          <li>
            Enter your existing monthly EMI obligations — other loans, credit card minimum dues, EMI on appliances. Banks also count 5% of credit card limits as a phantom EMI.
          </li>
          <li>
            Set the interest rate quoted by your bank (typically 8.5–9.5% for home loans in 2026).
          </li>
          <li>
            Pick a tenure. Longer tenure = bigger eligible loan but much more interest. Most home loans are 20–30 years.
          </li>
          <li>
            Adjust the FOIR cap if you know your income tier&apos;s actual cap. Default 50% is conservative.
          </li>
          <li>
            Read the maximum loan amount and total property budget. Then use the EMI Calculator to see what your actual EMI will look like at different loan sizes.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
