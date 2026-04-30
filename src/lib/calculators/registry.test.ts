import { describe, it, expect } from "vitest";
import {
  CALCULATORS,
  getCalculator,
  getRelatedCalculators,
  calculatorsByCategory,
} from "./registry";

describe("calculator registry", () => {
  it("has 17 calculators registered", () => {
    expect(CALCULATORS).toHaveLength(17);
  });

  it("has unique slugs", () => {
    const slugs = CALCULATORS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has SEO-friendly slugs (lowercase, hyphenated, ends with -calculator)", () => {
    for (const cal of CALCULATORS) {
      expect(cal.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(cal.slug.endsWith("-calculator")).toBe(true);
    }
  });

  it("every related slug points to a real calculator", () => {
    for (const cal of CALCULATORS) {
      for (const relatedSlug of cal.related) {
        expect(getCalculator(relatedSlug)).toBeDefined();
      }
    }
  });

  it("getRelatedCalculators returns calculator objects", () => {
    const related = getRelatedCalculators("emi-calculator");
    expect(related.length).toBeGreaterThan(0);
    for (const r of related) {
      expect(r.title).toBeDefined();
    }
  });

  it("getRelatedCalculators returns empty for unknown slug", () => {
    expect(getRelatedCalculators("nonexistent-calculator")).toEqual([]);
  });

  it("calculatorsByCategory groups all calculators", () => {
    const groups = calculatorsByCategory();
    const total = Object.values(groups).reduce((acc, list) => acc + list.length, 0);
    expect(total).toBe(CALCULATORS.length);
  });

  it("metaTitle and metaDescription are set for every calculator", () => {
    for (const cal of CALCULATORS) {
      expect(cal.metaTitle.length).toBeGreaterThan(20);
      expect(cal.metaTitle.length).toBeLessThanOrEqual(70);
      expect(cal.metaDescription.length).toBeGreaterThan(80);
      expect(cal.metaDescription.length).toBeLessThanOrEqual(170);
    }
  });
});
