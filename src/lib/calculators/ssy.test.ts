import { describe, it, expect } from "vitest";
import {
  calculateSsy,
  SSY_DEFAULT_RATE_PERCENT,
  SSY_MAX_ANNUAL_DEPOSIT,
  SSY_DEPOSIT_YEARS,
  SSY_MATURITY_YEARS,
} from "./ssy";

describe("calculateSsy", () => {
  it("max deposit ₹1.5L/year @ 8.2% → maturity at year 21", () => {
    const result = calculateSsy({
      annualDeposit: SSY_MAX_ANNUAL_DEPOSIT,
      girlChildAge: 5,
      annualRatePercent: SSY_DEFAULT_RATE_PERCENT,
    });
    // Total deposited: ₹1.5L × 15 = ₹22.5L
    expect(result.totalDeposited).toBe(22_50_000);
    // Maturity is well above ₹65L for these inputs (verified vs India Post calc)
    expect(result.maturity).toBeGreaterThan(65_00_000);
    expect(result.maturity).toBeLessThan(75_00_000);
  });

  it("schedule has exactly 21 rows (full maturity period)", () => {
    const result = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 3,
      annualRatePercent: 8.2,
    });
    expect(result.schedule).toHaveLength(SSY_MATURITY_YEARS);
  });

  it("deposits stop after year 15", () => {
    const result = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 0,
      annualRatePercent: 8.2,
    });
    for (let y = 0; y < SSY_DEPOSIT_YEARS; y++) {
      expect(result.schedule[y].deposit).toBe(50_000);
    }
    for (let y = SSY_DEPOSIT_YEARS; y < SSY_MATURITY_YEARS; y++) {
      expect(result.schedule[y].deposit).toBe(0);
    }
  });

  it("balance keeps growing during years 16-21 (no deposits, just interest)", () => {
    const result = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 0,
      annualRatePercent: 8.2,
    });
    for (let y = SSY_DEPOSIT_YEARS; y < SSY_MATURITY_YEARS; y++) {
      expect(result.schedule[y].closingBalance).toBeGreaterThan(
        result.schedule[y - 1].closingBalance,
      );
    }
  });

  it("age column tracks daughter's age (current age + year)", () => {
    const result = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 3,
      annualRatePercent: 8.2,
    });
    expect(result.schedule[0].age).toBe(4);
    expect(result.schedule[20].age).toBe(24);
  });

  it("zero rate: maturity equals total deposits", () => {
    const result = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 0,
      annualRatePercent: 0,
    });
    expect(result.maturity).toBeCloseTo(7_50_000, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("higher deposit → linearly higher maturity", () => {
    const a = calculateSsy({
      annualDeposit: 50_000,
      girlChildAge: 0,
      annualRatePercent: 8.2,
    });
    const b = calculateSsy({
      annualDeposit: 1_50_000,
      girlChildAge: 0,
      annualRatePercent: 8.2,
    });
    expect(b.maturity).toBeCloseTo(3 * a.maturity, -3);
  });

  it("returns zeros for zero deposit", () => {
    const result = calculateSsy({
      annualDeposit: 0,
      girlChildAge: 0,
      annualRatePercent: 8.2,
    });
    expect(result.maturity).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("default rate matches latest official notification", () => {
    expect(SSY_DEFAULT_RATE_PERCENT).toBe(8.2);
  });
});
