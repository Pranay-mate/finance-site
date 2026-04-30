import { describe, it, expect } from "vitest";
import { absoluteUrl, SITE } from "./site";

describe("absoluteUrl", () => {
  it("prepends the site URL when given a relative path", () => {
    expect(absoluteUrl("/calculators/ppf-calculator")).toBe(
      `${SITE.url}/calculators/ppf-calculator`,
    );
  });

  it("normalises a missing leading slash", () => {
    expect(absoluteUrl("calculators/fd-calculator")).toBe(
      `${SITE.url}/calculators/fd-calculator`,
    );
  });

  it("does not double-up slashes when SITE.url ends with a slash", () => {
    const result = absoluteUrl("/about");
    expect(result).toMatch(/[^/]\/about$/);
  });
});
