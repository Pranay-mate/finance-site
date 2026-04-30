import Link from "next/link";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { articleLd, breadcrumbLd, organizationLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { getArticle, getRelatedArticles } from "@/lib/articles/registry";
import { getCalculator } from "@/lib/calculators/registry";

type ArticleLayoutProps = {
  slug: string;
  children: React.ReactNode;
};

export function ArticleLayout({ slug, children }: ArticleLayoutProps) {
  const article = getArticle(slug);
  if (!article) {
    throw new Error(`No article registered with slug "${slug}".`);
  }

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
    { name: article.title, path: `/learn/${article.slug}` },
  ]);

  const articleSchema = articleLd({
    headline: article.title,
    description: article.metaDescription,
    path: `/learn/${article.slug}`,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate ?? article.publishedDate,
    authorName: SITE.organization.legalName,
  });

  const relatedCalcs = article.relatedCalculators
    .map(getCalculator)
    .filter((c) => c !== undefined);
  const relatedArticles = getRelatedArticles(slug);

  const publishedNice = formatDate(article.publishedDate);
  const updatedNice = article.updatedDate ? formatDate(article.updatedDate) : null;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article>
          <header className="border-b border-border/60">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
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
                    <Link href="/learn" className="hover:text-foreground">
                      Learn
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </li>
                  <li className="text-foreground" aria-current="page">
                    {article.title}
                  </li>
                </ol>
              </nav>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {article.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>{SITE.organization.legalName}</span>
                <span aria-hidden>·</span>
                <time dateTime={article.publishedDate}>
                  Published {publishedNice}
                </time>
                {updatedNice && (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={article.updatedDate}>Updated {updatedNice}</time>
                  </>
                )}
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readingTime} min read
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
            {children}
          </div>
        </article>

        {relatedCalcs.length > 0 && (
          <section className="border-t border-border bg-muted/20">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Run the numbers
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Calculators paired with this article.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedCalcs.map((calc) => (
                  <li key={calc!.slug}>
                    <Link
                      href={`/calculators/${calc!.slug}`}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20"
                    >
                      <div>
                        <p className="font-medium">{calc!.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {calc!.description}
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
        )}

        {relatedArticles.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="text-xl font-semibold tracking-tight">Related articles</h2>
              <ul className="mt-5 space-y-3">
                {relatedArticles.map((rel) => (
                  <li key={rel.slug}>
                    <Link
                      href={`/learn/${rel.slug}`}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20"
                    >
                      <div>
                        <p className="font-medium">{rel.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {rel.description}
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
        )}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
