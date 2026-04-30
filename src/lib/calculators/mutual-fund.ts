export type SipInput = {
  /** Monthly SIP installment in rupees. */
  monthlyAmount: number;
  /** Expected annual return as a percentage (e.g. 12 for 12%). */
  annualReturnPercent: number;
  /** Tenure in years. */
  tenureYears: number;
};

export type SipYearlyRow = {
  year: number;
  invested: number;
  estimatedReturns: number;
  closingBalance: number;
};

export type SipResult = {
  futureValue: number;
  totalInvested: number;
  totalReturns: number;
  schedule: SipYearlyRow[];
};

/**
 * SIP future value with monthly contribution, monthly compounding equivalent
 * to the annual return r (annuity-due — deposits at start of month):
 *
 *   i = r / 12 (monthly rate)
 *   N = tenure in months
 *   A = P × ((1+i)^N − 1) / i × (1+i)
 *
 * This matches Groww / ClearTax / ET Money SIP calculators.
 */
export function calculateSip(input: SipInput): SipResult {
  const { monthlyAmount, annualReturnPercent, tenureYears } = input;

  if (monthlyAmount <= 0 || tenureYears <= 0) {
    return { futureValue: 0, totalInvested: 0, totalReturns: 0, schedule: [] };
  }

  const N = Math.round(tenureYears * 12);
  const totalInvested = monthlyAmount * N;

  if (annualReturnPercent === 0) {
    return {
      futureValue: totalInvested,
      totalInvested,
      totalReturns: 0,
      schedule: buildSipSchedule(monthlyAmount, 0, tenureYears),
    };
  }

  const i = annualReturnPercent / 100 / 12;
  const futureValue =
    monthlyAmount * ((Math.pow(1 + i, N) - 1) / i) * (1 + i);

  return {
    futureValue,
    totalInvested,
    totalReturns: futureValue - totalInvested,
    schedule: buildSipSchedule(monthlyAmount, i, tenureYears),
  };
}

function buildSipSchedule(
  monthlyAmount: number,
  monthlyRate: number,
  tenureYears: number,
): SipYearlyRow[] {
  const N = Math.round(tenureYears * 12);
  const schedule: SipYearlyRow[] = [];
  let balance = 0;
  let invested = 0;

  const totalYears = Math.ceil(tenureYears);

  for (let y = 1; y <= totalYears; y++) {
    const monthsThisYear = Math.min(12, N - (y - 1) * 12);
    for (let m = 0; m < monthsThisYear; m++) {
      balance = (balance + monthlyAmount) * (1 + monthlyRate);
      invested += monthlyAmount;
    }
    schedule.push({
      year: y,
      invested,
      estimatedReturns: balance - invested,
      closingBalance: balance,
    });
  }

  return schedule;
}
