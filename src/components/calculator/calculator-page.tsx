import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection, type Faq } from "@/components/faq-section";
import { RelatedCalculators } from "./related-calculators";
import {
  breadcrumbLd,
  organizationLd,
  softwareApplicationLd,
} from "@/lib/jsonld";

type CalculatorPageProps = {
  slug: string;
  title: string;
  description: string;
  intro: React.ReactNode;
  calculator: React.ReactNode;
  howItWorks: React.ReactNode;
  howToUse: React.ReactNode;
  faqs: Faq[];
};

export function CalculatorPage({
  slug,
  title,
  description,
  intro,
  calculator,
  howItWorks,
  howToUse,
  faqs,
}: CalculatorPageProps) {
  const path = `/calculators/${slug}`;
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/#calculators" },
    { name: title, path },
  ]);
  const software = softwareApplicationLd({
    name: title,
    description,
    path,
    category: "FinanceApplication",
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link href="/#calculators" className="hover:text-foreground">
                  Calculators
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="text-foreground" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <header className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <div className="mt-4 text-base text-muted-foreground sm:text-lg">{intro}</div>
          </header>
        </div>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{calculator}</section>

        <section className="border-t border-border bg-muted/10">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
              <div className="prose-sm mt-4 space-y-4 text-sm text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]">
                {howItWorks}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How to use</h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/90">{howToUse}</div>
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} />

        <RelatedCalculators slug={slug} />
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
    </>
  );
}
