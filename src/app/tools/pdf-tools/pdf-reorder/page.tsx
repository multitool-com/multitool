import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Reorder / Remove Pages - Free Online Tool | MultiTool",
  description:
    "Reorder pages, move them with drag and drop, or remove pages you don't need.",
  keywords: [
    "reorder pdf pages",
    "pdf page organizer",
    "remove pages from pdf",
    "delete pdf pages",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-reorder",
  },
  openGraph: {
    title: "PDF Reorder / Remove Pages | MultiTool",
    description:
      "Reorder pages, move them with drag and drop, or remove pages you don't need.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-reorder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Reorder / Remove Pages | MultiTool",
    description:
      "Reorder pages, move them with drag and drop, or remove pages you don't need.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Reorder / Remove Pages"
      description="Reorder pages, move them with drag and drop, or remove pages you don't need."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-reorder"
    />
  );
}
