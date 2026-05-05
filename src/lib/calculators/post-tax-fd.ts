import {
  calculateFd,
  type CompoundingFrequency,
  type FdInput,
  type FdYearlyRow,
} from "./fd";

export type TaxRegime = "new" | "old";

export type PostTaxFdInput = FdInput & {
  /** Marginal tax slab as percent (e.g. 30 for 30%). Excludes cess. */
  slabRatePercent: number;
  /** Senior citizen (60+) — eligible for ₹50k 80TTB exemption in old regime. */
  seniorCitizen?: boolean;
  /** Tax regime — only old-regime seniors get 80TTB. Defaults to "new". */
  taxRegime?: TaxRegime;
  /**
   * Other 80TTB-eligible interest already claimed in the year (savings + other FDs).
   * Reduces the ₹50k pool. Defaults to 0.
   */
  otherEligibleInterest?: number;
  /**
   * Add 4% Health & Education Cess on the tax (default true — matches Indian
   * tax law). Set false to compare slab-only post-tax math.
   */
  applyCess?: boolean;
};

export type PostTaxFdYearlyRow = FdYearlyRow & {
  taxableInterest: number;
  taxPaid: number;
  postTaxInterest: number;
};

export type PostTaxFdResult = {
  preTaxMaturity: number;
  preTaxTotalInterest: number;
  preTaxEffectiveAnnualYield: number;

  totalTaxPaid: number;
  postTaxMaturity: number;
  postTaxTotalInterest: number;
  /** CAGR of net wealth on a post-tax basis. */
  postTaxCagr: number;
  /** Drag from tax: pre-tax CAGR minus post-tax CAGR, in percentage points. */
  taxDragPp: number;

  schedule: PostTaxFdYearlyRow[];
  compounding: CompoundingFrequency;
};

const CESS_RATE = 0.04;
const SENIOR_80TTB_LIMIT = 50_000;

export function calculatePostTaxFd(input: PostTaxFdInput): PostTaxFdResult {
  const fd = calculateFd(input);
  const compounding: CompoundingFrequency = input.compounding ?? "quarterly";

  if (fd.maturity === 0 || input.principal <= 0) {
    return {
      preTaxMaturity: 0,
      preTaxTotalInterest: 0,
      preTaxEffectiveAnnualYield: 0,
      totalTaxPaid: 0,
      postTaxMaturity: input.principal,
      postTaxTotalInterest: 0,
      postTaxCagr: 0,
      taxDragPp: 0,
      schedule: [],
      compounding,
    };
  }

  const slab = Math.max(0, input.slabRatePercent) / 100;
  const cessMultiplier =
    input.applyCess === false ? 1 : 1 + CESS_RATE;
  const isSeniorOldRegime =
    !!input.seniorCitizen && (input.taxRegime ?? "new") === "old";
  const exemption80TTB = isSeniorOldRegime
    ? Math.max(0, SENIOR_80TTB_LIMIT - (input.otherEligibleInterest ?? 0))
    : 0;

  let cumulativeTax = 0;
  const schedule: PostTaxFdYearlyRow[] = fd.schedule.map((row) => {
    const taxableInterest = Math.max(0, row.interestEarned - exemption80TTB);
    const taxPaid = taxableInterest * slab * cessMultiplier;
    cumulativeTax += taxPaid;
    return {
      ...row,
      taxableInterest,
      taxPaid,
      postTaxInterest: row.interestEarned - taxPaid,
    };
  });

  const postTaxMaturity = input.principal + (fd.totalInterest - cumulativeTax);
  const tYears = input.tenureMonths / 12;
  const preTaxCagr =
    tYears > 0
      ? (Math.pow(fd.maturity / input.principal, 1 / tYears) - 1) * 100
      : 0;
  const postTaxCagr =
    tYears > 0 && postTaxMaturity > 0
      ? (Math.pow(postTaxMaturity / input.principal, 1 / tYears) - 1) * 100
      : 0;

  return {
    preTaxMaturity: fd.maturity,
    preTaxTotalInterest: fd.totalInterest,
    preTaxEffectiveAnnualYield: fd.effectiveAnnualYield,
    totalTaxPaid: cumulativeTax,
    postTaxMaturity,
    postTaxTotalInterest: fd.totalInterest - cumulativeTax,
    postTaxCagr,
    taxDragPp: preTaxCagr - postTaxCagr,
    schedule,
    compounding,
  };
}
