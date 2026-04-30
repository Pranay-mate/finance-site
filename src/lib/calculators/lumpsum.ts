export type LumpsumInput = {
  /** Investment amount in rupees. */
  principal: number;
  /** Expected annual return as a percentage (e.g. 12 for 12%). */
  annualReturnPercent: number;
  /** Investment horizon in years. Fractional values supported. */
  tenureYears: number;
};

export type LumpsumYearlyRow = {
  year: number;
  openingBalance: number;
  growth: number;
  closingBalance: number;
};

export type LumpsumResult = {
  futureValue: number;
  totalInvested: number;
  totalGain: number;
  schedule: LumpsumYearlyRow[];
};

/**
 * Mutual-fund / equity convention: annual compounding.
 *
 *   A = P × (1 + r) ^ t
 */
export function calculateLumpsum(input: LumpsumInput): LumpsumResult {
  const { principal, annualReturnPercent, tenureYears } = input;

  if (principal <= 0 || tenureYears <= 0) {
    return { futureValue: 0, totalInvested: principal, totalGain: 0, schedule: [] };
  }

  const r = annualReturnPercent / 100;
  const futureValue = principal * Math.pow(1 + r, tenureYears);
  const totalGain = futureValue - principal;

  const schedule: LumpsumYearlyRow[] = [];
  let balance = principal;
  const totalYears = Math.ceil(tenureYears);

  for (let y = 1; y <= totalYears; y++) {
    const yearFraction = y === totalYears ? tenureYears - (y - 1) : 1;
    const opening = balance;
    const closing = opening * Math.pow(1 + r, yearFraction);
    schedule.push({
      year: y,
      openingBalance: opening,
      growth: closing - opening,
      closingBalance: closing,
    });
    balance = closing;
  }

  return {
    futureValue,
    totalInvested: principal,
    totalGain,
    schedule,
  };
}
