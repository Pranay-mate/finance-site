"use client";

import { useMemo, useState } from "react";
import { calculateTaxOptimalWithdrawal } from "@/lib/calculators/tax-optimal-withdrawal";
import { formatINR, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import { cn } from "@/lib/utils";

export function TaxOptimalForm() {
  const [annualExpenses, setAnnualExpenses] = useState(12_00_000);
  const [marginalSlab, setMarginalSlab] = useState(30);

  const [taxFreeAvailable, setTaxFreeAvailable] = useState(30_00_000);
  const [equityAvailable, setEquityAvailable] = useState(1_00_00_000);
  const [equityGainPct, setEquityGainPct] = useState(50);
  const [debtAvailable, setDebtAvailable] = useState(50_00_000);
  const [debtGainPct, setDebtGainPct] = useState(20);

  const result = useMemo(
    () =>
      calculateTaxOptimalWithdrawal({
        annualExpenses,
        marginalSlabPercent: marginalSlab,
        taxFreeAvailable,
        equityAvailable,
        equityUnrealizedGainFraction: equityGainPct / 100,
        debtAvailable,
        debtUnrealizedGainFraction: debtGainPct / 100,
      }),
    [
      annualExpenses,
      marginalSlab,
      taxFreeAvailable,
      equityAvailable,
      equityGainPct,
      debtAvailable,
      debtGainPct,
    ],
  );

  const planRows = [
    {
      bucket: "Tax-free (PPF / EPF / SSY)",
      optimal: result.optimal.fromTaxFree,
      naive: result.naive.fromTaxFree,
      tax: 0,
    },
    {
      bucket: "Equity MF (>1 yr held)",
      optimal: result.optimal.fromEquity,
      naive: result.naive.fromEquity,
      tax: result.optimal.taxOnEquity,
    },
    {
      bucket: "Debt MF (post-Apr 2023)",
      optimal: result.optimal.fromDebt,
      naive: result.naive.fromDebt,
      tax: result.optimal.taxOnDebt,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Withdrawal need
          </h3>
          <NumberInput
            id="to-expenses"
            label="Annual expenses needed (post-tax)"
            value={annualExpenses}
            min={1_00_000}
            max={1_00_00_000}
            step={50_000}
            suffix="INR"
            onChange={setAnnualExpenses}
          />
          <NumberInput
            id="to-slab"
            label="Marginal income tax slab"
            value={marginalSlab}
            min={0}
            max={30}
            step={5}
            suffix="%"
            onChange={setMarginalSlab}
            helperText="0%, 5%, 10%, 15%, 20%, 25%, 30%"
          />
        </div>

        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Available buckets
          </h3>
          <NumberInput
            id="to-taxfree"
            label="Tax-free corpus (PPF / EPF / SSY)"
            value={taxFreeAvailable}
            min={0}
            max={50_00_00_000}
            step={1_00_000}
            suffix="INR"
            onChange={setTaxFreeAvailable}
          />
          <NumberInput
            id="to-equity"
            label="Equity MF balance"
            value={equityAvailable}
            min={0}
            max={50_00_00_000}
            step={1_00_000}
            suffix="INR"
            onChange={setEquityAvailable}
          />
          <NumberInput
            id="to-equity-gain"
            label="Equity unrealized gain (% of balance)"
            value={equityGainPct}
            min={0}
            max={95}
            step={5}
            suffix="%"
            onChange={setEquityGainPct}
            helperText="What % of the balance is profit, not principal"
          />
          <NumberInput
            id="to-debt"
            label="Debt MF balance"
            value={debtAvailable}
            min={0}
            max={50_00_00_000}
            step={1_00_000}
            suffix="INR"
            onChange={setDebtAvailable}
          />
          <NumberInput
            id="to-debt-gain"
            label="Debt unrealized gain (% of balance)"
            value={debtGainPct}
            min={0}
            max={95}
            step={5}
            suffix="%"
            onChange={setDebtGainPct}
          />
        </div>
      </div>

      <ResultCard
        headline={{
          label: "Annual tax saved with optimal plan",
          value: formatINR(result.savings),
          helpText: result.savings > 0
            ? `Optimal: ${formatINR(result.optimal.totalTax)} tax · Naive: ${formatINR(result.naive.totalTax)} tax`
            : "Both plans produce the same tax",
        }}
        metrics={[
          {
            label: "Optimal effective tax rate",
            value: formatPercent(result.optimal.effectiveTaxRatePercent, 2),
            emphasis: "primary",
          },
          {
            label: "Naive effective tax rate",
            value: formatPercent(result.naive.effectiveTaxRatePercent, 2),
            emphasis: "primary",
          },
          {
            label: "Net received (optimal)",
            value: formatINR(result.optimal.netReceived),
            helpText: result.optimal.metExpenseTarget ? "Target met" : "Not enough corpus",
            emphasis: "primary",
          },
        ]}
      />

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold tracking-tight">
          Withdrawal split — Optimal vs Naive
        </h3>
        <BreakdownTable
          columns={[
            { key: "bucket", label: "Bucket", render: (r) => r.bucket },
            {
              key: "optimal",
              label: "Optimal",
              align: "right",
              render: (r) => formatINR(r.optimal),
            },
            {
              key: "naive",
              label: "Naive proportional",
              align: "right",
              render: (r) => formatINR(r.naive),
            },
            {
              key: "tax",
              label: "Tax (optimal)",
              align: "right",
              render: (r) => formatINR(r.tax),
            },
          ]}
          rows={planRows}
        />
      </div>

      <div
        className={cn(
          "rounded-xl border p-4 text-sm",
          result.savings > 0
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border bg-muted/20",
        )}
      >
        <p className="font-semibold">How the optimal plan works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>
            Drain <strong>tax-free</strong> first — zero tax always.
          </li>
          <li>
            Use <strong>equity within the ₹1.25L LTCG exemption window</strong> —
            zero tax up to the exemption.
          </li>
          <li>
            {marginalSlab > 12.5 ? (
              <>
                Take from <strong>equity above exemption</strong> (12.5% LTCG) before debt — equity
                is cheaper than debt at your {marginalSlab}% slab.
              </>
            ) : (
              <>
                Take from <strong>debt</strong> ({marginalSlab}% slab) before equity above
                exemption — debt is cheaper at your slab rate.
              </>
            )}
          </li>
          <li>Use the remaining bucket last — most expensive in tax.</li>
        </ol>
      </div>
    </div>
  );
}
