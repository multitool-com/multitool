import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Number Base Converter - Free Online Tool | MultiTool",
  description: "Convert numbers between binary, decimal, hexadecimal and octal.",
  keywords: ["binary converter", "hex converter", "decimal to binary"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/converters/number-base-converter",
  },
  openGraph: {
    title: "Number Base Converter | MultiTool",
    description: "Convert numbers between binary, decimal, hexadecimal and octal.",
    url: "https://multitoolbox.online/tools/converters/number-base-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Base Converter | MultiTool",
    description: "Convert numbers between binary, decimal, hexadecimal and octal.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Number Base Converter"
      description="Convert numbers between binary, decimal, hexadecimal and octal."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="number-base-converter"
    />
  );
}
