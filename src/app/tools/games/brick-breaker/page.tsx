import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BrickBreakerClient from "./BrickBreakerClient";

export const metadata: Metadata = {
  title: "Brick Breaker - Play Breakout Style Game Online Free | MultiTool",
  description:
    "Play the breakout-style brick breaker online free. Smash every brick, catch power-ups and clear all levels. Neon visuals, touch and keyboard controls, sounds. No download.",
  keywords: [
    "brick breaker",
    "breakout game",
    "ball brick game",
    "arcade brick game",
    "brick breaker online",
    "breakout arcade",
    "smash bricks game",
    "jogo brick breaker",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/brick-breaker",
  },
  openGraph: {
    title: "Brick Breaker - Breakout Style | MultiTool",
    description: "Smash the bricks, catch power-ups, clear the levels. Free.",
    url: "https://multitoolbox.online/tools/games/brick-breaker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brick Breaker - Free & Instant",
    description: "Breakout-style arcade in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Brick Breaker"
      description="Breakout-style arcade action: smash every brick to clear the level, catch falling power-ups and survive 10 levels of rising difficulty."
      categoryName="Games"
      categorySlug="games"
      toolSlug="brick-breaker"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Move the paddle with the <strong>mouse</strong>,{" "}
            <strong>←/→</strong> or <strong>A/D</strong> keys, or by{" "}
            <strong>dragging</strong> on mobile. Bounce the ball into the
            bricks — every brick hit scores points, and clearing the wall
            advances you to the next level.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Power-ups
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Wider paddle</strong> — easier to catch the ball.
            </li>
            <li>
              <strong>Extra ball</strong> — more balls, more chaos.
            </li>
            <li>
              <strong>Slow ball</strong> — takes the pressure off.
            </li>
            <li>
              <strong>+1 life</strong> — every 3,000 points.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Levels &amp; difficulty
          </h2>
          <p className="mb-4">
            There are <strong>10 levels</strong>, each with a tougher brick
            layout — some bricks need <strong>two hits</strong> to break.
            You have <strong>3 lives</strong>; lose the ball and you lose a
            life. Clear all 10 levels to win the game.
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
          question: "How do I control the paddle?",
          answer:
            "Use the mouse (the paddle follows it), the ←/→ or A/D keys, or drag on touch screens. The paddle only moves horizontally at the bottom.",
        },
        {
          question: "What happens when the ball falls?",
          answer:
            "You lose a life (you have 3). If you have an extra ball active, the remaining balls keep going. Game over when all lives are gone.",
        },
        {
          question: "How do power-ups work?",
          answer:
            "Some bricks drop glowing capsules when broken. Catch them with the paddle: orange = wider paddle, blue = extra ball, green = slow ball.",
        },
        {
          question: "How many levels are there?",
          answer:
            "10 levels with increasingly tough layouts. Some bricks need two hits. Clear them all to win.",
        },
        {
          question: "Can I play on mobile?",
          answer:
            "Yes — drag anywhere on the board to move the paddle. Touch works natively.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Pixel Pong", href: "/tools/games/pixel-pong" },
        { name: "Block Stacker", href: "/tools/games/block-stacker" },
        { name: "Snake", href: "/tools/games/snake" },
        { name: "2048", href: "/tools/games/2048" },
      ]}
    >
      <BrickBreakerClient />
    </ToolLayout>
  );
}
