import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Geometry Calculator - Free Online Tool | MultiTool",
  description: "Calculate area, perimeter and volume for common geometric shapes.",
  keywords: ["geometry calculator", "area calculator", "perimeter", "volume"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/math/geometry-calculator",
  },
  openGraph: {
    title: "Geometry Calculator | MultiTool",
    description: "Calculate area, perimeter and volume for common geometric shapes.",
    url: "https://multitoolbox.online/tools/math/geometry-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Calculator | MultiTool",
    description: "Calculate area, perimeter and volume for common geometric shapes.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Geometry Calculator"
      description="Calculate area, perimeter and volume for common geometric shapes."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="geometry-calculator"
    />
  );
}
