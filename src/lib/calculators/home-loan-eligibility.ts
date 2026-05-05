export type HomeLoanEligibilityInput = {
  /** Net (post-tax) monthly income in rupees. */
  monthlyIncome: number;
  /** Sum of existing monthly EMI obligations (other loans, credit cards). */
  existingEmi: number;
  /** Annual interest rate as a percentage (e.g. 8.75). */
  annualRatePercent: number;
  /** Loan tenure in months (banks allow up to 360 = 30 years). */
  tenureMonths: number;
  /**
   * Fixed Obligations to Income Ratio cap as a percentage (e.g. 50 means
   * total EMIs can be up to 50% of net monthly income). Banks typically
   * use 40–60% depending on income tier.
   */
  foirPercent: number;
  /**
   * Down payment as a percentage of property value (default 20%).
   * Used to derive the buyable property budget.
   */
  downPaymentPercent?: number;
};

export type HomeLoanEligibilityResult = {
  maxEmi: number;
  maxLoanAmount: number;
  /** Loan + down-payment budget. */
  propertyBudget: number;
  downPayment: number;
  totalInterest: number;
  totalPayment: number;
  /** Helpful diagnostic — what FOIR would be hit at the max EMI. */
  effectiveFoirPercent: number;
};

/**
 * Standard Indian bank eligibility model:
 *
 *   max EMI    = (income × FOIR) − existing EMIs
 *   max loan   = max EMI × ((1 + r)^n − 1) / (r × (1 + r)^n)
 *
 * where r = monthly rate, n = tenure in months. This is the inverse of
 * the reducing-balance EMI formula. If r = 0, max loan = max EMI × n.
 */
export function calculateHomeLoanEligibility(
  input: HomeLoanEligibilityInput,
): HomeLoanEligibilityResult {
  const {
    monthlyIncome,
    existingEmi,
    annualRatePercent,
    tenureMonths,
    foirPercent,
    downPaymentPercent = 20,
  } = input;

  if (monthlyIncome <= 0 || tenureMonths <= 0 || foirPercent <= 0) {
    return {
      maxEmi: 0,
      maxLoanAmount: 0,
      propertyBudget: 0,
      downPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      effectiveFoirPercent: 0,
    };
  }

  const foir = foirPercent / 100;
  const maxEmi = Math.max(0, monthlyIncome * foir - existingEmi);

  const monthlyRate = annualRatePercent / 100 / 12;
  const n = Math.round(tenureMonths);

  let maxLoanAmount: number;
  if (monthlyRate === 0) {
    maxLoanAmount = maxEmi * n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    maxLoanAmount = (maxEmi * (factor - 1)) / (monthlyRate * factor);
  }

  const dpFraction = Math.min(0.99, Math.max(0, downPaymentPercent / 100));
  const propertyBudget = dpFraction < 1 ? maxLoanAmount / (1 - dpFraction) : 0;
  const downPayment = propertyBudget - maxLoanAmount;

  const totalPayment = maxEmi * n;
  const totalInterest = Math.max(0, totalPayment - maxLoanAmount);
  const effectiveFoirPercent = ((maxEmi + existingEmi) / monthlyIncome) * 100;

  return {
    maxEmi,
    maxLoanAmount,
    propertyBudget,
    downPayment,
    totalInterest,
    totalPayment,
    effectiveFoirPercent,
  };
}
