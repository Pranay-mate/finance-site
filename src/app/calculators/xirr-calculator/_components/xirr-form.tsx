"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { calculateXirr, type CashFlow } from "@/lib/calculators/xirr";
import { formatINR, formatPercent } from "@/lib/format";
import { ResultCard } from "@/components/calculator/result-card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Row = CashFlow & { id: string };

const DEFAULT_ROWS: Row[] = [
  { id: "1", date: "2023-01-01", amount: -100_000 },
  { id: "2", date: "2023-07-01", amount: -50_000 },
  { id: "3", date: "2024-01-01", amount: -50_000 },
  { id: "4", date: "2025-01-01", amount: 250_000 },
];

let nextId = DEFAULT_ROWS.length + 1;

export function XirrForm() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  const result = useMemo(() => {
    const flows = rows
      .filter((r) => r.date && Number.isFinite(r.amount) && r.amount !== 0)
      .map((r) => ({ date: r.date, amount: r.amount }));
    return calculateXirr(flows);
  }, [rows]);

  const totalInvested = rows
    .filter((r) => r.amount < 0)
    .reduce((sum, r) => sum + r.amount, 0);
  const totalReceived = rows
    .filter((r) => r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: String(nextId++), date: new Date().toISOString().slice(0, 10), amount: 0 },
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length <= 2 ? prev : prev.filter((r) => r.id !== id)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <Label className="text-sm font-semibold">Cashflows</Label>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add row
          </button>
        </div>

        <p className="mb-4 text-xs text-muted-foreground">
          Enter every cashflow with its date. Investments are <strong className="text-foreground">negative</strong> (money out), redemptions and current portfolio value are <strong className="text-foreground">positive</strong> (money in).
        </p>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1.2fr_auto] gap-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Date</span>
            <span>Amount (₹)</span>
            <span></span>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_1.2fr_auto] gap-2 rounded-lg border border-border bg-background p-2"
            >
              <input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(row.id, { date: e.target.value })}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              <input
                type="number"
                inputMode="decimal"
                value={row.amount}
                onChange={(e) => updateRow(row.id, { amount: Number(e.target.value) })}
                className={cn(
                  "rounded-md border border-input bg-background px-3 py-1.5 text-right text-sm font-semibold tabular-nums shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  row.amount < 0 && "text-red-600 dark:text-red-400",
                  row.amount > 0 && "text-emerald-700 dark:text-emerald-400",
                )}
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 2}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="Remove row"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Annualised return (XIRR)",
            value: result.converged
              ? formatPercent(result.ratePercent, 2)
              : "—",
            helpText: result.converged
              ? `Iterated ${result.iterations} times to converge`
              : "Need at least one negative and one positive cashflow",
          }}
          metrics={[
            {
              label: "Total invested",
              value: formatINR(Math.abs(totalInvested)),
              emphasis: "primary",
            },
            {
              label: "Total received",
              value: formatINR(totalReceived),
              emphasis: "primary",
            },
            {
              label: "Net gain",
              value: formatINR(totalReceived + totalInvested),
              helpText: "Sum of all positive minus all negative cashflows",
            },
          ]}
        />

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tip</p>
          <p className="mt-1">
            For a portfolio you currently hold, add today&apos;s portfolio value as the final positive cashflow. XIRR will tell you the actual annualised return you&apos;ve earned across all your irregular contributions and withdrawals — exactly what Excel&apos;s XIRR function returns.
          </p>
        </div>
      </div>
    </div>
  );
}
