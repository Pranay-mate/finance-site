export const SITE = {
  name: "Finance Site",
  shortName: "FinSite",
  description:
    "Free, accurate financial calculators for Indian investors. SIP, lumpsum, PPF, EPF, FD, RD, EMI, income tax, GST, XIRR and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  locale: "en_IN",
  twitterHandle: "" as const,
  organization: {
    legalName: "Finance Site",
    foundingYear: 2026,
  },
} as const;

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
