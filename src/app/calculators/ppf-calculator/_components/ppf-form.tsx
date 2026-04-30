"use client";

import { useMemo, useState } from "react";
import {
  calculatePpf,
  PPF_DEFAULT_RATE_PERCENT,
  PPF_MAX_ANNUAL_DEPOSIT,
  PPF_MIN_ANNUAL_DEPOSIT,
  PPF_MIN_TENURE_YEARS,
} from "@/lib/calculators/ppf";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import {
  DonutChart,
  DonutLegend,
  type DonutDatum,
} from "@/components/calculator/donut-chart";
import { LineChart } from "@/components/calculator/line-chart";

const DEPOSIT_COLOR = "var(--chart-1)";
const INTEREST_COLOR = "var(--chart-2)";

export function PpfForm() {
  const [annualDeposit, setAnnualDeposit] = useState(PPF_MAX_ANNUAL_DEPOSIT);
  const [annualRate, setAnnualRate] = useState(PPF_DEFAULT_RATE_PERCENT);
  const [tenureYears, setTenureYears] = useState(PPF_MIN_TENURE_YEARS);

  const result = useMemo(
    () =>
      calculatePpf({
        annualDeposit,
        annualRatePercent: annualRate,
        tenureYears,
      }),
    [annualDeposit, annualRate, tenureYears],
  );

  const donutData: DonutDatum[] = [
    { name: "Total deposited", value: result.totalDeposited, color: DEPOSIT_COLOR },
    { name: "Interest earned", value: result.totalInterest, color: INTEREST_COLOR },
  ];

  const lineData = result.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    deposited: (row.year) * annualDeposit,
    balance: Math.round(row.closingBalance),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="ppf-deposit"
          label="Annual deposit"
          value={annualDeposit}
          min={PPF_MIN_ANNUAL_DEPOSIT}
          max={PPF_MAX_ANNUAL_DEPOSIT}
          step={500}
          suffix="INR"
          onChange={setAnnualDeposit}
          helperText="Min ₹500 · Max ₹1.5L per year"
        />
        <NumberInput
          id="ppf-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={5}
          max={10}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
          helperText={`Current rate: ${PPF_DEFAULT_RATE_PERCENT}%`}
        />
        <NumberInput
          id="ppf-tenure"
          label="Tenure"
          value={tenureYears}
          min={PPF_MIN_TENURE_YEARS}
          max={50}
          step={1}
          suffix="years"
          onChange={setTenureYears}
          helperText="Min 15 years · extend in 5-year blocks"
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Maturity amount",
            value: formatINR(result.maturity),
            helpText: `${formatINR(annualDeposit)}/year · ${formatPercent(annualRate, annualRate % 1 === 0 ? 0 : 2)} for ${tenureYears} years`,
          }}
          metrics={[
            {
              label: "Total deposited",
              value: formatINR(result.totalDeposited),
              emphasis: "primary",
            },
            {
              label: "Interest earned",
              value: formatINR(result.totalInterest),
              emphasis: "primary",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Deposited vs interest earned
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Maturity"
              centerValue={formatINRCompact(result.maturity)}
              ariaLabel="Deposited vs interest earned"
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

      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Growth over time
          </h3>
          <LineChart
            data={lineData}
            xKey="year"
            series={[
              { key: "deposited", label: "Cumulative deposits", color: DEPOSIT_COLOR },
              { key: "balance", label: "Account balance", color: INTEREST_COLOR },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="PPF balance vs deposits year by year"
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
                key: "deposit",
                label: "Deposit",
                align: "right",
                render: (r) => formatINR(r.deposit),
              },
              {
                key: "interestEarned",
                label: "Interest",
                align: "right",
                render: (r) => formatINR(r.interestEarned),
              },
              {
                key: "closingBalance",
                label: "Closing",
                align: "right",
                render: (r) => formatINR(r.closingBalance),
              },
            ]}
            rows={result.schedule}
          />
        </div>
      </div>
    </div>
  );
}
