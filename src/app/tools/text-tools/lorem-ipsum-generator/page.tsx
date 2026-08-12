import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Online Tool | MultiTool",
  description: "Generate Lorem Ipsum placeholder text — words, sentences or paragraphs.",
  keywords: ["lorem ipsum", "placeholder text", "dummy text generator"],
  alternates: {
    canonical: "https://multitool.online/tools/text-tools/lorem-ipsum-generator",
  },
  openGraph: {
    title: "Lorem Ipsum Generator | MultiTool",
    description: "Generate Lorem Ipsum placeholder text — words, sentences or paragraphs.",
    url: "https://multitool.online/tools/text-tools/lorem-ipsum-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator | MultiTool",
    description: "Generate Lorem Ipsum placeholder text — words, sentences or paragraphs.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text — words, sentences or paragraphs."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="lorem-ipsum-generator"
    />
  );
}
