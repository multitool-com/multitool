import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Metadata Editor - Free Online Tool | MultiTool",
  description:
    "View and edit PDF metadata: title, author, subject and keywords.",
  keywords: [
    "pdf metadata",
    "edit pdf title",
    "pdf properties",
    "pdf metadata editor",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-metadata",
  },
  openGraph: {
    title: "PDF Metadata Editor | MultiTool",
    description:
      "View and edit PDF metadata: title, author, subject and keywords.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-metadata",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Metadata Editor | MultiTool",
    description:
      "View and edit PDF metadata: title, author, subject and keywords.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Metadata Editor"
      description="View and edit PDF metadata: title, author, subject and keywords."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-metadata"
    />
  );
}
