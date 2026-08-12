import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Random Number Generator - Free Online Tool | MultiTool",
  description: "Generate random numbers within any range you specify.",
  keywords: ["random number generator", "rng", "random integer"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/random-number-generator",
  },
  openGraph: {
    title: "Random Number Generator | MultiTool",
    description: "Generate random numbers within any range you specify.",
    url: "https://multitoolbox.online/tools/generators/random-number-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Number Generator | MultiTool",
    description: "Generate random numbers within any range you specify.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Random Number Generator"
      description="Generate random numbers within any range you specify."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="random-number-generator"
    />
  );
}
