import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Text Diff Checker - Free Online Tool | MultiTool",
  description: "Compare two texts side by side and highlight the differences.",
  keywords: ["text diff", "compare text", "diff checker"],
  alternates: {
    canonical: "https://multitool.online/tools/text-tools/text-diff",
  },
  openGraph: {
    title: "Text Diff Checker | MultiTool",
    description: "Compare two texts side by side and highlight the differences.",
    url: "https://multitool.online/tools/text-tools/text-diff",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Checker | MultiTool",
    description: "Compare two texts side by side and highlight the differences.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Text Diff Checker"
      description="Compare two texts side by side and highlight the differences."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="text-diff"
    />
  );
}
