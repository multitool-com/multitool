import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Block Stacker - Free Online Game | MultiTool",
  description: "A falling-blocks puzzle in the tradition of the 80s classic. Stack lines and clear them.",
  keywords: ['falling blocks game', 'block puzzle', 'stack blocks game', 'tetris style game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/block-stacker",
  },
  openGraph: {
    title: "Block Stacker | MultiTool",
    description: "A falling-blocks puzzle in the tradition of the 80s classic. Stack lines and clear them.",
    url: "https://multitoolbox.online/tools/games/block-stacker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Block Stacker | MultiTool",
    description: "A falling-blocks puzzle in the tradition of the 80s classic. Stack lines and clear them.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Block Stacker"
      description="A falling-blocks puzzle in the tradition of the 80s classic. Stack lines and clear them."
      categoryName="Games"
      categorySlug="games"
      toolSlug="block-stacker"
    />
  );
}
