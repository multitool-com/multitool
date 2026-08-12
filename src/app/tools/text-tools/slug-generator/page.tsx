import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Slug Generator - Free Online Tool | MultiTool",
  description: "Generate clean, URL-friendly slugs from any text or title.",
  keywords: ["slug generator", "url slug", "seo slug"],
  alternates: {
    canonical: "https://multitool.online/tools/text-tools/slug-generator",
  },
  openGraph: {
    title: "Slug Generator | MultiTool",
    description: "Generate clean, URL-friendly slugs from any text or title.",
    url: "https://multitool.online/tools/text-tools/slug-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slug Generator | MultiTool",
    description: "Generate clean, URL-friendly slugs from any text or title.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Slug Generator"
      description="Generate clean, URL-friendly slugs from any text or title."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="slug-generator"
    />
  );
}
