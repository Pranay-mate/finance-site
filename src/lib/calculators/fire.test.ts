import { describe, it, expect } from "vitest";
import { calculateFire } from "./fire";

describe("calculateFire", () => {
  it("accumulates to a sensible corpus over 20 years", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    // 50K/month × 20 years at 12% — ballpark ₹4.5-5 Cr range
    expect(result.fireCorpus).toBeGreaterThan(4_50_00_000);
    expect(result.fireCorpus).toBeLessThan(5_50_00_000);
  });

  it("inflation-adjusted corpus is significantly less than nominal", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 25,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    expect(result.fireCorpusInTodaysRupees).toBeLessThan(result.fireCorpus);
    // (1.06)^25 ≈ 4.29x — corpus in today's money is ~23% of nominal
    const expectedRatio = result.fireCorpus / Math.pow(1.06, 25);
    expect(result.fireCorpusInTodaysRupees).toBeCloseTo(expectedRatio, 0);
  });

  it("retirement-start expenses grow with inflation", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    // 50K × (1.06)^20 ≈ 50K × 3.207 = ~₹1,60,357
    expect(result.retirementStartExpenses).toBeCloseTo(160_357, -3);
  });

  it("step-up SIP produces a larger corpus than flat SIP", () => {
    const flat = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
      sipStepUpRate: 0,
    });
    const stepUp = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
      sipStepUpRate: 10,
    });
    expect(stepUp.fireCorpus).toBeGreaterThan(flat.fireCorpus * 1.5);
  });

  it("existing corpus boosts the FIRE corpus", () => {
    const without = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    const withCorpus = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 50_00_000,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    // ₹50L for 20 years at 12% ≈ ₹4.8 Cr extra
    expect(withCorpus.fireCorpus - without.fireCorpus).toBeGreaterThan(4_00_00_000);
  });

  it("oversized corpus survives full retirement", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 30_000,
      currentCorpus: 5_00_00_000,
      monthlySip: 0,
      yearsToFire: 0,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    expect(result.survives).toBe(true);
    expect(result.yearsCorpusLasted).toBe(30);
  });

  it("undersized corpus depletes before end of retirement", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 1_00_000,
      currentCorpus: 50_00_000,
      monthlySip: 0,
      yearsToFire: 0,
      yearsInRetirement: 40,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    expect(result.survives).toBe(false);
    expect(result.yearsCorpusLasted).toBeLessThan(40);
  });

  it("schedule lengths match phase lengths", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 15,
      yearsInRetirement: 25,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    expect(result.accumulationSchedule).toHaveLength(15);
    expect(result.drawdownSchedule).toHaveLength(25);
  });

  it("initial withdrawal rate is sensible (3-5% range for typical FIRE)", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 50_000,
      currentCorpus: 0,
      monthlySip: 50_000,
      yearsToFire: 20,
      yearsInRetirement: 30,
      accumulationReturn: 12,
      retirementReturn: 8,
      inflationRate: 6,
    });
    expect(result.initialWithdrawalRatePercent).toBeGreaterThan(3);
    expect(result.initialWithdrawalRatePercent).toBeLessThan(7);
  });

  it("zero expenses case doesn't crash", () => {
    const result = calculateFire({
      currentMonthlyExpenses: 0,
      currentCorpus: 1_00_000,
      monthlySip: 1_000,
      yearsToFire: 5,
      yearsInRetirement: 5,
      accumulationReturn: 10,
      retirementReturn: 7,
      inflationRate: 5,
    });
    expect(result.fireCorpus).toBeGreaterThan(0);
    expect(result.survives).toBe(true);
  });
});
