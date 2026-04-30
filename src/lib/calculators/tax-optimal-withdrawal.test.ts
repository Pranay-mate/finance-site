import { describe, it, expect } from "vitest";
import { calculateTaxOptimalWithdrawal } from "./tax-optimal-withdrawal";

describe("calculateTaxOptimalWithdrawal", () => {
  const baseBuckets = {
    taxFreeAvailable: 30_00_000,
    equityAvailable: 1_00_00_000,
    equityUnrealizedGainFraction: 0.5,
    debtAvailable: 50_00_000,
    debtUnrealizedGainFraction: 0.2,
  };

  it("optimal plan beats naive on total tax", () => {
    const result = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 12_00_000,
      marginalSlabPercent: 30,
    });
    expect(result.optimal.totalTax).toBeLessThan(result.naive.totalTax);
    expect(result.savings).toBeGreaterThan(0);
  });

  it("optimal plan drains tax-free first", () => {
    const result = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 5_00_000,
      marginalSlabPercent: 30,
    });
    // ₹5L expense fits entirely in tax-free bucket (₹30L available)
    expect(result.optimal.fromTaxFree).toBe(5_00_000);
    expect(result.optimal.fromEquity).toBe(0);
    expect(result.optimal.fromDebt).toBe(0);
    expect(result.optimal.totalTax).toBe(0);
  });

  it("uses equity LTCG exemption window before paying tax", () => {
    const result = calculateTaxOptimalWithdrawal({
      taxFreeAvailable: 0,
      equityAvailable: 1_00_00_000,
      equityUnrealizedGainFraction: 0.5,
      debtAvailable: 0,
      debtUnrealizedGainFraction: 0.2,
      annualExpenses: 2_50_000,
      marginalSlabPercent: 30,
    });
    // ₹2.5L withdrawal at 50% gain = ₹1.25L gain — exactly at exemption.
    // Tax should be zero.
    expect(result.optimal.fromEquity).toBe(2_50_000);
    expect(result.optimal.totalTax).toBeCloseTo(0, 1);
  });

  it("at high slab (30%), prefers equity above exemption over debt", () => {
    const result = calculateTaxOptimalWithdrawal({
      taxFreeAvailable: 0,
      equityAvailable: 1_00_00_000,
      equityUnrealizedGainFraction: 0.5,
      debtAvailable: 50_00_000,
      debtUnrealizedGainFraction: 0.5,
      annualExpenses: 20_00_000,
      marginalSlabPercent: 30,
    });
    // 50% gain × 30% slab = 15% effective rate on debt
    // 50% gain × 12.5% LTCG = 6.25% effective rate on equity above exemption
    // Equity should be drained more than debt
    expect(result.optimal.fromEquity).toBeGreaterThan(result.optimal.fromDebt);
  });

  it("at low slab (5%), prefers debt over equity above exemption", () => {
    const result = calculateTaxOptimalWithdrawal({
      taxFreeAvailable: 0,
      equityAvailable: 1_00_00_000,
      equityUnrealizedGainFraction: 0.5,
      debtAvailable: 50_00_000,
      debtUnrealizedGainFraction: 0.5,
      annualExpenses: 20_00_000,
      marginalSlabPercent: 5,
    });
    // 50% gain × 5% slab = 2.5% on debt
    // 50% gain × 12.5% LTCG = 6.25% on equity above exemption
    // Debt is now cheaper — should drain it first after equity exemption
    expect(result.optimal.fromDebt).toBeGreaterThan(0);
  });

  it("net received matches the requested expense target (within rounding)", () => {
    const result = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 15_00_000,
      marginalSlabPercent: 30,
    });
    expect(result.optimal.netReceived).toBeCloseTo(15_00_000, -1);
    expect(result.optimal.metExpenseTarget).toBe(true);
  });

  it("zero unrealized gain on debt → no tax on debt portion", () => {
    const result = calculateTaxOptimalWithdrawal({
      taxFreeAvailable: 0,
      equityAvailable: 0,
      equityUnrealizedGainFraction: 0,
      debtAvailable: 50_00_000,
      debtUnrealizedGainFraction: 0,
      annualExpenses: 10_00_000,
      marginalSlabPercent: 30,
    });
    expect(result.optimal.taxOnDebt).toBe(0);
    expect(result.optimal.fromDebt).toBe(10_00_000);
  });

  it("returns zero plan when buckets are empty", () => {
    const result = calculateTaxOptimalWithdrawal({
      taxFreeAvailable: 0,
      equityAvailable: 0,
      equityUnrealizedGainFraction: 0.5,
      debtAvailable: 0,
      debtUnrealizedGainFraction: 0.2,
      annualExpenses: 10_00_000,
      marginalSlabPercent: 30,
    });
    expect(result.optimal.totalTax).toBe(0);
    expect(result.optimal.metExpenseTarget).toBe(false);
  });

  it("naive proportional plan splits across all buckets", () => {
    const result = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 10_00_000,
      marginalSlabPercent: 30,
    });
    expect(result.naive.fromTaxFree).toBeGreaterThan(0);
    expect(result.naive.fromEquity).toBeGreaterThan(0);
    expect(result.naive.fromDebt).toBeGreaterThan(0);
  });

  it("savings increase with larger withdrawal needs", () => {
    const small = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 5_00_000,
      marginalSlabPercent: 30,
    });
    const large = calculateTaxOptimalWithdrawal({
      ...baseBuckets,
      annualExpenses: 25_00_000,
      marginalSlabPercent: 30,
    });
    expect(large.savings).toBeGreaterThanOrEqual(small.savings);
  });
});
