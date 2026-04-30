"use client";

import { useMemo, useState } from "react";
import { calculateSalary } from "@/lib/calculators/salary";
import { formatINR, formatPercent } from "@/lib/format";
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

const TAKE_HOME_COLOR = "var(--chart-2)";
const EPF_COLOR = "var(--chart-3)";
const TAX_COLOR = "var(--chart-1)";
const PT_COLOR = "var(--chart-4)";

type Regime = "auto" | "new" | "old";
type Locality = "metro" | "non-metro";

export function SalaryForm() {
  const [annualCtc, setAnnualCtc] = useState(15_00_000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [locality, setLocality] = useState<Locality>("metro");
  const [regime, setRegime] = useState<Regime>("auto");
  const [section80C, setSection80C] = useState(0);
  const [section80D, setSection80D] = useState(0);
  const [annualRent, setAnnualRent] = useState(0);

  const result = useMemo(
    () =>
      calculateSalary({
        annualCtc,
        basicPercentOfCtc: basicPercent / 100,
        isMetro: locality === "metro",
        regime: regime === "auto" ? undefined : regime,
        section80C,
        section80D,
        annualRentPaid: annualRent,
      }),
    [annualCtc, basicPercent, locality, regime, section80C, section80D, annualRent],
  );

  const donutData: DonutDatum[] = [
    { name: "Take-home", value: result.netAnnualTakeHome, color: TAKE_HOME_COLOR },
    { name: "Employee EPF", value: result.employeeEpf, color: EPF_COLOR },
    { name: "Income tax", value: result.incomeTax, color: TAX_COLOR },
    { name: "Professional tax", value: result.professionalTax, color: PT_COLOR },
  ];

  const breakdownRows = [
    { label: "Annual CTC", value: result.annualCtc, isTotal: false },
    { label: "− Employer EPF", value: -result.employerEpf, isTotal: false },
    { label: "− Gratuity provision", value: -result.gratuityProvision, isTotal: false },
    { label: "= Annual gross salary (in payroll)", value: result.annualGrossSalary, isTotal: true },
    { label: "  Basic + DA", value: result.basic, isTotal: false },
    { label: "  HRA", value: result.hra, isTotal: false },
    { label: "  Special allowance", value: result.specialAllowance, isTotal: false },
    { label: "− Employee EPF (12% of basic)", value: -result.employeeEpf, isTotal: false },
    { label: "− Professional tax", value: -result.professionalTax, isTotal: false },
    { label: "− Income tax", value: -result.incomeTax, isTotal: false },
    { label: "= Annual take-home", value: result.netAnnualTakeHome, isTotal: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <NumberInput
            id="sal-ctc"
            label="Annual CTC"
            value={annualCtc}
            min={1_00_000}
            max={5_00_00_000}
            step={50_000}
            suffix="INR"
            onChange={setAnnualCtc}
          />
          <NumberInput
            id="sal-basic-pct"
            label="Basic (% of CTC)"
            value={basicPercent}
            min={20}
            max={60}
            step={5}
            suffix="%"
            onChange={setBasicPercent}
            helperText="Most companies set basic at 40-50% of CTC"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium">City type</Label>
            <Tabs value={locality} onValueChange={(v) => setLocality(v as Locality)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metro">Metro (50% HRA)</TabsTrigger>
                <TabsTrigger value="non-metro">Non-metro (40% HRA)</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground">
              Mumbai, Delhi, Kolkata, Chennai, Hyderabad, Bengaluru, Pune count as metros.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tax regime</Label>
            <Tabs value={regime} onValueChange={(v) => setRegime(v as Regime)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="auto">Auto</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="old">Old</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground">
              Auto picks the cheaper regime. Recommended for your inputs:{" "}
              <strong>{result.recommendedRegime === "new" ? "New" : "Old"}</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Old-regime deductions (optional)
          </h3>
          <NumberInput
            id="sal-80c"
            label="Section 80C investments"
            value={section80C}
            min={0}
            max={1_50_000}
            step={5_000}
            suffix="INR"
            onChange={setSection80C}
            helperText="PPF, ELSS, life insurance — capped at ₹1.5L (your EPF auto-counted)"
          />
          <NumberInput
            id="sal-80d"
            label="Section 80D (medical insurance)"
            value={section80D}
            min={0}
            max={1_00_000}
            step={1_000}
            suffix="INR"
            onChange={setSection80D}
          />
          <NumberInput
            id="sal-rent"
            label="Annual rent paid (HRA exemption)"
            value={annualRent}
            min={0}
            max={20_00_000}
            step={10_000}
            suffix="INR"
            onChange={setAnnualRent}
            helperText="HRA exemption applies only to the Old regime"
          />
        </div>
      </div>

      <ResultCard
        headline={{
          label: "Monthly take-home",
          value: formatINR(result.netMonthlyTakeHome),
          helpText: `${formatINR(result.annualCtc)} CTC · ${formatPercent(result.effectiveTaxRatePercent, 2)} effective tax · ${result.recommendedRegime === regime || regime === "auto" ? "Optimal regime" : `Choose ${result.recommendedRegime === "new" ? "New" : "Old"} for lower tax`}`,
        }}
        metrics={[
          {
            label: "Annual take-home",
            value: formatINR(result.netAnnualTakeHome),
            emphasis: "primary",
          },
          {
            label: "Annual income tax",
            value: formatINR(result.incomeTax),
            emphasis: "primary",
          },
          {
            label: "Total deductions",
            value: formatINR(
              result.employeeEpf + result.professionalTax + result.incomeTax,
            ),
            helpText: "EPF + PT + tax",
            emphasis: "primary",
          },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Where your CTC goes
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="CTC"
              centerValue={formatINR(result.annualCtc)}
              ariaLabel="CTC breakdown"
            />
            <DonutLegend
              items={donutData.map((d) => ({
                ...d,
                name: `${d.name} — ${formatINR(d.value)}`,
              }))}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Step-by-step breakdown
          </h3>
          <BreakdownTable
            columns={[
              { key: "label", label: "Component", render: (r) => r.label },
              {
                key: "value",
                label: "Amount",
                align: "right",
                render: (r) => (
                  <span className={r.isTotal ? "font-semibold" : undefined}>
                    {formatINR(Math.abs(r.value))}
                    {r.value < 0 && " (deducted)"}
                  </span>
                ),
              },
            ]}
            rows={breakdownRows}
          />
        </div>
      </div>
    </div>
  );
}
