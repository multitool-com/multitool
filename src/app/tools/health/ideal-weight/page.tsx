import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator - Free Online Tool | MultiTool",
  description: "Find your ideal body weight range based on height, age and gender.",
  keywords: ["ideal weight", "healthy weight calculator", "target weight"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/ideal-weight",
  },
  openGraph: {
    title: "Ideal Weight Calculator | MultiTool",
    description: "Find your ideal body weight range based on height, age and gender.",
    url: "https://multitoolbox.online/tools/health/ideal-weight",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Weight Calculator | MultiTool",
    description: "Find your ideal body weight range based on height, age and gender.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Ideal Weight Calculator"
      description="Find your ideal body weight range based on height, age and gender."
      categoryName="Health & Fitness"
      categorySlug="health"
      toolSlug="ideal-weight"
    />
  );
}
