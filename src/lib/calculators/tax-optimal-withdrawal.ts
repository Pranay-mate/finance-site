/**
 * Tax-Optimized Withdrawal Planner.
 *
 * Given an annual expense need and three buckets (tax-free, equity, debt),
 * computes the withdrawal split that minimises tax. Compares the optimised
 * plan against a naive proportional split.
 *
 * Key tax rules used (FY 2025-26):
 *   - Tax-free buckets (PPF, EPF maturity, SSY): zero tax always.
 *   - Equity MF gains: 12.5% above ₹1.25L LTCG exemption per year, assuming
 *     units are held > 12 months. Tax applies to the *gain* portion of
 *     each rupee withdrawn (proportional to unrealized gain %).
 *   - Debt MF gains (post-April-2023 units): full slab rate. Tax applies
 *     to the *gain* portion only.
 *
 * The optimal withdrawal order depends on the user's marginal slab:
 *   - If slab ≤ 12.5%: debt cheaper than equity LTCG above exemption.
 *   - If slab > 12.5%: equity LTCG above exemption cheaper than debt.
 */

export const EQUITY_LTCG_EXEMPTION = 125_000;
export const EQUITY_LTCG_RATE = 0.125;
const CESS = 0.04;

export type WithdrawalBuckets = {
  taxFreeAvailable: number;
  equityAvailable: number;
  /** Unrealized gain as a fraction of equity balance (0-1). */
  equityUnrealizedGainFraction: number;
  debtAvailable: number;
  /** Unrealized gain as a fraction of debt balance (0-1). */
  debtUnrealizedGainFraction: number;
};

export type TaxOptimalInput = WithdrawalBuckets & {
  /** Total annual withdrawal needed (gross of tax). */
  annualExpenses: number;
  /** Marginal tax slab rate as a percentage (e.g. 30 for 30%). */
  marginalSlabPercent: number;
};

export type WithdrawalPlan = {
  fromTaxFree: number;
  fromEquity: number;
  fromDebt: number;
  taxOnEquity: number;
  taxOnDebt: number;
  totalTax: number;
  /** What you keep after tax (i.e., the net amount usable). */
  netReceived: number;
  /** Effective overall tax rate as a percentage of withdrawal. */
  effectiveTaxRatePercent: number;
  /** True if total withdrawn met the expense target. */
  metExpenseTarget: boolean;
};

export type TaxOptimalResult = {
  optimal: WithdrawalPlan;
  naive: WithdrawalPlan;
  savings: number;
};

/**
 * Computes tax for an equity withdrawal of `amount` rupees, given the
 * unrealized gain fraction. Applies the ₹1.25L LTCG exemption once.
 */
function equityTax(amount: number, gainFraction: number): number {
  if (amount <= 0) return 0;
  const gainPortion = amount * gainFraction;
  const taxableGain = Math.max(0, gainPortion - EQUITY_LTCG_EXEMPTION);
  return taxableGain * EQUITY_LTCG_RATE * (1 + CESS);
}

/**
 * Computes tax for a debt withdrawal of `amount` rupees at the marginal slab.
 */
function debtTax(amount: number, gainFraction: number, slabFraction: number): number {
  if (amount <= 0) return 0;
  const gainPortion = amount * gainFraction;
  return gainPortion * slabFraction * (1 + CESS);
}

function buildPlan(
  fromTaxFree: number,
  fromEquity: number,
  fromDebt: number,
  buckets: WithdrawalBuckets,
  slabFraction: number,
  target: number,
): WithdrawalPlan {
  const taxOnEquity = equityTax(fromEquity, buckets.equityUnrealizedGainFraction);
  const taxOnDebt = debtTax(fromDebt, buckets.debtUnrealizedGainFraction, slabFraction);
  const totalTax = taxOnEquity + taxOnDebt;
  const totalWithdrawn = fromTaxFree + fromEquity + fromDebt;
  const netReceived = totalWithdrawn - totalTax;
  const effectiveRate = totalWithdrawn > 0 ? (totalTax / totalWithdrawn) * 100 : 0;

  return {
    fromTaxFree,
    fromEquity,
    fromDebt,
    taxOnEquity,
    taxOnDebt,
    totalTax,
    netReceived,
    effectiveTaxRatePercent: effectiveRate,
    metExpenseTarget: netReceived + 1 >= target, // ₹1 tolerance for fp rounding
  };
}

/**
 * Find the optimal split. Strategy:
 *
 *   1. Drain tax-free first (cheapest).
 *   2. Then equity within the LTCG exemption window. The equity amount that
 *      keeps gains at exactly ₹1.25L is `1.25L / gainFraction`.
 *   3. After that, the cheaper of (a) debt at slab rate, or (b) equity above
 *      LTCG exemption at 12.5%. This depends on the slab.
 *   4. Finally, the more expensive of those two.
 *
 * Each step withdraws up to the bucket's available balance and stops when the
 * expense target is met (we account for tax that this withdrawal will incur,
 * so the net amount equals the target).
 */
