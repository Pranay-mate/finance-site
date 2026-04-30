import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { MfForm } from "./_components/mf-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "mutual-fund-returns-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is SIP future value calculated?",
    answer:
      "SIPs use monthly compounding equivalent of the assumed annual return. Each monthly contribution grows for the remaining months: A = P × ((1+i)^N − 1) / i × (1+i), where P is the monthly SIP, i is the monthly rate (annual ÷ 12 ÷ 100), and N is the tenure in months. We multiply by (1+i) because deposits are made at the start of each month (annuity-due). This matches Groww, ClearTax, and ET Money SIP calculators.",
  },
  {
    question: "SIP or lumpsum — which is better?",
    answer:
      "Mathematically, lumpsum wins if you have the money up front and the market only goes up. In reality, markets are volatile. SIP averages your purchase price across cycles (rupee-cost averaging), so you buy more units when prices are low and fewer when high — this typically beats trying to time the market. SIPs also enforce a savings habit. Use the toggle above to compare directly: a ₹12L lumpsum at 12% for 10 years gives ~₹37L; the same ₹12L spread as ₹10K/month SIP gives ~₹23L because not all money was invested from day one.",
  },
  {
    question: "What return should I assume?",
    answer:
      "Long-run averages for diversified Indian equity mutual funds: 10-13% (CAGR over 15-20 years for index, large-cap, or flexi-cap funds). Hybrid: 8-11%. Debt: 6-8%. Use 12% as the default for equity-heavy portfolios with a 10+ year horizon. For shorter horizons or conservative planning, drop to 8-10%. Don't assume 15%+ unless you have strong reasons — it's possible but uncommon.",
  },
  {
    question: "Can SIP returns be negative?",
    answer:
      "Yes — in any short period (1-3 years), market volatility can leave your SIP value below total invested. Equity SIPs of 5+ years rarely show negative absolute returns historically, and 10+ year SIPs in diversified funds have never been negative in Indian market history. The longer your horizon, the more reliable equity returns become.",
  },
  {
    question: "How is mutual fund growth taxed?",
    answer:
      "Equity funds (≥65% equity): LTCG at 12.5% above ₹1.25L per year for units held >1 year (post-Budget 2024); STCG at 20% for ≤1 year. Debt funds (post April 2023): all gains taxed at slab rate, no indexation, no LTCG benefit. Hybrid funds: equity-oriented hybrids (>65% equity) follow equity rules; balanced/conservative hybrids follow debt rules. The future value shown here is pre-tax — your hand-take will be lower.",
  },
  {
    question: "Should I increase my SIP every year?",
    answer:
      "Yes, ideally. A 'step-up SIP' that grows 10% annually (matching salary growth) significantly outperforms a flat SIP because you're investing more during your peak earning years. Some platforms offer auto step-up. Even a manual annual increase makes a huge difference: ₹10K/month with 10% annual step-up over 25 years at 12% beats a flat ₹25K/month over the same period.",
  },
  {
    question: "Is XIRR the same as the return shown here?",
    answer:
      "No. XIRR is for irregular cashflows (lumpsum top-ups, partial redemptions, missed SIPs). For a clean monthly SIP at a constant amount, the assumed annual return here approximates XIRR closely. For real-world portfolios with unequal contributions, use the XIRR calculator — it solves for the actual rate that makes all your cashflows balance.",
  },
];

export default function MfReturnsCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="Mutual Fund Returns Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Project the future value of mutual fund investments — both SIP and lumpsum. Compare what your monthly SIP could grow into over 10, 20, or 30 years, or estimate returns on a one-time fund purchase. Built for Indian equity, hybrid, and debt mutual funds.
        </p>
      }
      calculator={<MfForm />}
      howItWorks={
        <>
          <p>
            Both SIP and lumpsum projections use compound interest, but with different formulas:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Lumpsum (annual compounding):
A = P × (1 + r) ^ t

SIP (monthly compounding, annuity-due):
A = P × ((1 + i)^N − 1) / i × (1 + i)
where i = r / 12 (monthly rate)
      N = tenure in months
      P = monthly SIP installment`}</code>
          </pre>
          <p>
            For SIPs the first installment compounds for the full tenure; the last for just one month. That&apos;s why a SIP earns less than a lumpsum of the same total amount over the same period — but it&apos;s also why SIPs are more forgiving when markets are volatile.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>Pick <strong>SIP</strong> or <strong>Lumpsum</strong> depending on how you invest.</li>
          <li>
            Enter the monthly SIP amount (or lumpsum amount). Most platforms allow SIPs from ₹500.
          </li>
          <li>
            Set the expected annual return. <strong>10-12% is reasonable for equity funds</strong>; use 8-10% for conservative planning or hybrid funds.
          </li>
          <li>
            Choose your investment horizon. Equity funds need 5-7+ years to absorb volatility — longer is much better for compounding.
          </li>
          <li>
            Compare the &quot;Invested vs Returns&quot; donut: in a 20+ year SIP at 12%, returns typically dwarf the principal — that&apos;s the power of long-horizon compounding.
          </li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
