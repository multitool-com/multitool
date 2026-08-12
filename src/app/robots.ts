import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/tools";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
        ],
      },
      // Google AdSense bot — permissão explícita
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      // Google Ads bot
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}