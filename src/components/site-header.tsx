import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <TrendingUp className="h-4 w-4" aria-hidden />
          </span>
          <span>{SITE.name}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#calculators"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Calculators
          </Link>
          <Link
            href="/learn"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Learn
          </Link>
          <Link
            href="/#faq"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
