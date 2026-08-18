import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Pixel Pong - Free Online Game | MultiTool",
  description: "The arcade paddle classic, pixel-styled. Beat the computer in retro rally.",
  keywords: ['pong game', 'pixel pong', 'arcade pong', 'retro pong game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/pixel-pong",
  },
  openGraph: {
    title: "Pixel Pong | MultiTool",
    description: "The arcade paddle classic, pixel-styled. Beat the computer in retro rally.",
    url: "https://multitoolbox.online/tools/games/pixel-pong",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Pong | MultiTool",
    description: "The arcade paddle classic, pixel-styled. Beat the computer in retro rally.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Pixel Pong"
      description="The arcade paddle classic, pixel-styled. Beat the computer in retro rally."
      categoryName="Games"
      categorySlug="games"
      toolSlug="pixel-pong"
    />
  );
}
