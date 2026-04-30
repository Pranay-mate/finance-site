export type EmiInput = {
  /** Loan principal in rupees. */
  principal: number;
  /** Annual nominal interest rate as a percentage (e.g. 8.5 for 8.5%). */
  annualRatePercent: number;
  /** Loan tenure in months. */
  tenureMonths: number;
};

export type EmiAmortizationRow = {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

export type EmiYearlyRow = {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

export type EmiResult = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  schedule: EmiAmortizationRow[];
  yearly: EmiYearlyRow[];
};

/**
 * Reducing-balance EMI formula:
 *
 *   EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 *
 * where P = principal, r = monthly rate, n = tenure in months.
 *
 * If the rate is zero, EMI = P / n.
 */
export function calculateEmi(input: EmiInput): EmiResult {
  const { principal, annualRatePercent, tenureMonths } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      emi: 0,
      totalPayment: 0,
      totalInterest: 0,
      totalPrincipal: principal,
      schedule: [],
      yearly: [],
    };
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  const n = Math.round(tenureMonths);

  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const schedule: EmiAmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= n; m++) {
    const interestPaid = balance * monthlyRate;
    let principalPaid = emi - interestPaid;

    if (m === n) {
      principalPaid = balance;
    }

    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month: m,
      emi,
      principalPaid,
      interestPaid,
      balance,
    });
  }

  const totalPayment = schedule.reduce(
    (sum, row) => sum + row.principalPaid + row.interestPaid,
    0,
  );
  const totalInterest = schedule.reduce((sum, row) => sum + row.interestPaid, 0);

  const yearly: EmiYearlyRow[] = [];
  for (let y = 1; y <= Math.ceil(n / 12); y++) {
    const yearRows = schedule.slice((y - 1) * 12, y * 12);
    if (yearRows.length === 0) break;
    yearly.push({
      year: y,
      principalPaid: yearRows.reduce((s, r) => s + r.principalPaid, 0),
      interestPaid: yearRows.reduce((s, r) => s + r.interestPaid, 0),
      balance: yearRows[yearRows.length - 1].balance,
    });
  }

  return {
    emi,
    totalPayment,
    totalInterest,
    totalPrincipal: principal,
    schedule,
    yearly,
  };
}
