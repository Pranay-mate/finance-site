import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Heart } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd, organizationLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `About ${SITE.name}`,
  description: `Why ${SITE.name} exists, who built it, and how the calculators stay accurate. India-first personal-finance tools, free and no-signup.`,
  path: "/about",
  keywords: [
    `about ${SITE.name.toLowerCase()}`,
    "indian personal finance calculator",
    "free financial calculator india",
  ],
});

const PRINCIPLES = [
  {
    Icon: ShieldCheck,
    title: "Math you can verify",
    body: "Every calculator's formula is shown on the page. Outputs are cross-checked against RBI / EPFO / Income Tax Department references. No black-box approximations.",
  },
  {
    Icon: Eye,
    title: "India-first defaults",
    body: "Indian inflation (6%), Indian tax slabs (FY 2025-26), Indian compounding conventions (quarterly for FDs, monthly for SIPs). No copy-pasted US assumptions.",
  },
  {
    Icon: Heart,
    title: "Free forever, no signup",
    body: "No accounts, no upsells, no email gating. Calculations run in your browser. We never log inputs.",
  },
] as const;

export default function AboutPage() {
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              About {SITE.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {SITE.tagline}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Why this site exists</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Most online finance calculators for Indian users are built on
              shaky defaults. They use 3% inflation (a US figure) when India&apos;s
              long-run average is closer to 6%. They show a SIP corpus number
              but don&apos;t check whether it actually survives a 30-year retirement.
              They list "Section 80C" as a feature without explaining how the
              new tax regime makes it irrelevant for most people now.
            </p>
            <p>
              {SITE.name} is an attempt to do this right — calculators that
              are accurate to the rupee, articles that explain the math behind
              them, and content that takes Indian-specific quirks (LTCG
              exemption, RBI inflation targeting, EPF rule changes) seriously.
            </p>
            <p>
              Free, no signup, no ads. The calculations run entirely in your
              browser; we don&apos;t store or transmit your inputs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Principles</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map(({ Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Who built it</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              {SITE.name} is built and maintained by{" "}
              <a
                href="https://pranay-mate.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
              >
                Pranay Mate
              </a>
              , a senior full stack developer working on fintech and
              sports-tech products in India. The site is open about its
              assumptions, formulas, and rate sources — none of which are
              hidden behind a paywall or a registration form.
            </p>
            <p>
              Spotted an error? A bad assumption? An outdated rate? Get in
              touch — corrections usually ship within a few days of being
              flagged.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Get the most out of {SITE.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with the calculators you actually use day-to-day, then
              dive into the long-form articles if you want the why behind the
              numbers.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/#calculators"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Browse calculators
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                Read the guides
              </Link>
            </div>
          </div>
        </section>
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
    </>
  );
}
