import { describe, it, expect } from "vitest";
import { calculateSwp } from "./swp";

describe("calculateSwp", () => {
  it("withdrawal less than growth → corpus grows over time", () => {
    const result = calculateSwp({
      corpus: 1_00_00_000, // 1 Cr
      monthlyWithdrawal: 50_000, // ₹6L/year
      annualReturnPercent: 10,
      tenureYears: 20,
    });
    // 10% on 1 Cr = ~10L/year of growth; 6L/year withdrawal — corpus grows
    expect(result.finalBalance).toBeGreaterThan(1_00_00_000);
    expect(result.depleted).toBe(false);
    expect(result.monthsLasted).toBe(240);
  });

  it("withdrawal equals growth → corpus roughly stable", () => {
    const result = calculateSwp({
      corpus: 1_00_00_000,
      monthlyWithdrawal: 83_000, // close to 10% on 1Cr / 12 ≈ 83333
      annualReturnPercent: 10,
      tenureYears: 20,
    });
    // Corpus should remain in the same ball-park (not depleted, not exploded)
    expect(result.finalBalance).toBeGreaterThan(0);
    expect(result.depleted).toBe(false);
  });

  it("withdrawal exceeds growth → corpus depletes", () => {
    const result = calculateSwp({
      corpus: 50_00_000, // 50L
      monthlyWithdrawal: 1_00_000, // 12L/year — well above sustainable
      annualReturnPercent: 8,
      tenureYears: 30,
    });
    expect(result.depleted).toBe(true);
    expect(result.monthsLasted).toBeLessThan(360);
    expect(result.finalBalance).toBeLessThanOrEqual(0);
  });

  it("zero return: monthly withdrawal × months ≤ corpus", () => {
    const result = calculateSwp({
      corpus: 12_00_000,
      monthlyWithdrawal: 10_000,
      annualReturnPercent: 0,
      tenureYears: 10,
    });
    // Without growth, 10K × 120 = 12L total — exactly the corpus
    expect(result.totalWithdrawn).toBeCloseTo(12_00_000, 0);
    expect(result.finalBalance).toBeCloseTo(0, 0);
  });

  it("schedule sums match totals", () => {
    const result = calculateSwp({
      corpus: 50_00_000,
      monthlyWithdrawal: 30_000,
      annualReturnPercent: 8,
      tenureYears: 15,
    });
    const totalWithdrawn = result.schedule.reduce(
      (sum, row) => sum + row.totalWithdrawn,
      0,
    );
    expect(totalWithdrawn).toBeCloseTo(result.totalWithdrawn, 0);
  });

  it("each schedule row's opening matches previous row's closing", () => {
    const result = calculateSwp({
      corpus: 50_00_000,
      monthlyWithdrawal: 30_000,
      annualReturnPercent: 8,
      tenureYears: 10,
    });
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].openingBalance).toBeCloseTo(
        result.schedule[i - 1].closingBalance,
        2,
      );
    }
  });

  it("returns zero for zero corpus", () => {
    const result = calculateSwp({
      corpus: 0,
      monthlyWithdrawal: 30_000,
      annualReturnPercent: 8,
      tenureYears: 10,
    });
    expect(result.finalBalance).toBe(0);
    expect(result.schedule).toHaveLength(0);
  });

  it("4% safe withdrawal rate sustains 30 years at 8% return", () => {
    // Bengen's 4% rule sanity check
    const corpus = 1_00_00_000;
    const result = calculateSwp({
      corpus,
      monthlyWithdrawal: (corpus * 0.04) / 12,
      annualReturnPercent: 8,
      tenureYears: 30,
    });
    expect(result.depleted).toBe(false);
    expect(result.finalBalance).toBeGreaterThan(corpus); // 4% under 8% return = corpus grows
  });
});
