import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NoughtsCrossesClient from "./NoughtsCrossesClient";

export const metadata: Metadata = {
  title: "Noughts & Crosses - Play Tic Tac Toe Online Free | MultiTool",
  description:
    "Play Noughts & Crosses (tic-tac-toe) online free. Play against the computer with 3 difficulty levels or with a friend. Neon visuals and sounds. No download.",
  keywords: [
    "tic tac toe",
    "noughts and crosses",
    "play tic tac toe",
    "tic tac toe online",
    "x o game",
    "tic tac toe vs computer",
    "jogo da velha",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/noughts-crosses",
  },
  openGraph: {
    title: "Noughts & Crosses - Play Tic Tac Toe | MultiTool",
    description: "Play tic-tac-toe vs the computer or a friend. Free.",
    url: "https://www.multitoolbox.online/tools/games/noughts-crosses",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noughts & Crosses - Free & Instant",
    description: "Play tic-tac-toe in your browser. No download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Noughts & Crosses"
      description="The classic three-in-a-row game with neon style. Play against the computer (three difficulty levels) or challenge a friend on the same device."
      categoryName="Games"
      categorySlug="games"
      toolSlug="noughts-crosses"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Players take turns placing their symbol — <strong>X</strong> or{" "}
            <strong>O</strong> — in an empty cell. The first to line up{" "}
            <strong>three in a row</strong> (horizontally, vertically or
            diagonally) wins. If the board fills with no winner, it's a
            draw.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Modes
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>vs Computer</strong> — three levels: Easy (random
              moves), Medium (sometimes best, sometimes not) and Hard
              (unbeatable — the computer never loses).
            </li>
            <li>
              <strong>2 Players</strong> — pass the device and take turns.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            sent anywhere — your score lives only on your device.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I win?",
          answer:
            "Place three of your symbols in a row — across, down or diagonal — before your opponent does. The game announces the winner instantly.",
        },
        {
          question: "Is the Hard computer really unbeatable?",
          answer:
            "Yes. The Hard level uses a perfect minimax search: it never loses. You can still draw against it — and winning requires a mistake from it, which won't happen.",
        },
        {
          question: "Can I play with a friend?",
          answer:
            "Yes. Choose the 2 Players mode and take turns on the same device. X starts, then O.",
        },
        {
          question: "What happens on a draw?",
          answer:
            "If all nine cells are filled and nobody has three in a row, the game ends in a draw and the score stays unchanged.",
        },
        {
          question: "Is the game free?",
          answer:
            "Yes, completely free with no account and nothing to install. It runs directly in your browser on any device.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser — nothing is stored on any server.",
        },
      ]}
      relatedTools={[
        { name: "Snake", href: "/tools/games/snake" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Four in a Row", href: "/tools/games/four-in-a-row" },
        { name: "Memory Match", href: "/tools/games/memory-match" },
      ]}
    >
      <NoughtsCrossesClient />
    </ToolLayout>
  );
}
