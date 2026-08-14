import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Compress - Free Online Tool | MultiTool",
  description:
    "Reduce the file size of a PDF by re-encoding pages as optimized images.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "pdf compressor",
    "shrink pdf",
    "smaller pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-compress",
  },
  openGraph: {
    title: "PDF Compress | MultiTool",
    description:
      "Reduce the file size of a PDF by re-encoding pages as optimized images.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-compress",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Compress | MultiTool",
    description:
      "Reduce the file size of a PDF by re-encoding pages as optimized images.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Compress"
      description="Reduce the file size of a PDF by re-encoding pages as optimized images."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-compress"
    />
  );
}
