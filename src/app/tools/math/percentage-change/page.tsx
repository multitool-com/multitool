import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Percentage Increase / Decrease - Free Online Tool | MultiTool",
  description: "Calculate the percentage change between two numbers (increase or decrease).",
  keywords: ["percentage change", "percent increase", "percent decrease"],
  alternates: {
    canonical: "https://multitool.online/tools/math/percentage-change",
  },
  openGraph: {
    title: "Percentage Increase / Decrease | MultiTool",
    description: "Calculate the percentage change between two numbers (increase or decrease).",
    url: "https://multitool.online/tools/math/percentage-change",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Increase / Decrease | MultiTool",
    description: "Calculate the percentage change between two numbers (increase or decrease).",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Percentage Increase / Decrease"
      description="Calculate the percentage change between two numbers (increase or decrease)."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="percentage-change"
    />
  );
}
