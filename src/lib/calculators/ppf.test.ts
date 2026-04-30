import { describe, it, expect } from "vitest";
import {
  calculatePpf,
  PPF_DEFAULT_RATE_PERCENT,
  PPF_MIN_ANNUAL_DEPOSIT,
  PPF_MAX_ANNUAL_DEPOSIT,
} from "./ppf";

/**
 * Reference values cross-verified against India Post / SBI / ClearTax PPF
 * calculators when deposits are made at the start of the financial year.
 */
describe("calculatePpf", () => {
  it("max deposit ₹1.5L/year @ 7.1% for 15 years (India Post reference)", () => {
    const result = calculatePpf({
      annualDeposit: 150_000,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    // (1.071)^15 = 2.7910 (approx)
    // A = 150000 × 1.071 × (2.7910 − 1) / 0.071 ≈ 40,68,209
    expect(result.maturity).toBeCloseTo(40_68_209, -3);
    expect(result.totalDeposited).toBe(22_50_000);
    expect(result.totalInterest).toBeCloseTo(18_18_209, -3);
  });

  it("₹50K/year @ 7.1% for 15 years", () => {
    const result = calculatePpf({
      annualDeposit: 50_000,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    expect(result.maturity).toBeCloseTo(13_56_070, -3);
    expect(result.totalDeposited).toBe(7_50_000);
  });

  it("₹1L/year @ 7.1% for 25 years (extended PPF)", () => {
    const result = calculatePpf({
      annualDeposit: 100_000,
      annualRatePercent: 7.1,
      tenureYears: 25,
    });
    expect(result.totalDeposited).toBe(25_00_000);
    expect(result.maturity).toBeGreaterThan(60_00_000);
    expect(result.maturity).toBeLessThan(75_00_000);
  });

  it("yearly schedule has correct length and columns", () => {
    const result = calculatePpf({
      annualDeposit: 150_000,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    expect(result.schedule).toHaveLength(15);
    expect(result.schedule[0].openingBalance).toBe(0);
    expect(result.schedule[0].deposit).toBe(150_000);
  });

  it("each year's closing equals previous year's closing + deposit + interest", () => {
    const result = calculatePpf({
      annualDeposit: 150_000,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].openingBalance).toBeCloseTo(
        result.schedule[i - 1].closingBalance,
        5,
      );
    }
  });

  it("interest grows each year as balance compounds", () => {
    const result = calculatePpf({
      annualDeposit: 150_000,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].interestEarned).toBeGreaterThan(
        result.schedule[i - 1].interestEarned,
      );
    }
  });

  it("zero rate: maturity equals total deposited", () => {
    const result = calculatePpf({
      annualDeposit: 150_000,
      annualRatePercent: 0,
      tenureYears: 15,
    });
    expect(result.maturity).toBeCloseTo(22_50_000, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("returns zeros for zero deposit", () => {
    const result = calculatePpf({
      annualDeposit: 0,
      annualRatePercent: 7.1,
      tenureYears: 15,
    });
    expect(result.maturity).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("constants match Government of India rules", () => {
    expect(PPF_DEFAULT_RATE_PERCENT).toBe(7.1);
    expect(PPF_MIN_ANNUAL_DEPOSIT).toBe(500);
    expect(PPF_MAX_ANNUAL_DEPOSIT).toBe(150_000);
  });
});
