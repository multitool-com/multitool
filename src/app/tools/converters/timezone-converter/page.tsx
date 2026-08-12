import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Time Zone Converter - Free Online Tool | MultiTool",
  description: "Convert times between different time zones around the world.",
  keywords: ["time zone converter", "world clock", "utc converter"],
  alternates: {
    canonical: "https://multitool.online/tools/converters/timezone-converter",
  },
  openGraph: {
    title: "Time Zone Converter | MultiTool",
    description: "Convert times between different time zones around the world.",
    url: "https://multitool.online/tools/converters/timezone-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Converter | MultiTool",
    description: "Convert times between different time zones around the world.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Time Zone Converter"
      description="Convert times between different time zones around the world."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="timezone-converter"
    />
  );
}
