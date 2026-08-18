import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Minesweeper - Free Online Game | MultiTool",
  description: "Clear the grid without hitting a mine. The classic logic puzzle, refreshed.",
  keywords: ['minesweeper', 'play minesweeper', 'minefield game', 'logic puzzle game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/minesweeper",
  },
  openGraph: {
    title: "Minesweeper | MultiTool",
    description: "Clear the grid without hitting a mine. The classic logic puzzle, refreshed.",
    url: "https://multitoolbox.online/tools/games/minesweeper",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper | MultiTool",
    description: "Clear the grid without hitting a mine. The classic logic puzzle, refreshed.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Minesweeper"
      description="Clear the grid without hitting a mine. The classic logic puzzle, refreshed."
      categoryName="Games"
      categorySlug="games"
      toolSlug="minesweeper"
    />
  );
}
