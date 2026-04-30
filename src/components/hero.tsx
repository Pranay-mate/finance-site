import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Eye } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_top,theme(colors.foreground/5%),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            Free · No signup · Instant results
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Make confident money decisions —
            <span className="text-muted-foreground"> backed by the math.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Accurate, transparent financial calculators for Indian investors. From your first SIP to retirement withdrawals — every formula shown, every assumption disclosed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Explore calculators
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/calculators/mutual-fund-returns-calculator"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted"
            >
              Try MF returns
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              Icon: ShieldCheck,
              title: "Math you can trust",
              body: "Verified against RBI, EPFO, and Income Tax Department references.",
            },
            {
              Icon: Zap,
              title: "Instant results",
              body: "Static, server-rendered pages. No spinners, no signup.",
            },
            {
              Icon: Eye,
              title: "Transparent assumptions",
              body: "Every formula and rate assumption is shown — no black box.",
            },
          ].map(({ Icon, title, body }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
