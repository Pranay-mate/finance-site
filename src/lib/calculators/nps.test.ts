import { describe, it, expect } from "vitest";
import { calculateNps } from "./nps";

describe("calculateNps", () => {
  it("₹5K/month for 30 years at 10% produces a multi-crore corpus", () => {
    const result = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(result.retirementCorpus).toBeGreaterThan(1_00_00_000);
    expect(result.retirementCorpus).toBeLessThan(2_00_00_000);
  });

  it("60-40 split: 60% lump sum + 40% annuity", () => {
    const result = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(result.lumpSumAtRetirement).toBeCloseTo(
      result.retirementCorpus * 0.6,
      0,
    );
    expect(result.annuityCorpus).toBeCloseTo(
      result.retirementCorpus * 0.4,
      0,
    );
  });

  it("annuity income equals annuity corpus × annuity rate", () => {
    const result = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(result.annualPensionBeforeTax).toBeCloseTo(
      result.annuityCorpus * 0.07,
      0,
    );
    expect(result.monthlyPensionBeforeTax).toBeCloseTo(
      result.annualPensionBeforeTax / 12,
      0,
    );
  });

  it("employer contribution boosts the corpus", () => {
    const without = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    const withEmployer = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      monthlyEmployerContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(withEmployer.retirementCorpus).toBeGreaterThan(
      without.retirementCorpus * 1.9,
    );
  });

  it("schedule has correct length and tracks age", () => {
    const result = calculateNps({
      currentAge: 35,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(result.schedule).toHaveLength(25);
    expect(result.schedule[0].age).toBe(36);
    expect(result.schedule[24].age).toBe(60);
  });

  it("higher return produces higher corpus (monotonic)", () => {
    const at8 = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 8,
      annuityRatePercent: 7,
    });
    const at12 = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 12,
      annuityRatePercent: 7,
    });
    expect(at12.retirementCorpus).toBeGreaterThan(at8.retirementCorpus);
  });

  it("existing corpus carries forward and grows", () => {
    const without = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    const withCorpus = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
      existingCorpus: 5_00_000,
    });
    // ₹5L for 30 yrs at 10% ≈ ₹87L extra
    expect(withCorpus.retirementCorpus - without.retirementCorpus).toBeGreaterThan(
      80_00_000,
    );
  });

  it("retirement age = current age returns existing corpus unchanged", () => {
    const result = calculateNps({
      currentAge: 60,
      retirementAge: 60,
      monthlySelfContribution: 5_000,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
      existingCorpus: 50_00_000,
    });
    expect(result.retirementCorpus).toBe(50_00_000);
    expect(result.schedule).toHaveLength(0);
  });

  it("zero contributions and no corpus → zero everywhere", () => {
    const result = calculateNps({
      currentAge: 30,
      monthlySelfContribution: 0,
      annualReturnPercent: 10,
      annuityRatePercent: 7,
    });
    expect(result.retirementCorpus).toBe(0);
    expect(result.lumpSumAtRetirement).toBe(0);
    expect(result.annuityCorpus).toBe(0);
  });
});
