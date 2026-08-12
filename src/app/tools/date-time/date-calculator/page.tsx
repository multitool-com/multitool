import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Date Calculator - Free Online Tool | MultiTool",
  description: "Add or subtract days, weeks, months or years from any date.",
  keywords: ["date calculator", "date difference", "add days to date"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/date-time/date-calculator",
  },
  openGraph: {
    title: "Date Calculator | MultiTool",
    description: "Add or subtract days, weeks, months or years from any date.",
    url: "https://multitoolbox.online/tools/date-time/date-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date Calculator | MultiTool",
    description: "Add or subtract days, weeks, months or years from any date.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Date Calculator"
      description="Add or subtract days, weeks, months or years from any date."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="date-calculator"
    />
  );
}
