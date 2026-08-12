import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Dice Roller - Free Online Tool | MultiTool",
  description: "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.",
  keywords: ["dice roller", "virtual dice", "d20 roller"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/dice-roller",
  },
  openGraph: {
    title: "Dice Roller | MultiTool",
    description: "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.",
    url: "https://multitoolbox.online/tools/generators/dice-roller",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dice Roller | MultiTool",
    description: "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Dice Roller"
      description="Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="dice-roller"
    />
  );
}
