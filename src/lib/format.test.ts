import { describe, it, expect } from "vitest";
import {
  formatINR,
  formatINRCompact,
  formatNumber,
  formatPercent,
  formatYears,
} from "./format";

describe("format helpers", () => {
  it("formats INR with Indian grouping (lakh / crore separators)", () => {
    expect(formatINR(100000)).toMatch(/1,00,000/);
    expect(formatINR(10000000)).toMatch(/1,00,00,000/);
  });

  it("rounds INR values to whole rupees", () => {
    expect(formatINR(1234.56)).toMatch(/1,235/);
  });

  it("returns em-dash for non-finite numbers", () => {
    expect(formatINR(Number.NaN)).toBe("—");
    expect(formatINRCompact(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatNumber(Number.NaN)).toBe("—");
    expect(formatPercent(Number.NaN)).toBe("—");
  });

  it("formats percent with default 2 decimals", () => {
    expect(formatPercent(7.1)).toBe("7.10%");
    expect(formatPercent(7, 0)).toBe("7%");
  });

  it("formats years with smart pluralization", () => {
    expect(formatYears(1)).toBe("1 year");
    expect(formatYears(20)).toBe("20 years");
    expect(formatYears(2.5)).toBe("2.5 years");
  });

  it("formats compact INR with rupee prefix", () => {
    expect(formatINRCompact(1500000)).toMatch(/^₹/);
  });
});
