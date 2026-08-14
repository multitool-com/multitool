import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Watermark - Free Online Tool | MultiTool",
  description:
    "Add a text or image watermark to every page of a PDF, with position and opacity controls.",
  keywords: [
    "pdf watermark",
    "add watermark to pdf",
    "watermark pdf",
    "pdf watermark online",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-watermark",
  },
  openGraph: {
    title: "PDF Watermark | MultiTool",
    description:
      "Add a text or image watermark to every page of a PDF, with position and opacity controls.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-watermark",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Watermark | MultiTool",
    description:
      "Add a text or image watermark to every page of a PDF, with position and opacity controls.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Watermark"
      description="Add a text or image watermark to every page of a PDF, with position and opacity controls."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-watermark"
    />
  );
}
