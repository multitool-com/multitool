import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder - Free Online Tool | MultiTool",
  description: "Encode or decode URLs and query strings (percent-encoding).",
  keywords: ["url encoder", "url decoder", "percent encoding"],
  alternates: {
    canonical: "https://multitool.online/tools/developer-tools/url-encoder",
  },
  openGraph: {
    title: "URL Encoder / Decoder | MultiTool",
    description: "Encode or decode URLs and query strings (percent-encoding).",
    url: "https://multitool.online/tools/developer-tools/url-encoder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder / Decoder | MultiTool",
    description: "Encode or decode URLs and query strings (percent-encoding).",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="URL Encoder / Decoder"
      description="Encode or decode URLs and query strings (percent-encoding)."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="url-encoder"
    />
  );
}
