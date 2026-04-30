"use client";

import { useMemo, useState } from "react";
import { calculateSip } from "@/lib/calculators/mutual-fund";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INVESTED_COLOR = "var(--chart-1)";
const RETURNS_COLOR = "var(--chart-2)";

type Mode = "sip" | "lumpsum";

export function MfForm() {
  const [mode, setMode] = useState<Mode>("sip");
  const [monthlyAmount, setMonthlyAmount] = useState(10_000);
  const [lumpsumAmount, setLumpsumAmount] = useState(500_000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);

  const sipResult = useMemo(
    () =>
      calculateSip({
        monthlyAmount,
        annualReturnPercent: annualReturn,
        tenureYears,
      }),
    [monthlyAmount, annualReturn, tenureYears],
  );

  const lumpsumResult = useMemo(
    () =>
      calculateLumpsum({
        principal: lumpsumAmount,
        annualReturnPercent: annualReturn,
        tenureYears,
      }),
    [lumpsumAmount, annualReturn, tenureYears],
  );

  const futureValue = mode === "sip" ? sipResult.futureValue : lumpsumResult.futureValue;
  const invested =
    mode === "sip" ? sipResult.totalInvested : lumpsumResult.totalInvested;
  const gains =
    mode === "sip" ? sipResult.totalReturns : lumpsumResult.totalGain;

  const donutData: DonutDatum[] = [
    { name: "Invested", value: invested, color: INVESTED_COLOR },
    { name: "Estimated returns", value: gains, color: RETURNS_COLOR },
  ];

  const lineData =
    mode === "sip"
      ? sipResult.schedule.map((row) => ({
          year: `Yr ${row.year}`,
          invested: Math.round(row.invested),
          balance: Math.round(row.closingBalance),
        }))
      : lumpsumResult.schedule.map((row) => ({
          year: `Yr ${row.year}`,
          invested: lumpsumResult.totalInvested,
          balance: Math.round(row.closingBalance),
        }));

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="sip">SIP</TabsTrigger>
          <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          {mode === "sip" ? (
            <NumberInput
              id="mf-monthly"
              label="Monthly SIP"
              value={monthlyAmount}
              min={500}
              max={500_000}
              step={500}
              suffix="INR"
              onChange={setMonthlyAmount}
            />
          ) : (
            <NumberInput
              id="mf-lumpsum"
              label="One-time investment"
              value={lumpsumAmount}
              min={1_000}
              max={50_000_000}
              step={1_000}
              suffix="INR"
              onChange={setLumpsumAmount}
            />
          )}
          <NumberInput
            id="mf-return"
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
            id="mf-tenure"
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
              label: mode === "sip" ? "SIP future value" : "Lumpsum future value",
              value: formatINR(futureValue),
              helpText:
                mode === "sip"
                  ? `${formatINR(monthlyAmount)}/month × ${tenureYears} yr at ${formatPercent(annualReturn, annualReturn % 1 === 0 ? 0 : 1)}`
                  : `${formatINRCompact(lumpsumAmount)} at ${formatPercent(annualReturn, annualReturn % 1 === 0 ? 0 : 1)} for ${tenureYears} yr`,
            }}
            metrics={[
              {
                label: "Total invested",
                value: formatINR(invested),
                emphasis: "primary",
              },
              {
                label: "Estimated returns",
                value: formatINR(gains),
                emphasis: "primary",
              },
            ]}
          />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Invested vs estimated returns
            </h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <DonutChart
                data={donutData}
                centerLabel="Future value"
                centerValue={formatINRCompact(futureValue)}
                ariaLabel="Invested vs returns"
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
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-3 text-lg font-semibold tracking-tight">
          Growth over time
        </h3>
        <LineChart
          data={lineData}
          xKey="year"
          series={[
            { key: "invested", label: "Invested", color: INVESTED_COLOR },
            { key: "balance", label: "Portfolio value", color: RETURNS_COLOR },
          ]}
          yTickFormatter={(v) => formatINRCompact(v)}
          ariaLabel="Invested vs portfolio value over time"
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold tracking-tight">
          Year-by-year breakdown
        </h3>
        {mode === "sip" ? (
          <BreakdownTable
            columns={[
              { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
              {
                key: "invested",
                label: "Invested",
                align: "right",
                render: (r) => formatINR(r.invested),
              },
              {
                key: "estimatedReturns",
                label: "Estimated returns",
                align: "right",
                render: (r) => formatINR(r.estimatedReturns),
              },
              {
                key: "closingBalance",
                label: "Portfolio value",
                align: "right",
                render: (r) => formatINR(r.closingBalance),
              },
            ]}
            rows={sipResult.schedule}
          />
        ) : (
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
            rows={lumpsumResult.schedule}
          />
        )}
      </div>
    </div>
  );
}
