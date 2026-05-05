"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculateHomeLoanEligibility } from "@/lib/calculators/home-loan-eligibility";
import {
  formatINR,
  formatINRCompact,
  formatPercent,
} from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import {
  DonutChart,
  DonutLegend,
  type DonutDatum,
} from "@/components/calculator/donut-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const LOAN_COLOR = "var(--chart-1)";
const DOWN_PAYMENT_COLOR = "var(--chart-2)";

const FOIR_OPTIONS: { value: number; label: string; hint: string }[] = [
  { value: 40, label: "40%", hint: "Conservative" },
  { value: 50, label: "50%", hint: "Standard" },
  { value: 55, label: "55%", hint: "₹1L–2L income" },
  { value: 60, label: "60%", hint: "₹2L+ income" },
];

export function EligibilityForm() {
  const [monthlyIncome, setMonthlyIncome] = useState(120_000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [annualRate, setAnnualRate] = useState(8.75);
  const [tenureYears, setTenureYears] = useState(20);
  const [foir, setFoir] = useState(50);
  const [downPayment, setDownPayment] = useState(20);

  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () =>
      calculateHomeLoanEligibility({
        monthlyIncome,
        existingEmi,
        annualRatePercent: annualRate,
        tenureMonths,
        foirPercent: foir,
        downPaymentPercent: downPayment,
      }),
    [monthlyIncome, existingEmi, annualRate, tenureMonths, foir, downPayment],
  );

  const donutData: DonutDatum[] = [
    { name: "Loan", value: result.maxLoanAmount, color: LOAN_COLOR },
    {
      name: "Down payment",
      value: Math.max(0, result.downPayment),
      color: DOWN_PAYMENT_COLOR,
    },
  ];

  const isCapped = result.maxEmi === 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
        <NumberInput
          id="hle-income"
          label="Net monthly income"
          value={monthlyIncome}
          min={20_000}
          max={2_000_000}
          step={1_000}
          suffix="INR"
          onChange={setMonthlyIncome}
        />
        <NumberInput
          id="hle-existing-emi"
          label="Existing monthly EMIs"
          value={existingEmi}
          min={0}
          max={1_000_000}
          step={500}
          suffix="INR"
          onChange={setExistingEmi}
        />
        <NumberInput
          id="hle-rate"
          label="Interest rate (per year)"
          value={annualRate}
          min={5}
          max={15}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
        />
        <NumberInput
          id="hle-tenure"
          label="Tenure"
          value={tenureYears}
          min={5}
          max={30}
          step={1}
          suffix="years"
          onChange={setTenureYears}
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">FOIR cap</Label>
          <Tabs value={String(foir)} onValueChange={(v) => setFoir(Number(v))}>
            <TabsList className="grid w-full grid-cols-4">
              {FOIR_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={String(opt.value)} className="text-xs">
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {FOIR_OPTIONS.find((o) => o.value === foir)?.hint} — share of net
            income that can go toward all EMIs combined.
          </p>
        </div>

        <NumberInput
          id="hle-down-payment"
          label="Down payment"
          value={downPayment}
          min={10}
          max={50}
          step={1}
          suffix="%"
          onChange={setDownPayment}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Maximum eligible loan",
            value: formatINR(result.maxLoanAmount),
            helpText: isCapped
              ? "Your existing EMIs already exceed the FOIR cap — no new EMI capacity available."
              : `${formatINRCompact(monthlyIncome)} income · ${foir}% FOIR · ${tenureYears}y @ ${formatPercent(annualRate, 2)}`,
          }}
          metrics={[
            {
              label: "Max EMI you can afford",
              value: formatINR(result.maxEmi),
              emphasis: "primary",
              helpText: `Effective FOIR ${formatPercent(result.effectiveFoirPercent, 1)}`,
            },
            {
              label: "Total property budget",
              value: formatINR(result.propertyBudget),
              emphasis: "primary",
              helpText: `Loan + ${downPayment}% down payment`,
            },
            {
              label: "Down payment needed",
              value: formatINR(result.downPayment),
            },
            {
              label: "Total interest over tenure",
              value: formatINR(result.totalInterest),
              helpText: `${tenureYears} years × max EMI`,
            },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Property budget split
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Budget"
              centerValue={formatINRCompact(result.propertyBudget)}
              ariaLabel="Loan and down payment split of property budget"
            />
            <DonutLegend
              items={donutData.map((d) => ({
                ...d,
                name: `${d.name} — ${formatINR(d.value)}`,
              }))}
            />
          </div>
        </div>

        <Link
          href="/calculators/emi-calculator"
          className="group flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4 transition hover:border-foreground/20"
        >
          <div>
            <p className="text-sm font-medium">
              Now check the EMI for {formatINRCompact(result.maxLoanAmount)} →
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              See month-wise principal vs interest breakdown.
            </p>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
