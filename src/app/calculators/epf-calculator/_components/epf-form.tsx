"use client";

import { useMemo, useState } from "react";
import {
  calculateEpf,
  EPF_DEFAULT_RATE_PERCENT,
  EPF_EMPLOYEE_CONTRIBUTION_PERCENT,
  EPF_EMPLOYER_CONTRIBUTION_PERCENT,
} from "@/lib/calculators/epf";
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

const EMP_COLOR = "var(--chart-1)";
const ER_COLOR = "var(--chart-3)";
const INTEREST_COLOR = "var(--chart-2)";

export function EpfForm() {
  const [monthlyBasic, setMonthlyBasic] = useState(50_000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [salaryGrowth, setSalaryGrowth] = useState(8);
  const [annualRate, setAnnualRate] = useState(EPF_DEFAULT_RATE_PERCENT);
  const [existingBalance, setExistingBalance] = useState(0);

  const result = useMemo(
    () =>
      calculateEpf({
        monthlyBasic,
        currentAge,
        retirementAge,
        annualSalaryGrowthPercent: salaryGrowth,
        annualRatePercent: annualRate,
        existingBalance,
      }),
    [monthlyBasic, currentAge, retirementAge, salaryGrowth, annualRate, existingBalance],
  );

  const donutData: DonutDatum[] = [
    { name: "Employee contribution", value: result.totalEmployeeContribution, color: EMP_COLOR },
    { name: "Employer contribution", value: result.totalEmployerContribution, color: ER_COLOR },
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
          id="epf-basic"
          label="Monthly basic + DA"
          value={monthlyBasic}
          min={5_000}
          max={500_000}
          step={1_000}
          suffix="INR"
          onChange={setMonthlyBasic}
        />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="epf-age"
            label="Current age"
            value={currentAge}
            min={18}
            max={59}
            step={1}
            suffix="none"
            onChange={setCurrentAge}
          />
          <NumberInput
            id="epf-retire-age"
            label="Retirement age"
            value={retirementAge}
            min={Math.max(currentAge + 1, 50)}
            max={70}
            step={1}
            suffix="none"
            onChange={setRetirementAge}
          />
        </div>
        <NumberInput
          id="epf-growth"
          label="Annual salary growth"
          value={salaryGrowth}
          min={0}
          max={20}
          step={0.5}
          suffix="%"
          onChange={setSalaryGrowth}
        />
        <NumberInput
          id="epf-rate"
          label="EPF interest rate"
          value={annualRate}
          min={5}
          max={12}
          step={0.05}
          suffix="%"
          onChange={setAnnualRate}
          helperText={`Current EPFO rate: ${EPF_DEFAULT_RATE_PERCENT}%`}
        />
        <NumberInput
          id="epf-existing"
          label="Current EPF balance (optional)"
          value={existingBalance}
          min={0}
          max={20_000_000}
          step={10_000}
          suffix="INR"
          onChange={setExistingBalance}
        />
      </div>

      <div className="space-y-6">
        <ResultCard
          headline={{
            label: "Retirement corpus",
            value: formatINR(result.retirementCorpus),
            helpText: `${retirementAge - currentAge} years to retirement · ${formatPercent(annualRate, 2)} return · ${formatPercent(salaryGrowth, 1)}/yr salary growth`,
          }}
          metrics={[
            {
              label: "Your contribution",
              value: formatINR(result.totalEmployeeContribution),
              helpText: `${EPF_EMPLOYEE_CONTRIBUTION_PERCENT}% of basic`,
              emphasis: "primary",
            },
            {
              label: "Employer contribution",
              value: formatINR(result.totalEmployerContribution),
              helpText: `${EPF_EMPLOYER_CONTRIBUTION_PERCENT}% (incl. EPS)`,
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
            Corpus composition
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <DonutChart
              data={donutData}
              centerLabel="Corpus"
              centerValue={formatINRCompact(result.retirementCorpus)}
              ariaLabel="EPF corpus composition"
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
            Corpus growth by age
          </h3>
          <LineChart
            data={lineData}
            xKey="age"
            series={[
              { key: "balance", label: "EPF balance", color: INTEREST_COLOR },
            ]}
            yTickFormatter={(v) => formatINRCompact(v)}
            ariaLabel="EPF corpus by age"
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Year-by-year breakdown
          </h3>
          <BreakdownTable
            columns={[
              { key: "age", label: "Age", render: (r) => `${r.age}` },
              {
                key: "monthlyBasic",
                label: "Basic",
                align: "right",
                render: (r) => formatINR(r.monthlyBasic),
              },
              {
                key: "employeeContribution",
                label: "Your share",
                align: "right",
                render: (r) => formatINR(r.employeeContribution),
              },
              {
                key: "employerContribution",
                label: "Employer share",
                align: "right",
                render: (r) => formatINR(r.employerContribution),
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
