"use client";

import { useMemo, useState } from "react";
import {
  calculateFd,
  type CompoundingFrequency,
} from "@/lib/calculators/fd";
import {
  formatINR,
  formatINRCompact,
  formatPercent,
} from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import {
  DonutChart,
  DonutLegend,
  type DonutDatum,
} from "@/components/calculator/donut-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const PRINCIPAL_COLOR = "var(--chart-1)";
const INTEREST_COLOR = "var(--chart-2)";

const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "monthly", label: "Monthly" },
];

export function FdForm() {
  const [principal, setPrincipal] = useState(500_000);
  const [annualRate, setAnnualRate] = useState(7);
  const [tenureYears, setTenureYears] = useState(5);
  const [compounding, setCompounding] = useState<CompoundingFrequency>("quarterly");

  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () =>
      calculateFd({
        principal,
        annualRatePercent: annualRate,
        tenureMonths,
        compounding,
      }),
    [principal, annualRate, tenureMonths, compounding],
  );

  const donutData: DonutDatum[] = [
    { name: "Principal", value: principal, color: PRINCIPAL_COLOR },
    { name: "Interest", value: result.totalInterest, color: INTEREST_COLOR },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="fd-principal"
          label="Deposit amount"
          value={principal}
          min={1_000}
          max={20_000_000}
          step={1_000}
          suffix="INR"
          onChange={setPrincipal}
        />
        <NumberInput
          id="fd-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={1}
          max={15}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
        />
        <NumberInput
          id="fd-tenure"
          label="Tenure"
          value={tenureYears}
          min={0.25}
          max={10}
          step={0.25}
          suffix="years"
          onChange={setTenureYears}
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Compounding frequency</Label>
          <Tabs
            value={compounding}
            onValueChange={(v) => setCompounding(v as CompoundingFrequency)}
          >
            <TabsList className="grid w-full grid-cols-4">
              {COMPOUNDING_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            Most Indian banks compound FD interest <strong>quarterly</strong>.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Maturity amount",
            value: formatINR(result.maturity),
            helpText: `${formatINRCompact(principal)} principal · ${formatPercent(annualRate, annualRate % 1 === 0 ? 0 : 2)} for ${tenureYears} years (${compounding} compounding)`,
          }}
          metrics={[
            {
              label: "Total interest",
              value: formatINR(result.totalInterest),
              emphasis: "primary",
            },
            {
              label: "Effective yield",
              value: formatPercent(result.effectiveAnnualYield, 2),
              emphasis: "primary",
              helpText: "Real annual return after compounding",
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
              centerLabel="Maturity"
              centerValue={formatINRCompact(result.maturity)}
              ariaLabel="Principal and interest split at maturity"
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
              key: "openingBalance",
              label: "Opening balance",
              align: "right",
              render: (r) => formatINR(r.openingBalance),
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
