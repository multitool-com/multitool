import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Images to PDF - Free Online Tool | MultiTool",
  description: "Turn JPG, PNG and WebP images into a single PDF document in your browser.",
  keywords: ['images to pdf', 'jpg to pdf', 'png to pdf', 'image to pdf converter'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF | MultiTool",
    description: "Turn JPG, PNG and WebP images into a single PDF document in your browser.",
    url: "https://multitoolbox.online/tools/pdf-tools/images-to-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Images to PDF | MultiTool",
    description: "Turn JPG, PNG and WebP images into a single PDF document in your browser.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Images to PDF"
      description="Turn JPG, PNG and WebP images into a single PDF document in your browser."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="images-to-pdf"
    />
  );
}
