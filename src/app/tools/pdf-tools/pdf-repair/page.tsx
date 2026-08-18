import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Repair - Free Online Tool | MultiTool",
  description:
    "Try to recover and repair damaged or unreadable PDF files.",
  keywords: [
    "pdf repair",
    "repair pdf",
    "fix pdf",
    "recover pdf",
    "corrupted pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-repair",
  },
  openGraph: {
    title: "PDF Repair | MultiTool",
    description:
      "Try to recover and repair damaged or unreadable PDF files.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-repair",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Repair | MultiTool",
    description:
      "Try to recover and repair damaged or unreadable PDF files.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Repair"
      description="Try to recover and repair damaged or unreadable PDF files."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-repair"
    />
  );
}
