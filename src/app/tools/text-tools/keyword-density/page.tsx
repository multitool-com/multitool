import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Keyword Density Checker - Free Online Tool | MultiTool",
  description:
    "Check how often a keyword appears in your text as a percentage of all words.",
  keywords: [
    "keyword density",
    "keyword density checker",
    "seo keyword",
    "keyword frequency",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/keyword-density",
  },
  openGraph: {
    title: "Keyword Density Checker | MultiTool",
    description:
      "Check how often a keyword appears in your text as a percentage of all words.",
    url: "https://multitoolbox.online/tools/text-tools/keyword-density",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyword Density Checker | MultiTool",
    description:
      "Check how often a keyword appears in your text as a percentage of all words.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Keyword Density Checker"
      description="Check how often a keyword appears in your text as a percentage of all words."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="keyword-density"
    />
  );
}
