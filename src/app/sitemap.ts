import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const locales = ["en", "zh"];
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const publicPages = ["", "/pricing", "/blog", "/docs"];
  for (const locale of locales) {
    for (const page of publicPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  // Blog posts
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Docs pages
  const docSlugs = [
    "getting-started", "configuration", "deployment",
    "authentication", "database", "i18n", "themes",
    "payments", "ai-integration", "email",
  ];
  for (const locale of locales) {
    for (const slug of docSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/docs/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
