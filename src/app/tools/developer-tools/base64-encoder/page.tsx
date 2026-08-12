import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder - Free Online Tool | MultiTool",
  description: "Encode text to Base64 or decode Base64 back to plain text.",
  keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
  alternates: {
    canonical: "https://multitool.online/tools/developer-tools/base64-encoder",
  },
  openGraph: {
    title: "Base64 Encoder / Decoder | MultiTool",
    description: "Encode text to Base64 or decode Base64 back to plain text.",
    url: "https://multitool.online/tools/developer-tools/base64-encoder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder / Decoder | MultiTool",
    description: "Encode text to Base64 or decode Base64 back to plain text.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to plain text."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="base64-encoder"
    />
  );
}
