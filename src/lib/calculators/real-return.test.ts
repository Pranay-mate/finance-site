import { describe, it, expect } from "vitest";
import { calculateRealReturn } from "./real-return";

describe("calculateRealReturn", () => {
  it("12% nominal at 6% inflation → ~5.66% real (Fisher equation)", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 12,
      inflationRate: 6,
      tenureYears: 10,
    });
    // (1.12 / 1.06) − 1 = 0.05660...
    expect(result.realReturnPercent).toBeCloseTo(5.66, 1);
  });

  it("equal nominal and inflation → 0% real return", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 7,
      inflationRate: 7,
      tenureYears: 20,
    });
    expect(result.realReturnPercent).toBeCloseTo(0, 5);
    expect(result.realFutureValue).toBeCloseTo(100_000, 5);
  });

  it("nominal future value uses standard compound interest", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 10,
      inflationRate: 5,
      tenureYears: 10,
    });
    // (1.10)^10 = 2.5937
    expect(result.nominalFutureValue).toBeCloseTo(259_374, -1);
  });

  it("real future value is always less than nominal when inflation is positive", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 10,
      inflationRate: 5,
      tenureYears: 10,
    });
    expect(result.realFutureValue).toBeLessThan(result.nominalFutureValue);
  });

  it("inflationDrag = nominal − real future value", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 10,
      inflationRate: 5,
      tenureYears: 15,
    });
    expect(result.inflationDrag).toBeCloseTo(
      result.nominalFutureValue - result.realFutureValue,
      5,
    );
  });

  it("real return is negative when inflation exceeds nominal return", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 5,
      inflationRate: 7,
      tenureYears: 10,
    });
    expect(result.realReturnPercent).toBeLessThan(0);
    expect(result.realFutureValue).toBeLessThan(100_000);
  });

  it("yearly schedule has correct length and final value matches future value", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 12,
      inflationRate: 6,
      tenureYears: 10,
    });
    expect(result.schedule).toHaveLength(10);
    expect(result.schedule[9].nominalValue).toBeCloseTo(result.nominalFutureValue, 0);
    expect(result.schedule[9].realValue).toBeCloseTo(result.realFutureValue, 0);
  });

  it("Fisher precise differs from nominal − inflation approximation", () => {
    const result = calculateRealReturn({
      principal: 100_000,
      nominalReturnPercent: 12,
      inflationRate: 6,
      tenureYears: 1,
    });
    // Approximation would give 6%, Fisher gives 5.66%
    expect(result.realReturnPercent).toBeLessThan(6);
    expect(result.realReturnPercent).toBeGreaterThan(5.5);
  });
});
