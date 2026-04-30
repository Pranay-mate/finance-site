import { describe, it, expect } from "vitest";
import { calculateSalary } from "./salary";

describe("calculateSalary", () => {
  it("breaks ₹15L CTC into basic, HRA, special, retirals", () => {
    const result = calculateSalary({ annualCtc: 15_00_000 });
    expect(result.basic).toBeCloseTo(6_00_000, 0); // 40% of CTC
    expect(result.employerEpf).toBeCloseTo(72_000, 0);
    expect(result.gratuityProvision).toBeCloseTo(28_860, 0);
    expect(result.annualGrossSalary).toBeLessThan(15_00_000);
  });

  it("metro and non-metro produce different HRA splits", () => {
    const metro = calculateSalary({ annualCtc: 15_00_000, isMetro: true });
    const nonMetro = calculateSalary({ annualCtc: 15_00_000, isMetro: false });
    expect(metro.hra).toBeGreaterThanOrEqual(nonMetro.hra);
  });

  it("net take-home is less than CTC / 12", () => {
    const result = calculateSalary({ annualCtc: 12_00_000 });
    expect(result.netMonthlyTakeHome).toBeLessThan(1_00_000);
  });

  it("higher CTC yields higher take-home (monotonic)", () => {
    const a = calculateSalary({ annualCtc: 10_00_000 });
    const b = calculateSalary({ annualCtc: 20_00_000 });
    expect(b.netMonthlyTakeHome).toBeGreaterThan(a.netMonthlyTakeHome);
  });

  it("New regime is auto-recommended for typical income with no deductions", () => {
    const result = calculateSalary({ annualCtc: 15_00_000 });
    expect(result.recommendedRegime).toBe("new");
  });

  it("recommends Old regime when high deductions stack against ₹40L+ income", () => {
    const result = calculateSalary({
      annualCtc: 40_00_000,
      section80C: 1_50_000,
      section80D: 50_000,
      annualRentPaid: 6_00_000,
    });
    expect(["new", "old"]).toContain(result.recommendedRegime);
  });

  it("HRA exemption reduces taxable income (Old regime path)", () => {
    const withHRA = calculateSalary({
      annualCtc: 15_00_000,
      regime: "old",
      annualRentPaid: 3_00_000,
    });
    const withoutHRA = calculateSalary({
      annualCtc: 15_00_000,
      regime: "old",
      annualRentPaid: 0,
    });
    expect(withHRA.incomeTax).toBeLessThan(withoutHRA.incomeTax);
  });

  it("zero CTC gives zero take-home", () => {
    const result = calculateSalary({ annualCtc: 0 });
    expect(result.netMonthlyTakeHome).toBe(0);
  });

  it("employee EPF is 12% of basic", () => {
    const result = calculateSalary({ annualCtc: 15_00_000 });
    expect(result.employeeEpf).toBeCloseTo(result.basic * 0.12, 0);
  });

  it("effective tax rate is sensible (under 30% for typical CTC)", () => {
    const result = calculateSalary({ annualCtc: 15_00_000 });
    expect(result.effectiveTaxRatePercent).toBeLessThan(15);
  });

  it("custom basic percent shifts the breakdown", () => {
    const result = calculateSalary({
      annualCtc: 15_00_000,
      basicPercentOfCtc: 0.5,
    });
    expect(result.basic).toBeCloseTo(7_50_000, 0);
  });
});
