export const SITE = {
  name: "Rupeeful",
  shortName: "Rupeeful",
  tagline: "Make every rupee count.",
  description:
    "Make every rupee count. Free financial calculators and clear money guides for India — SIP, PPF, EPF, EMI, income tax, GST, XIRR, FIRE, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  locale: "en_IN",
  twitterHandle: "" as const,
  organization: {
    legalName: "Rupeeful",
    foundingYear: 2026,
  },
} as const;

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
