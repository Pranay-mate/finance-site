import { cn } from "@/lib/utils";

export type ResultMetric = {
  label: string;
  value: string;
  helpText?: string;
  emphasis?: "primary" | "default";
};

type ResultCardProps = {
  headline: { label: string; value: string; helpText?: string };
  metrics?: ResultMetric[];
  className?: string;
};

export function ResultCard({ headline, metrics, className }: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{headline.label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
        {headline.value}
      </p>
      {headline.helpText && (
        <p className="mt-2 text-xs text-muted-foreground">{headline.helpText}</p>
      )}

      {metrics && metrics.length > 0 && (
        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
              <dd
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  m.emphasis === "primary" && "text-foreground",
                )}
              >
                {m.value}
              </dd>
              {m.helpText && (
                <p className="text-xs text-muted-foreground">{m.helpText}</p>
              )}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
