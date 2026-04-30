"use client";

import { useMemo, useState } from "react";
import { calculateSwp } from "@/lib/calculators/swp";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import { LineChart } from "@/components/calculator/line-chart";

const BALANCE_COLOR = "var(--chart-2)";
const WITHDRAWAL_COLOR = "var(--chart-1)";

export function SwpForm() {
  const [corpus, setCorpus] = useState(1_00_00_000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50_000);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [tenureYears, setTenureYears] = useState(25);

  const result = useMemo(
    () =>
      calculateSwp({
        corpus,
        monthlyWithdrawal,
        annualReturnPercent: annualReturn,
        tenureYears,
      }),
    [corpus, monthlyWithdrawal, annualReturn, tenureYears],
  );

  const lineData = result.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    balance: Math.max(0, Math.round(row.closingBalance)),
    withdrawn: Math.round(row.totalWithdrawn),
  }));

  const yearsLasted = result.monthsLasted / 12;
  const longevityHelp = result.depleted
    ? `Corpus depleted after ${yearsLasted.toFixed(1)} years`
    : `Corpus survived all ${tenureYears} years with ${formatINRCompact(result.finalBalance)} remaining`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="swp-corpus"
          label="Initial corpus"
          value={corpus}
          min={1_00_000}
          max={50_00_00_000}
          step={1_00_000}
          suffix="INR"
          onChange={setCorpus}
        />
        <NumberInput
          id="swp-withdrawal"
          label="Monthly withdrawal"
          value={monthlyWithdrawal}
          min={1_000}
          max={20_00_000}
          step={1_000}
          suffix="INR"
          onChange={setMonthlyWithdrawal}
        />
        <NumberInput
          id="swp-return"
          label="Expected annual return"
          value={annualReturn}
          min={0}
          max={20}
          step={0.5}
          suffix="%"
          onChange={setAnnualReturn}
          helperText="Conservative ~7%, balanced ~10%, equity-heavy ~12%"
        />
        <NumberInput
          id="swp-tenure"
          label="Project for"
          value={tenureYears}
          min={1}
          max={50}
          step={1}
          suffix="years"
          onChange={setTenureYears}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: result.depleted ? "Corpus runs out at year" : "Final balance",
            value: result.depleted
              ? yearsLasted.toFixed(1)
              : formatINR(result.finalBalance),
            helpText: longevityHelp,
          }}
          metrics={[
            {
              label: "Total withdrawn",
              value: formatINR(result.totalWithdrawn),
              emphasis: "primary",
            },
            {
              label: "Total growth earned",
              value: formatINR(result.totalGrowth),
              emphasis: "primary",
            },
          ]}
        />
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Corpus and cumulative withdrawals
          </h3>
          <LineChart
            data={lineData}
            xKey="year"
            series={[
              { key: "balance", label: "Remaining balance", color: BALANCE_COLOR },
              { key: "withdrawn", label: "Withdrawn that year", color: WITHDRAWAL_COLOR },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="Corpus balance and yearly withdrawals"
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Year-by-year breakdown
          </h3>
          <BreakdownTable
            columns={[
              { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
              {
                key: "openingBalance",
                label: "Opening",
                align: "right",
                render: (r) => formatINR(r.openingBalance),
              },
              {
                key: "growth",
                label: "Growth",
                align: "right",
                render: (r) => formatINR(r.growth),
              },
              {
                key: "totalWithdrawn",
                label: "Withdrawn",
                align: "right",
                render: (r) => formatINR(r.totalWithdrawn),
              },
              {
                key: "closingBalance",
                label: "Closing",
                align: "right",
                render: (r) =>
                  r.closingBalance <= 0 ? "Depleted" : formatINR(r.closingBalance),
              },
            ]}
            rows={result.schedule}
          />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Sustainability check:</strong>{" "}
          As a rule of thumb, withdrawing more than {formatPercent(annualReturn)} of your corpus per year is unsustainable in real terms (before inflation). For a true safe withdrawal rate, subtract expected inflation from your assumed return. Bengen&apos;s &quot;4% rule&quot; (developed for the US market) suggests 4% annual withdrawal is sustainable for 30+ years; for India, 3.5%-4% is a reasonable starting point given inflation tends to run higher.
        </div>
      </div>
    </div>
  );
}
