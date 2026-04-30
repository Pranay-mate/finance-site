"use client";

import { useMemo, useState } from "react";
import { calculateRd } from "@/lib/calculators/rd";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import {
  DonutChart,
  DonutLegend,
  type DonutDatum,
} from "@/components/calculator/donut-chart";

const INVESTED_COLOR = "var(--chart-1)";
const INTEREST_COLOR = "var(--chart-2)";

export function RdForm() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5_000);
  const [annualRate, setAnnualRate] = useState(7);
  const [tenureYears, setTenureYears] = useState(5);

  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () =>
      calculateRd({
        monthlyDeposit,
        annualRatePercent: annualRate,
        tenureMonths,
      }),
    [monthlyDeposit, annualRate, tenureMonths],
  );

  const donutData: DonutDatum[] = [
    { name: "Total invested", value: result.totalInvested, color: INVESTED_COLOR },
    { name: "Interest earned", value: result.totalInterest, color: INTEREST_COLOR },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="rd-deposit"
          label="Monthly deposit"
          value={monthlyDeposit}
          min={500}
          max={500_000}
          step={500}
          suffix="INR"
          onChange={setMonthlyDeposit}
        />
        <NumberInput
          id="rd-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={1}
          max={12}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
        />
        <NumberInput
          id="rd-tenure"
          label="Tenure"
          value={tenureYears}
          min={0.5}
          max={10}
          step={0.5}
          suffix="years"
          onChange={setTenureYears}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Maturity amount",
            value: formatINR(result.maturity),
            helpText: `${formatINR(monthlyDeposit)}/month · ${formatPercent(annualRate, annualRate % 1 === 0 ? 0 : 2)} for ${tenureYears} years (quarterly compounding)`,
          }}
          metrics={[
            {
              label: "Total invested",
              value: formatINR(result.totalInvested),
              emphasis: "primary",
            },
            {
              label: "Total interest earned",
              value: formatINR(result.totalInterest),
              emphasis: "primary",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Invested vs interest earned
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Maturity"
              centerValue={formatINRCompact(result.maturity)}
              ariaLabel="Total invested vs interest earned"
            />
            <DonutLegend
              items={donutData.map((d) => ({
                ...d,
                name: `${d.name} — ${formatINR(d.value)}`,
              }))}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h3 className="mb-3 text-lg font-semibold tracking-tight">
          Year-by-year growth
        </h3>
        <BreakdownTable
          columns={[
            { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
            {
              key: "invested",
              label: "Total invested",
              align: "right",
              render: (r) => formatINR(r.invested),
            },
            {
              key: "interestEarned",
              label: "Interest earned",
              align: "right",
              render: (r) => formatINR(r.interestEarned),
            },
            {
              key: "closingBalance",
              label: "Closing balance",
              align: "right",
              render: (r) => formatINR(r.closingBalance),
            },
          ]}
          rows={result.schedule}
        />
      </div>
    </div>
  );
}
