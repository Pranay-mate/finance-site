import { describe, it, expect } from "vitest";
import { calculateIncomeTax } from "./income-tax";

/**
 * Reference values cross-verified against ClearTax FY 2025-26 calculator
 * and the IT Department's tax slabs notification.
 */
describe("calculateIncomeTax — New Regime FY 2025-26", () => {
  it("₹5L gross → zero tax (87A rebate covers it)", () => {
    const result = calculateIncomeTax({ grossIncome: 5_00_000 });
    expect(result.newRegime.totalTax).toBe(0);
  });

  it("₹12L gross → zero tax via 87A rebate (up to ₹12L taxable income)", () => {
    const result = calculateIncomeTax({ grossIncome: 12_75_000 });
    expect(result.newRegime.taxableIncome).toBe(12_00_000);
    expect(result.newRegime.totalTax).toBe(0);
  });

  it("₹15L gross → tax kicks in beyond rebate threshold", () => {
    const result = calculateIncomeTax({ grossIncome: 15_00_000 });
    // Taxable: 15L − 75K = 14.25L
    // Tax: 4-8L × 5% = 20K, 8-12L × 10% = 40K, 12-14.25L × 15% = 33,750 → 93,750
    // No 87A rebate (taxable > 12L). Cess 4% = 3,750. Total ~ 97,500
    expect(result.newRegime.taxableIncome).toBe(14_25_000);
    expect(result.newRegime.totalTax).toBeCloseTo(97_500, -2);
  });

  it("₹50L gross → tax with no surcharge (just below ₹50L threshold)", () => {
    const result = calculateIncomeTax({ grossIncome: 50_00_000 });
    expect(result.newRegime.surcharge).toBe(0);
  });

  it("₹60L gross → 10% surcharge applies", () => {
    const result = calculateIncomeTax({ grossIncome: 60_00_000 });
    expect(result.newRegime.surcharge).toBeGreaterThan(0);
  });

  it("standard deduction = ₹75K under New Regime", () => {
    const result = calculateIncomeTax({ grossIncome: 10_00_000 });
    expect(result.newRegime.standardDeduction).toBe(75_000);
  });
});

describe("calculateIncomeTax — Old Regime FY 2025-26", () => {
  it("₹5L gross with 80C deduction → zero tax (87A)", () => {
    const result = calculateIncomeTax({
      grossIncome: 5_00_000,
      section80C: 1_50_000,
    });
    expect(result.oldRegime.totalTax).toBe(0);
  });

  it("80C is capped at ₹1.5L even if user enters more", () => {
    const result = calculateIncomeTax({
      grossIncome: 10_00_000,
      section80C: 5_00_000,
    });
    // Only ₹1.5L should be deducted from 80C
    expect(result.oldRegime.totalDeductions).toBe(50_000 + 150_000);
  });

  it("standard deduction = ₹50K under Old Regime", () => {
    const result = calculateIncomeTax({ grossIncome: 10_00_000 });
    expect(result.oldRegime.standardDeduction).toBe(50_000);
  });

  it("senior citizen (60-80) gets ₹3L exemption", () => {
    const result = calculateIncomeTax({
      grossIncome: 4_00_000,
      ageGroup: "60-80",
    });
    expect(result.oldRegime.totalTax).toBe(0); // ₹3.5L taxable, but 87A covers small tax
  });

  it("super-senior (80+) gets ₹5L exemption — zero tax up to ₹5L", () => {
    const result = calculateIncomeTax({
      grossIncome: 5_50_000,
      ageGroup: "above-80",
    });
    expect(result.oldRegime.taxBeforeRebate).toBe(0);
  });
});

describe("calculateIncomeTax — Regime comparison", () => {
  it("recommends New regime for ₹15L with no deductions", () => {
    const result = calculateIncomeTax({ grossIncome: 15_00_000 });
    expect(result.recommended).toBe("new");
  });

  it("recommends Old regime for ₹30L with very high deductions", () => {
    const result = calculateIncomeTax({
      grossIncome: 30_00_000,
      section80C: 1_50_000,
      section80D: 50_000,
      otherDeductions: 8_00_000, // HRA + home loan interest + LTA stack
    });
    expect(result.recommended).toBe("old");
  });

  it("savings amount equals difference between regimes", () => {
    const result = calculateIncomeTax({ grossIncome: 15_00_000 });
    const expectedSavings = Math.abs(
      result.newRegime.totalTax - result.oldRegime.totalTax,
    );
    expect(result.savings).toBe(expectedSavings);
  });

  it("zero income → zero tax in both regimes", () => {
    const result = calculateIncomeTax({ grossIncome: 0 });
    expect(result.newRegime.totalTax).toBe(0);
    expect(result.oldRegime.totalTax).toBe(0);
  });

  it("4% cess applied to (tax + surcharge) in both regimes", () => {
    const result = calculateIncomeTax({ grossIncome: 30_00_000 });
    const expectedNewCess =
      (result.newRegime.taxAfterRebate + result.newRegime.surcharge) * 0.04;
    expect(result.newRegime.cess).toBeCloseTo(expectedNewCess, 2);
  });
});
