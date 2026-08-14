import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Sign - Free Online Tool | MultiTool",
  description: "Draw your signature and stamp it onto a PDF document in your browser.",
  keywords: ['sign pdf', 'pdf signature', 'sign pdf online', 'digital signature pdf'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-sign",
  },
  openGraph: {
    title: "PDF Sign | MultiTool",
    description: "Draw your signature and stamp it onto a PDF document in your browser.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-sign",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Sign | MultiTool",
    description: "Draw your signature and stamp it onto a PDF document in your browser.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Sign"
      description="Draw your signature and stamp it onto a PDF document in your browser."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-sign"
    />
  );
}
