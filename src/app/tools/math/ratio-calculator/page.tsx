import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Ratio Calculator - Free Online Tool | MultiTool",
  description: "Simplify ratios, compare and solve proportions instantly.",
  keywords: ["ratio calculator", "proportion", "simplify ratio"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/math/ratio-calculator",
  },
  openGraph: {
    title: "Ratio Calculator | MultiTool",
    description: "Simplify ratios, compare and solve proportions instantly.",
    url: "https://multitoolbox.online/tools/math/ratio-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratio Calculator | MultiTool",
    description: "Simplify ratios, compare and solve proportions instantly.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Ratio Calculator"
      description="Simplify ratios, compare and solve proportions instantly."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="ratio-calculator"
    />
  );
}
