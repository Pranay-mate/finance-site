/**
 * Current EPF interest rate notified by EPFO for FY 2024-25.
 * Reviewed annually; check EPFO website for latest.
 */
export const EPF_DEFAULT_RATE_PERCENT = 8.25;

/** Standard contribution rates under EPF Act. */
export const EPF_EMPLOYEE_CONTRIBUTION_PERCENT = 12;
/**
 * Employer contributes 12% of basic + DA, but 8.33% of basic up to ₹15,000
 * is diverted to EPS (Employees' Pension Scheme). The rest (3.67%) goes to EPF.
 * For salaries above the ₹15K wage ceiling, the EPS contribution stays capped
 * at ₹1,250/month (8.33% of ₹15K), so the EPF portion of the employer share grows.
 *
 * For simplicity, this calculator assumes employer's full 12% is credited to EPF
 * (the convention most simplified EPF calculators — including Groww, ClearTax —
 * follow when the user wants a quick projection). The FAQ explains the EPS split.
 */
export const EPF_EMPLOYER_CONTRIBUTION_PERCENT = 12;

export type EpfInput = {
  /** Monthly basic + DA in rupees. */
  monthlyBasic: number;
  /** Employee's age (used to derive years to retirement). */
  currentAge: number;
  /** Retirement age. Defaults to 60. */
  retirementAge?: number;
  /** Annual salary growth as a percentage (e.g. 10 for 10%). */
  annualSalaryGrowthPercent: number;
  /** EPF interest rate as a percentage. */
  annualRatePercent: number;
  /** Existing EPF balance (optional). */
  existingBalance?: number;
  /** Override employee contribution % (defaults to 12). */
  employeeContributionPercent?: number;
  /** Override employer contribution % (defaults to 12). */
  employerContributionPercent?: number;
};

export type EpfYearlyRow = {
  year: number;
  age: number;
  monthlyBasic: number;
  employeeContribution: number;
  employerContribution: number;
  interestEarned: number;
  closingBalance: number;
};

export type EpfResult = {
  retirementCorpus: number;
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalInterest: number;
  schedule: EpfYearlyRow[];
};

/**
 * Models monthly contributions invested at the EPF monthly rate (annual / 12)
 * with annual compounding equivalence. Salary increments apply once per year.
 * Existing balance, if any, grows at the annual rate from year 0.
 */
export function calculateEpf(input: EpfInput): EpfResult {
  const retirementAge = input.retirementAge ?? 60;
  const yearsToRetirement = retirementAge - input.currentAge;

  if (
    input.monthlyBasic <= 0 ||
    yearsToRetirement <= 0 ||
    input.annualRatePercent < 0
  ) {
    return {
      retirementCorpus: input.existingBalance ?? 0,
      totalEmployeeContribution: 0,
      totalEmployerContribution: 0,
      totalInterest: 0,
      schedule: [],
    };
  }

  const employeePct =
    (input.employeeContributionPercent ?? EPF_EMPLOYEE_CONTRIBUTION_PERCENT) / 100;
  const employerPct =
    (input.employerContributionPercent ?? EPF_EMPLOYER_CONTRIBUTION_PERCENT) / 100;
  const r = input.annualRatePercent / 100;
  const i = r / 12;
  const growth = input.annualSalaryGrowthPercent / 100;

  let monthlyBasic = input.monthlyBasic;
  let balance = input.existingBalance ?? 0;
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalInterest = 0;

  const schedule: EpfYearlyRow[] = [];

  for (let y = 1; y <= yearsToRetirement; y++) {
    const opening = balance;
    const monthlyContribution = monthlyBasic * (employeePct + employerPct);
    const empContribAnnual = monthlyBasic * employeePct * 12;
    const employerContribAnnual = monthlyBasic * employerPct * 12;

    const balanceFromOpening = opening * (1 + r);
    const balanceFromContributions =
      r === 0
        ? monthlyContribution * 12
        : monthlyContribution * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);

    const closing = balanceFromOpening + balanceFromContributions;
    const interestThisYear = closing - opening - empContribAnnual - employerContribAnnual;

    schedule.push({
      year: y,
      age: input.currentAge + y,
      monthlyBasic,
      employeeContribution: empContribAnnual,
      employerContribution: employerContribAnnual,
      interestEarned: interestThisYear,
      closingBalance: closing,
    });

    balance = closing;
    totalEmployee += empContribAnnual;
    totalEmployer += employerContribAnnual;
    totalInterest += interestThisYear;
    monthlyBasic *= 1 + growth;
  }

  return {
    retirementCorpus: balance,
    totalEmployeeContribution: totalEmployee,
    totalEmployerContribution: totalEmployer,
    totalInterest,
    schedule,
  };
}
