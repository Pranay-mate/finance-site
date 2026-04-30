import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedCalculators } from "@/lib/calculators/registry";

export function RelatedCalculators({ slug }: { slug: string }) {
  const related = getRelatedCalculators(slug);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
          Related calculators
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((cal) => (
            <li key={cal.slug}>
              <Link
                href={`/calculators/${cal.slug}`}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20"
              >
                <div>
                  <p className="font-medium">{cal.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cal.description}
                  </p>
                </div>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
