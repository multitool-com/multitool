import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Days Until Date - Free Online Tool | MultiTool",
  description: "Count how many days remain until a specific future date.",
  keywords: ["days until", "countdown days", "days remaining"],
  alternates: {
    canonical: "https://multitool.online/tools/date-time/days-until-date",
  },
  openGraph: {
    title: "Days Until Date | MultiTool",
    description: "Count how many days remain until a specific future date.",
    url: "https://multitool.online/tools/date-time/days-until-date",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Days Until Date | MultiTool",
    description: "Count how many days remain until a specific future date.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Days Until Date"
      description="Count how many days remain until a specific future date."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="days-until-date"
    />
  );
}
