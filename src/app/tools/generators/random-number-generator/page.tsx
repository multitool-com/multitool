import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RandomNumberGeneratorClient from "./RandomNumberGeneratorClient";

export const metadata: Metadata = {
  title: "Random Number Generator - No Repeats, Sorted | MultiTool",
  description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
  keywords: ["random number generator", "random number between", "random integer generator", "lottery numbers", "numero aleatorio"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/random-number-generator",
  },
  openGraph: {
    title: "Random Number Generator - No Repeats, Sorted | MultiTool",
    description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
    url: "https://www.multitoolbox.online/tools/generators/random-number-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Number Generator - No Repeats, Sorted | MultiTool",
    description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Random Number Generator - No Repeats, Sorted | MultiTool"
      description="Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="random-number-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Set the minimum and maximum, choose how many numbers (up to 1000) and toggle no-repeats and sorting. Perfect for draws, testing and learning probability.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Randomness, pseudo-randomness and fairness
          </h2>
          <p className="mb-4">
            Browser random number generators are <strong>pseudo-random</strong>:
            they start from an unpredictable seed (timings, entropy from your
            machine) and produce a sequence that is statistically
            indistinguishable from random. For draws, games, sampling and
            giveaways, that is exactly what you want — every number has the
            same chance, and no pattern a human could exploit.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>No-repeats mode</strong> draws without replacement (a Fisher–Yates style shuffle), just like pulling numbered balls from a bag — perfect for raffles and bingo-style draws.</li>
            <li><strong>With repeats</strong> simulates true dice-and-coins behavior — ideal for games, simulations and probability exercises.</li>
            <li><strong>Cryptography is different:</strong> generating passwords, keys or tokens requires <em>cryptographic</em> randomness — that is what our Password Generator uses internally.</li>
          </ul>
          <div className="bg-white border border-ink/10 rounded-lg overflow-hidden my-3 text-sm">
            {[
              ["Raffle / giveaway (unique)", "1 – number of entries, no repeats"],
              ["Dice simulation", "1–6, repeats on"],
              ["Percent decisions", "1–100"],
              ["Random sample from a list", "1 – list size, no repeats"],
              ["Lottery-style practice", "1–60, 6 unique numbers"],
            ].map(([a, b], i) => (
              <div key={a} className={`flex justify-between gap-4 px-4 py-2 ${i % 2 ? "bg-paper/60" : ""}`}>
                <span className="text-ink/70">{a}</span>
                <span className="font-mono text-accent whitespace-nowrap">{b}</span>
              </div>
            ))}
          </div>
          <p className="mb-4">
            A note on fairness for public draws: because the numbers are
            generated on each participant&apos;s own device, the result is
            auditable only by trust. For high-stakes public raffles, record
            your screen or use the wheel-style draw with visible participants.
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
        { question: "Are the numbers truly random?", answer: "They use the browser's cryptographic random generator where available — strong enough for any practical use." },
        { question: "Can I avoid repeats?", answer: "Yes — enable No repeats; the tool then shuffles the range and picks unique values." },
        { question: "How many numbers can I generate?", answer: "Up to 1000 at once, limited only by your range when uniqueness is on." },
        { question: "Can I sort the result?", answer: "Yes — toggle Sort ascending to order the output." },
        { question: "Can I use decimals?", answer: "The tool generates integers. For decimals, use the statistics or scientific calculator." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Dice Roller", href: "/tools/generators/dice-roller" },
        { name: "Wheel Spinner", href: "/tools/generators/wheel-spinner" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
        { name: "Giveaway Picker", href: "/tools/generators/giveaway-picker" },
      ]}
    >
      <RandomNumberGeneratorClient />
    </ToolLayout>
  );
}
