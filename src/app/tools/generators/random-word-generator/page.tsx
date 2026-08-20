import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RandomWordGeneratorClient from "./RandomWordGeneratorClient";

export const metadata: Metadata = {
  title: "Random Word Generator - Random Words Online | MultiTool",
  description: "Generate random words instantly for writing prompts, games, passwords and inspiration. Choose how many words you need. Free, no sign-up.",
  keywords: ["random word generator", "random words", "writing prompt generator", "word list", "inspiration words"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/random-word-generator",
  },
  openGraph: {
    title: "Random Word Generator - Random Words Online | MultiTool",
    description: "Generate random words instantly for writing prompts, games, passwords and inspiration. Choose how many words you need. Free, no sign-up.",
    url: "https://www.multitoolbox.online/tools/generators/random-word-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Word Generator - Random Words Online | MultiTool",
    description: "Generate random words instantly for writing prompts, games, passwords and inspiration. Choose how many words you need. Free, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Random Word Generator - Random Words Online | MultiTool"
      description="Generate random words instantly for writing prompts, games, passwords and inspiration. Choose how many words you need. Free, no sign-up."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="random-word-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Generate random words instantly for writing prompts, games, passwords and inspiration. Choose how many words you need. Free, no sign-up.
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
        { question: "What can I use random words for?", answer: "Creative writing prompts, naming things, word games, passwords made of words, or just sparking inspiration." },
        { question: "How many words can I generate?", answer: "From 1 to 10 words per batch, selected randomly from a curated list of 50 nice words." },
        { question: "Are the words truly random?", answer: "Yes — each batch shuffles the list and picks without repetition, so you get varied selections." },
        { question: "Can I copy all words at once?", answer: "Yes — the Copy All button copies them as a comma-separated list." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Word Guess", href: "/tools/games/word-guess" },
        { name: "Username Generator", href: "/tools/generators/username-generator" },
        { name: "Love Calculator", href: "/tools/generators/love-calculator" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" }
      ]}
    >
      <RandomWordGeneratorClient />
    </ToolLayout>
  );
}
