import { faqLd } from "@/lib/jsonld";

export type Faq = { question: string; answer: string };

export function FaqSection({
  id = "faq",
  heading = "Frequently asked questions",
  faqs,
}: {
  id?: string;
  heading?: string;
  faqs: Faq[];
}) {
  return (
    <section id={id} className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
      <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
              {faq.question}
              <span
                aria-hidden
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }}
      />
    </section>
  );
}
