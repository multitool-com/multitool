import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Unit Converter - Free Online Tool | MultiTool",
  description: "Convert between length, weight, volume and other common units.",
  keywords: ["unit converter", "metric converter", "imperial converter"],
  alternates: {
    canonical: "https://multitool.online/tools/converters/unit-converter",
  },
  openGraph: {
    title: "Unit Converter | MultiTool",
    description: "Convert between length, weight, volume and other common units.",
    url: "https://multitool.online/tools/converters/unit-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter | MultiTool",
    description: "Convert between length, weight, volume and other common units.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Unit Converter"
      description="Convert between length, weight, volume and other common units."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="unit-converter"
    />
  );
}
