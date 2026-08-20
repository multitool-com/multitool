import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Game2048Client from "./Game2048Client";

export const metadata: Metadata = {
  title: "2048 Game - Play 2048 Online Free | MultiTool",
  description:
    "Play 2048 online free. Merge the tiles, reach 2048 and keep going. Keyboard and touch controls, score and best score tracking. No download, no sign-up.",
  keywords: [
    "2048",
    "2048 game",
    "play 2048",
    "2048 online",
    "2048 puzzle",
    "merge tiles game",
    "number game 2048",
    "jogo 2048",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/2048",
  },
  openGraph: {
    title: "2048 Game - Play 2048 Online | MultiTool",
    description:
      "Play the addictive 2048 number puzzle in your browser. Free.",
    url: "https://www.multitoolbox.online/tools/games/2048",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2048 Game - Free & Instant",
    description: "Play 2048 in your browser. No download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="2048"
      description="Slide the tiles, merge equal numbers and try to reach 2048. The viral number puzzle, free in your browser with keyboard and touch controls."
      categoryName="Games"
      categorySlug="games"
      toolSlug="2048"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play 2048
          </h2>
          <p className="mb-4">
            Slide the board with the <strong>arrow keys</strong> (or swipe
            on mobile) to move all tiles in one direction. Two tiles with
            the <strong>same number</strong> merge into one with double the
            value. Reach the <strong>2048</strong> tile to win — but you can
            keep going for higher scores.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Strategy tips
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Keep your <strong>biggest tile in a corner</strong> and build
              around it.
            </li>
            <li>
              Avoid moving the board in every direction — stick to two or
              three.
            </li>
            <li>
              A new tile (2 or 4) appears after every move, so plan space
              ahead.
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
          question: "How do I move the tiles?",
          answer:
            "Use the arrow keys or WASD on a keyboard. On phones and tablets, swipe in the direction you want the tiles to slide.",
        },
        {
          question: "What is the goal of 2048?",
          answer:
            "Merge equal tiles to create higher values and reach the 2048 tile. The game keeps going after 2048 — try to beat your best score.",
        },
        {
          question: "Is there a strategy to win?",
          answer:
            "Keep your largest tile in one corner and avoid moving it. Build chains toward that corner and limit the directions you slide to two or three. Patience beats speed.",
        },
        {
          question: "What happens when I run out of moves?",
          answer:
            "When no tile can merge and the board is full, the game is over. You can start a new game instantly — your best score is saved in your browser.",
        },
        {
          question: "Is this the original 2048?",
          answer:
            "It is an original implementation of the same open-source game concept (the original by Gabriele Cirulli is MIT-licensed). Same rules, fresh look.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser — nothing is stored on any server.",
        },
      ]}
      relatedTools={[
        { name: "Snake", href: "/tools/games/snake" },
        { name: "Memory Match", href: "/tools/games/memory-match" },
        { name: "Block Stacker", href: "/tools/games/block-stacker" },
        { name: "Word Guess", href: "/tools/games/word-guess" },
      ]}
    >
      <Game2048Client />
    </ToolLayout>
  );
}
