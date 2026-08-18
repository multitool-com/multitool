import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Snake Puzzle - Free Online Game | MultiTool",
  description:
    "Untangle the snakes: click a snake to slide it forward and clear the board. Level-based logic puzzle.",
  keywords: [
    "snake puzzle",
    "unpuzzle",
    "snake logic puzzle",
    "untangle snakes game",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/snake-puzzle",
  },
  openGraph: {
    title: "Snake Puzzle | MultiTool",
    description:
      "Untangle the snakes: click a snake to slide it forward and clear the board.",
    url: "https://multitoolbox.online/tools/games/snake-puzzle",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snake Puzzle | MultiTool",
    description:
      "Untangle the snakes: click a snake to slide it forward and clear the board.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Snake Puzzle"
      description="Untangle the snakes: click a snake to slide it forward and clear the board. Level-based logic puzzle."
      categoryName="Games"
      categorySlug="games"
      toolSlug="snake-puzzle"
    />
  );
}
