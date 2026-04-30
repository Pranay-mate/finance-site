import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buildMetadata } from "@/lib/seo";
import {
  liveArticles,
  articlesByCategory,
  type ArticleCategory,
} from "@/lib/articles/registry";
import { breadcrumbLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Learn — Long-form guides on Indian personal finance",
  description:
    "In-depth, numbers-first articles on investing, tax, retirement and wealth building in India. Each guide is paired with calculators so you can run the numbers as you read.",
  path: "/learn",
  keywords: [
    "personal finance india",
    "investing guides",
    "tax planning india",
    "fire india",
  ],
});

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  investing: "Investing",
  tax: "Tax planning",
  retirement: "Retirement & FIRE",
  savings: "Savings",
  loans: "Loans & EMI",
};

const CATEGORY_ORDER: ArticleCategory[] = [
  "investing",
  "tax",
  "retirement",
  "savings",
  "loans",
];

export default function LearnHubPage() {
  const articles = liveArticles();
  const groups = articlesByCategory();
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Learn
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Long-form guides on Indian personal finance. Every article is paired with one or more calculators so you can run the numbers as you read.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"} published
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {CATEGORY_ORDER.map((category) => {
            const items = groups[category];
            if (!items || items.length === 0) return null;
            return (
              <div key={category} className="mb-12">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {CATEGORY_LABELS[category]}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {items.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/learn/${article.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/20 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" aria-hidden />
                            {article.readingTime} min read
                          </span>
                          <span aria-hidden>·</span>
                          <time dateTime={article.publishedDate}>
                            {new Date(article.publishedDate).toLocaleDateString(
                              "en-IN",
                              { month: "short", day: "numeric", year: "numeric" },
                            )}
                          </time>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold tracking-tight transition group-hover:text-foreground">
                          {article.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">
                          {article.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                          Read article
                          <ArrowRight
                            className="h-4 w-4 transition group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
