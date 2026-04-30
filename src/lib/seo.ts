import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
};

export function buildMetadata(input: SeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const ogImage = input.ogImage ?? "/og-default.png";

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Free Financial Calculators for Indian Investors`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.organization.legalName }],
  creator: SITE.organization.legalName,
  publisher: SITE.organization.legalName,
  formatDetection: { email: false, address: false, telephone: false },
};
