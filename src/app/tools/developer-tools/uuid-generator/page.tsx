import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "UUID Generator - Free Online Tool | MultiTool",
  description: "Generate random UUIDs (v4) — one or bulk. Copy with one click.",
  keywords: ["uuid generator", "guid generator", "uuid v4"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator | MultiTool",
    description: "Generate random UUIDs (v4) — one or bulk. Copy with one click.",
    url: "https://multitoolbox.online/tools/developer-tools/uuid-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator | MultiTool",
    description: "Generate random UUIDs (v4) — one or bulk. Copy with one click.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="UUID Generator"
      description="Generate random UUIDs (v4) — one or bulk. Copy with one click."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="uuid-generator"
    />
  );
}
