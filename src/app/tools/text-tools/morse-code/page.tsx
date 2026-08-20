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
