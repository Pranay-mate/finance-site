"use client";

import { useMemo, useState } from "react";
import { calculateEmi } from "@/lib/calculators/emi";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import {
  DonutChart,
  DonutLegend,
  type DonutDatum,
} from "@/components/calculator/donut-chart";

const PRINCIPAL_CHART_COLOR = "var(--chart-1)";
const INTEREST_CHART_COLOR = "var(--chart-2)";

export function EmiForm() {
  const [principal, setPrincipal] = useState(2_500_000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () =>
      calculateEmi({
        principal,
        annualRatePercent: annualRate,
        tenureMonths,
      }),
    [principal, annualRate, tenureMonths],
  );

  const donutData: DonutDatum[] = [
    { name: "Principal", value: result.totalPrincipal, color: PRINCIPAL_CHART_COLOR },
    { name: "Interest", value: result.totalInterest, color: INTEREST_CHART_COLOR },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="emi-principal"
          label="Loan amount"
          value={principal}
          min={50_000}
          max={50_000_000}
          step={10_000}
          suffix="INR"
          onChange={setPrincipal}
        />
        <NumberInput
          id="emi-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={1}
          max={24}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
        />
        <NumberInput
          id="emi-tenure"
          label="Loan tenure"
          value={tenureYears}
          min={1}
          max={30}
          step={1}
          suffix="years"
          onChange={setTenureYears}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Monthly EMI",
            value: formatINR(result.emi),
            helpText: `${formatINRCompact(result.totalPrincipal)} principal · ${formatPercent(annualRate, annualRate % 1 === 0 ? 0 : 2)} for ${tenureYears} years`,
          }}
          metrics={[
            {
              label: "Total interest",
              value: formatINR(result.totalInterest),
              emphasis: "primary",
            },
            {
              label: "Total payment",
              value: formatINR(result.totalPayment),
              emphasis: "primary",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Principal vs interest
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Total"
              centerValue={formatINRCompact(result.totalPayment)}
              ariaLabel="Principal vs interest split for the loan"
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
          Year-by-year breakdown
        </h3>
        <BreakdownTable
          columns={[
            { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
            {
              key: "principalPaid",
              label: "Principal paid",
              align: "right",
              render: (r) => formatINR(r.principalPaid),
            },
            {
              key: "interestPaid",
              label: "Interest paid",
              align: "right",
              render: (r) => formatINR(r.interestPaid),
            },
            {
              key: "balance",
              label: "Balance",
              align: "right",
              render: (r) => formatINR(r.balance),
            },
          ]}
          rows={result.yearly}
        />
      </div>
    </div>
  );
}
