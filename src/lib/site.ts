export const SITE = {
  name: "WisePaisa",
  shortName: "WisePaisa",
  tagline: "Plan your money the wise way.",
  description:
    "Plan your money the wise way. Free financial calculators for India — SIP, PPF, EPF, EMI, income tax, GST, XIRR, FIRE, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  locale: "en_IN",
  twitterHandle: "" as const,
  organization: {
    legalName: "WisePaisa",
    foundingYear: 2026,
  },
} as const;

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
