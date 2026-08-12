import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Roman Numeral Converter - Free Online Tool | MultiTool",
  description: "Convert Roman numerals to numbers and numbers to Roman numerals.",
  keywords: ["roman numeral converter", "roman numerals", "roman to number"],
  alternates: {
    canonical: "https://multitool.online/tools/converters/roman-numeral-converter",
  },
  openGraph: {
    title: "Roman Numeral Converter | MultiTool",
    description: "Convert Roman numerals to numbers and numbers to Roman numerals.",
    url: "https://multitool.online/tools/converters/roman-numeral-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roman Numeral Converter | MultiTool",
    description: "Convert Roman numerals to numbers and numbers to Roman numerals.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Roman Numeral Converter"
      description="Convert Roman numerals to numbers and numbers to Roman numerals."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="roman-numeral-converter"
    />
  );
}
