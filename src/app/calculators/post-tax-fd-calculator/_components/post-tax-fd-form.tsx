"use client";

import { useMemo, useState } from "react";
import {
  calculatePostTaxFd,
  type TaxRegime,
} from "@/lib/calculators/post-tax-fd";
import type { CompoundingFrequency } from "@/lib/calculators/fd";
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
const POST_TAX_INTEREST_COLOR = "var(--chart-2)";
const TAX_COLOR = "var(--chart-3)";

const SLAB_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 10, label: "10%" },
  { value: 20, label: "20%" },
  { value: 30, label: "30%" },
];

const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "monthly", label: "Monthly" },
];

const REGIME_OPTIONS: { value: TaxRegime; label: string }[] = [
  { value: "new", label: "New regime" },
  { value: "old", label: "Old regime" },
];

export function PostTaxFdForm() {
  const [principal, setPrincipal] = useState(500_000);
  const [annualRate, setAnnualRate] = useState(7);
  const [tenureYears, setTenureYears] = useState(5);
  const [compounding, setCompounding] = useState<CompoundingFrequency>("quarterly");
  const [slab, setSlab] = useState(30);
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [seniorCitizen, setSeniorCitizen] = useState(false);

  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () =>
      calculatePostTaxFd({
        principal,
        annualRatePercent: annualRate,
        tenureMonths,
        compounding,
        slabRatePercent: slab,
        seniorCitizen,
        taxRegime: regime,
      }),
    [principal, annualRate, tenureMonths, compounding, slab, seniorCitizen, regime],
  );

  const donutData: DonutDatum[] = [
    { name: "Principal", value: principal, color: PRINCIPAL_COLOR },
    {
      name: "Post-tax interest",
      value: Math.max(0, result.postTaxTotalInterest),
      color: POST_TAX_INTEREST_COLOR,
    },
    {
      name: "Tax paid",
      value: result.totalTaxPaid,
      color: TAX_COLOR,
    },
  ];

  const showSeniorBenefit = seniorCitizen && regime === "old";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="ptfd-principal"
          label="Deposit amount"
          value={principal}
          min={1_000}
          max={20_000_000}
          step={1_000}
          suffix="INR"
          onChange={setPrincipal}
        />
        <NumberInput
          id="ptfd-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={1}
          max={15}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
        />
        <NumberInput
          id="ptfd-tenure"
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
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tax slab <span className="text-xs text-muted-foreground">(excl. cess)</span>
          </Label>
          <Tabs
            value={String(slab)}
            onValueChange={(v) => setSlab(Number(v))}
          >
            <TabsList className="grid w-full grid-cols-5">
              {SLAB_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={String(opt.value)} className="text-xs">
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            Pick the slab applied to your topmost rupee. We add 4% cess automatically.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Tax regime</Label>
          <Tabs
            value={regime}
            onValueChange={(v) => setRegime(v as TaxRegime)}
          >
            <TabsList className="grid w-full grid-cols-2">
              {REGIME_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 cursor-pointer"
            checked={seniorCitizen}
            onChange={(e) => setSeniorCitizen(e.target.checked)}
          />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Senior citizen (60+)</p>
            <p className="text-xs text-muted-foreground">
              {showSeniorBenefit
                ? "Applies ₹50,000/year 80TTB exemption."
                : regime === "new"
                ? "80TTB only applies under the Old regime — switch above to use it."
                : "Toggle to apply 80TTB exemption (Old regime only)."}
            </p>
          </div>
        </label>
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Post-tax maturity",
            value: formatINR(result.postTaxMaturity),
            helpText: `${formatINRCompact(principal)} principal · ${formatPercent(annualRate, annualRate % 1 === 0 ? 0 : 2)} pre-tax · ${slab}% slab`,
          }}
          metrics={[
            {
              label: "Pre-tax maturity",
              value: formatINR(result.preTaxMaturity),
              helpText: "What the bank pays you",
            },
            {
              label: "Total tax paid",
              value: formatINR(result.totalTaxPaid),
              helpText: "Slab rate + 4% cess on accrued interest",
            },
            {
              label: "Post-tax CAGR",
              value: formatPercent(result.postTaxCagr, 2),
              emphasis: "primary",
              helpText: "Your real annual return after tax",
            },
            {
              label: "Tax drag",
              value: `−${formatPercent(result.taxDragPp, 2)}`,
              emphasis: "primary",
              helpText: "Pre-tax CAGR minus post-tax CAGR",
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Where the money goes
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Maturity"
              centerValue={formatINRCompact(result.preTaxMaturity)}
              ariaLabel="Principal, post-tax interest, and tax paid"
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
          Year-by-year tax breakdown
        </h3>
        <BreakdownTable
          columns={[
            { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
            {
              key: "interestEarned",
              label: "Interest earned",
              align: "right",
              render: (r) => formatINR(r.interestEarned),
            },
            {
              key: "taxableInterest",
              label: "Taxable",
              align: "right",
              render: (r) => formatINR(r.taxableInterest),
            },
            {
              key: "taxPaid",
              label: "Tax paid",
              align: "right",
              render: (r) => formatINR(r.taxPaid),
            },
            {
              key: "postTaxInterest",
              label: "Post-tax interest",
              align: "right",
              render: (r) => formatINR(r.postTaxInterest),
            },
            {
              key: "closingBalance",
              label: "FD balance (gross)",
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
