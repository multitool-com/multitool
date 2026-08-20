import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TypingTestClient from "./TypingTestClient";

export const metadata: Metadata = {
  title: "Typing Test - WPM Speed Test Free | MultiTool",
  description: "Measure your typing speed in WPM and accuracy with 15, 30 or 60 second tests. Live feedback on every keystroke.",
  keywords: ["typing test", "wpm test", "typing speed test", "words per minute", "teste de digitacao"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/typing-test",
  },
  openGraph: {
    title: "Typing Test - WPM Speed Test Free | MultiTool",
    description: "Measure your typing speed in WPM and accuracy with 15, 30 or 60 second tests. Live feedback on every keystroke.",
    url: "https://www.multitoolbox.online/tools/text-tools/typing-test",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Test - WPM Speed Test Free | MultiTool",
    description: "Measure your typing speed in WPM and accuracy with 15, 30 or 60 second tests. Live feedback on every keystroke.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Typing Test - WPM Speed Test Free | MultiTool"
      description="Measure your typing speed in WPM and accuracy with 15, 30 or 60 second tests. Live feedback on every keystroke."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="typing-test"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick a duration (15, 30 or 60 seconds) and start typing. Every keystroke is scored live — correct characters in dark, errors in red — and at the end you get your WPM, CPM and accuracy.
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
        { question: "What is WPM?", answer: "Words per minute, calculated as correctly typed characters divided by 5 (the average word length) per minute." },
        { question: "Is accuracy important?", answer: "Yes — errors lower your accuracy percentage and don't count toward WPM, pushing you to type cleanly." },
        { question: "Which test duration should I use?", answer: "60 seconds is the standard benchmark; 15 seconds is a quick warm-up." },
        { question: "What is a good score?", answer: "40 WPM is average, 60-80 is good, and 100+ is professional level." },
        { question: "Does it use random words?", answer: "Yes — a shuffled list of common English words, so every test is different." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Number to Words Converter", href: "/tools/text-tools/number-to-words" },
        { name: "Text to Speech", href: "/tools/text-tools/text-to-speech" },
      ]}
    >
      <TypingTestClient />
    </ToolLayout>
  );
}
