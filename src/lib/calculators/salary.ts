import { calculateIncomeTax, type Regime } from "./income-tax";

/**
 * Salary calculator — converts annual CTC into monthly take-home.
 *
 * Indian CTC is the gross cost to the employer including:
 *   - Basic + DA
 *   - HRA, special allowance, LTA, food coupons
 *   - Employer's EPF contribution (12% of basic, capped at ₹15K basic in EPS split)
 *   - Gratuity provision (~4.81% of basic; not paid out monthly)
 *   - Variable / performance pay
 *
 * What hits your bank each month is much less than CTC / 12 because:
 *   - Employer's EPF + gratuity provisions don't reach you monthly.
 *   - Your own EPF (12% of basic) is deducted.
 *   - Professional tax (₹200/month in most states).
 *   - Income tax (TDS).
 *
 * This calculator uses a typical CTC structure where:
 *   - Basic = `basicPercentOfCtc` × CTC (default 40%)
 *   - HRA = 50% of basic (metro) or 40% (non-metro) — capped at HRA component
 *   - Special allowance = the rest
 *   - Employer EPF = 12% of basic
 *   - Gratuity provision = 4.81% of basic
 *
 * Tax computation reuses our income-tax calculator, including regime choice
 * and any additional deductions the employee declares (80C, 80D, HRA exemption).
 */

export type SalaryInput = {
  /** Annual CTC in rupees. */
  annualCtc: number;
  /** Basic + DA as a fraction of gross CTC (default 0.4). */
  basicPercentOfCtc?: number;
  /** Whether the employee lives in a metro city (affects HRA). */
  isMetro?: boolean;
  /** Tax regime preference. */
  regime?: Regime;
  /** Optional 80C investment for Old regime. */
  section80C?: number;
  /** Optional 80D for Old regime. */
  section80D?: number;
  /** Optional HRA exemption claim (Old regime — actual rent annual). */
  annualRentPaid?: number;
};

export type SalaryBreakdown = {
  annualCtc: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  employerEpf: number;
  gratuityProvision: number;

  /** Annual cash that lands in payroll (CTC minus retirals). */
  annualGrossSalary: number;

  employeeEpf: number;
  professionalTax: number;
  incomeTax: number;
  netAnnualTakeHome: number;
  netMonthlyTakeHome: number;

  effectiveTaxRatePercent: number;
  recommendedRegime: Regime;
};

const PROFESSIONAL_TAX_ANNUAL = 2400;

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const ctc = Math.max(0, input.annualCtc);
  const basicPct = input.basicPercentOfCtc ?? 0.4;
  const isMetro = input.isMetro ?? true;

  const basic = ctc * basicPct;
  const hraRate = isMetro ? 0.5 : 0.4;
  const hraComponent = basic * hraRate;
  const employerEpf = basic * 0.12;
  const gratuityProvision = basic * 0.0481;

  const cashCtcAvailable =
    ctc - employerEpf - gratuityProvision;
  // Special allowance fills whatever is left after basic + HRA from cash.
  const hra = Math.min(hraComponent, Math.max(0, cashCtcAvailable - basic));
  const specialAllowance = Math.max(0, cashCtcAvailable - basic - hra);

  // Gross salary that hits the payroll register (excludes retirals).
  const annualGrossSalary = basic + hra + specialAllowance;

  // Employee's own EPF deduction.
  const employeeEpf = basic * 0.12;
  const professionalTax = annualGrossSalary > 0 ? PROFESSIONAL_TAX_ANNUAL : 0;

  // Compute tax. We feed gross income (before deductions) into the income-tax
  // calculator. The standard deduction is auto-applied inside.
  const taxResult = calculateIncomeTax({
    grossIncome: annualGrossSalary,
    section80C: (input.section80C ?? 0) + employeeEpf,
    section80D: input.section80D,
    otherDeductions: hraExemption(input.annualRentPaid ?? 0, basic, hra, isMetro),
  });

  const regime = input.regime ?? taxResult.recommended;
  const taxForRegime =
    regime === "new" ? taxResult.newRegime : taxResult.oldRegime;
  const incomeTax = taxForRegime.totalTax;

  const netAnnualTakeHome =
    annualGrossSalary - employeeEpf - professionalTax - incomeTax;
  const netMonthlyTakeHome = netAnnualTakeHome / 12;

  return {
    annualCtc: ctc,
    basic,
    hra,
    specialAllowance,
    employerEpf,
    gratuityProvision,
    annualGrossSalary,
    employeeEpf,
    professionalTax,
    incomeTax,
    netAnnualTakeHome,
    netMonthlyTakeHome,
    effectiveTaxRatePercent:
      ctc > 0 ? (incomeTax / ctc) * 100 : 0,
    recommendedRegime: taxResult.recommended,
  };
}

/**
 * HRA exemption per Section 10(13A): minimum of
 *   (a) actual HRA received,
 *   (b) 50% (metro) / 40% (non-metro) of basic + DA,
 *   (c) annual rent paid − 10% of basic + DA
 */
function hraExemption(
  annualRent: number,
  basic: number,
  hra: number,
  isMetro: boolean,
): number {
  if (annualRent <= 0 || hra <= 0) return 0;
  const a = hra;
  const b = basic * (isMetro ? 0.5 : 0.4);
  const c = Math.max(0, annualRent - 0.1 * basic);
  return Math.min(a, b, c);
}
