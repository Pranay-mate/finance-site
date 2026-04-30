import { describe, it, expect } from "vitest";
import { calculateEmi } from "./emi";

/**
 * Reference values cross-verified against SBI / HDFC / ICICI online EMI calculators
 * (which all use the standard reducing-balance formula). Tolerance is ±1 rupee.
 */
describe("calculateEmi", () => {
  it("home loan: ₹10L @ 8% for 20 years matches SBI reference", () => {
    const result = calculateEmi({
      principal: 1_000_000,
      annualRatePercent: 8,
      tenureMonths: 240,
    });
    expect(result.emi).toBeCloseTo(8_364.4, 1);
    expect(result.totalPayment).toBeCloseTo(2_007_456, -1);
    expect(result.totalInterest).toBeCloseTo(1_007_456, -1);
  });

  it("car loan: ₹5L @ 10% for 5 years matches HDFC reference", () => {
    const result = calculateEmi({
      principal: 500_000,
      annualRatePercent: 10,
      tenureMonths: 60,
    });
    expect(result.emi).toBeCloseTo(10_623.52, 1);
    expect(result.totalInterest).toBeCloseTo(137_411, -1);
  });

  it("personal loan: ₹2L @ 12% for 3 years", () => {
    const result = calculateEmi({
      principal: 200_000,
      annualRatePercent: 12,
      tenureMonths: 36,
    });
    expect(result.emi).toBeCloseTo(6_642.86, 1);
  });

  it("zero-interest loan: principal equally split over months", () => {
    const result = calculateEmi({
      principal: 120_000,
      annualRatePercent: 0,
      tenureMonths: 12,
    });
    expect(result.emi).toBeCloseTo(10_000, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("amortization schedule has correct length and ends with zero balance", () => {
    const result = calculateEmi({
      principal: 1_000_000,
      annualRatePercent: 8,
      tenureMonths: 240,
    });
    expect(result.schedule).toHaveLength(240);
    expect(result.schedule[239].balance).toBeCloseTo(0, 0);
  });

  it("interest paid drops over time as principal share grows", () => {
    const result = calculateEmi({
      principal: 1_000_000,
      annualRatePercent: 8,
      tenureMonths: 240,
    });
    const firstMonthInterest = result.schedule[0].interestPaid;
    const lastMonthInterest = result.schedule[239].interestPaid;
    expect(firstMonthInterest).toBeGreaterThan(lastMonthInterest);
  });

  it("yearly summary aggregates monthly rows correctly", () => {
    const result = calculateEmi({
      principal: 1_000_000,
      annualRatePercent: 8,
      tenureMonths: 240,
    });
    expect(result.yearly).toHaveLength(20);
    const totalFromYearly = result.yearly.reduce(
      (sum, y) => sum + y.principalPaid + y.interestPaid,
      0,
    );
    expect(totalFromYearly).toBeCloseTo(result.totalPayment, -1);
  });

  it("returns zeros for zero principal", () => {
    const result = calculateEmi({
      principal: 0,
      annualRatePercent: 8,
      tenureMonths: 60,
    });
    expect(result.emi).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("returns zeros for zero tenure", () => {
    const result = calculateEmi({
      principal: 1_000_000,
      annualRatePercent: 8,
      tenureMonths: 0,
    });
    expect(result.emi).toBe(0);
  });
});
