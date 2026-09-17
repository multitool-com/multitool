import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CoinFlipClient from "./CoinFlipClient";

export const metadata: Metadata = {
  title: "Coin Flip & Magic 8-Ball - Flip a Coin Online | MultiTool",
  description: "Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds, history and fair randomness. Free, no download.",
  keywords: ["coin flip", "flip a coin", "coin toss", "yes or no", "magic 8 ball", "decision maker", "cara ou coroa"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/coin-flip",
  },
  openGraph: {
    title: "Coin Flip & Magic 8-Ball - Flip a Coin Online | MultiTool",
    description: "Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds, history and fair randomness. Free, no download.",
    url: "https://www.multitoolbox.online/tools/generators/coin-flip",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coin Flip & Magic 8-Ball - Flip a Coin Online | MultiTool",
    description: "Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds, history and fair randomness. Free, no download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Coin Flip & Magic 8-Ball - Flip a Coin Online | MultiTool"
      description="Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds, history and fair randomness. Free, no download."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="coin-flip"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds, history and fair randomness. Free, no download.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            50/50, and why we trust coins
          </h2>
          <p className="mb-4">
            Coin flips decide football kickoffs and billion-dollar
            negotiations because they are the simplest fair decision device
            ever invented — two outcomes, equal probability, visible to
            everyone in the room.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>The streaks surprise people:</strong> in 10 flips, a streak of 4+ same-side results happens about half the time. Randomness is lumpy, not alternating — “tails 5 times, it must be heads now” is the classic gambler&apos;s fallacy.</li>
            <li><strong>Fun fact from physics:</strong> a large 2023 Stanford study measured a slight same-side bias (~50.8%) from how humans flip — irrelevant for fun, fascinating for statisticians.</li>
            <li><strong>Magic 8-Ball adds the second question:</strong> when it is not binary (“should I…?”), the 8-Ball&apos;s classic answers add a layer of comic ambiguity. Treat it as entertainment — the coin is the honest one.</li>
            <li><strong>Best use cases:</strong> who goes first, choosing between two good options, and teaching kids probability — the 50/50 truth survives any number of flips.</li>
          </ul>
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
        { question: "Is the coin flip fair?", answer: "Yes — it uses the browser's random number generator, which is statistically fair. Heads and tails each have a 50% chance." },
        { question: "Can I use this to make real decisions?", answer: "It is perfect for settling small debates and decisions — from who pays dinner to what to watch. For big life choices, think twice!" },
        { question: "What is the Magic 8-Ball?", answer: "A classic toy that answers yes/no questions with one of 20 random responses. Ask a question and click to shake it." },
        { question: "Does it keep history?", answer: "Yes — your recent results are shown during the session, and coin flip keeps a heads/tails counter." },
        { question: "Does it work on mobile?", answer: "Yes — everything is touch-friendly and works on any device." },
        { question: "Is it free?", answer: "Yes, completely free with no account and nothing to install." }
      ]}
      relatedTools={[
        { name: "Love Calculator", href: "/tools/generators/love-calculator" },
        { name: "Username Generator", href: "/tools/generators/username-generator" },
        { name: "Random Word Generator", href: "/tools/generators/random-word-generator" },
        { name: "Dice Roller", href: "/tools/generators/dice-roller" }
      ]}
    >
      <CoinFlipClient />
    </ToolLayout>
  );
}
