import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MemoryMatchClient from "./MemoryMatchClient";

export const metadata: Metadata = {
  title: "Memory Match - Play Memory Card Game Online Free | MultiTool",
  description:
    "Play the classic memory card game online free. Flip the cards, find all the matching pairs and beat your best time. Three difficulty levels, no download.",
  keywords: [
    "memory game",
    "memory match",
    "card matching game",
    "concentration game",
    "memory game online",
    "matching pairs game",
    "memory cards game",
    "jogo da memoria",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/memory-match",
  },
  openGraph: {
    title: "Memory Match - Memory Card Game | MultiTool",
    description:
      "Play the classic memory card game in your browser. Free, no download.",
    url: "https://www.multitoolbox.online/tools/games/memory-match",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Match - Free & Instant",
    description: "Flip cards and find the pairs. No download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Memory Match"
      description="Flip the cards, memorize the symbols and find every matching pair. A classic memory game with three difficulty levels, pixel-art style."
      categoryName="Games"
      categorySlug="games"
      toolSlug="memory-match"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play Memory Match
          </h2>
          <p className="mb-4">
            All cards start <strong>face down</strong>. Click a card to flip
            it, then flip a second one — if they match, they stay face up.
            If not, they turn back. Find <strong>all the pairs</strong> to
            win. The game counts your moves and time.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Difficulty levels
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Easy (4×3)</strong> — 6 pairs, great for kids and
              first games.
            </li>
            <li>
              <strong>Normal (4×4)</strong> — 8 pairs, the classic
              challenge.
            </li>
            <li>
              <strong>Hard (6×4)</strong> — 12 pairs for memory masters.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            stored on any server — your best time lives only on your device.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I win the memory game?",
          answer:
            "Flip two cards at a time and find matching pairs. When every pair is face up, you win. Fewer moves and faster time mean a better score.",
        },
        {
          question: "What are the difficulty levels?",
          answer:
            "Easy has 12 cards (6 pairs), Normal has 16 (8 pairs) and Hard has 24 (12 pairs). Start easy to learn the symbols, then challenge your memory.",
        },
        {
          question: "Is there a strategy?",
          answer:
            "Yes: after a mismatch, remember where both cards were. Focus on one symbol at a time, and scan the board systematically row by row.",
        },
        {
          question: "Does the game work on mobile?",
          answer:
            "Yes. The cards are large enough to tap comfortably on phones and tablets, and the layout scales to any screen size.",
        },
        {
          question: "Is the game free?",
          answer:
            "Yes, completely free with no account, no ads and nothing to install. It runs directly in your browser.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally — your moves, time and best score never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "Snake", href: "/tools/games/snake" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Sequence Memory", href: "/tools/games/sequence-memory" },
        { name: "Noughts & Crosses", href: "/tools/games/noughts-crosses" },
      ]}
    >
      <MemoryMatchClient />
    </ToolLayout>
  );
}
