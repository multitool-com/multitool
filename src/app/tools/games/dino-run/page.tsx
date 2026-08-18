import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Dino Run - Free Online Game | MultiTool",
  description: "Jump over obstacles and run as far as you can in this endless desert dash.",
  keywords: ['dino game', 'endless runner', 'dino run', 'jump game online'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/dino-run",
  },
  openGraph: {
    title: "Dino Run | MultiTool",
    description: "Jump over obstacles and run as far as you can in this endless desert dash.",
    url: "https://multitoolbox.online/tools/games/dino-run",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dino Run | MultiTool",
    description: "Jump over obstacles and run as far as you can in this endless desert dash.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Dino Run"
      description="Jump over obstacles and run as far as you can in this endless desert dash."
      categoryName="Games"
      categorySlug="games"
      toolSlug="dino-run"
    />
  );
}
