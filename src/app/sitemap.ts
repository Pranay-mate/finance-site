import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators/registry";
import { liveArticles } from "@/lib/articles/registry";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/learn"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.filter(
    (c) => c.status !== "planned",
  ).map((c) => ({
    url: absoluteUrl(`/calculators/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = liveArticles().map((a) => ({
    url: absoluteUrl(`/learn/${a.slug}`),
    lastModified: a.updatedDate ? new Date(a.updatedDate) : new Date(a.publishedDate),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...calculatorRoutes, ...articleRoutes];
}
