import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Noughts & Crosses - Free Online Game | MultiTool",
  description: "Play tic-tac-toe against the computer or a friend. Three in a row wins.",
  keywords: ['tic tac toe', 'noughts and crosses', 'play tic tac toe', 'x o game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/noughts-crosses",
  },
  openGraph: {
    title: "Noughts & Crosses | MultiTool",
    description: "Play tic-tac-toe against the computer or a friend. Three in a row wins.",
    url: "https://multitoolbox.online/tools/games/noughts-crosses",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noughts & Crosses | MultiTool",
    description: "Play tic-tac-toe against the computer or a friend. Three in a row wins.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Noughts & Crosses"
      description="Play tic-tac-toe against the computer or a friend. Three in a row wins."
      categoryName="Games"
      categorySlug="games"
      toolSlug="noughts-crosses"
    />
  );
}
