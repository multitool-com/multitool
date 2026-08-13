import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Image to Base64 - Free Online Tool | MultiTool",
  description:
    "Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON.",
  keywords: [
    "image to base64",
    "base64 image",
    "data uri",
    "image encoder",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/image-to-base64",
  },
  openGraph: {
    title: "Image to Base64 | MultiTool",
    description:
      "Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON.",
    url: "https://multitoolbox.online/tools/images/image-to-base64",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Base64 | MultiTool",
    description:
      "Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Image to Base64"
      description="Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="image-to-base64"
    />
  );
}
