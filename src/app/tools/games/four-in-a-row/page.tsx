import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Four in a Row - Free Online Game | MultiTool",
  description: "Drop discs and connect four in a row. Play against the computer.",
  keywords: ['connect four', 'four in a row', 'connect 4 game', 'drop disc game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/four-in-a-row",
  },
  openGraph: {
    title: "Four in a Row | MultiTool",
    description: "Drop discs and connect four in a row. Play against the computer.",
    url: "https://multitoolbox.online/tools/games/four-in-a-row",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Four in a Row | MultiTool",
    description: "Drop discs and connect four in a row. Play against the computer.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Four in a Row"
      description="Drop discs and connect four in a row. Play against the computer."
      categoryName="Games"
      categorySlug="games"
      toolSlug="four-in-a-row"
    />
  );
}
