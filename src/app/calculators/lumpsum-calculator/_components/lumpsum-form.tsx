"use client";

import { useMemo, useState } from "react";
import { calculateLumpsum } from "@/lib/calculators/lumpsum";
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

const INVESTED_COLOR = "var(--chart-1)";
const GAIN_COLOR = "var(--chart-2)";

export function LumpsumForm() {
  const [principal, setPrincipal] = useState(100_000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);

  const result = useMemo(
    () =>
      calculateLumpsum({
        principal,
        annualReturnPercent: annualReturn,
        tenureYears,
      }),
    [principal, annualReturn, tenureYears],
  );

  const donutData: DonutDatum[] = [
    { name: "Invested", value: result.totalInvested, color: INVESTED_COLOR },
    { name: "Gain", value: result.totalGain, color: GAIN_COLOR },
  ];

  const lineData = result.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    balance: Math.round(row.closingBalance),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="lumpsum-principal"
          label="Investment amount"
          value={principal}
          min={1_000}
          max={50_000_000}
          step={1_000}
          suffix="INR"
          onChange={setPrincipal}
        />
        <NumberInput
          id="lumpsum-return"
          label="Expected annual return"
          value={annualReturn}
          min={1}
          max={30}
          step={0.1}
          suffix="%"
          onChange={setAnnualReturn}
          helperText="Equity ~12%, hybrid ~10%, debt ~7%"
        />
        <NumberInput
          id="lumpsum-tenure"
          label="Investment horizon"
          value={tenureYears}
          min={1}
          max={40}
          step={1}
          suffix="years"
          onChange={setTenureYears}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Future value",
            value: formatINR(result.futureValue),
            helpText: `${formatINRCompact(principal)} growing at ${formatPercent(annualReturn, annualReturn % 1 === 0 ? 0 : 1)} for ${tenureYears} years`,
          }}
          metrics={[
            {
              label: "Total invested",
              value: formatINR(result.totalInvested),
              emphasis: "primary",
            },
            {
              label: "Estimated gain",
              value: formatINR(result.totalGain),
              emphasis: "primary",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Invested vs estimated gain
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Future value"
              centerValue={formatINRCompact(result.futureValue)}
              ariaLabel="Invested vs gain breakdown"
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
              { key: "balance", label: "Portfolio value", color: "var(--chart-2)" },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="Portfolio value year by year"
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
