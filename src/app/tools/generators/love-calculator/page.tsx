import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LoveCalculatorClient from "./LoveCalculatorClient";

export const metadata: Metadata = {
  title: "Love Calculator - Test Love Compatibility Online | MultiTool",
  description: "Free love calculator. Enter two names and discover your love compatibility percentage. Fun, instant and viral — try it with your crush!",
  keywords: ["love calculator", "love test", "compatibility test", "love percentage", "calculator de amor", "teste de amor"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/love-calculator",
  },
  openGraph: {
    title: "Love Calculator - Test Love Compatibility Online | MultiTool",
    description: "Free love calculator. Enter two names and discover your love compatibility percentage. Fun, instant and viral — try it with your crush!",
    url: "https://www.multitoolbox.online/tools/generators/love-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Calculator - Test Love Compatibility Online | MultiTool",
    description: "Free love calculator. Enter two names and discover your love compatibility percentage. Fun, instant and viral — try it with your crush!",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Love Calculator - Test Love Compatibility Online | MultiTool"
      description="Free love calculator. Enter two names and discover your love compatibility percentage. Fun, instant and viral — try it with your crush!"
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="love-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Free love calculator. Enter two names and discover your love compatibility percentage. Fun, instant and viral — try it with your crush!
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The science and the fun of it
          </h2>
          <p className="mb-4">
            No algorithm can measure love — but the fun of comparing names
            is universal, and the psychology behind it is real. This tool
            is entertainment with a wink, and the honest framing below is
            part of the joke.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Why it works as a game:</strong> icebreaking. Name-match games have started conversations at parties for a century — from paper fortune tellers to this page. The number is the excuse; the laugh is the product.</li>
            <li><strong>What relationship science actually says:</strong> decades of studies point to boring-but-real predictors — how couples handle conflict, shared values, kindness in small moments. Nothing about the letters in names.</li>
            <li><strong>Deterministic by design:</strong> the same pair always gets the same score (a stable hash of the names) — so you can argue about the result fairly.</li>
            <li><strong>Party mode:</strong> try celebrity pairs, pet + owner, team names. The scoreboard gets competitive fast.</li>
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
        { question: "Is the love calculator accurate?", answer: "No — it is a fun, playful calculation based on the names you enter. It is not real matchmaking or science, just entertainment to share with friends." },
        { question: "How is the percentage calculated?", answer: "A deterministic algorithm combines the letters of both names with a random element, producing a score from 0 to 100% plus a playful message." },
        { question: "Can I use my real name?", answer: "Of course — the tool works with any names, real or fictional. Use nicknames if you want to keep it private." },
        { question: "Why do I get a different result each time?", answer: "A small random factor varies the result slightly, so re-rolling gives a different score. That is intentional for fun." },
        { question: "Is it private?", answer: "Yes — everything runs in your browser. The names you type never leave your device." },
        { question: "Can I share the result?", answer: "Yes! The percentage and message are perfect for sharing with friends — screenshot it or copy the result." }
      ]}
      relatedTools={[
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
        { name: "Username Generator", href: "/tools/generators/username-generator" },
        { name: "Random Word Generator", href: "/tools/generators/random-word-generator" },
        { name: "Password Generator", href: "/tools/generators/password-generator" }
      ]}
    >
      <LoveCalculatorClient />
    </ToolLayout>
  );
}
