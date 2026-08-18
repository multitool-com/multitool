import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FourInARowClient from "./FourInARowClient";

export const metadata: Metadata = {
  title: "Four in a Row - Play Connect 4 Online Free | MultiTool",
  description:
    "Play Four in a Row online free (connect-4 style). Drop discs and connect four in a row — against the computer with 3 difficulty levels or a friend. Neon visuals, sounds, no download.",
  keywords: [
    "connect four",
    "four in a row",
    "connect 4 game",
    "drop disc game",
    "four in a row online",
    "connect 4 vs computer",
    "strategic board game",
    "ligue 4",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/four-in-a-row",
  },
  openGraph: {
    title: "Four in a Row - Connect 4 Style | MultiTool",
    description: "Drop discs and connect four. Free, no download.",
    url: "https://multitoolbox.online/tools/games/four-in-a-row",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Four in a Row - Free & Instant",
    description: "Connect four discs to win. Play now.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Four in a Row"
      description="The classic connect-4 strategy game in neon. Drop a disc in any column and be the first to line up four — vertically, horizontally or diagonally."
      categoryName="Games"
      categorySlug="games"
      toolSlug="four-in-a-row"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Click a column (or tap it) to drop your disc. It falls to the
            lowest free cell. Connect <strong>four discs in a row</strong> —
            across, down or diagonal — to win. If the board fills with no
            winner, it's a draw.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Modes
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>vs Computer</strong> — Easy (random-ish), Normal
              (balanced) and Hard (searches several moves ahead).
            </li>
            <li>
              <strong>2 Players</strong> — take turns on the same device.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            sent anywhere.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I win?",
          answer:
            "Be the first to connect four of your discs in a straight line — horizontal, vertical or diagonal. The game announces the winner instantly.",
        },
        {
          question: "Can I play against the computer?",
          answer:
            "Yes — choose Easy, Normal or Hard. Hard searches several moves ahead and plays a strong strategic game.",
        },
        {
          question: "Can I play with a friend?",
          answer:
            "Yes. Choose 2 Players mode and take turns on the same device. Red goes first, then yellow.",
        },
        {
          question: "What happens on a draw?",
          answer:
            "If all 42 cells fill with no four-in-a-row, the game ends in a draw and the score stays unchanged.",
        },
        {
          question: "Is the game free?",
          answer:
            "Yes, completely free with no account and nothing to install.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Noughts & Crosses", href: "/tools/games/noughts-crosses" },
        { name: "Minesweeper", href: "/tools/games/minesweeper" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Word Guess", href: "/tools/games/word-guess" },
      ]}
    >
      <FourInARowClient />
    </ToolLayout>
  );
}
