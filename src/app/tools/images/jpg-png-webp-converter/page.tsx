import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "JPG / PNG / WebP Converter - Free Online Tool | MultiTool",
  description:
    "Convert images between JPG, PNG and WebP formats instantly in your browser.",
  keywords: [
    "jpg to png",
    "png to jpg",
    "webp converter",
    "image format converter",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/jpg-png-webp-converter",
  },
  openGraph: {
    title: "JPG / PNG / WebP Converter | MultiTool",
    description:
      "Convert images between JPG, PNG and WebP formats instantly in your browser.",
    url: "https://multitoolbox.online/tools/images/jpg-png-webp-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG / PNG / WebP Converter | MultiTool",
    description:
      "Convert images between JPG, PNG and WebP formats instantly in your browser.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="JPG / PNG / WebP Converter"
      description="Convert images between JPG, PNG and WebP formats instantly in your browser."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="jpg-png-webp-converter"
    />
  );
}
