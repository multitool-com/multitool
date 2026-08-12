import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Hash Generator - Free Online Tool | MultiTool",
  description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",
  keywords: ["hash generator", "md5", "sha256", "hash converter"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/hash-generator",
  },
  openGraph: {
    title: "Hash Generator | MultiTool",
    description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",
    url: "https://multitoolbox.online/tools/developer-tools/hash-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator | MultiTool",
    description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="hash-generator"
    />
  );
}
