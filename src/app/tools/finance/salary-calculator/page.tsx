import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Salary / Hourly Wage Calculator - Free Online Tool | MultiTool",
  description: "Convert between hourly, weekly, monthly and annual salary quickly.",
  keywords: ["salary calculator", "hourly wage", "annual salary", "pay converter"],
  alternates: {
    canonical: "https://multitool.online/tools/finance/salary-calculator",
  },
  openGraph: {
    title: "Salary / Hourly Wage Calculator | MultiTool",
    description: "Convert between hourly, weekly, monthly and annual salary quickly.",
    url: "https://multitool.online/tools/finance/salary-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary / Hourly Wage Calculator | MultiTool",
    description: "Convert between hourly, weekly, monthly and annual salary quickly.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Salary / Hourly Wage Calculator"
      description="Convert between hourly, weekly, monthly and annual salary quickly."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="salary-calculator"
    />
  );
}
