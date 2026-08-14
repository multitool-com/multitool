import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Split / Extract Pages - Free Online Tool | MultiTool",
  description: "Extract specific pages or ranges from a PDF and save them as a new file.",
  keywords: ['split pdf', 'extract pages from pdf', 'pdf page extractor', 'split pdf online'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-split",
  },
  openGraph: {
    title: "PDF Split / Extract Pages | MultiTool",
    description: "Extract specific pages or ranges from a PDF and save them as a new file.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-split",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Split / Extract Pages | MultiTool",
    description: "Extract specific pages or ranges from a PDF and save them as a new file.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Split / Extract Pages"
      description="Extract specific pages or ranges from a PDF and save them as a new file."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-split"
    />
  );
}
