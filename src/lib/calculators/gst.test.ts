import { describe, it, expect } from "vitest";
import { calculateGst, GST_STANDARD_RATES } from "./gst";

describe("calculateGst", () => {
  it("add 18% GST: ₹1000 → ₹1180 (₹180 GST)", () => {
    const result = calculateGst({ mode: "add", amount: 1000, ratePercent: 18 });
    expect(result.baseAmount).toBe(1000);
    expect(result.gstAmount).toBeCloseTo(180, 6);
    expect(result.totalAmount).toBeCloseTo(1180, 6);
  });

  it("remove 18% GST from ₹1180 → ₹1000 base + ₹180 GST", () => {
    const result = calculateGst({ mode: "remove", amount: 1180, ratePercent: 18 });
    expect(result.baseAmount).toBeCloseTo(1000, 6);
    expect(result.gstAmount).toBeCloseTo(180, 6);
    expect(result.totalAmount).toBe(1180);
  });

  it("add and remove are exact inverses for any rate and amount", () => {
    for (const rate of GST_STANDARD_RATES) {
      const amount = 12_345.67;
      const added = calculateGst({ mode: "add", amount, ratePercent: rate });
      const removed = calculateGst({
        mode: "remove",
        amount: added.totalAmount,
        ratePercent: rate,
      });
      expect(removed.baseAmount).toBeCloseTo(amount, 6);
    }
  });

  it("CGST + SGST = total GST (intra-state)", () => {
    const result = calculateGst({ mode: "add", amount: 10_000, ratePercent: 18 });
    expect(result.cgst + result.sgst).toBeCloseTo(result.gstAmount, 6);
    expect(result.cgst).toBeCloseTo(result.sgst, 6);
  });

  it("IGST equals total GST (inter-state)", () => {
    const result = calculateGst({ mode: "add", amount: 10_000, ratePercent: 18 });
    expect(result.igst).toBeCloseTo(result.gstAmount, 6);
  });

  it("0% GST: total equals base", () => {
    const result = calculateGst({ mode: "add", amount: 1000, ratePercent: 0 });
    expect(result.totalAmount).toBe(1000);
    expect(result.gstAmount).toBe(0);
  });

  it("28% GST (luxury) on ₹100,000 → ₹28,000 GST", () => {
    const result = calculateGst({ mode: "add", amount: 100_000, ratePercent: 28 });
    expect(result.gstAmount).toBeCloseTo(28_000, 6);
    expect(result.totalAmount).toBeCloseTo(128_000, 6);
  });

  it("returns zeros for zero amount", () => {
    const result = calculateGst({ mode: "add", amount: 0, ratePercent: 18 });
    expect(result.totalAmount).toBe(0);
    expect(result.gstAmount).toBe(0);
  });

  it("standard rates include all GST Council slabs", () => {
    expect(GST_STANDARD_RATES).toEqual([0, 5, 12, 18, 28]);
  });
});
