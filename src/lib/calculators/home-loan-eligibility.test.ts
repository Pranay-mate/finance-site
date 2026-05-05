import { describe, it, expect } from "vitest";
import { calculateHomeLoanEligibility } from "./home-loan-eligibility";
import { calculateEmi } from "./emi";

describe("calculateHomeLoanEligibility", () => {
  it("max EMI = income × FOIR when there's no existing EMI", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.maxEmi).toBeCloseTo(50_000, 0);
  });

  it("existing EMIs reduce max EMI rupee-for-rupee", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 15_000,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.maxEmi).toBeCloseTo(35_000, 0);
  });

  it("max loan reverse-EMI checks against forward EMI calc", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 200_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    // Forward check: an EMI calc on the derived loan amount should match max EMI.
    const forward = calculateEmi({
      principal: result.maxLoanAmount,
      annualRatePercent: 8.75,
      tenureMonths: 240,
    });
    expect(forward.emi).toBeCloseTo(result.maxEmi, 0);
  });

  it("longer tenure increases max loan amount", () => {
    const tenYears = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 120,
      foirPercent: 50,
    });
    const twentyYears = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(twentyYears.maxLoanAmount).toBeGreaterThan(tenYears.maxLoanAmount);
  });

  it("higher rate decreases max loan amount", () => {
    const lowRate = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8,
      tenureMonths: 240,
      foirPercent: 50,
    });
    const highRate = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 10,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(highRate.maxLoanAmount).toBeLessThan(lowRate.maxLoanAmount);
  });

  it("higher FOIR increases max loan amount", () => {
    const foir40 = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 40,
    });
    const foir60 = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 60,
    });
    expect(foir60.maxLoanAmount).toBeGreaterThan(foir40.maxLoanAmount);
  });

  it("property budget = max loan / (1 − dp%) and down payment matches", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 200_000,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
      downPaymentPercent: 20,
    });
    expect(result.propertyBudget).toBeCloseTo(result.maxLoanAmount / 0.8, -1);
    expect(result.downPayment).toBeCloseTo(
      result.propertyBudget - result.maxLoanAmount,
      0,
    );
  });

  it("zero rate: max loan = max EMI × tenure months", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 0,
      annualRatePercent: 0,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.maxLoanAmount).toBeCloseTo(50_000 * 240, 0);
  });

  it("max EMI cannot go below zero (existing EMIs exceed FOIR cap)", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 50_000,
      existingEmi: 40_000,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.maxEmi).toBe(0);
    expect(result.maxLoanAmount).toBe(0);
  });

  it("effective FOIR equals input FOIR when EMI is maxed out", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 100_000,
      existingEmi: 10_000,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.effectiveFoirPercent).toBeCloseTo(50, 1);
  });

  it("returns zeros for zero income", () => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome: 0,
      existingEmi: 0,
      annualRatePercent: 8.75,
      tenureMonths: 240,
      foirPercent: 50,
    });
    expect(result.maxEmi).toBe(0);
    expect(result.maxLoanAmount).toBe(0);
  });
});
