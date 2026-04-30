export type CashFlow = {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Amount — negative for outflows (investments), positive for inflows (redemptions, current value). */
  amount: number;
};

export type XirrResult = {
  /** Annualised return as a percentage (e.g. 12.34 means 12.34%). NaN if not converged. */
  ratePercent: number;
  iterations: number;
  converged: boolean;
};

const MAX_ITERATIONS = 100;
const TOLERANCE = 1e-7;
const DAYS_IN_YEAR = 365;

function dayDifference(later: string, earlier: string): number {
  const a = new Date(later).getTime();
  const b = new Date(earlier).getTime();
  return (a - b) / (1000 * 60 * 60 * 24);
}

function npv(rate: number, flows: CashFlow[], baseDate: string): number {
  let sum = 0;
  for (const flow of flows) {
    const t = dayDifference(flow.date, baseDate) / DAYS_IN_YEAR;
    sum += flow.amount / Math.pow(1 + rate, t);
  }
  return sum;
}

function npvDerivative(rate: number, flows: CashFlow[], baseDate: string): number {
  let sum = 0;
  for (const flow of flows) {
    const t = dayDifference(flow.date, baseDate) / DAYS_IN_YEAR;
    if (t === 0) continue;
    sum += (-t * flow.amount) / Math.pow(1 + rate, t + 1);
  }
  return sum;
}

/**
 * Computes XIRR for irregular cashflows. Uses Newton-Raphson with a bisection
 * fallback if Newton fails to converge. Excel/Google Sheets compatible.
 *
 * Conventions:
 *  - At least one negative and one positive cashflow are required.
 *  - Dates are ISO strings (YYYY-MM-DD).
 *  - Returns annualised rate as a percentage.
 */
export function calculateXirr(flows: CashFlow[]): XirrResult {
  if (flows.length < 2) {
    return { ratePercent: NaN, iterations: 0, converged: false };
  }

  const hasPositive = flows.some((f) => f.amount > 0);
  const hasNegative = flows.some((f) => f.amount < 0);
  if (!hasPositive || !hasNegative) {
    return { ratePercent: NaN, iterations: 0, converged: false };
  }

  const sorted = [...flows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const baseDate = sorted[0].date;

  // Newton-Raphson
  let rate = 0.1;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const f = npv(rate, sorted, baseDate);
    if (Math.abs(f) < TOLERANCE) {
      return { ratePercent: rate * 100, iterations: i, converged: true };
    }
    const fPrime = npvDerivative(rate, sorted, baseDate);
    if (Math.abs(fPrime) < 1e-12) break;
    const next = rate - f / fPrime;
    if (!Number.isFinite(next) || next < -0.999) break;
    if (Math.abs(next - rate) < TOLERANCE) {
      return { ratePercent: next * 100, iterations: i, converged: true };
    }
    rate = next;
  }

  // Bisection fallback
  let low = -0.999;
  let high = 10;
  let fLow = npv(low, sorted, baseDate);
  let fHigh = npv(high, sorted, baseDate);
  if (fLow * fHigh > 0) {
    return { ratePercent: NaN, iterations: MAX_ITERATIONS, converged: false };
  }
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    const fMid = npv(mid, sorted, baseDate);
    if (Math.abs(fMid) < TOLERANCE || (high - low) / 2 < TOLERANCE) {
      return {
        ratePercent: mid * 100,
        iterations: MAX_ITERATIONS + i,
        converged: true,
      };
    }
    if (fMid * fLow < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }

  return {
    ratePercent: NaN,
    iterations: MAX_ITERATIONS * 2,
    converged: false,
  };
}
