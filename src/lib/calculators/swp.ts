export type SwpInput = {
  /** Initial corpus in rupees. */
  corpus: number;
  /** Monthly withdrawal in rupees. */
  monthlyWithdrawal: number;
  /** Expected annual return as a percentage. */
  annualReturnPercent: number;
  /** Number of years to project. */
  tenureYears: number;
};

export type SwpYearlyRow = {
  year: number;
  openingBalance: number;
  totalWithdrawn: number;
  growth: number;
  closingBalance: number;
};

export type SwpResult = {
  finalBalance: number;
  totalWithdrawn: number;
  totalGrowth: number;
  monthsLasted: number;
  /** True if corpus ran out before the requested tenure. */
  depleted: boolean;
  schedule: SwpYearlyRow[];
};

/**
 * SWP simulation. Each month: balance grows at monthly rate (annual / 12),
 * then the user withdraws the fixed amount. If balance hits zero, withdrawals
 * stop (we report monthsLasted < requested tenure).
 *
 * Convention: growth applied first (monthly compounding), then withdrawal.
 */
export function calculateSwp(input: SwpInput): SwpResult {
  const { corpus, monthlyWithdrawal, annualReturnPercent, tenureYears } = input;

  if (corpus <= 0 || tenureYears <= 0) {
    return {
      finalBalance: corpus,
      totalWithdrawn: 0,
      totalGrowth: 0,
      monthsLasted: 0,
      depleted: corpus <= 0,
      schedule: [],
    };
  }

  const i = annualReturnPercent / 100 / 12;
  const totalMonths = Math.round(tenureYears * 12);

  let balance = corpus;
  let totalWithdrawn = 0;
  let totalGrowth = 0;
  let monthsLasted = 0;

  const schedule: SwpYearlyRow[] = [];

  for (let y = 1; y <= Math.ceil(tenureYears); y++) {
    const opening = balance;
    let withdrawnThisYear = 0;
    let growthThisYear = 0;
    const monthsThisYear = Math.min(12, totalMonths - (y - 1) * 12);

    for (let m = 0; m < monthsThisYear; m++) {
      if (balance <= 0) break;

      const grown = balance * (1 + i);
      const monthGrowth = grown - balance;
      growthThisYear += monthGrowth;
      balance = grown;

      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      withdrawnThisYear += withdrawal;
      monthsLasted += 1;
    }

    schedule.push({
      year: y,
      openingBalance: opening,
      totalWithdrawn: withdrawnThisYear,
      growth: growthThisYear,
      closingBalance: balance,
    });

    totalWithdrawn += withdrawnThisYear;
    totalGrowth += growthThisYear;

    if (balance <= 0) break;
  }

  return {
    finalBalance: balance,
    totalWithdrawn,
    totalGrowth,
    monthsLasted,
    depleted: balance <= 0 && monthsLasted < totalMonths,
    schedule,
  };
}
