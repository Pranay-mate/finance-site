import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

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
    // Note: omitting `host` — it's a Yandex-only directive that Googlebot
    // ignores and GSC flags as a warning.
  };
}
