import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Sequence Memory - Free Online Game | MultiTool",
  description: "Watch the glowing sequence and repeat it. How long a chain can you remember?",
  keywords: ['memory game', 'simon game', 'sequence memory', 'brain game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/sequence-memory",
  },
  openGraph: {
    title: "Sequence Memory | MultiTool",
    description: "Watch the glowing sequence and repeat it. How long a chain can you remember?",
    url: "https://multitoolbox.online/tools/games/sequence-memory",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sequence Memory | MultiTool",
    description: "Watch the glowing sequence and repeat it. How long a chain can you remember?",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Sequence Memory"
      description="Watch the glowing sequence and repeat it. How long a chain can you remember?"
      categoryName="Games"
      categorySlug="games"
      toolSlug="sequence-memory"
    />
  );
}
