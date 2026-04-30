"use client";

import { useMemo, useState } from "react";
import { calculateRealReturn } from "@/lib/calculators/real-return";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import { LineChart } from "@/components/calculator/line-chart";

const NOMINAL_COLOR = "var(--chart-2)";
const REAL_COLOR = "var(--chart-1)";

export function RealReturnForm() {
  const [principal, setPrincipal] = useState(10_00_000);
  const [nominalReturn, setNominalReturn] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [tenureYears, setTenureYears] = useState(20);

  const result = useMemo(
    () =>
      calculateRealReturn({
        principal,
        nominalReturnPercent: nominalReturn,
        inflationRate: inflation,
        tenureYears,
      }),
    [principal, nominalReturn, inflation, tenureYears],
  );

  const lineData = result.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    nominal: Math.round(row.nominalValue),
    real: Math.round(row.realValue),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="rr-principal"
          label="Investment amount"
          value={principal}
          min={1_000}
          max={50_00_00_000}
          step={10_000}
          suffix="INR"
          onChange={setPrincipal}
        />
        <NumberInput
          id="rr-nominal"
          label="Nominal annual return"
          value={nominalReturn}
          min={1}
          max={30}
          step={0.5}
          suffix="%"
          onChange={setNominalReturn}
          helperText="The headline rate (FD, MF returns)"
        />
        <NumberInput
          id="rr-inflation"
          label="Expected inflation"
          value={inflation}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
          onChange={setInflation}
          helperText="India long-run avg ~6%"
        />
        <NumberInput
          id="rr-tenure"
          label="Investment horizon"
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
            label: "Real annual return",
            value: formatPercent(result.realReturnPercent, 2),
            helpText: `Nominal ${formatPercent(nominalReturn, 1)} − inflation ${formatPercent(inflation, 1)} = real ${formatPercent(result.realReturnPercent, 2)} (Fisher equation)`,
          }}
          metrics={[
            {
              label: "Nominal future value",
              value: formatINR(result.nominalFutureValue),
              helpText: "What you'll see in the bank",
              emphasis: "primary",
            },
            {
              label: "Real future value",
              value: formatINR(result.realFutureValue),
              helpText: "Today's purchasing power equivalent",
              emphasis: "primary",
            },
            {
              label: "Lost to inflation",
              value: formatINR(result.inflationDrag),
              helpText: "Future value drag from rising prices",
              emphasis: "primary",
            },
          ]}
        />

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">What this means</p>
          <p className="mt-1">
            {result.realReturnPercent < 0
              ? `Your investment is losing purchasing power. Even though the nominal value grows to ${formatINRCompact(result.nominalFutureValue)}, in today's rupees that's only ${formatINRCompact(result.realFutureValue)} — less than what you started with.`
              : result.realReturnPercent < 2
                ? `You're barely beating inflation. The headline ${formatPercent(nominalReturn, 1)} return looks good, but in real terms you're growing wealth at only ${formatPercent(result.realReturnPercent, 2)}/year.`
                : `Genuine real wealth growth of ${formatPercent(result.realReturnPercent, 2)}/year. Over ${tenureYears} years, that's enough to compound your purchasing power meaningfully.`}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Nominal vs real value over time
          </h3>
          <LineChart
            data={lineData}
            xKey="year"
            series={[
              { key: "nominal", label: "Nominal value", color: NOMINAL_COLOR },
              { key: "real", label: "Real value (today's ₹)", color: REAL_COLOR },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="Nominal vs inflation-adjusted real value"
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
                key: "nominalValue",
                label: "Nominal value",
                align: "right",
                render: (r) => formatINR(r.nominalValue),
              },
              {
                key: "realValue",
                label: "Real value",
                align: "right",
                render: (r) => formatINR(r.realValue),
              },
              {
                key: "cumulativeInflationFactor",
                label: "₹100 buys",
                align: "right",
                render: (r) =>
                  `₹${(100 / r.cumulativeInflationFactor).toFixed(0)} of yr-1 stuff`,
              },
            ]}
            rows={result.schedule}
          />
        </div>
      </div>
    </div>
  );
}
