export type RealReturnInput = {
  /** Initial investment amount in rupees. */
  principal: number;
  /** Nominal annual return as a percentage. */
  nominalReturnPercent: number;
  /** Annual inflation rate as a percentage. */
  inflationRate: number;
  /** Investment horizon in years. */
  tenureYears: number;
};

export type RealReturnYearlyRow = {
  year: number;
  nominalValue: number;
  realValue: number;
  cumulativeInflationFactor: number;
};

export type RealReturnResult = {
  /** Real (inflation-adjusted) annual return, as a percentage. */
  realReturnPercent: number;
  /** Nominal future value (no inflation adjustment). */
  nominalFutureValue: number;
  /** Real future value (in today's purchasing power). */
  realFutureValue: number;
  /** Total purchasing power lost to inflation over the horizon. */
  inflationDrag: number;
  schedule: RealReturnYearlyRow[];
};

/**
 * Real return uses the Fisher equation:
 *
 *   real_return = (1 + nominal) / (1 + inflation) − 1
 *
 * (The simpler "nominal − inflation" approximation is off by a couple of
 * basis points; we use the precise formula.)
 */
export function calculateRealReturn(input: RealReturnInput): RealReturnResult {
  const r = input.nominalReturnPercent / 100;
  const i = input.inflationRate / 100;
  const t = input.tenureYears;
  const realRate = (1 + r) / (1 + i) - 1;

  const nominalFutureValue = input.principal * Math.pow(1 + r, t);
  const realFutureValue = input.principal * Math.pow(1 + realRate, t);
  const inflationDrag = nominalFutureValue - realFutureValue;

  const schedule: RealReturnYearlyRow[] = [];
  for (let y = 1; y <= Math.ceil(t); y++) {
    const yearFraction = y === Math.ceil(t) ? t - (y - 1) : 1;
    const accumulatedYears = (y - 1) + yearFraction;
    const inflationFactor = Math.pow(1 + i, accumulatedYears);
    const nominalAtY = input.principal * Math.pow(1 + r, accumulatedYears);
    const realAtY = nominalAtY / inflationFactor;
    schedule.push({
      year: y,
      nominalValue: nominalAtY,
      realValue: realAtY,
      cumulativeInflationFactor: inflationFactor,
    });
  }

  return {
    realReturnPercent: realRate * 100,
    nominalFutureValue,
    realFutureValue,
    inflationDrag,
    schedule,
  };
}
