import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { CalculatorGrid } from "@/components/calculator-grid";
import { FaqSection, type Faq } from "@/components/faq-section";
import { buildMetadata } from "@/lib/seo";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `${SITE.name} — Free Financial Calculators for Indian Investors`,
  description: SITE.description,
  path: "/",
  keywords: [
    "financial calculator",
    "sip calculator",
    "ppf calculator",
    "income tax calculator",
    "emi calculator",
    "fd calculator",
    "india",
  ],
});

const HOMEPAGE_FAQS: Faq[] = [
  {
    question: "Are these calculators free to use?",
    answer:
      "Yes. Every calculator on this site is free, requires no signup, and shows results instantly. We never store your inputs.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Each calculator is verified against official sources (RBI, EPFO, India Post, Income Tax Department) with multiple test cases. Where rates change yearly (PPF, EPF, SSY), the latest official rate is the default — but you can override any input.",
  },
  {
    question: "Is this investment advice?",
    answer:
      "No. The calculators are educational tools that show what is mathematically possible given your inputs. Actual returns vary, taxes change, and personal circumstances differ. Always consult a SEBI-registered investment adviser before acting.",
  },
  {
    question: "Do you store the numbers I enter?",
    answer:
      "No. Calculations run in your browser. We do not log inputs, outputs, or attach them to any account.",
  },
  {
    question: "Which Indian financial year do tax calculators use?",
    answer:
      "Income tax calculators default to the current financial year's rules. We update slabs, deductions, and surcharges within a few days of any official notification.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CalculatorGrid />
        <FaqSection faqs={HOMEPAGE_FAQS} />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
      />
    </>
  );
}
