import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Rotate - Free Online Tool | MultiTool",
  description: "Rotate PDF pages 90, 180 or 270 degrees — all pages or only selected ones.",
  keywords: ['rotate pdf', 'rotate pdf pages', 'pdf rotate online'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-rotate",
  },
  openGraph: {
    title: "PDF Rotate | MultiTool",
    description: "Rotate PDF pages 90, 180 or 270 degrees — all pages or only selected ones.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-rotate",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Rotate | MultiTool",
    description: "Rotate PDF pages 90, 180 or 270 degrees — all pages or only selected ones.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Rotate"
      description="Rotate PDF pages 90, 180 or 270 degrees — all pages or only selected ones."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-rotate"
    />
  );
}
