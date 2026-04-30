import { describe, it, expect } from "vitest";
import { calculateFd } from "./fd";

/**
 * Reference values cross-verified against SBI / HDFC FD calculators
 * (which use quarterly compounding by default).
 */
describe("calculateFd", () => {
  it("₹1L @ 7% for 5 years (quarterly) matches SBI reference", () => {
    const result = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
    });
    // (1 + 0.0175)^20 = 1.41478
    expect(result.maturity).toBeCloseTo(141_478, -1);
    expect(result.totalInterest).toBeCloseTo(41_478, -1);
  });

  it("₹5L @ 6.5% for 3 years (quarterly)", () => {
    const result = calculateFd({
      principal: 500_000,
      annualRatePercent: 6.5,
      tenureMonths: 36,
    });
    // (1 + 0.01625)^12 = 1.21341
    expect(result.maturity).toBeCloseTo(606_704, -1);
  });

  it("yearly compounding gives lower maturity than quarterly at same nominal rate", () => {
    const yearly = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "yearly",
    });
    const quarterly = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "quarterly",
    });
    expect(yearly.maturity).toBeLessThan(quarterly.maturity);
  });

  it("monthly compounding gives the highest maturity at same nominal rate", () => {
    const quarterly = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "quarterly",
    });
    const monthly = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "monthly",
    });
    expect(monthly.maturity).toBeGreaterThan(quarterly.maturity);
  });

  it("effective annual yield exceeds nominal rate when compounded more than yearly", () => {
    const result = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "quarterly",
    });
    // Effective rate for 7% nominal compounded quarterly ≈ 7.186%
    expect(result.effectiveAnnualYield).toBeCloseTo(7.186, 2);
  });

  it("effective annual yield equals nominal rate for yearly compounding", () => {
    const result = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      compounding: "yearly",
    });
    expect(result.effectiveAnnualYield).toBeCloseTo(7, 6);
  });

  it("zero rate returns principal with no interest", () => {
    const result = calculateFd({
      principal: 100_000,
      annualRatePercent: 0,
      tenureMonths: 60,
    });
    expect(result.maturity).toBeCloseTo(100_000, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("yearly schedule sums to total interest", () => {
    const result = calculateFd({
      principal: 500_000,
      annualRatePercent: 7,
      tenureMonths: 60,
    });
    const totalFromSchedule = result.schedule.reduce(
      (sum, y) => sum + y.interestEarned,
      0,
    );
    expect(totalFromSchedule).toBeCloseTo(result.totalInterest, -1);
  });

  it("returns zeros for zero principal", () => {
    const result = calculateFd({
      principal: 0,
      annualRatePercent: 7,
      tenureMonths: 60,
    });
    expect(result.maturity).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("handles partial-year tenure (18 months)", () => {
    const result = calculateFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 18,
    });
    // (1.0175)^6 = 1.10970
    expect(result.maturity).toBeCloseTo(110_970, -1);
    // Schedule should have 2 rows (year 1 full, year 2 partial)
    expect(result.schedule).toHaveLength(2);
  });
});
