/**
 * Current PPF interest rate notified by Government of India for FY 2025-26.
 * The rate is reviewed quarterly; this is the effective rate as of the
 * most recent notification.
 */
export const PPF_DEFAULT_RATE_PERCENT = 7.1;

/** Min and max annual deposit in a PPF account (Government of India rules). */
export const PPF_MIN_ANNUAL_DEPOSIT = 500;
export const PPF_MAX_ANNUAL_DEPOSIT = 150_000;

/** Mandatory minimum lock-in. Account can be extended in 5-year blocks after this. */
export const PPF_MIN_TENURE_YEARS = 15;

export type PpfInput = {
  /** Annual deposit in rupees. Must be between 500 and 1,50,000. */
  annualDeposit: number;
  /** Annual interest rate as a percentage. */
  annualRatePercent: number;
  /** Tenure in years (minimum 15). */
  tenureYears: number;
};

export type PpfYearlyRow = {
  year: number;
  openingBalance: number;
  deposit: number;
  interestEarned: number;
  closingBalance: number;
};

export type PpfResult = {
  maturity: number;
  totalDeposited: number;
  totalInterest: number;
  schedule: PpfYearlyRow[];
};

/**
 * PPF maturity assuming the annual deposit is made at the start of each year
 * (so it earns interest for the full year). This matches India Post / SBI /
 * ClearTax PPF calculators when the deposit is made before April 5 each FY.
 *
 * Closed-form (annuity-due, annual compounding):
 *   A = R × (1 + r) × ((1 + r)^N − 1) / r
 */
export function calculatePpf(input: PpfInput): PpfResult {
  const { annualDeposit, annualRatePercent, tenureYears } = input;

  if (annualDeposit <= 0 || tenureYears <= 0) {
    return { maturity: 0, totalDeposited: 0, totalInterest: 0, schedule: [] };
  }

  const r = annualRatePercent / 100;
  const N = Math.round(tenureYears);
  const schedule: PpfYearlyRow[] = [];

  let balance = 0;
  for (let y = 1; y <= N; y++) {
    const opening = balance;
    const afterDeposit = opening + annualDeposit;
    const interestEarned = afterDeposit * r;
    const closing = afterDeposit + interestEarned;
    schedule.push({
      year: y,
      openingBalance: opening,
      deposit: annualDeposit,
      interestEarned,
      closingBalance: closing,
    });
    balance = closing;
  }

  const totalDeposited = annualDeposit * N;
  const totalInterest = balance - totalDeposited;

  return {
    maturity: balance,
    totalDeposited,
    totalInterest,
    schedule,
  };
}
