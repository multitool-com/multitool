import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "GPA Calculator - Free Online Tool | MultiTool",
  description: "Calculate your Grade Point Average (GPA) from grades and credit hours.",
  keywords: ["gpa calculator", "grade point average", "college gpa"],
  alternates: {
    canonical: "https://multitool.online/tools/math/gpa-calculator",
  },
  openGraph: {
    title: "GPA Calculator | MultiTool",
    description: "Calculate your Grade Point Average (GPA) from grades and credit hours.",
    url: "https://multitool.online/tools/math/gpa-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator | MultiTool",
    description: "Calculate your Grade Point Average (GPA) from grades and credit hours.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="GPA Calculator"
      description="Calculate your Grade Point Average (GPA) from grades and credit hours."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="gpa-calculator"
    />
  );
}
