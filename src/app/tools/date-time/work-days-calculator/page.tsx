import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Work Days Calculator - Free Online Tool | MultiTool",
  description: "Calculate the number of business days between two dates.",
  keywords: ["work days calculator", "business days", "working days between dates"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/date-time/work-days-calculator",
  },
  openGraph: {
    title: "Work Days Calculator | MultiTool",
    description: "Calculate the number of business days between two dates.",
    url: "https://multitoolbox.online/tools/date-time/work-days-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Days Calculator | MultiTool",
    description: "Calculate the number of business days between two dates.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Work Days Calculator"
      description="Calculate the number of business days between two dates."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="work-days-calculator"
    />
  );
}
