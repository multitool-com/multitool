import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Brick Breaker - Free Online Game | MultiTool",
  description: "Bounce the ball and smash every brick. The breakout-style arcade favorite.",
  keywords: ['brick breaker', 'breakout game', 'ball brick game', 'arcade brick game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/brick-breaker",
  },
  openGraph: {
    title: "Brick Breaker | MultiTool",
    description: "Bounce the ball and smash every brick. The breakout-style arcade favorite.",
    url: "https://multitoolbox.online/tools/games/brick-breaker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brick Breaker | MultiTool",
    description: "Bounce the ball and smash every brick. The breakout-style arcade favorite.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Brick Breaker"
      description="Bounce the ball and smash every brick. The breakout-style arcade favorite."
      categoryName="Games"
      categorySlug="games"
      toolSlug="brick-breaker"
    />
  );
}
