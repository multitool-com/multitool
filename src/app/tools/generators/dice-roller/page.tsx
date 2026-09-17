import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DiceRollerClient from "./DiceRollerClient";

export const metadata: Metadata = {
  title: "Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool",
  description: "Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history.",
  keywords: ["dice roller", "roll dice", "d20", "rpg dice", "dice simulator", "dados online"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/dice-roller",
  },
  openGraph: {
    title: "Dice Roller - d4, d6, d8, d10, d12, d20 | MultiTool",
    description: "Roll up to 10 dice of any type — d4, d6, d8, d10, d12, d20 — with realistic animation, totals and full history.",
    url: "https://www.multitoolbox.online/tools/generators/dice-roller",
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
            Dice odds: why 7 rules two dice
          </h2>
          <p className="mb-4">
            Roll one die and every face is equally likely (1 in 6). Roll{" "}
            <strong>two</strong> dice and the sums form the famous bell
            shape — because more combinations produce the middle totals:
          </p>
          <div className="bg-white border border-ink/10 rounded-lg overflow-hidden my-3 text-sm">
            {[
              ["2 (snake eyes) or 12 (boxcars)", "2.78% each"],
              ["4 or 10", "8.33% each"],
              ["6 or 8", "13.89% each"],
              ["7 — the king", "16.67% (6 of 36)"],
            ].map(([a, b], i) => (
              <div key={a} className={`flex justify-between gap-4 px-4 py-2 ${i % 2 ? "bg-paper/60" : ""}`}>
                <span className="text-ink/70">{a}</span>
                <span className="font-mono text-accent whitespace-nowrap">{b}</span>
              </div>
            ))}
          </div>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Why board games feel fair:</strong> Monopoly-style movement, Catan resources and craps bets are all built on this hidden bell curve.</li>
            <li><strong>RPG nights:</strong> missing dice (or suspicious ones) no longer stop the session — roll any quantity and see each die plus the total.</li>
            <li><strong>Digital dice have no bias:</strong> physical dice can be weighted or chipped; each roll here is an independent, uniform draw.</li>
          </ul>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Dice notation, the gamer&apos;s shorthand
          </h2>
          <p className="mb-4">
            Tabletop culture writes rolls as{" "}
            <strong>XdY</strong>: the number of dice, the letter d, and the
            faces. 2d6 = two six-sided dice (sum 2–12); 4d6 = four (4–24,
            that famous bell curve again); 1d20 = the legendary twenty-sided
            die of RPG fame. House rules add flourishes — “4d6 drop lowest”
            for heroic characters, “3d8+2” when a potion is involved. Roll
            the quantity you need here and read both the individual dice and
            the total, exactly like the tabletop.
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
