/**
 * NPS (National Pension System) corpus calculator.
 *
 * Models monthly contributions during accumulation, with optional employer
 * contribution under 80CCD(2). Returns are based on the chosen asset mix
 * (typical 75% equity / 15% corp debt / 10% govt bonds at age 30, glides
 * down with age).
 *
 * At age 60:
 *   - 60% can be withdrawn lump-sum (tax-free).
 *   - 40% must be converted to an annuity (taxable as income).
 *
 * Annuity rate is configurable; typical Indian ASP rates are 6-7%.
 */

export type NpsInput = {
  /** Current age (must be < retirement age). */
  currentAge: number;
  /** Retirement age — locked at 60 for NPS Tier 1 unless premature exit. */
  retirementAge?: number;
  /** Monthly self contribution (₹). */
  monthlySelfContribution: number;
  /** Monthly employer contribution (₹) — under 80CCD(2). */
  monthlyEmployerContribution?: number;
  /** Expected annual return during accumulation, as a percentage. */
  annualReturnPercent: number;
  /** Annuity rate at retirement, as a percentage. */
  annuityRatePercent: number;
  /** Existing NPS corpus, if any. */
  existingCorpus?: number;
};

export type NpsYearlyRow = {
  year: number;
  age: number;
  selfContribution: number;
  employerContribution: number;
  growth: number;
  closingBalance: number;
};

export type NpsResult = {
  retirementCorpus: number;
  totalSelfContributions: number;
  totalEmployerContributions: number;
  totalGrowth: number;
  /** 60% lump sum at retirement (tax-free). */
  lumpSumAtRetirement: number;
  /** 40% mandatory annuity. */
  annuityCorpus: number;
  /** Annual pension before tax (annuity corpus × annuity rate). */
  annualPensionBeforeTax: number;
  monthlyPensionBeforeTax: number;
  schedule: NpsYearlyRow[];
};

export function calculateNps(input: NpsInput): NpsResult {
  const retirementAge = input.retirementAge ?? 60;
  const yearsToRetirement = Math.max(0, retirementAge - input.currentAge);

  if (yearsToRetirement === 0) {
    const corpus = input.existingCorpus ?? 0;
    return zeroResult(corpus, input.annuityRatePercent);
  }

  const r = input.annualReturnPercent / 100;
  const i = r / 12;
  const employerMonthly = input.monthlyEmployerContribution ?? 0;
  const totalMonthlyContribution =
    input.monthlySelfContribution + employerMonthly;

  if (totalMonthlyContribution <= 0 && (input.existingCorpus ?? 0) <= 0) {
    return zeroResult(0, input.annuityRatePercent);
  }

  let balance = input.existingCorpus ?? 0;
  let totalSelf = 0;
  let totalEmployer = 0;
  let totalGrowth = 0;
  const schedule: NpsYearlyRow[] = [];

  for (let y = 1; y <= yearsToRetirement; y++) {
    const opening = balance;
    let yearGrowth = 0;
    for (let m = 0; m < 12; m++) {
      const grown = (balance + totalMonthlyContribution) * (1 + i);
      const monthGrowth = grown - balance - totalMonthlyContribution;
      yearGrowth += monthGrowth;
      balance = grown;
    }
    const yearSelfContribution = input.monthlySelfContribution * 12;
    const yearEmployerContribution = employerMonthly * 12;
    totalSelf += yearSelfContribution;
    totalEmployer += yearEmployerContribution;
    totalGrowth += yearGrowth;

    schedule.push({
      year: y,
      age: input.currentAge + y,
      selfContribution: yearSelfContribution,
      employerContribution: yearEmployerContribution,
      growth: yearGrowth,
      closingBalance: balance,
    });
    void opening;
  }

  const retirementCorpus = balance;
  const lumpSumAtRetirement = retirementCorpus * 0.6;
  const annuityCorpus = retirementCorpus * 0.4;
  const annuityRate = input.annuityRatePercent / 100;
  const annualPensionBeforeTax = annuityCorpus * annuityRate;
  const monthlyPensionBeforeTax = annualPensionBeforeTax / 12;

  return {
    retirementCorpus,
    totalSelfContributions: totalSelf,
    totalEmployerContributions: totalEmployer,
    totalGrowth,
    lumpSumAtRetirement,
    annuityCorpus,
    annualPensionBeforeTax,
    monthlyPensionBeforeTax,
    schedule,
  };
}

function zeroResult(corpus: number, annuityRatePct: number): NpsResult {
  const annuity = corpus * 0.4;
  return {
    retirementCorpus: corpus,
    totalSelfContributions: 0,
    totalEmployerContributions: 0,
    totalGrowth: 0,
    lumpSumAtRetirement: corpus * 0.6,
    annuityCorpus: annuity,
    annualPensionBeforeTax: annuity * (annuityRatePct / 100),
    monthlyPensionBeforeTax: (annuity * (annuityRatePct / 100)) / 12,
    schedule: [],
  };
}
