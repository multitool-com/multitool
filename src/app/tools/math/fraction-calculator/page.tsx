import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Fraction Calculator - Free Online Tool | MultiTool",
  description: "Add, subtract, multiply and divide fractions with step-by-step results.",
  keywords: ["fraction calculator", "add fractions", "simplify fraction"],
  alternates: {
    canonical: "https://multitool.online/tools/math/fraction-calculator",
  },
  openGraph: {
    title: "Fraction Calculator | MultiTool",
    description: "Add, subtract, multiply and divide fractions with step-by-step results.",
    url: "https://multitool.online/tools/math/fraction-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraction Calculator | MultiTool",
    description: "Add, subtract, multiply and divide fractions with step-by-step results.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Fraction Calculator"
      description="Add, subtract, multiply and divide fractions with step-by-step results."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="fraction-calculator"
    />
  );
}
