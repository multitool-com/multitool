import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Calorie / BMR Calculator - Free Online Tool | MultiTool",
  description: "Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR).",
  keywords: ["calorie calculator", "bmr calculator", "tdee", "daily calories"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/calorie-calculator",
  },
  openGraph: {
    title: "Calorie / BMR Calculator | MultiTool",
    description: "Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR).",
    url: "https://multitoolbox.online/tools/health/calorie-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie / BMR Calculator | MultiTool",
    description: "Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR).",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Calorie / BMR Calculator"
      description="Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR)."
      categoryName="Health & Fitness"
      categorySlug="health"
      toolSlug="calorie-calculator"
    />
  );
}
