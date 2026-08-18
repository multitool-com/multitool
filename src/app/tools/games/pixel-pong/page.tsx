import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PixelPongClient from "./PixelPongClient";

export const metadata: Metadata = {
  title: "Pixel Pong - Play Pong Online Free | MultiTool",
  description:
    "Play the arcade paddle classic online free with neon pixel style. Beat the computer across 3 difficulty levels. Touch and keyboard controls, sounds. No download.",
  keywords: [
    "pong game",
    "pixel pong",
    "arcade pong",
    "retro pong game",
    "play pong",
    "pong online",
    "paddle game",
    "jogo pong",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/pixel-pong",
  },
  openGraph: {
    title: "Pixel Pong - Arcade Pong | MultiTool",
    description: "The arcade paddle classic with neon pixels. Free, no download.",
    url: "https://multitoolbox.online/tools/games/pixel-pong",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Pong - Free & Instant",
    description: "Beat the computer at the classic paddle game.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Pixel Pong"
      description="The arcade paddle classic in neon pixels. Move your paddle, bounce the ball and score 7 points to win — the computer gets faster as you beat it."
      categoryName="Games"
      categorySlug="games"
      toolSlug="pixel-pong"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Move your paddle (left) with the <strong>mouse</strong>,{" "}
            <strong>W/S</strong> or <strong>↑/↓</strong> keys, or by{" "}
            <strong>dragging/tapping</strong> on mobile. The ball speeds up
            with every rally. First to <strong>7 points</strong> wins.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Difficulty
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Easy</strong> — the computer moves slowly and makes
              mistakes.
            </li>
            <li>
              <strong>Normal</strong> — a fair rally.
            </li>
            <li>
              <strong>Hard</strong> — fast reflexes and almost perfect
              aim.
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
          question: "How do I control my paddle?",
          answer:
            "Use the mouse (the paddle follows it), the W/S or ↑/↓ keys, or touch/drag on mobile. The paddle only moves vertically on the left side.",
        },
        {
          question: "How do I win?",
          answer:
            "Score 7 points first. You score when the ball passes the computer's paddle; it scores when the ball passes yours. The ball speeds up after each paddle hit.",
        },
        {
          question: "Is the Hard computer beatable?",
          answer:
            "Yes — it is fast and accurate but not perfect. Mixing speeds and aiming for the edges of its paddle can create unpredictable bounces.",
        },
        {
          question: "Can I play on mobile?",
          answer:
            "Yes — drag anywhere on the board to move your paddle, and the touch controls work natively.",
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
        { name: "Brick Breaker", href: "/tools/games/brick-breaker" },
        { name: "Snake", href: "/tools/games/snake" },
        { name: "Block Stacker", href: "/tools/games/block-stacker" },
        { name: "Four in a Row", href: "/tools/games/four-in-a-row" },
      ]}
    >
      <PixelPongClient />
    </ToolLayout>
  );
}
