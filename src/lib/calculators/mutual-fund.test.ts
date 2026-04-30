import { describe, it, expect } from "vitest";
import { calculateSip } from "./mutual-fund";

/**
 * Reference values from Groww / ClearTax SIP calculators.
 * They use the same annuity-due monthly-compounding model.
 */
describe("calculateSip", () => {
  it("₹10,000/month for 10 years @ 12% (Groww reference)", () => {
    const result = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    // Total invested: ₹12L; FV: ~₹23.23L
    expect(result.totalInvested).toBe(1_200_000);
    expect(result.futureValue).toBeCloseTo(2_323_391, -2);
    expect(result.totalReturns).toBeCloseTo(1_123_391, -2);
  });

  it("₹5000/month for 20 years @ 12% (the classic 'crorepati' SIP)", () => {
    const result = calculateSip({
      monthlyAmount: 5_000,
      annualReturnPercent: 12,
      tenureYears: 20,
    });
    // Total invested: ₹12L; FV: ~₹49.95L
    expect(result.totalInvested).toBe(1_200_000);
    expect(result.futureValue).toBeCloseTo(4_995_740, -3);
  });

  it("₹25,000/month for 25 years @ 12% (typical retirement SIP)", () => {
    const result = calculateSip({
      monthlyAmount: 25_000,
      annualReturnPercent: 12,
      tenureYears: 25,
    });
    // Total invested: ₹75L; FV: ~₹4.74Cr
    expect(result.totalInvested).toBe(7_500_000);
    expect(result.futureValue).toBeGreaterThan(45_000_000);
    expect(result.futureValue).toBeLessThan(50_000_000);
  });

  it("zero return: future value equals total invested", () => {
    const result = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 0,
      tenureYears: 10,
    });
    expect(result.futureValue).toBe(1_200_000);
    expect(result.totalReturns).toBe(0);
  });

  it("yearly schedule: invested column accumulates correctly", () => {
    const result = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    expect(result.schedule).toHaveLength(10);
    expect(result.schedule[0].invested).toBe(120_000);
    expect(result.schedule[9].invested).toBe(1_200_000);
  });

  it("yearly schedule: final closing matches future value", () => {
    const result = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    const final = result.schedule[result.schedule.length - 1].closingBalance;
    expect(final).toBeCloseTo(result.futureValue, -1);
  });

  it("doubling the SIP doubles the future value (linear in monthly amount)", () => {
    const a = calculateSip({
      monthlyAmount: 5_000,
      annualReturnPercent: 12,
      tenureYears: 15,
    });
    const b = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 15,
    });
    expect(b.futureValue).toBeCloseTo(2 * a.futureValue, 5);
  });

  it("returns zeros for zero monthly amount", () => {
    const result = calculateSip({
      monthlyAmount: 0,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    expect(result.futureValue).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("longer tenure significantly amplifies returns (compounding non-linearity)", () => {
    const a = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 10,
    });
    const b = calculateSip({
      monthlyAmount: 10_000,
      annualReturnPercent: 12,
      tenureYears: 20,
    });
    // Twice the tenure = more than 4× the future value (compounding)
    expect(b.futureValue / a.futureValue).toBeGreaterThan(4);
  });
});
