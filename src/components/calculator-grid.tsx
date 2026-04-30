import Link from "next/link";
import {
  TrendingUp,
  PiggyBank,
  Landmark,
  Receipt,
  Wallet,
  LineChart,
  ArrowRight,
} from "lucide-react";
import {
  CALCULATORS,
  type Calculator,
  type CalculatorCategory,
} from "@/lib/calculators/registry";

const CATEGORY_META: Record<
  CalculatorCategory,
  { label: string; description: string; Icon: typeof TrendingUp }
> = {
  investment: {
    label: "Investment Planning",
    description: "Plan SIPs, lumpsum investments, and withdrawals.",
    Icon: TrendingUp,
  },
  "savings-scheme": {
    label: "Savings Schemes",
    description: "Government-backed schemes with guaranteed returns.",
    Icon: PiggyBank,
  },
  loan: {
    label: "Loans & EMI",
    description: "Work out EMIs, total interest, and amortization.",
    Icon: Landmark,
  },
  tax: {
    label: "Tax",
    description: "Income tax, GST, and deduction calculators.",
    Icon: Receipt,
  },
  deposit: {
    label: "Deposits",
    description: "Fixed and recurring deposit maturity calculators.",
    Icon: Wallet,
  },
  advanced: {
    label: "Advanced",
    description: "Returns analytics for irregular cashflows.",
    Icon: LineChart,
  },
};

const CATEGORY_ORDER: CalculatorCategory[] = [
  "investment",
  "savings-scheme",
  "loan",
  "tax",
  "deposit",
  "advanced",
];

function CalculatorCard({ cal }: { cal: Calculator }) {
  return (
    <Link
      href={`/calculators/${cal.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-foreground/20 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold tracking-tight">{cal.title}</h3>
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{cal.description}</p>
      {cal.status === "planned" && (
        <span className="mt-3 inline-flex w-fit items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Coming soon
        </span>
      )}
    </Link>
  );
}

export function CalculatorGrid() {
  const groups = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    meta: CATEGORY_META[cat],
    items: CALCULATORS.filter((c) => c.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="calculators" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          All calculators
        </h2>
        <p className="mt-3 text-muted-foreground">
          Twelve focused tools that cover the most common money decisions in India — from your first SIP to retirement withdrawals.
        </p>
      </div>

      <div className="space-y-12">
        {groups.map(({ category, meta, items }) => {
          const Icon = meta.Icon;
          return (
            <div key={category}>
              <div className="mb-5 flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{meta.label}</h3>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((cal) => (
                  <CalculatorCard key={cal.slug} cal={cal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
