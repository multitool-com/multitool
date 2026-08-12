import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator - Free Online Tool | MultiTool",
  description: "Estimate your baby\'s due date based on your last menstrual period.",
  keywords: ["pregnancy calculator", "due date", "baby due date", "gestational age"],
  alternates: {
    canonical: "https://multitool.online/tools/health/pregnancy-due-date",
  },
  openGraph: {
    title: "Pregnancy Due Date Calculator | MultiTool",
    description: "Estimate your baby\'s due date based on your last menstrual period.",
    url: "https://multitool.online/tools/health/pregnancy-due-date",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Due Date Calculator | MultiTool",
    description: "Estimate your baby\'s due date based on your last menstrual period.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Pregnancy Due Date Calculator"
      description="Estimate your baby\'s due date based on your last menstrual period."
      categoryName="Health & Fitness"
      categorySlug="health"
      toolSlug="pregnancy-due-date"
    />
  );
}
