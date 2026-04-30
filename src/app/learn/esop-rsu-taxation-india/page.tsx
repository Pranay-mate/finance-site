import type { Metadata } from "next";
import { ArticleLayout } from "@/components/article-layout";
import { buildMetadata } from "@/lib/seo";
import { getArticle } from "@/lib/articles/registry";
import Content from "./content.mdx";

const SLUG = "esop-rsu-taxation-india";
const article = getArticle(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: article.metaTitle,
  description: article.metaDescription,
  path: `/learn/${SLUG}`,
  keywords: article.keywords,
});

export default function Page() {
  return (
    <ArticleLayout slug={SLUG}>
      <Content />
    </ArticleLayout>
  );
}
