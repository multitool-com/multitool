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
