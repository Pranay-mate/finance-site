import Link from "next/link";
import { SITE } from "@/lib/site";
import { CALCULATORS } from "@/lib/calculators/registry";

export function SiteFooter() {
  const featured = CALCULATORS.slice(0, 6);

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold">{SITE.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{SITE.description}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Popular calculators</p>
            <ul className="mt-3 space-y-2 text-sm">
              {featured.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/calculators/${c.slug}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Resources</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-foreground">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Disclaimer</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Calculators are educational tools. Output is illustrative — not investment advice. Tax rules and interest rates change; always verify with official sources before acting.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.organization.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
