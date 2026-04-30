"use client";

import { useMemo, useState } from "react";
import {
  calculateSsy,
  SSY_DEFAULT_RATE_PERCENT,
  SSY_MAX_ANNUAL_DEPOSIT,
  SSY_MIN_ANNUAL_DEPOSIT,
} from "@/lib/calculators/ssy";
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

export function SsyForm() {
  const [annualDeposit, setAnnualDeposit] = useState(SSY_MAX_ANNUAL_DEPOSIT);
  const [girlChildAge, setGirlChildAge] = useState(5);
  const [annualRate, setAnnualRate] = useState(SSY_DEFAULT_RATE_PERCENT);

  const result = useMemo(
    () =>
      calculateSsy({
        annualDeposit,
        girlChildAge,
        annualRatePercent: annualRate,
      }),
    [annualDeposit, girlChildAge, annualRate],
  );

  const donutData: DonutDatum[] = [
    { name: "Total deposited", value: result.totalDeposited, color: DEPOSIT_COLOR },
    { name: "Interest earned", value: result.totalInterest, color: INTEREST_COLOR },
  ];

  const lineData = result.schedule.map((row) => ({
    age: `Age ${row.age}`,
    balance: Math.round(row.closingBalance),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="ssy-deposit"
          label="Annual deposit"
          value={annualDeposit}
          min={SSY_MIN_ANNUAL_DEPOSIT}
          max={SSY_MAX_ANNUAL_DEPOSIT}
          step={250}
          suffix="INR"
          onChange={setAnnualDeposit}
          helperText="Min ₹250 · Max ₹1.5L per year · Deposits for first 15 years"
        />
        <NumberInput
          id="ssy-age"
          label="Daughter's current age"
          value={girlChildAge}
          min={0}
          max={10}
          step={1}
          suffix="years"
          onChange={setGirlChildAge}
          helperText="Account must be opened before age 10"
        />
        <NumberInput
          id="ssy-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={6}
          max={10}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
          helperText={`Current rate: ${SSY_DEFAULT_RATE_PERCENT}%`}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Maturity at year 21",
            value: formatINR(result.maturity),
            helpText: `${formatINR(annualDeposit)}/year for 15 years · ${formatPercent(annualRate, 2)} compounded annually · matures when daughter is ${girlChildAge + 21}`,
          }}
          metrics={[
            {
              label: "Total deposited",
              value: formatINR(result.totalDeposited),
              helpText: "₹X × 15 years",
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
            Balance growth by daughter&apos;s age
          </h3>
          <LineChart
            data={lineData}
            xKey="age"
            series={[{ key: "balance", label: "SSY balance", color: INTEREST_COLOR }]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="SSY balance growth"
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Year-by-year breakdown
          </h3>
          <BreakdownTable
            columns={[
              { key: "year", label: "Year", render: (r) => `Yr ${r.year} (age ${r.age})` },
              {
                key: "deposit",
                label: "Deposit",
                align: "right",
                render: (r) =>
                  r.deposit === 0 ? "—" : formatINR(r.deposit),
              },
              {
                key: "interestEarned",
                label: "Interest",
                align: "right",
                render: (r) => formatINR(r.interestEarned),
              },
              {
                key: "closingBalance",
                label: "Balance",
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
