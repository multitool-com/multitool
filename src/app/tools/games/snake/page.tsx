import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SnakeClient from "./SnakeClient";

export const metadata: Metadata = {
  title: "Snake Game - Play Classic Snake Online Free | MultiTool",
  description:
    "Play the classic Snake game online free. Eat the food, grow longer and avoid the walls. Neon visuals, keyboard and touch controls, high score tracking. No download.",
  keywords: [
    "snake game",
    "play snake",
    "snake online",
    "classic snake game",
    "snake game free",
    "retro snake",
    "neon snake game",
    "cobrinha game",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/snake",
  },
  openGraph: {
    title: "Snake Game - Play Classic Snake Online | MultiTool",
    description:
      "Play the classic Snake game in your browser. Free, no download.",
    url: "https://www.multitoolbox.online/tools/games/snake",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snake Game - Free & Instant",
    description: "Play classic Snake in your browser. No download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Snake"
      description="The classic Snake game with a neon twist. Eat the food, grow longer and don't hit the walls or yourself. Play with the keyboard or swipe on mobile."
      categoryName="Games"
      categorySlug="games"
      toolSlug="snake"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play Snake
          </h2>
          <p className="mb-4">
            Control the snake with the <strong>arrow keys</strong> (or{" "}
            <strong>WASD</strong>) and eat the glowing food to grow longer.
            The game ends if you hit a wall or your own tail. On mobile,
            swipe in any direction to turn.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Scoring
          </h2>
          <p className="mb-4">
            Every piece of food gives you <strong>10 points</strong>. The
            snake speeds up as you grow, so the challenge increases — how
            long can you survive? Your best score is saved in your browser.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked, sent
            or stored on any server — your high score lives only on your
            device.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I control the snake?",
          answer:
            "Use the arrow keys or WASD on a keyboard. On phones and tablets, swipe in the direction you want to go. The snake cannot turn back onto itself.",
        },
        {
          question: "What happens when I hit a wall?",
          answer:
            "The game ends. In this version the walls are solid — plan your turns ahead of time. Your score is shown and you can start a new game instantly.",
        },
        {
          question: "How do I get a high score?",
          answer:
            "Eat food (10 points each) while avoiding walls and your own tail. The snake accelerates as it grows, so longer snakes need faster reactions. The best score is saved in your browser.",
        },
        {
          question: "Is the game free?",
          answer:
            "Yes, completely free with no account, no ads and nothing to install. It runs directly in your browser and works on phones, tablets and computers.",
        },
        {
          question: "Can I pause the game?",
          answer:
            "Yes. Press the pause button (or the spacebar) to pause and resume whenever you need a break.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally — your score and game state never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "2048", href: "/tools/games/2048" },
        { name: "Memory Match", href: "/tools/games/memory-match" },
        { name: "Block Stacker", href: "/tools/games/block-stacker" },
        { name: "Dino Run", href: "/tools/games/dino-run" },
      ]}
    >
      <SnakeClient />
    </ToolLayout>
  );
}
