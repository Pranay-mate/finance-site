/**
 * FIRE (Financial Independence, Retire Early) calculator adapted for India.
 *
 * Models two phases:
 *   1. Accumulation: monthly SIP for `yearsToFire`, growing at `accumulationReturn`.
 *   2. Drawdown: annual withdrawal of (currentExpenses × inflation factor) for
 *      `yearsInRetirement`, growing at `retirementReturn`.
 *
 * Withdrawals are inflation-adjusted (each year's withdrawal grows by
 * `inflationRate`). Returns are real-world: equity-heavy in accumulation,
 * shifting to debt-heavy in retirement (configurable).
 */

export type FireInput = {
  /** Current monthly expenses in today's rupees. */
  currentMonthlyExpenses: number;
  /** Existing investment corpus (₹). */
  currentCorpus: number;
  /** Monthly SIP during accumulation phase (₹). */
  monthlySip: number;
  /** Years until you "FIRE" (start the drawdown phase). */
  yearsToFire: number;
  /** Years you expect to live in retirement after FIRE date. */
  yearsInRetirement: number;
  /** Expected annual return during accumulation, as a percentage (e.g. 12 for 12%). */
  accumulationReturn: number;
  /** Expected annual return during retirement, as a percentage (e.g. 8 for 8%). Typically lower. */
  retirementReturn: number;
  /** Expected annual inflation, as a percentage (e.g. 6 for 6%). */
  inflationRate: number;
  /** Annual SIP step-up as a percentage. 0 means flat SIP. */
  sipStepUpRate?: number;
};

export type AccumulationRow = {
  year: number;
  age?: number;
  monthlyContribution: number;
  contributionsThisYear: number;
  cumulativeInvested: number;
  closingBalance: number;
};

export type DrawdownRow = {
  year: number;
  yearOfRetirement: number;
  openingBalance: number;
  annualWithdrawal: number;
  growth: number;
  closingBalance: number;
  depleted: boolean;
};

export type FireResult = {
  /** Corpus at the FIRE date (in nominal future-rupees). */
  fireCorpus: number;
  /** What that corpus is worth in today's purchasing power. */
  fireCorpusInTodaysRupees: number;
  /** Monthly expenses at the FIRE date in nominal future-rupees. */
  retirementStartExpenses: number;
  /** Approx safe withdrawal rate (annual expenses / fireCorpus * 100). */
  initialWithdrawalRatePercent: number;
  /** Whether the corpus survives the requested retirement years. */
  survives: boolean;
  /** Final corpus at end of `yearsInRetirement` (positive if survived). */
  finalCorpus: number;
  /** Years the corpus actually lasted. */
  yearsCorpusLasted: number;
  accumulationSchedule: AccumulationRow[];
  drawdownSchedule: DrawdownRow[];
};

export function calculateFire(input: FireInput): FireResult {
  const stepUp = (input.sipStepUpRate ?? 0) / 100;
  const inflation = input.inflationRate / 100;
  const accReturn = input.accumulationReturn / 100;
  const retReturn = input.retirementReturn / 100;
  const accMonthlyRate = accReturn / 12;
  const retYears = Math.round(input.yearsInRetirement);
  const fireYears = Math.round(input.yearsToFire);

  // ----- Accumulation phase -----
  const accumulationSchedule: AccumulationRow[] = [];
  let balance = input.currentCorpus;
  let monthlyContribution = input.monthlySip;
  let cumulativeInvested = 0;

  for (let y = 1; y <= fireYears; y++) {
    const opening = balance;
    let yearContribution = 0;
    for (let m = 0; m < 12; m++) {
      balance = (balance + monthlyContribution) * (1 + accMonthlyRate);
      yearContribution += monthlyContribution;
    }
    cumulativeInvested += yearContribution;
    accumulationSchedule.push({
      year: y,
      monthlyContribution,
      contributionsThisYear: yearContribution,
      cumulativeInvested,
      closingBalance: balance,
    });
    monthlyContribution *= 1 + stepUp;
    void opening;
  }

  const fireCorpus = balance;
  const inflationFactorAtFire = Math.pow(1 + inflation, fireYears);
  const fireCorpusInTodaysRupees = fireCorpus / inflationFactorAtFire;
  const retirementStartExpenses =
    input.currentMonthlyExpenses * inflationFactorAtFire;
  const annualExpensesAtFire = retirementStartExpenses * 12;
  const initialWithdrawalRatePercent =
    fireCorpus > 0 ? (annualExpensesAtFire / fireCorpus) * 100 : 0;

  // ----- Drawdown phase -----
  const drawdownSchedule: DrawdownRow[] = [];
  let drawdownBalance = fireCorpus;
  let yearlyWithdrawal = annualExpensesAtFire;
  let yearsLasted = 0;
  let depleted = false;

  for (let r = 1; r <= retYears; r++) {
    const opening = drawdownBalance;
    if (drawdownBalance <= 0) {
      drawdownSchedule.push({
        year: fireYears + r,
        yearOfRetirement: r,
        openingBalance: 0,
        annualWithdrawal: 0,
        growth: 0,
        closingBalance: 0,
        depleted: true,
      });
      depleted = true;
      continue;
    }

    const grown = drawdownBalance * (1 + retReturn);
    const growth = grown - drawdownBalance;
    const actualWithdrawal = Math.min(yearlyWithdrawal, grown);
    const closing = grown - actualWithdrawal;

    drawdownSchedule.push({
      year: fireYears + r,
      yearOfRetirement: r,
      openingBalance: opening,
      annualWithdrawal: actualWithdrawal,
      growth,
      closingBalance: closing,
      depleted: closing <= 0,
    });

    drawdownBalance = closing;
    if (closing > 0) yearsLasted = r;
    yearlyWithdrawal *= 1 + inflation;
  }

  return {
    fireCorpus,
    fireCorpusInTodaysRupees,
    retirementStartExpenses,
    initialWithdrawalRatePercent,
    survives: !depleted && drawdownBalance > 0,
    finalCorpus: Math.max(0, drawdownBalance),
    yearsCorpusLasted: yearsLasted,
    accumulationSchedule,
    drawdownSchedule,
  };
}
