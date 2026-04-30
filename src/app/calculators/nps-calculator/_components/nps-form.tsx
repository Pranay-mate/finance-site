"use client";

import { useMemo, useState } from "react";
import { calculateNps } from "@/lib/calculators/nps";
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

const SELF_COLOR = "var(--chart-1)";
const ER_COLOR = "var(--chart-3)";
const GROWTH_COLOR = "var(--chart-2)";

export function NpsForm() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlySelf, setMonthlySelf] = useState(5_000);
  const [monthlyEmployer, setMonthlyEmployer] = useState(0);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(7);
  const [existingCorpus, setExistingCorpus] = useState(0);

  const result = useMemo(
    () =>
      calculateNps({
        currentAge,
        retirementAge,
        monthlySelfContribution: monthlySelf,
        monthlyEmployerContribution: monthlyEmployer,
        annualReturnPercent: annualReturn,
        annuityRatePercent: annuityRate,
        existingCorpus,
      }),
    [
      currentAge,
      retirementAge,
      monthlySelf,
      monthlyEmployer,
      annualReturn,
      annuityRate,
      existingCorpus,
    ],
  );

  const donutData: DonutDatum[] = [
    { name: "Your contributions", value: result.totalSelfContributions, color: SELF_COLOR },
    { name: "Employer contributions", value: result.totalEmployerContributions, color: ER_COLOR },
    { name: "Investment growth", value: result.totalGrowth, color: GROWTH_COLOR },
  ];

  const lineData = result.schedule.map((row) => ({
    age: `Age ${row.age}`,
    balance: Math.round(row.closingBalance),
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="nps-age"
              label="Current age"
              value={currentAge}
              min={18}
              max={59}
              step={1}
              suffix="none"
              onChange={setCurrentAge}
            />
            <NumberInput
              id="nps-retire-age"
              label="Retirement age"
              value={retirementAge}
              min={Math.max(currentAge + 1, 50)}
              max={75}
              step={1}
              suffix="none"
              onChange={setRetirementAge}
            />
          </div>
          <NumberInput
            id="nps-self"
            label="Monthly self contribution"
            value={monthlySelf}
            min={500}
            max={5_00_000}
            step={500}
            suffix="INR"
            onChange={setMonthlySelf}
            helperText="Min ₹500/month for active NPS Tier 1"
          />
          <NumberInput
            id="nps-employer"
            label="Monthly employer contribution"
            value={monthlyEmployer}
            min={0}
            max={5_00_000}
            step={500}
            suffix="INR"
            onChange={setMonthlyEmployer}
            helperText="Under 80CCD(2) — tax-free if up to 14% of basic+DA"
          />
          <NumberInput
            id="nps-existing"
            label="Existing NPS corpus"
            value={existingCorpus}
            min={0}
            max={20_00_00_000}
            step={50_000}
            suffix="INR"
            onChange={setExistingCorpus}
          />
        </div>

        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <NumberInput
            id="nps-return"
            label="Expected annual return"
            value={annualReturn}
            min={5}
            max={15}
            step={0.5}
            suffix="%"
            onChange={setAnnualReturn}
            helperText="Equity-heavy mix ~10-12%; debt-heavy ~7-8%"
          />
          <NumberInput
            id="nps-annuity"
            label="Annuity rate at retirement"
            value={annuityRate}
            min={4}
            max={12}
            step={0.5}
            suffix="%"
            onChange={setAnnuityRate}
            helperText="Typical Indian ASP rates: 6-7%"
          />

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <p className="font-semibold">Mandatory split at retirement</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>· <strong>60%</strong> can be withdrawn lump-sum (tax-free)</li>
              <li>· <strong>40%</strong> must convert to annuity (taxable income)</li>
              <li>· Higher annuity rate options often have lower or no return-of-purchase-price</li>
            </ul>
          </div>
        </div>
      </div>

      <ResultCard
        headline={{
          label: "NPS corpus at retirement",
          value: formatINR(result.retirementCorpus),
          helpText: `${retirementAge - currentAge} years to retire · ${formatPercent(annualReturn, 1)} return · ${formatINR(monthlySelf + monthlyEmployer)}/mo total contribution`,
        }}
        metrics={[
          {
            label: "60% lump sum (tax-free)",
            value: formatINR(result.lumpSumAtRetirement),
            emphasis: "primary",
          },
          {
            label: "40% annuity corpus",
            value: formatINR(result.annuityCorpus),
            helpText: "Locked into pension",
            emphasis: "primary",
          },
          {
            label: "Monthly pension (before tax)",
            value: formatINR(result.monthlyPensionBeforeTax),
            helpText: `Annual: ${formatINR(result.annualPensionBeforeTax)}`,
            emphasis: "primary",
          },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Corpus composition
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Corpus"
              centerValue={formatINRCompact(result.retirementCorpus)}
              ariaLabel="NPS corpus composition"
            />
            <DonutLegend
              items={donutData.map((d) => ({
                ...d,
                name: `${d.name} — ${formatINR(d.value)}`,
              }))}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Corpus growth by age
          </h3>
          <LineChart
            data={lineData}
            xKey="age"
            series={[
              { key: "balance", label: "NPS balance", color: GROWTH_COLOR },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="NPS corpus growth"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold tracking-tight">
          Year-by-year breakdown
        </h3>
        <BreakdownTable
          columns={[
            { key: "age", label: "Age", render: (r) => `${r.age}` },
            {
              key: "selfContribution",
              label: "Your share",
              align: "right",
              render: (r) => formatINR(r.selfContribution),
            },
            {
              key: "employerContribution",
              label: "Employer",
              align: "right",
              render: (r) => formatINR(r.employerContribution),
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
  );
}
