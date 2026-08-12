import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/tools";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.name} - Free Online Tools`,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#0d3b36",
    orientation: "portrait",
    categories: ["utilities", "productivity", "education"],
    lang: "en",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}