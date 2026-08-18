import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WordGuessClient from "./WordGuessClient";

export const metadata: Metadata = {
  title: "Word Guess - Guess the Word in 6 Tries Online Free | MultiTool",
  description:
    "Play the word guessing game online free. Guess the hidden 5-letter word in six tries with color feedback. Daily brain teaser with session stats and sounds. No download.",
  keywords: [
    "word game",
    "guess the word",
    "word puzzle",
    "daily word game",
    "5 letter word game",
    "wordle style game",
    "guess word online",
    "jogo de palavras",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/games/word-guess",
  },
  openGraph: {
    title: "Word Guess - Guess the Word | MultiTool",
    description: "Guess the hidden word in six tries. Free, no download.",
    url: "https://multitoolbox.online/tools/games/word-guess",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Guess - Free & Instant",
    description: "Six tries to find the word. Play now.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Word Guess"
      description="Find the hidden 5-letter word in six tries. Green means right place, yellow means right letter wrong place. Track your streak while the session lasts."
      categoryName="Games"
      categorySlug="games"
      toolSlug="word-guess"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Guess the hidden <strong>5-letter word</strong>. After each
            guess the letters light up: <strong>green</strong> = correct
            letter in the correct spot, <strong>yellow</strong> = correct
            letter in the wrong spot, <strong>gray</strong> = not in the
            word. You have <strong>six tries</strong>.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Session stats
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Games played, wins, current streak and best streak are tracked
              while the session lasts.
            </li>
            <li>
              Type with your <strong>physical keyboard</strong> or tap the{" "}
              <strong>on-screen keyboard</strong>.
            </li>
            <li>
              A new random word starts every game — endless brain teasers.
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
          question: "How do the colors work?",
          answer:
            "Green: the letter is correct and in the right position. Yellow: the letter is in the word but in another position. Gray: the letter is not in the word at all.",
        },
        {
          question: "What about repeated letters?",
          answer:
            "Duplicates are handled fairly: if the word has one 'E' and you guess two, only one lights up yellow — the algorithm counts the remaining letters correctly.",
        },
        {
          question: "Can I type with my keyboard?",
          answer:
            "Yes — type letters directly, Backspace to delete and Enter to submit. The on-screen keyboard also works with taps.",
        },
        {
          question: "Are my stats saved?",
          answer:
            "For the session: games played, wins, current streak and best streak survive a refresh and reset when you close the tab.",
        },
        {
          question: "Is there a daily word?",
          answer:
            "Every game draws a fresh random word from a curated list of common 5-letter words — play as many rounds as you like.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Memory Match", href: "/tools/games/memory-match" },
        { name: "Sequence Memory", href: "/tools/games/sequence-memory" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Noughts & Crosses", href: "/tools/games/noughts-crosses" },
      ]}
    >
      <WordGuessClient />
    </ToolLayout>
  );
}
