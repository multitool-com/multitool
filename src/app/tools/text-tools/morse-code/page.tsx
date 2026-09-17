import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MorseCodeClient from "./MorseCodeClient";

export const metadata: Metadata = {
  title: "Morse Code Translator - Text to Morse Code Online | MultiTool",
  description: "Translate text to Morse code and back, with sound playback. Learn the classic alphabet and encode messages instantly. Free, no download.",
  keywords: ["morse code", "morse code translator", "text to morse", "morse decoder", "morse alphabet", "codigo morse"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/morse-code",
  },
  openGraph: {
    title: "Morse Code Translator - Text to Morse Code Online | MultiTool",
    description: "Translate text to Morse code and back, with sound playback. Learn the classic alphabet and encode messages instantly. Free, no download.",
    url: "https://www.multitoolbox.online/tools/text-tools/morse-code",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morse Code Translator - Text to Morse Code Online | MultiTool",
    description: "Translate text to Morse code and back, with sound playback. Learn the classic alphabet and encode messages instantly. Free, no download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Morse Code Translator - Text to Morse Code Online | MultiTool"
      description="Translate text to Morse code and back, with sound playback. Learn the classic alphabet and encode messages instantly. Free, no download."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="morse-code"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Translate text to Morse code and back, with sound playback. Learn the classic alphabet and encode messages instantly. Free, no download.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The code that refused to die
          </h2>
          <p className="mb-4">
            Samuel Morse and Alfred Vail created this code in the 1830s–40s
            for the telegraph — the first time in history a message could
            travel faster than a horse. Nearly two centuries later, it still
            has active users.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>SOS is not an abbreviation:</strong> it was chosen because the pattern ···−−−··· is unmistakable through noise — three short, three long, three short.</li>
            <li><strong>Timing rules:</strong> a dash is three times a dot; letters are separated by a pause, words by a longer one. That is why well-formed Morse is readable even at high speed.</li>
            <li><strong>Still in use today:</strong> amateur radio operators worldwide, aviation navigation beacons (identifying Morse letters), assistive technology for accessibility, and emergency signaling with a flashlight.</li>
            <li><strong>Learning it:</strong> most people learn by sound, not by reading — 10 minutes a day of listening practice builds the reflex in a few weeks.</li>
          </ul>
          <p className="mb-4">
            The letter frequency wisdom is baked into the code itself: the
            most common English letter, E, is a single dot — the shortest
            possible symbol. Old engineering, still elegant.
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
        { question: "How does Morse code work?", answer: "Each letter and number is represented by dots and dashes: A is .-, B is -..., and so on. Spaces separate letters, slashes separate words." },
        { question: "Can I hear the Morse code?", answer: "Yes — the Play button plays the code as audio beeps, with correct timing (dots, dashes and pauses)." },
        { question: "Can I decode Morse back to text?", answer: "Yes — paste Morse code in the code field and the text field updates automatically." },
        { question: "What characters are supported?", answer: "Letters A-Z, digits 0-9, punctuation and common symbols. Unsupported characters are skipped." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Emoji Copy-Paste", href: "/tools/text-tools/emoji-copy-paste" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
        { name: "Word Counter", href: "/tools/text-tools/word-counter" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" }
      ]}
    >
      <MorseCodeClient />
    </ToolLayout>
  );
}
