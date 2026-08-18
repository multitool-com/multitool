import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MinesweeperClient from "./MinesweeperClient";

export const metadata: Metadata = {
  title: "Minesweeper - Play Minesweeper Online Free | MultiTool",
  description:
    "Play Minesweeper online free. Clear the board without hitting a mine. Three difficulty levels, flags, timer and best times. Neon style and sounds. No download.",
  keywords: [
    "minesweeper",
    "play minesweeper",
    "minefield game",
    "logic puzzle game",
    "minesweeper online",
    "minesweeper game",
    "campo minado",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/minesweeper",
  },
  openGraph: {
    title: "Minesweeper - Play Online | MultiTool",
    description:
      "Clear the board without hitting a mine. Free, no download.",
    url: "https://multitoolbox.online/tools/games/minesweeper",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper - Free & Instant",
    description: "Clear the mines. Beat your best time.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Minesweeper"
      description="The classic logic puzzle with a neon refresh. Reveal cells, use the numbers to deduce where the mines hide, flag them and clear the whole board."
      categoryName="Games"
      categorySlug="games"
      toolSlug="minesweeper"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Click a cell to <strong>reveal</strong> it. If it hides a mine,
            the game ends. If not, it shows how many mines are in the{" "}
            <strong>8 neighboring cells</strong> — use those numbers to
            deduce where the mines are. <strong>Right-click</strong> (or
            long-press on mobile) to place a <strong>flag</strong>.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Difficulty levels
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Easy</strong> — 9×9 with 10 mines.
            </li>
            <li>
              <strong>Normal</strong> — 16×16 with 40 mines.
            </li>
            <li>
              <strong>Hard</strong> — 16×30 with 99 mines.
            </li>
          </ul>
          <p className="mb-4">
            The <strong>first click is always safe</strong> — it can never
            hit a mine. Best time per difficulty is saved on your device.
          </p>

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
          question: "How do I flag a mine?",
          answer:
            "Right-click a cell (or long-press on mobile) to toggle a flag. Flags mark where you believe a mine is — they don't reveal anything, they just help you keep track.",
        },
        {
          question: "What do the numbers mean?",
          answer:
            "Each revealed number counts the mines in the 8 cells around it. A '3' means exactly 3 mines are touching that cell — use that to deduce which neighbors are safe.",
        },
        {
          question: "Is the first click always safe?",
          answer:
            "Yes. The mines are placed after your first click, never under it — so you always start with a revealed area.",
        },
        {
          question: "What happens when I click a mine?",
          answer:
            "The game ends and all mines are revealed. Your time is not saved when you lose — only winning times count for the best score.",
        },
        {
          question: "How do I win?",
          answer:
            "Reveal every cell that is not a mine. When all safe cells are open, you win and your time is saved as the best for that difficulty.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Snake Puzzle", href: "/tools/games/snake-puzzle" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Snake", href: "/tools/games/snake" },
        { name: "Noughts & Crosses", href: "/tools/games/noughts-crosses" },
      ]}
    >
      <MinesweeperClient />
    </ToolLayout>
  );
}
