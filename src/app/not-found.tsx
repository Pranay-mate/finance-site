import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CALCULATORS } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const popular = CALCULATORS.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            We couldn&apos;t find that page.
          </h1>
          <p className="mt-4 text-muted-foreground">
            The page may have moved, or the calculator you&apos;re looking for is still on the way. Try one of these popular tools instead.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
          <h2 className="mb-6 text-center text-lg font-semibold">Popular calculators</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculators/${c.slug}`}
                  className="block rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20"
                >
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
