import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DinoRunClient from "./DinoRunClient";

export const metadata: Metadata = {
  title: "Dino Run - Endless Runner Game Online Free | MultiTool",
  description:
    "Play the endless runner game online free. Jump over cacti, duck under birds and run as far as you can. Speed keeps rising, day turns to night. Sounds, no download.",
  keywords: [
    "dino game",
    "endless runner",
    "dino run",
    "jump game online",
    "dinosaur game",
    "running game browser",
    "obstacle runner",
    "jogo do dinossauro",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/dino-run",
  },
  openGraph: {
    title: "Dino Run - Endless Runner | MultiTool",
    description: "Run, jump and duck. How far can you go? Free, no download.",
    url: "https://www.multitoolbox.online/tools/games/dino-run",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dino Run - Free & Instant",
    description: "The endless runner in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Dino Run"
      description="A tiny dinosaur runs through the desert — jump the cacti, duck the birds and see how far you can go before you crash. The world speeds up the longer you survive."
      categoryName="Games"
      categorySlug="games"
      toolSlug="dino-run"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Press <strong>space</strong>, <strong>↑</strong> or{" "}
            <strong>W</strong> to jump (hold longer = jump higher). Press{" "}
            <strong>↓</strong> or <strong>S</strong> to duck under birds. On
            mobile, tap to jump and swipe down to duck.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Difficulty &amp; session
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              The <strong>speed keeps rising</strong> the further you run —
              there is no ceiling, it gets frantic.
            </li>
            <li>
              Obstacles vary: small and tall cacti on the ground, birds at
              two heights (duck or jump).
            </li>
            <li>
              <strong>Day turns to night</strong> every 500 points, with a
              fresh color palette.
            </li>
            <li>
              Your <strong>best distance</strong> is saved for the session.
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
          question: "How do I control the dino?",
          answer:
            "Space, ↑ or W jumps. ↓ or S ducks (useful for birds). On mobile: tap to jump, swipe down to duck. Hold jump longer for a higher jump.",
        },
        {
          question: "How do I avoid the birds?",
          answer:
            "Low birds can be ducked under; higher ones need a jump. Watch their height and react — the pattern repeats, so you can learn the timing.",
        },
        {
          question: "Does the game get harder?",
          answer:
            "Yes — speed increases continuously with distance, and obstacles spawn in tighter patterns. There is no maximum speed, so eventually everyone crashes.",
        },
        {
          question: "What is the day/night cycle?",
          answer:
            "Every 500 points the scenery switches between a sunny desert palette and a night palette — pure visual variety that keeps the run fresh.",
        },
        {
          question: "Is my best score saved?",
          answer:
            "For your session, yes — it survives a page refresh and resets when you close the tab.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Snake", href: "/tools/games/snake" },
        { name: "Block Stacker", href: "/tools/games/block-stacker" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Pixel Pong", href: "/tools/games/pixel-pong" },
      ]}
    >
      <DinoRunClient />
    </ToolLayout>
  );
}