function optimalPlan(input: TaxOptimalInput): WithdrawalPlan {
  const slab = input.marginalSlabPercent / 100;
  const buckets = input;
  let target = input.annualExpenses;

  let fromTaxFree = 0;
  let fromEquity = 0;
  let fromDebt = 0;

  // Step 1: tax-free
  if (target > 0 && buckets.taxFreeAvailable > 0) {
    const take = Math.min(target, buckets.taxFreeAvailable);
    fromTaxFree += take;
    target -= take;
  }

  // Step 2: equity within LTCG exemption window
  // We can withdraw `EQUITY_LTCG_EXEMPTION / gainFraction` of equity at zero tax.
  if (target > 0 && buckets.equityAvailable > 0 && buckets.equityUnrealizedGainFraction > 0) {
    const exemptCapacity =
      EQUITY_LTCG_EXEMPTION / buckets.equityUnrealizedGainFraction;
    const availableExempt = Math.min(exemptCapacity, buckets.equityAvailable);
    const take = Math.min(target, availableExempt);
    fromEquity += take;
    target -= take;
  } else if (target > 0 && buckets.equityAvailable > 0) {
    // No gains → no tax, take freely
    const take = Math.min(target, buckets.equityAvailable);
    fromEquity += take;
    target -= take;
  }

  // Step 3 & 4: order between debt vs equity-above-exemption depends on slab.
  // Effective marginal cost on each remaining rupee of withdrawal:
  //   debt: gainFraction × slab
  //   equity above exemption: gainFraction × 12.5%
  const effectiveDebtRate =
    buckets.debtUnrealizedGainFraction * slab * (1 + CESS);
  const effectiveEquityAboveRate =
    buckets.equityUnrealizedGainFraction * EQUITY_LTCG_RATE * (1 + CESS);

  const equityAboveCheaper = effectiveEquityAboveRate <= effectiveDebtRate;

  function takeFromEquityAbove(remaining: number): number {
    const equityRemaining = buckets.equityAvailable - fromEquity;
    if (equityRemaining <= 0 || remaining <= 0) return remaining;
    // Each rupee withdrawn yields (1 - gainFraction × LTCG_RATE × cess) net.
    const netFraction =
      1 - buckets.equityUnrealizedGainFraction * EQUITY_LTCG_RATE * (1 + CESS);
    const grossNeeded = netFraction > 0 ? remaining / netFraction : remaining;
    const take = Math.min(grossNeeded, equityRemaining);
    fromEquity += take;
    return Math.max(0, remaining - take * netFraction);
  }

  function takeFromDebt(remaining: number): number {
    const debtRemaining = buckets.debtAvailable - fromDebt;
    if (debtRemaining <= 0 || remaining <= 0) return remaining;
    const netFraction = 1 - buckets.debtUnrealizedGainFraction * slab * (1 + CESS);
    const grossNeeded = netFraction > 0 ? remaining / netFraction : remaining;
    const take = Math.min(grossNeeded, debtRemaining);
    fromDebt += take;
    return Math.max(0, remaining - take * netFraction);
  }

  if (equityAboveCheaper) {
    target = takeFromEquityAbove(target);
    target = takeFromDebt(target);
  } else {
    target = takeFromDebt(target);
    target = takeFromEquityAbove(target);
  }

  return buildPlan(
    fromTaxFree,
    fromEquity,
    fromDebt,
    buckets,
    slab,
    input.annualExpenses,
  );
}

/**
 * Naive plan: split withdrawals proportionally across the three buckets by
 * available balance. This is what most retirees default to.
 */
function naivePlan(input: TaxOptimalInput): WithdrawalPlan {
  const total =
    input.taxFreeAvailable + input.equityAvailable + input.debtAvailable;
  if (total <= 0) {
    return buildPlan(0, 0, 0, input, input.marginalSlabPercent / 100, input.annualExpenses);
  }
  const fromTaxFree =
    (input.taxFreeAvailable / total) * input.annualExpenses;
  const fromEquity =
    (input.equityAvailable / total) * input.annualExpenses;
  const fromDebt = (input.debtAvailable / total) * input.annualExpenses;

  return buildPlan(
    fromTaxFree,
    fromEquity,
    fromDebt,
    input,
    input.marginalSlabPercent / 100,
    input.annualExpenses,
  );
}

export function calculateTaxOptimalWithdrawal(
  input: TaxOptimalInput,
): TaxOptimalResult {
  const optimal = optimalPlan(input);
  const naive = naivePlan(input);

  return {
    optimal,
    naive,
    savings: Math.max(0, naive.totalTax - optimal.totalTax),
  };
}
