import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BlockStackerClient from "./BlockStackerClient";

export const metadata: Metadata = {
  title: "Block Stacker - Falling Blocks Puzzle Game Online Free | MultiTool",
  description:
    "Play the classic falling-blocks puzzle game online free, in the tradition of the 80s arcade favorite. Rotate, stack and clear lines. Speed rises every level. Keyboard controls, sounds, no download.",
  keywords: [
    "falling blocks game",
    "block puzzle",
    "stack blocks game",
    "tetris style game",
    "block stacking game",
    "puzzle blocks online",
    "line clear game",
    "jogo de blocos",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/block-stacker",
  },
  openGraph: {
    title: "Block Stacker - Falling Blocks Puzzle | MultiTool",
    description:
      "Rotate, stack and clear lines in the classic falling-blocks puzzle. Free.",
    url: "https://multitoolbox.online/tools/games/block-stacker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Block Stacker - Free & Instant",
    description: "The classic falling-blocks puzzle in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Block Stacker"
      description="The timeless falling-blocks puzzle: rotate pieces, complete lines and clear them. Every 10 lines the level rises and blocks fall faster. How long can you survive?"
      categoryName="Games"
      categorySlug="games"
      toolSlug="block-stacker"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Blocks fall from the top. Move them with the{" "}
            <strong>arrow keys</strong> (or WASD), <strong>rotate</strong>{" "}
            with ↑/X, <strong>hard drop</strong> with space, and{" "}
            <strong>hold</strong> with C/Shift. Complete a full horizontal
            line to clear it — the goal is to keep the stack from reaching
            the top.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Scoring &amp; difficulty
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              1 line = 100 × level · 2 lines = 300 × level · 3 = 500 ×
              level · <strong>4 lines (Tetris!) = 800 × level</strong>.
            </li>
            <li>
              Every <strong>10 lines</strong> the level rises and the blocks{" "}
              <strong>fall faster</strong> — up to a frantic maximum speed.
            </li>
            <li>
              <strong>NEXT</strong> shows the coming piece and{" "}
              <strong>HOLD</strong> lets you save one piece for later.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            sent anywhere — your best score lives only on your device.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I control the blocks?",
          answer:
            "Left/right arrows (or A/D) move, up arrow (or X) rotates, down arrow (or S) soft-drops, space hard-drops, C (or Shift) holds a piece, P pauses.",
        },
        {
          question: "How do I clear lines?",
          answer:
            "Fill a complete horizontal row with blocks — the row disappears and everything above drops. Clearing 4 lines at once is a 'Tetris' worth 800×level points.",
        },
        {
          question: "How does the difficulty increase?",
          answer:
            "Every 10 lines cleared the level goes up and the fall speed increases. Speed keeps ramping until it becomes frantic — survival is the challenge.",
        },
        {
          question: "What do NEXT and HOLD do?",
          answer:
            "NEXT previews the upcoming piece so you can plan. HOLD saves the current piece and swaps it with your held one (once per piece) — great for saving the piece you need.",
        },
        {
          question: "What happens when I reach the top?",
          answer:
            "If a new piece cannot enter the board, the game ends. Your best score is saved on your device for the session.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "2048", href: "/tools/games/2048" },
        { name: "Snake", href: "/tools/games/snake" },
        { name: "Minesweeper", href: "/tools/games/minesweeper" },
        { name: "Brick Breaker", href: "/tools/games/brick-breaker" },
      ]}
    >
      <BlockStackerClient />
    </ToolLayout>
  );
}
