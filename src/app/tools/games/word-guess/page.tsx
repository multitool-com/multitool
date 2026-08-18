import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Word Guess - Free Online Game | MultiTool",
  description: "Guess the hidden word in six tries. A daily brain teaser for word lovers.",
  keywords: ['word game', 'guess the word', 'word puzzle', 'daily word game'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/word-guess",
  },
  openGraph: {
    title: "Word Guess | MultiTool",
    description: "Guess the hidden word in six tries. A daily brain teaser for word lovers.",
    url: "https://multitoolbox.online/tools/games/word-guess",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Guess | MultiTool",
    description: "Guess the hidden word in six tries. A daily brain teaser for word lovers.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Word Guess"
      description="Guess the hidden word in six tries. A daily brain teaser for word lovers."
      categoryName="Games"
      categorySlug="games"
      toolSlug="word-guess"
    />
  );
}
