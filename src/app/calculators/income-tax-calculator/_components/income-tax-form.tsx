"use client";

import { useMemo, useState } from "react";
import { calculateIncomeTax, type RegimeResult } from "@/lib/calculators/income-tax";
import { formatINR, formatPercent } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { BreakdownTable } from "@/components/calculator/breakdown-table";
import { cn } from "@/lib/utils";

function RegimeColumn({
  result,
  isRecommended,
}: {
  result: RegimeResult;
  isRecommended: boolean;
}) {
  const title = result.regime === "new" ? "New Regime" : "Old Regime";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6",
        isRecommended ? "border-foreground" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {isRecommended && (
          <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
            Recommended
          </span>
        )}
      </div>

      <p className="mt-4 text-3xl font-semibold tabular-nums">
        {formatINR(result.totalTax)}
      </p>
      <p className="text-xs text-muted-foreground">
        Total tax · Effective rate {formatPercent(result.effectiveRatePercent, 2)}
      </p>

      <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Gross income</dt>
          <dd className="tabular-nums">{formatINR(result.grossIncome)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Standard deduction</dt>
          <dd className="tabular-nums">− {formatINR(result.standardDeduction)}</dd>
        </div>
        {result.totalDeductions > result.standardDeduction && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Other deductions (80C, 80D, HRA…)</dt>
            <dd className="tabular-nums">
              − {formatINR(result.totalDeductions - result.standardDeduction)}
            </dd>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2">
          <dt className="font-medium">Taxable income</dt>
          <dd className="font-semibold tabular-nums">{formatINR(result.taxableIncome)}</dd>
        </div>
        <div className="flex justify-between pt-2">
          <dt className="text-muted-foreground">Tax (slab)</dt>
          <dd className="tabular-nums">{formatINR(result.taxBeforeRebate)}</dd>
        </div>
        {result.rebate87A > 0 && (
          <div className="flex justify-between text-green-700 dark:text-green-400">
            <dt>87A rebate</dt>
            <dd className="tabular-nums">− {formatINR(result.rebate87A)}</dd>
          </div>
        )}
        {result.surcharge > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Surcharge</dt>
            <dd className="tabular-nums">+ {formatINR(result.surcharge)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Health & Education Cess (4%)</dt>
          <dd className="tabular-nums">+ {formatINR(result.cess)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <dt className="font-medium">Take-home (after tax)</dt>
          <dd className="font-semibold tabular-nums">{formatINR(result.takeHome)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function IncomeTaxForm() {
  const [grossIncome, setGrossIncome] = useState(15_00_000);
  const [section80C, setSection80C] = useState(150_000);
  const [section80D, setSection80D] = useState(25_000);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const result = useMemo(
    () =>
      calculateIncomeTax({
        grossIncome,
        section80C,
        section80D,
        otherDeductions,
      }),
    [grossIncome, section80C, section80D, otherDeductions],
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-7 md:grid-cols-2">
          <NumberInput
            id="it-gross"
            label="Gross annual income"
            value={grossIncome}
            min={1_00_000}
            max={5_00_00_000}
            step={50_000}
            suffix="INR"
            onChange={setGrossIncome}
            helperText="Salary + bonus + other income, before deductions"
          />
          <NumberInput
            id="it-80c"
            label="Section 80C (Old regime only)"
            value={section80C}
            min={0}
            max={1_50_000}
            step={5_000}
            suffix="INR"
            onChange={setSection80C}
            helperText="PPF, ELSS, EPF, life insurance — capped at ₹1.5L"
          />
          <NumberInput
            id="it-80d"
            label="Section 80D (Old regime only)"
            value={section80D}
            min={0}
            max={1_00_000}
            step={1_000}
            suffix="INR"
            onChange={setSection80D}
            helperText="Medical insurance premium for self/family"
          />
          <NumberInput
            id="it-other"
            label="HRA + other exemptions (Old regime only)"
            value={otherDeductions}
            min={0}
            max={20_00_000}
            step={10_000}
            suffix="INR"
            onChange={setOtherDeductions}
            helperText="HRA, LTA, home loan interest, etc."
          />
        </div>
      </div>

      <ResultCard
        headline={{
          label:
            result.recommended === "new"
              ? "New Regime saves you"
              : "Old Regime saves you",
          value: formatINR(result.savings),
          helpText:
            result.savings === 0
              ? "Both regimes give the same outcome"
              : `Choose ${result.recommended === "new" ? "New" : "Old"} regime when filing your return`,
        }}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RegimeColumn
          result={result.newRegime}
          isRecommended={result.recommended === "new"}
        />
        <RegimeColumn
          result={result.oldRegime}
          isRecommended={result.recommended === "old"}
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold tracking-tight">
          {result.recommended === "new" ? "New" : "Old"} Regime — slab-by-slab tax
        </h3>
        <BreakdownTable
          columns={[
            { key: "range", label: "Income range", render: (r) => r.range },
            {
              key: "rate",
              label: "Rate",
              align: "right",
              render: (r) => `${r.rate}%`,
            },
            {
              key: "taxOnSlab",
              label: "Tax on this slab",
              align: "right",
              render: (r) => formatINR(r.taxOnSlab),
            },
          ]}
          rows={
            result.recommended === "new"
              ? result.newRegime.slabs
              : result.oldRegime.slabs
          }
        />
      </div>
    </div>
  );
}
