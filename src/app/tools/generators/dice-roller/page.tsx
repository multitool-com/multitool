import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DiceRollerClient from "./DiceRollerClient";

export const metadata: Metadata = {
  title: "Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool",
  description: "Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history.",
  keywords: ["dice roller", "roll dice", "d20", "rpg dice", "dice simulator", "dados online"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/dice-roller",
  },
  openGraph: {
    title: "Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool",
    description: "Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history.",
    url: "https://multitoolbox.online/tools/generators/dice-roller",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool",
    description: "Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool"
      description="Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="dice-roller"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick your die (d4 to d20), choose how many (up to 10) and roll. The dice tumble with animation before settling, showing each face and the total — with a history of every roll.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs entirely in your browser. Nothing you type is
            ever sent to any server or stored.
          </p>
        </>
      }
      faqs={[
        { question: "Is it fair?", answer: "Yes — each face has exactly equal probability, generated with the browser's random generator." },
        { question: "What dice do RPG players need?", answer: "d20, d12, d10, d8, d6 and d4 — all included here, up to 10 at once." },
        { question: "What is a d20?", answer: "A 20-sided die, the most famous die in Dungeons & Dragons and other tabletop RPGs." },
        { question: "Does it keep history?", answer: "Yes — your last 12 rolls are listed with totals." },
        { question: "Why does it animate?", answer: "The tumbling animation makes the roll feel real, and the result is only shown when it stops." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
        { name: "Wheel Spinner", href: "/tools/generators/wheel-spinner" },
        { name: "Giveaway Picker", href: "/tools/generators/giveaway-picker" },
      ]}
    >
      <DiceRollerClient />
    </ToolLayout>
  );
}
