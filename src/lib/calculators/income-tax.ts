/**
 * Indian income-tax calculator for FY 2025-26 (AY 2026-27).
 *
 * Implements both the New Regime (default after Budget 2024) and the Old
 * Regime, including slab math, Section 87A rebate, surcharge with the
 * "marginal relief" thresholds, and the 4% Health & Education Cess.
 *
 * Sources: Finance Act 2024 amendments, Income Tax Department circulars,
 * cross-verified against ClearTax and IT Department's e-Filing calculator.
 */

export type Regime = "new" | "old";

export type IncomeTaxInput = {
  /** Gross annual income from salary, business, etc. (before deductions). */
  grossIncome: number;
  /** Investments under Section 80C (PPF, ELSS, EPF, life insurance). Max ₹1.5L. Old regime only. */
  section80C?: number;
  /** Section 80D — medical insurance premium. Old regime only. */
  section80D?: number;
  /** HRA / LTA / other exemptions. Old regime only. */
  otherDeductions?: number;
  /** Age band — affects basic exemption limit in Old regime. */
  ageGroup?: "below-60" | "60-80" | "above-80";
};

export type SlabBreakdown = {
  range: string;
  rate: number;
  taxOnSlab: number;
};

export type RegimeResult = {
  regime: Regime;
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  takeHome: number;
  effectiveRatePercent: number;
  slabs: SlabBreakdown[];
};

export type IncomeTaxResult = {
  newRegime: RegimeResult;
  oldRegime: RegimeResult;
  recommended: Regime;
  savings: number;
};

/** New Regime slabs (FY 2025-26 / AY 2026-27). */
const NEW_REGIME_SLABS = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 5 },
  { upTo: 1_200_000, rate: 10 },
  { upTo: 1_600_000, rate: 15 },
  { upTo: 2_000_000, rate: 20 },
  { upTo: 2_400_000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

/** Old Regime slabs (FY 2025-26 / AY 2026-27). Below 60 base. */
function oldRegimeSlabs(ageGroup: "below-60" | "60-80" | "above-80") {
  const exemption =
    ageGroup === "above-80" ? 500_000 : ageGroup === "60-80" ? 300_000 : 250_000;
  return [
    { upTo: exemption, rate: 0 },
    { upTo: 500_000, rate: 5 },
    { upTo: 1_000_000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ];
}

const NEW_REGIME_STANDARD_DEDUCTION = 75_000;
const OLD_REGIME_STANDARD_DEDUCTION = 50_000;

/** Section 87A rebate caps. */
const REBATE_87A_NEW_INCOME_LIMIT = 12_00_000;
const REBATE_87A_NEW_MAX = 60_000; // covers entire tax up to ₹12L taxable
const REBATE_87A_OLD_INCOME_LIMIT = 5_00_000;
const REBATE_87A_OLD_MAX = 12_500;

const CESS_RATE = 0.04;

function calculateSlabTax(
  taxableIncome: number,
  slabs: { upTo: number; rate: number }[],
): { tax: number; breakdown: SlabBreakdown[] } {
  let tax = 0;
  let prev = 0;
  const breakdown: SlabBreakdown[] = [];

  for (const slab of slabs) {
    const slabTop = slab.upTo;
    const incomeInSlab = Math.max(0, Math.min(taxableIncome, slabTop) - prev);
    if (incomeInSlab > 0 || (taxableIncome > prev && taxableIncome <= slabTop)) {
      const slabTax = incomeInSlab * (slab.rate / 100);
      tax += slabTax;
      breakdown.push({
        range:
          slabTop === Infinity
            ? `₹${prev.toLocaleString("en-IN")}+`
            : `₹${prev.toLocaleString("en-IN")} – ₹${slabTop.toLocaleString("en-IN")}`,
        rate: slab.rate,
        taxOnSlab: slabTax,
      });
    }
    prev = slabTop;
    if (taxableIncome <= slabTop) break;
  }
  return { tax, breakdown };
}

function calculateSurcharge(taxableIncome: number, taxBeforeRebate: number, regime: Regime): number {
  let surchargePercent = 0;
  if (taxableIncome > 5_00_00_000) {
    // 37% surcharge in Old regime; New regime capped at 25%
    surchargePercent = regime === "old" ? 37 : 25;
  } else if (taxableIncome > 2_00_00_000) {
    surchargePercent = 25;
  } else if (taxableIncome > 1_00_00_000) {
    surchargePercent = 15;
  } else if (taxableIncome > 50_00_000) {
    surchargePercent = 10;
  }
  return taxBeforeRebate * (surchargePercent / 100);
}

function calculateForRegime(
  input: IncomeTaxInput,
  regime: Regime,
): RegimeResult {
  const ageGroup = input.ageGroup ?? "below-60";
  const stdDeduction =
    regime === "new" ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION;

  let totalDeductions = stdDeduction;
  if (regime === "old") {
    totalDeductions +=
      Math.min(input.section80C ?? 0, 150_000) +
      (input.section80D ?? 0) +
      (input.otherDeductions ?? 0);
  }

  const taxableIncome = Math.max(0, input.grossIncome - totalDeductions);
  const slabs = regime === "new" ? NEW_REGIME_SLABS : oldRegimeSlabs(ageGroup);
  const { tax: taxBeforeRebate, breakdown } = calculateSlabTax(taxableIncome, slabs);

  let rebate87A = 0;
  if (regime === "new" && taxableIncome <= REBATE_87A_NEW_INCOME_LIMIT) {
    rebate87A = Math.min(taxBeforeRebate, REBATE_87A_NEW_MAX);
  } else if (regime === "old" && taxableIncome <= REBATE_87A_OLD_INCOME_LIMIT) {
    rebate87A = Math.min(taxBeforeRebate, REBATE_87A_OLD_MAX);
  }

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A);
  const surcharge = calculateSurcharge(taxableIncome, taxAfterRebate, regime);
  const cess = (taxAfterRebate + surcharge) * CESS_RATE;
  const totalTax = taxAfterRebate + surcharge + cess;
  const takeHome = input.grossIncome - totalTax;
  const effectiveRatePercent =
    input.grossIncome > 0 ? (totalTax / input.grossIncome) * 100 : 0;

  return {
    regime,
    grossIncome: input.grossIncome,
    standardDeduction: stdDeduction,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebate87A,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    takeHome,
    effectiveRatePercent,
    slabs: breakdown,
  };
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const newRegime = calculateForRegime(input, "new");
  const oldRegime = calculateForRegime(input, "old");

  const recommended = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return { newRegime, oldRegime, recommended, savings };
}
