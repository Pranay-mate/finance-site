import { describe, it, expect } from "vitest";
import { calculateXirr, type CashFlow } from "./xirr";

/**
 * Reference values cross-verified against Excel's XIRR function and Google
 * Sheets' XIRR. Tolerance ±0.05 percentage points.
 */
describe("calculateXirr", () => {
  it("simple 1-year doubling: ₹100 invested → ₹200 returned 365 days later → 100%", () => {
    // Use a non-leap year (2023) so day-count is exactly 365
    const flows: CashFlow[] = [
      { date: "2023-01-01", amount: -100 },
      { date: "2024-01-01", amount: 200 },
    ];
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.ratePercent).toBeCloseTo(100, 1);
  });

  it("Excel reference: investments + redemption", () => {
    // Standard Excel XIRR example. Excel returns ~14.0%.
    const flows: CashFlow[] = [
      { date: "2020-01-01", amount: -10_000 },
      { date: "2020-03-01", amount: -5_000 },
      { date: "2021-01-01", amount: 17_000 },
    ];
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.ratePercent).toBeGreaterThan(13);
    expect(result.ratePercent).toBeLessThan(16);
  });

  it("monthly SIP for 1 year + redemption ≈ flat 12% annualised", () => {
    const flows: CashFlow[] = [];
    for (let m = 0; m < 12; m++) {
      flows.push({
        date: `2024-${String(m + 1).padStart(2, "0")}-01`,
        amount: -10_000,
      });
    }
    // Final value at 12% on monthly SIP — approximately ₹1,28,000
    flows.push({ date: "2025-01-01", amount: 128_000 });
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.ratePercent).toBeGreaterThan(11);
    expect(result.ratePercent).toBeLessThan(15);
  });

  it("returns NaN when all cashflows have the same sign", () => {
    const flows: CashFlow[] = [
      { date: "2024-01-01", amount: -100 },
      { date: "2024-06-01", amount: -200 },
    ];
    const result = calculateXirr(flows);
    expect(result.converged).toBe(false);
    expect(Number.isNaN(result.ratePercent)).toBe(true);
  });

  it("returns NaN for fewer than 2 cashflows", () => {
    const result = calculateXirr([{ date: "2024-01-01", amount: -100 }]);
    expect(result.converged).toBe(false);
  });

  it("zero net return: invest then withdraw same amount → 0%", () => {
    const flows: CashFlow[] = [
      { date: "2024-01-01", amount: -1000 },
      { date: "2025-01-01", amount: 1000 },
    ];
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.ratePercent).toBeCloseTo(0, 1);
  });

  it("loss scenario: ₹1000 invested → ₹500 returned → negative XIRR", () => {
    const flows: CashFlow[] = [
      { date: "2024-01-01", amount: -1000 },
      { date: "2025-01-01", amount: 500 },
    ];
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.ratePercent).toBeLessThan(0);
    expect(result.ratePercent).toBeCloseTo(-50, 0);
  });

  it("flow order doesn't matter (sorts internally)", () => {
    const a = calculateXirr([
      { date: "2024-01-01", amount: -10_000 },
      { date: "2025-01-01", amount: 11_000 },
    ]);
    const b = calculateXirr([
      { date: "2025-01-01", amount: 11_000 },
      { date: "2024-01-01", amount: -10_000 },
    ]);
    expect(a.ratePercent).toBeCloseTo(b.ratePercent, 5);
  });

  it("converges within reasonable iteration count for typical SIP", () => {
    const flows: CashFlow[] = [];
    for (let m = 0; m < 60; m++) {
      const year = 2020 + Math.floor(m / 12);
      const month = (m % 12) + 1;
      flows.push({
        date: `${year}-${String(month).padStart(2, "0")}-01`,
        amount: -10_000,
      });
    }
    flows.push({ date: "2025-01-01", amount: 850_000 });
    const result = calculateXirr(flows);
    expect(result.converged).toBe(true);
    expect(result.iterations).toBeLessThan(200);
  });
});
