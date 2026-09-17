import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TextToSpeechClient from "./TextToSpeechClient";

export const metadata: Metadata = {
  title: "Text to Speech - Read Aloud Online Free | MultiTool",
  description: "Turn any text into spoken audio right in your browser: choose a voice, speed and pitch. Free, no sign-up, nothing uploaded.",
  keywords: ["text to speech", "tts", "read aloud", "text reader", "texto em voz", "texto para voz"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/text-to-speech",
  },
  openGraph: {
    title: "Text to Speech - Read Aloud Online Free | MultiTool",
    description: "Turn any text into spoken audio right in your browser: choose a voice, speed and pitch. Free, no sign-up, nothing uploaded.",
    url: "https://www.multitoolbox.online/tools/text-tools/text-to-speech",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to Speech - Read Aloud Online Free | MultiTool",
    description: "Turn any text into spoken audio right in your browser: choose a voice, speed and pitch. Free, no sign-up, nothing uploaded.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Text to Speech - Read Aloud Online Free | MultiTool"
      description="DESC"
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="text-to-speech"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type or paste any text, pick a voice from your device's built-in voices, adjust speed and pitch, then press Speak. The speech is generated locally by your operating system and browser — nothing is uploaded to any server.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The browser voice, and how to use it well
          </h2>
          <p className="mb-4">
            This tool uses your browser&apos;s built-in speech engine — the
            same voice your operating system provides for accessibility —
            which means zero uploads and instant playback. That choice has
            trade-offs worth knowing:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Proofreading superpower:</strong> hearing your text catches typos, repeated words and clunky rhythm that the eye forgives. Writers swear by the read-aloud pass.</li>
            <li><strong>Language learning:</strong> paste foreign phrases to hear pronunciation; slow down the rate for studying, natural speed for immersion.</li>
            <li><strong>Voices vary by device:</strong> the list of voices and languages depends on your OS and installed language packs — a voice you have at home may be missing on another computer.</li>
            <li><strong>Long texts:</strong> engines handle a few thousand characters comfortably; for full books, split by chapters. Punctuation is your pause control — commas and periods create the prosody.</li>
            <li><strong>Private by architecture:</strong> the text never leaves your machine — there is no server on the other side, which is precisely why it works offline too.</li>
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
        { question: "Does it work offline?", answer: "Yes — voices are built into your operating system and browser, so speech works even without internet." },
        { question: "How do I change the voice?", answer: "Open the voice dropdown — it lists every voice installed on your device, grouped by language. Different operating systems offer different voices." },
        { question: "Can I adjust speed and pitch?", answer: "Yes — speed goes from 0.5x to 2x and pitch from 0 to 2, so you can listen slowly to learn a language or fast to skim." },
        { question: "Why is my language missing?", answer: "Voices depend on your operating system. You can usually add more voices in Windows (Settings, Time and Language, Speech) or macOS (System Settings, Accessibility, Spoken Content)." },
        { question: "Does it read in Portuguese?", answer: "Yes — if your device has a Portuguese voice installed (pt-BR on Windows and macOS), you can select it from the dropdown." },
        { question: "Is it really free?", answer: "Yes — no account, no limits, no uploads. Everything stays on your device." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Number to Words Converter", href: "/tools/text-tools/number-to-words" },
        { name: "Readability Checker", href: "/tools/text-tools/readability-checker" },
        { name: "Morse Code Translator", href: "/tools/text-tools/morse-code" },
      ]}
    >
      <TextToSpeechClient />
    </ToolLayout>
  );
}
