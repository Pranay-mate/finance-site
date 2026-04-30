import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { GstForm } from "./_components/gst-form";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators/registry";
import type { Faq } from "@/components/faq-section";

const SLUG = "gst-calculator";
const cal = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: cal.metaTitle,
  description: cal.metaDescription,
  path: `/calculators/${SLUG}`,
  keywords: cal.keywords,
});

const FAQS: Faq[] = [
  {
    question: "How is GST calculated?",
    answer:
      "GST is a percentage added to the base price of goods or services. To add GST: total = base × (1 + rate/100). To extract GST from an inclusive total: base = total / (1 + rate/100), GST = total − base. The standard slabs in India are 0%, 5%, 12%, 18%, and 28%, set by the GST Council.",
  },
  {
    question: "What's the difference between CGST, SGST, and IGST?",
    answer:
      "All three are GST — just collected by different tiers. For intra-state transactions (buyer and seller in the same state), GST splits equally as CGST (Central GST) and SGST (State GST). For inter-state transactions, the full GST is collected as IGST (Integrated GST) by the centre, which then distributes the state's share to the destination state. The buyer's total tax is identical either way.",
  },
  {
    question: "Which slab applies to my product or service?",
    answer:
      "5% — essential goods (sugar, tea, edible oils), economy transport, restaurants without AC. 12% — processed food, business class flights, mobile phones (some categories). 18% — most services (telecom, IT, banking), most consumer goods, restaurants with AC. 28% — luxury items (cars, ACs, refrigerators), demerit goods (tobacco, aerated drinks). Some items are exempt (0%) or zero-rated (exports). The official HSN/SAC code lookup at gst.gov.in is the authoritative source.",
  },
  {
    question: "Can I claim Input Tax Credit (ITC)?",
    answer:
      "Yes, if you're a GST-registered business, you can claim credit for the GST you paid on business purchases against the GST you collected on sales. ITC requires a valid tax invoice, the supplier must have filed their GST returns, and the goods/services must be used for business. Personal purchases don't qualify. Use this calculator to figure the GST component of any invoice.",
  },
  {
    question: "Do I need to register for GST?",
    answer:
      "Yes, if your annual turnover exceeds ₹40 lakh (for goods) or ₹20 lakh (for services), with lower thresholds for some special-category states. Voluntary registration is also allowed, which lets you claim ITC and issue tax invoices. E-commerce sellers must register regardless of turnover. Service providers selling across state lines must register too.",
  },
  {
    question: "How is GST applied on discounts?",
    answer:
      "Pre-invoice discount (shown on the invoice itself): reduces the base, so GST is calculated on the post-discount amount. Post-invoice discount (e.g., volume rebates): GST is on the original invoice amount; the discount can be passed on with a credit note. For consumers, what you see on the bill is the final number — use the 'remove GST' mode of this calculator to extract the base price from any GST-inclusive total.",
  },
  {
    question: "Why is restaurant GST sometimes 5% and sometimes 18%?",
    answer:
      "Restaurants without AC and without alcohol service: 5% GST without ITC. Restaurants with AC: 5% GST without ITC (post-November 2017). Restaurants in 5-star hotels (room tariff > ₹7,500): 18% with ITC. Outdoor catering: 18%. So the 5% you see at most restaurants is GST without input credit — the restaurant pays GST on its own purchases (rent, ingredients) but can't offset it.",
  },
];

export default function GstCalculatorPage() {
  return (
    <CalculatorPage
      slug={SLUG}
      title="GST Calculator"
      description={cal.metaDescription}
      intro={
        <p>
          Add or remove GST from any amount in two clicks. Pick a standard slab (5%, 12%, 18%, 28%), choose intra-state for the CGST + SGST split or inter-state for IGST, and the calculator does the rest. Useful for invoices, expense claims, or just figuring out what an MRP includes.
        </p>
      }
      calculator={<GstForm />}
      howItWorks={
        <>
          <p>The math is simple percentage arithmetic:</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
            <code>{`Add GST (exclusive → inclusive):
  total = base × (1 + rate/100)
  gst = base × (rate/100)

Remove GST (inclusive → exclusive):
  base = total / (1 + rate/100)
  gst = total − base

Intra-state: CGST = SGST = gst / 2
Inter-state: IGST = gst (full)`}</code>
          </pre>
          <p>
            The most common gotcha is the &quot;remove GST&quot; flow: people often subtract <code>rate%</code> from an inclusive amount and get the wrong base. Example: ₹118 inclusive of 18% GST has a base of ₹100 (not ₹96.76). Always divide by <code>(1 + rate/100)</code>.
          </p>
        </>
      }
      howToUse={
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Pick <strong>Add GST</strong> if you have a base price and want the total, or <strong>Remove GST</strong> if you have an inclusive amount and want the base.
          </li>
          <li>Enter the amount.</li>
          <li>Select the GST rate. Most services and consumer goods are at 18%.</li>
          <li>
            Pick <strong>intra-state</strong> (CGST + SGST) for transactions within the same state, or <strong>inter-state</strong> (IGST) for cross-border.
          </li>
          <li>Read off the breakdown — useful for invoices, accounting, and ITC claims.</li>
        </ol>
      }
      faqs={FAQS}
    />
  );
}
