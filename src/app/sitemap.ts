import type { MetadataRoute } from "next";
import { SITE_CONFIG, categories, getAllTools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas estáticas (institucionais e legais)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.url}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Páginas de categoria
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_CONFIG.url}/tools/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Páginas de ferramentas
  // Ferramentas "ready" têm prioridade maior que "coming-soon"
  const toolPages: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${SITE_CONFIG.url}/tools/${tool.categorySlug}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.status === "ready" ? 0.9 : 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}