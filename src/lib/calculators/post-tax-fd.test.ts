import { describe, it, expect } from "vitest";
import { calculatePostTaxFd } from "./post-tax-fd";

describe("calculatePostTaxFd", () => {
  it("zero slab matches gross FD maturity", () => {
    const result = calculatePostTaxFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 0,
    });
    expect(result.postTaxMaturity).toBeCloseTo(result.preTaxMaturity, 5);
    expect(result.totalTaxPaid).toBe(0);
    expect(result.taxDragPp).toBeCloseTo(0, 5);
  });

  it("30% slab + 4% cess on ₹1L @ 7% for 5y: tax ≈ 31.2% of total interest", () => {
    const result = calculatePostTaxFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    // Pre-tax interest ≈ 41,478. Tax = 41,478 × 0.30 × 1.04 ≈ 12,941
    expect(result.totalTaxPaid).toBeCloseTo(12_941, -1);
    expect(result.postTaxMaturity).toBeCloseTo(128_537, -1);
  });

  it("post-tax CAGR is lower than pre-tax effective yield", () => {
    const result = calculatePostTaxFd({
      principal: 500_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    expect(result.postTaxCagr).toBeLessThan(result.preTaxEffectiveAnnualYield);
    expect(result.taxDragPp).toBeGreaterThan(2);
  });

  it("disabling cess gives slightly higher post-tax maturity", () => {
    const withCess = calculatePostTaxFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    const noCess = calculatePostTaxFd({
      principal: 100_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
      applyCess: false,
    });
    expect(noCess.postTaxMaturity).toBeGreaterThan(withCess.postTaxMaturity);
    expect(noCess.totalTaxPaid).toBeLessThan(withCess.totalTaxPaid);
  });

  it("senior citizen on old regime gets 80TTB exemption (₹50k/year)", () => {
    const senior = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
      seniorCitizen: true,
      taxRegime: "old",
    });
    const nonSenior = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    expect(senior.totalTaxPaid).toBeLessThan(nonSenior.totalTaxPaid);
  });

  it("senior citizen on new regime does NOT get 80TTB exemption", () => {
    const seniorNew = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
      seniorCitizen: true,
      taxRegime: "new",
    });
    const nonSenior = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    expect(seniorNew.totalTaxPaid).toBeCloseTo(nonSenior.totalTaxPaid, 0);
  });

  it("otherEligibleInterest reduces 80TTB pool for seniors", () => {
    const noOther = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
      seniorCitizen: true,
      taxRegime: "old",
    });
    const withOther = calculatePostTaxFd({
      principal: 1_000_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
      seniorCitizen: true,
      taxRegime: "old",
      otherEligibleInterest: 30_000,
    });
    // With ₹30k of other interest, only ₹20k of FD interest gets exemption.
    expect(withOther.totalTaxPaid).toBeGreaterThan(noOther.totalTaxPaid);
  });

  it("schedule rows sum to totalTaxPaid", () => {
    const result = calculatePostTaxFd({
      principal: 500_000,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    const sumTax = result.schedule.reduce((s, r) => s + r.taxPaid, 0);
    expect(sumTax).toBeCloseTo(result.totalTaxPaid, 4);
  });

  it("post-tax interest + tax paid equals pre-tax interest each year", () => {
    const result = calculatePostTaxFd({
      principal: 200_000,
      annualRatePercent: 7,
      tenureMonths: 36,
      slabRatePercent: 20,
    });
    for (const row of result.schedule) {
      expect(row.postTaxInterest + row.taxPaid).toBeCloseTo(row.interestEarned, 4);
    }
  });

  it("returns zeros for zero principal", () => {
    const result = calculatePostTaxFd({
      principal: 0,
      annualRatePercent: 7,
      tenureMonths: 60,
      slabRatePercent: 30,
    });
    expect(result.postTaxMaturity).toBe(0);
    expect(result.totalTaxPaid).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });
});
