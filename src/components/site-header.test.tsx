import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";
import { SITE } from "@/lib/site";

describe("SiteHeader", () => {
  it("renders the site name", () => {
    render(<SiteHeader />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
  });

  it("links the brand back to the homepage", () => {
    render(<SiteHeader />);
    const homeLink = screen.getByRole("link", { name: new RegExp(SITE.name, "i") });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("exposes Calculators, Learn, and FAQ navigation links", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /calculators/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^learn$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /faq/i })).toBeInTheDocument();
  });
});
