import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Free Online Tool | MultiTool",
  description: "Convert Unix timestamps to human-readable dates and vice versa.",
  keywords: ["unix timestamp", "epoch converter", "timestamp to date"],
  alternates: {
    canonical: "https://multitool.online/tools/date-time/unix-timestamp",
  },
  openGraph: {
    title: "Unix Timestamp Converter | MultiTool",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    url: "https://multitool.online/tools/date-time/unix-timestamp",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter | MultiTool",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and vice versa."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="unix-timestamp"
    />
  );
}
