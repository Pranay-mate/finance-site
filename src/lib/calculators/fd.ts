export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

export const COMPOUNDING_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

export type FdInput = {
  /** Deposit principal in rupees. */
  principal: number;
  /** Annual nominal interest rate as a percentage (e.g. 7.1 for 7.1%). */
  annualRatePercent: number;
  /** Tenure in months. */
  tenureMonths: number;
  /** Compounding frequency. Indian banks typically use quarterly. */
  compounding?: CompoundingFrequency;
};

export type FdYearlyRow = {
  year: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
};

export type FdResult = {
  maturity: number;
  totalInterest: number;
  effectiveAnnualYield: number;
  schedule: FdYearlyRow[];
};

/**
 * Compound interest with periodic compounding:
 *
 *   A = P × (1 + r / n) ^ (n × t)
 *
 * P = principal, r = annual rate (decimal), n = compounding periods per year, t = years.
 *
 * If the rate is zero, A = P.
 */
export function calculateFd(input: FdInput): FdResult {
  const compounding: CompoundingFrequency = input.compounding ?? "quarterly";
  const n = COMPOUNDING_PER_YEAR[compounding];
  const r = input.annualRatePercent / 100;
  const tYears = input.tenureMonths / 12;

  if (input.principal <= 0 || input.tenureMonths <= 0) {
    return { maturity: 0, totalInterest: 0, effectiveAnnualYield: 0, schedule: [] };
  }

  const periodicRate = r / n;
  const totalPeriods = n * tYears;
  const maturity = input.principal * Math.pow(1 + periodicRate, totalPeriods);
  const totalInterest = maturity - input.principal;

  const effectiveAnnualYield =
    r === 0 ? 0 : (Math.pow(1 + periodicRate, n) - 1) * 100;

  const schedule: FdYearlyRow[] = [];
  let balance = input.principal;
  const fullYears = Math.ceil(tYears);

  for (let y = 1; y <= fullYears; y++) {
    const opening = balance;
    const periodsThisYear =
      y === fullYears ? totalPeriods - (y - 1) * n : n;
    const closing = opening * Math.pow(1 + periodicRate, periodsThisYear);
    schedule.push({
      year: y,
      openingBalance: opening,
      interestEarned: closing - opening,
      closingBalance: closing,
    });
    balance = closing;
  }

  return { maturity, totalInterest, effectiveAnnualYield, schedule };
}
