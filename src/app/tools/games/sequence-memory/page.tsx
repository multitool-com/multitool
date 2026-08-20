import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SequenceMemoryClient from "./SequenceMemoryClient";

export const metadata: Metadata = {
  title: "Sequence Memory - Play Simon Memory Game Online Free | MultiTool",
  description:
    "Play the classic sequence memory game online free. Watch the glowing colors, repeat the sequence and beat your record. Endless levels with sounds. No download.",
  keywords: [
    "memory game",
    "simon game",
    "sequence memory",
    "brain game",
    "color memory game",
    "simon says game",
    "repeat the sequence",
    "jogo da memoria cores",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/games/sequence-memory",
  },
  openGraph: {
    title: "Sequence Memory - Simon Style Game | MultiTool",
    description:
      "Watch the sequence, repeat it, level up. Free, no download.",
    url: "https://www.multitoolbox.online/tools/games/sequence-memory",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sequence Memory - Free & Instant",
    description: "Repeat the glowing sequence. How far can you go?",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Sequence Memory"
      description="Watch the sequence of glowing colors, then repeat it. Every round adds one more step — how long a chain can your memory hold?"
      categoryName="Games"
      categorySlug="games"
      toolSlug="sequence-memory"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to play
          </h2>
          <p className="mb-4">
            Four colored pads light up <strong>one by one</strong>, each
            with its own tone. After the sequence plays, <strong>repeat
            it</strong> by tapping the pads in the same order. Every
            successful round adds <strong>one more step</strong> to the
            sequence.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Levels &amp; session
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              The sequence grows forever — level 1 is 1 step, level 10 is
              10 steps.
            </li>
            <li>
              Your <strong>session keeps going</strong> while the game is
              open: current level and best survive a refresh, and reset when
              you close the tab.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Tips
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Say the colors out loud as they flash — it helps a lot.
            </li>
            <li>
              Chunk the sequence in groups of 3–4 instead of memorizing one
              by one.
            </li>
            <li>
              The tones help: each color has its own pitch, so listen as
              well as look.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The game runs entirely in your browser. Nothing is tracked or
            stored on any server.
          </p>
        </>
      }
      faqs={[
        {
          question: "How does the game work?",
          answer:
            "Four colored pads flash in a sequence. Watch and listen, then tap the pads in the same order. Each level adds one more step to the sequence.",
        },
        {
          question: "What happens when I make a mistake?",
          answer:
            "The game ends and shows your final level. Your best score is kept for the session — start again and try to beat it.",
        },
        {
          question: "Is there a limit to the levels?",
          answer:
            "No. The sequence can grow endlessly — the limit is your memory. Level 10 means remembering 10 steps in order.",
        },
        {
          question: "Does it work on mobile?",
          answer:
            "Yes. The pads are large enough to tap comfortably on any screen size.",
        },
        {
          question: "Is the game free?",
          answer:
            "Yes, completely free with no account and nothing to install.",
        },
        {
          question: "Does the game track my data?",
          answer:
            "No. Everything runs locally in your browser.",
        },
      ]}
      relatedTools={[
        { name: "Memory Match", href: "/tools/games/memory-match" },
        { name: "Snake", href: "/tools/games/snake" },
        { name: "2048", href: "/tools/games/2048" },
        { name: "Word Guess", href: "/tools/games/word-guess" },
      ]}
    >
      <SequenceMemoryClient />
    </ToolLayout>
  );
}
