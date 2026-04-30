import { describe, it, expect } from "vitest";
import { calculateEpf, EPF_DEFAULT_RATE_PERCENT } from "./epf";

describe("calculateEpf", () => {
  it("returns a corpus for a 30-year-old earning ₹50K basic, 10% growth, retiring at 60", () => {
    const result = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    // Order-of-magnitude: a typical 30-year run should produce a multi-crore corpus.
    expect(result.retirementCorpus).toBeGreaterThan(50_000_000);
    expect(result.retirementCorpus).toBeLessThan(200_000_000);
    expect(result.schedule).toHaveLength(30);
  });

  it("schedule rows reflect annual salary growth", () => {
    const result = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    expect(result.schedule[0].monthlyBasic).toBe(50_000);
    expect(result.schedule[1].monthlyBasic).toBeCloseTo(55_000, 1);
    expect(result.schedule[29].monthlyBasic).toBeGreaterThan(700_000);
  });

  it("contributions and interest sum to retirement corpus", () => {
    const result = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    const totalContributions =
      result.totalEmployeeContribution + result.totalEmployerContribution;
    expect(totalContributions + result.totalInterest).toBeCloseTo(
      result.retirementCorpus,
      -2,
    );
  });

  it("zero salary growth produces a smaller corpus than 10% growth", () => {
    const flat = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 0,
      annualRatePercent: 8.25,
    });
    const growing = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    expect(growing.retirementCorpus).toBeGreaterThan(flat.retirementCorpus);
  });

  it("existing balance grows at the EPF rate alongside new contributions", () => {
    const noBalance = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    const withBalance = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
      existingBalance: 1_000_000,
    });
    expect(withBalance.retirementCorpus).toBeGreaterThan(
      noBalance.retirementCorpus + 1_000_000,
    );
  });

  it("zero rate: corpus equals total contributions", () => {
    const result = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 0,
      annualRatePercent: 0,
    });
    const totalContributions =
      result.totalEmployeeContribution + result.totalEmployerContribution;
    expect(result.retirementCorpus).toBeCloseTo(totalContributions, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("returns existing balance unchanged when retirement age = current age", () => {
    const result = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 60,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
      existingBalance: 1_000_000,
    });
    expect(result.retirementCorpus).toBe(1_000_000);
    expect(result.schedule).toHaveLength(0);
  });

  it("default rate matches latest EPFO notification", () => {
    expect(EPF_DEFAULT_RATE_PERCENT).toBe(8.25);
  });

  it("doubling monthly basic doubles the corpus (linearity)", () => {
    const a = calculateEpf({
      monthlyBasic: 50_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    const b = calculateEpf({
      monthlyBasic: 100_000,
      currentAge: 30,
      retirementAge: 60,
      annualSalaryGrowthPercent: 10,
      annualRatePercent: 8.25,
    });
    expect(b.retirementCorpus).toBeCloseTo(2 * a.retirementCorpus, -3);
  });
});
