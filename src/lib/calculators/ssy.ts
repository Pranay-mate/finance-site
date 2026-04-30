/** Sukanya Samriddhi Yojana official rate notified for FY 2024-25 (post-Q4 review). */
export const SSY_DEFAULT_RATE_PERCENT = 8.2;
export const SSY_MIN_ANNUAL_DEPOSIT = 250;
export const SSY_MAX_ANNUAL_DEPOSIT = 150_000;
export const SSY_DEPOSIT_YEARS = 15;
export const SSY_MATURITY_YEARS = 21;

export type SsyInput = {
  /** Annual deposit in rupees. ₹250 - ₹1,50,000. */
  annualDeposit: number;
  /** Daughter's current age (used to project deposits made and remaining). */
  girlChildAge: number;
  /** Annual interest rate as a percentage. */
  annualRatePercent: number;
};

export type SsyYearlyRow = {
  year: number;
  age: number;
  deposit: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
};

export type SsyResult = {
  maturity: number;
  totalDeposited: number;
  totalInterest: number;
  yearsOfDeposits: number;
  schedule: SsyYearlyRow[];
};

/**
 * SSY accepts deposits only for the first 15 years from account opening.
 * From year 16 to year 21, the balance keeps compounding tax-free without
 * further contributions. Maturity is at year 21 from opening (or earlier if
 * the daughter marries after 18). Annual compounding, deposit at start of year.
 */
export function calculateSsy(input: SsyInput): SsyResult {
  const { annualDeposit, girlChildAge, annualRatePercent } = input;

  if (annualDeposit <= 0 || annualRatePercent < 0 || girlChildAge < 0) {
    return {
      maturity: 0,
      totalDeposited: 0,
      totalInterest: 0,
      yearsOfDeposits: 0,
      schedule: [],
    };
  }

  const r = annualRatePercent / 100;
  const schedule: SsyYearlyRow[] = [];
  let balance = 0;
  let totalDeposited = 0;

  for (let y = 1; y <= SSY_MATURITY_YEARS; y++) {
    const opening = balance;
    const deposit = y <= SSY_DEPOSIT_YEARS ? annualDeposit : 0;
    const afterDeposit = opening + deposit;
    const interestEarned = afterDeposit * r;
    const closing = afterDeposit + interestEarned;

    schedule.push({
      year: y,
      age: girlChildAge + y,
      deposit,
      openingBalance: opening,
      interestEarned,
      closingBalance: closing,
    });

    totalDeposited += deposit;
    balance = closing;
  }

  return {
    maturity: balance,
    totalDeposited,
    totalInterest: balance - totalDeposited,
    yearsOfDeposits: SSY_DEPOSIT_YEARS,
    schedule,
  };
}
