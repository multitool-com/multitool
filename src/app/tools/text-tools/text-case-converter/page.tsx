import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Text Case Converter - Free Online Tool | MultiTool",
  description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.",
  keywords: ["case converter", "uppercase", "lowercase", "title case"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/text-case-converter",
  },
  openGraph: {
    title: "Text Case Converter | MultiTool",
    description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.",
    url: "https://multitoolbox.online/tools/text-tools/text-case-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter | MultiTool",
    description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Text Case Converter"
      description="Convert text to UPPERCASE, lowercase, Title Case, camelCase and more."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="text-case-converter"
    />
  );
}
