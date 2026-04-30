import { describe, it, expect } from "vitest";
import { calculateLumpsum } from "./lumpsum";

describe("calculateLumpsum", () => {
  it("₹1L @ 12% for 10 years → ~₹3.10L (Groww/ClearTax reference)", () => {
    const result = calculateLumpsum({
      principal: 100_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    // (1.12)^10 = 3.10585
    expect(result.futureValue).toBeCloseTo(310_585, -1);
    expect(result.totalGain).toBeCloseTo(210_585, -1);
  });

  it("₹5L @ 15% for 20 years (early-retirement scenario)", () => {
    const result = calculateLumpsum({
      principal: 500_000,
      annualReturnPercent: 15,
      tenureYears: 20,
    });
    // (1.15)^20 = 16.3665
    expect(result.futureValue).toBeCloseTo(8_183_270, -2);
  });

  it("zero return: future value equals principal", () => {
    const result = calculateLumpsum({
      principal: 100_000,
      annualReturnPercent: 0,
      tenureYears: 10,
    });
    expect(result.futureValue).toBeCloseTo(100_000, 5);
    expect(result.totalGain).toBe(0);
  });

  it("doubles in ~6 years at 12% (rule of 72 sanity check)", () => {
    const result = calculateLumpsum({
      principal: 100_000,
      annualReturnPercent: 12,
      tenureYears: 6,
    });
    // Rule of 72 says 72/12 = 6 years to double; actual (1.12)^6 = 1.974
    expect(result.futureValue).toBeGreaterThan(190_000);
    expect(result.futureValue).toBeLessThan(200_000);
  });

  it("yearly schedule has correct length and final balance", () => {
    const result = calculateLumpsum({
      principal: 100_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    expect(result.schedule).toHaveLength(10);
    expect(result.schedule[9].closingBalance).toBeCloseTo(result.futureValue, 0);
  });

  it("partial-year tenure (7.5 years) handled with fractional final year", () => {
    const result = calculateLumpsum({
      principal: 100_000,
      annualReturnPercent: 12,
      tenureYears: 7.5,
    });
    // (1.12)^7.5 = 2.33957
    expect(result.futureValue).toBeCloseTo(233_957, -1);
    expect(result.schedule).toHaveLength(8); // 7 full + 1 half
  });

  it("returns zero future value for zero principal", () => {
    const result = calculateLumpsum({
      principal: 0,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    expect(result.futureValue).toBe(0);
  });
});
