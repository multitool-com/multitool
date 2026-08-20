import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SnakePuzzleClient from "./SnakePuzzleClient";

export const metadata: Metadata = {
  title: "Snake Puzzle - Untangle the Snakes Online Free | MultiTool",
  description:
    "Play the Snake Puzzle online free. Click a snake to slide it forward — but only if there's space. Clear every snake off the board across endless levels. Neon visuals, sounds, no download.",
  keywords: [
    "snake puzzle",
    "unpuzzle",
    "snake logic puzzle",
    "untangle snakes",
    "snake sliding puzzle",
    "puzzle game snake",
    "slide snake game",
    "jogo da cobra puzzle",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/snake-puzzle",
  },
  openGraph: {
    title: "Snake Puzzle - Untangle the Snakes | MultiTool",
    description:
      "Click snakes to slide them off the board. Endless levels. Free, no download.",
    url: "https://www.multitoolbox.online/tools/games/snake-puzzle",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snake Puzzle - Free & Instant",
    description: "Slide the snakes off the board. Endless levels.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Snake Puzzle"
      description="Click a snake to slide it forward — but only if there's space in front. Clear every snake off the board. Levels get harder, and your session keeps going while you play."
      categoryName="Games"
      categorySlug="games"
      toolSlug="snake-puzzle"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play Snake Puzzle
          </h2>
          <p className="mb-4">
            Each level places <strong>snakes on a board</strong>. Click a
            snake to make it slide <strong>one step forward</strong> — in
            the direction its head is pointing — but it only moves if the
            cell in front is <strong>empty</strong>. Slide every snake off
            the board to clear the level.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Levels &amp; session
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Every level adds <strong>more snakes</strong> and bigger
              boards.
            </li>
            <li>
              Your <strong>session keeps going</strong> while the game is
              open — level by level, no sign-up.
            </li>
            <li>
              Closing the tab resets the run. Progress is never saved
              permanently.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Tips
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Snakes move <strong>only in a straight line</strong> — plan
              the order.
            </li>
            <li>
              A snake near the edge with a clear path is usually the best
              first move.
            </li>
            <li>
              Don't block a snake's exit with another snake — think ahead.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            stored on any server — your session lives only on your device
            while the page is open.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I move a snake?",
          answer:
            "Click (or tap) any snake. It slides one cell forward, in the direction its head points, but only if that cell is empty. If it's blocked, nothing happens — try a different snake or order.",
        },
        {
          question: "How do I win a level?",
          answer:
            "Slide every snake off the board. When a snake's head reaches the edge and the next step would be outside, the whole snake exits the board. Clear all snakes to advance.",
        },
        {
          question: "Are the levels endless?",
          answer:
            "Yes. Difficulty grows with every level: more snakes, longer snakes and bigger boards. There is no final level — how far can you go?",
        },
        {
          question: "Is my progress saved?",
          answer:
            "Only during your session while the game is open — your current level is kept in memory (and survives a refresh in the same tab). Closing the tab resets the run, by design.",
        },
        {
          question: "Can a snake turn?",
          answer:
            "No. Snakes move only in a straight line, the direction they're facing. That's the puzzle: choose the right order to untangle them all.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser — nothing is sent or stored on any server.",
        },
      ]}
      relatedTools={[
        { name: "Snake", href: "/tools/games/snake" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Memory Match", href: "/tools/games/memory-match" },
        { name: "Minesweeper", href: "/tools/games/minesweeper" },
      ]}
    >
      <SnakePuzzleClient />
    </ToolLayout>
  );
}
