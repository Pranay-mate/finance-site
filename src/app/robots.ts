import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Block indexing only when explicitly opted into staging mode.
  // Localhost is never crawled by Google, so blocking it serves no purpose
  // (and breaks Lighthouse SEO testing). Real staging deploys should set
  // STAGING_NOINDEX=1 in their env.
  const blockIndexing = process.env.STAGING_NOINDEX === "1";

  return {
    rules: blockIndexing
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
