"use client";

import { useMemo, useState } from "react";
import { calculateFire } from "@/lib/calculators/fire";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import { LineChart } from "@/components/calculator/line-chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CORPUS_COLOR = "var(--chart-2)";
const WITHDRAW_COLOR = "var(--chart-1)";

export function FireForm() {
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(50_000);
  const [currentCorpus, setCurrentCorpus] = useState(10_00_000);
  const [monthlySip, setMonthlySip] = useState(50_000);
  const [yearsToFire, setYearsToFire] = useState(20);
  const [yearsInRetirement, setYearsInRetirement] = useState(35);
  const [accumulationReturn, setAccumulationReturn] = useState(12);
  const [retirementReturn, setRetirementReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(6);
  const [sipStepUpRate, setSipStepUpRate] = useState(8);

  const result = useMemo(
    () =>
      calculateFire({
        currentMonthlyExpenses,
        currentCorpus,
        monthlySip,
        yearsToFire,
        yearsInRetirement,
        accumulationReturn,
        retirementReturn,
        inflationRate,
        sipStepUpRate,
      }),
    [
      currentMonthlyExpenses,
      currentCorpus,
      monthlySip,
      yearsToFire,
      yearsInRetirement,
      accumulationReturn,
      retirementReturn,
      inflationRate,
      sipStepUpRate,
    ],
  );

  const accLineData = result.accumulationSchedule.map((row) => ({
    year: `Yr ${row.year}`,
    balance: Math.round(row.closingBalance),
    invested: Math.round(row.cumulativeInvested),
  }));

  const ddLineData = result.drawdownSchedule.map((row) => ({
    year: `R+${row.yearOfRetirement}`,
    balance: Math.max(0, Math.round(row.closingBalance)),
    withdrawal: Math.round(row.annualWithdrawal),
  }));

  const safety = classifySafety(result.initialWithdrawalRatePercent, result.survives);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <NumberInput
            id="fire-expenses"
            label="Current monthly expenses"
            value={currentMonthlyExpenses}
            min={5_000}
            max={20_00_000}
            step={1_000}
            suffix="INR"
            onChange={setCurrentMonthlyExpenses}
            helperText="In today's rupees — we'll inflate forward"
          />
          <NumberInput
            id="fire-corpus"
            label="Existing investment corpus"
            value={currentCorpus}
            min={0}
            max={50_00_00_000}
            step={1_00_000}
            suffix="INR"
            onChange={setCurrentCorpus}
          />
          <NumberInput
            id="fire-sip"
            label="Monthly SIP"
            value={monthlySip}
            min={1_000}
            max={20_00_000}
            step={1_000}
            suffix="INR"
            onChange={setMonthlySip}
          />
          <NumberInput
            id="fire-stepup"
            label="Annual SIP step-up"
            value={sipStepUpRate}
            min={0}
            max={20}
            step={1}
            suffix="%"
            onChange={setSipStepUpRate}
            helperText="Salary-linked annual increase, 0% = flat SIP"
          />
        </div>

        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <NumberInput
            id="fire-years-to-fire"
            label="Years until FIRE"
            value={yearsToFire}
            min={1}
            max={45}
            step={1}
            suffix="years"
            onChange={setYearsToFire}
          />
          <NumberInput
            id="fire-retire-years"
            label="Years in retirement after FIRE"
            value={yearsInRetirement}
            min={5}
            max={60}
            step={1}
            suffix="years"
            onChange={setYearsInRetirement}
          />
          <NumberInput
            id="fire-acc-return"
            label="Accumulation return (equity-heavy)"
            value={accumulationReturn}
            min={6}
            max={20}
            step={0.5}
            suffix="%"
            onChange={setAccumulationReturn}
          />
          <NumberInput
            id="fire-ret-return"
            label="Retirement return (more conservative)"
            value={retirementReturn}
            min={4}
            max={15}
            step={0.5}
            suffix="%"
            onChange={setRetirementReturn}
            helperText="Typically 2-4% lower than accumulation phase"
          />
          <NumberInput
            id="fire-inflation"
            label="Expected inflation"
            value={inflationRate}
            min={2}
            max={12}
            step={0.5}
            suffix="%"
            onChange={setInflationRate}
            helperText="India long-run avg ~6%"
          />
        </div>
      </div>

      <ResultCard
        headline={{
          label: "FIRE corpus needed (nominal future-rupees)",
          value: formatINR(result.fireCorpus),
          helpText: `In today's purchasing power: ${formatINR(result.fireCorpusInTodaysRupees)} · ${result.survives ? "✓ Survives full retirement" : `⚠ Depletes after ${result.yearsCorpusLasted} years`}`,
        }}
        metrics={[
          {
            label: "Monthly expenses at FIRE date",
            value: formatINR(result.retirementStartExpenses),
            helpText: `vs ${formatINR(currentMonthlyExpenses)} today`,
            emphasis: "primary",
          },
          {
            label: "Initial withdrawal rate",
            value: formatPercent(result.initialWithdrawalRatePercent, 2),
            helpText: safety.label,
            emphasis: "primary",
          },
          {
            label: "Final corpus (end of retirement)",
            value: result.survives
              ? formatINR(result.finalCorpus)
              : "₹0 — depleted",
            emphasis: "primary",
          },
        ]}
      />

      <div
        className={cn(
          "rounded-xl border p-4 text-sm",
          safety.tone === "ok"
            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200"
            : safety.tone === "warn"
              ? "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200"
              : "border-red-500/30 bg-red-500/5 text-red-900 dark:text-red-200",
        )}
      >
        <p className="font-semibold">{safety.title}</p>
        <p className="mt-1">{safety.advice}</p>
      </div>

      <Tabs defaultValue="accumulation">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="accumulation">Accumulation phase</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown phase</TabsTrigger>
        </TabsList>

        <TabsContent value="accumulation" className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold tracking-tight">
              Corpus growth during accumulation
            </h3>
            <LineChart
              data={accLineData}
              xKey="year"
              series={[
                { key: "invested", label: "Cumulative invested", color: WITHDRAW_COLOR },
                { key: "balance", label: "Portfolio value", color: CORPUS_COLOR },
              ]}
              yTickFormatter={(v) => formatINRCompact(v)}
              ariaLabel="Accumulation phase corpus growth"
            />
          </div>
          <BreakdownTable
            columns={[
              { key: "year", label: "Year", render: (r) => `Year ${r.year}` },
              {
                key: "monthlyContribution",
                label: "Monthly SIP",
                align: "right",
                render: (r) => formatINR(r.monthlyContribution),
              },
              {
                key: "contributionsThisYear",
                label: "Invested",
                align: "right",
                render: (r) => formatINR(r.contributionsThisYear),
              },
              {
                key: "closingBalance",
                label: "Portfolio",
                align: "right",
                render: (r) => formatINR(r.closingBalance),
              },
            ]}
            rows={result.accumulationSchedule}
          />
        </TabsContent>

        <TabsContent value="drawdown" className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold tracking-tight">
              Corpus during retirement
            </h3>
            <LineChart
              data={ddLineData}
              xKey="year"
              series={[
                { key: "balance", label: "Remaining corpus", color: CORPUS_COLOR },
                { key: "withdrawal", label: "Annual withdrawal", color: WITHDRAW_COLOR },
              ]}
              yTickFormatter={(v) => formatINRCompact(v)}
              ariaLabel="Retirement drawdown phase"
            />
          </div>
          <BreakdownTable
            columns={[
              {
                key: "yearOfRetirement",
                label: "Year",
                render: (r) => `R+${r.yearOfRetirement}`,
              },
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
                key: "annualWithdrawal",
                label: "Withdrawn",
                align: "right",
                render: (r) => formatINR(r.annualWithdrawal),
              },
              {
                key: "closingBalance",
                label: "Closing",
                align: "right",
                render: (r) =>
                  r.depleted && r.closingBalance <= 0 ? "Depleted" : formatINR(r.closingBalance),
              },
            ]}
            rows={result.drawdownSchedule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function classifySafety(
  rate: number,
  survives: boolean,
): { tone: "ok" | "warn" | "danger"; title: string; label: string; advice: string } {
  if (!survives || rate > 5) {
    return {
      tone: "danger",
      title: "High depletion risk",
      label: "Above sustainable range",
      advice:
        "At this withdrawal rate, the corpus is unlikely to survive a typical retirement, especially with sequence-of-returns risk. Increase your SIP, extend your accumulation years, or reduce expenses.",
    };
  }
  if (rate > 4) {
    return {
      tone: "warn",
      title: "Moderate risk",
      label: "Aggressive — Bengen 4% territory",
      advice:
        "A withdrawal rate this high is borderline sustainable. Bengen's research suggests ~4% is the upper safe limit for US markets; for India, 3-3.5% is safer due to higher inflation. Add a buffer.",
    };
  }
  return {
    tone: "ok",
    title: "Sustainable plan",
    label: "Within safe withdrawal range",
    advice:
      "Your corpus and withdrawal rate are well within the safe range for Indian markets. Stress-test by running again with returns 2% lower to check resilience.",
  };
}
