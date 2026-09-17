import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NumberToWordsClient from "./NumberToWordsClient";

export const metadata: Metadata = {
  title: "Number to Words Converter - English & Portuguese | MultiTool",
  description: "Convert any number to words in English or Portuguese instantly — perfect for checks, invoices, contracts and essays.",
  keywords: ["number to words", "numbers to words converter", "write numbers in words", "check amount in words", "numero por extenso", "converter numero em palavras"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/number-to-words",
  },
  openGraph: {
    title: "Number to Words Converter - English & Portuguese | MultiTool",
    description: "Convert any number to words in English or Portuguese instantly — perfect for checks, invoices, contracts and essays.",
    url: "https://www.multitoolbox.online/tools/text-tools/number-to-words",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Number to Words Converter - English & Portuguese | MultiTool",
    description: "Convert any number to words in English or Portuguese instantly — perfect for checks, invoices, contracts and essays.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Number to Words Converter - English & Portuguese | MultiTool"
      description="DESC"
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="number-to-words"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type any number — with decimals, commas or a minus sign — pick English or Portuguese, and the tool writes it out in full words. The conversion follows standard check-writing conventions for both languages.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why writing numbers as words still matters
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Legal documents:</strong> contracts write “two thousand five hundred dollars (US$ 2,500.00)” — the words protect against a tampered digit, which is far easier to alter than a spelled amount.</li>
            <li><strong>Banking:</strong> checks require the amount in words; a mismatch between words and figures can void them.</li>
            <li><strong>Formal writing:</strong> style guides agree on one thing — spell out small numbers (“three reasons”), use digits for large or technical ones (“3,482 users”).</li>
            <li><strong>Readability:</strong> words remove ambiguity in speech-to-text, invoices read aloud, and international contexts where “1,005” means one thousand and five in one country and something else in another.</li>
            <li><strong>Language support:</strong> this tool handles English and Portuguese, including the hyphenation rules (“twenty-one”, “vinte e um”) that trip up manual writing.</li>
          </ul>
          <p className="mb-4">
            The converter handles the fiddly parts automatically —
            “and” placement, hyphens, millions vs billions (a billion is a
            thousand million in the short scale most of the world uses
            today) — so every result is style-guide correct.
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
        { question: "How do you write 123 in words?", answer: "In English: one hundred twenty-three. In Portuguese: cento e vinte e três." },
        { question: "How do you write 1,000,000 in words?", answer: "In English: one million. In Portuguese: um milhão." },
        { question: "Can it convert decimals?", answer: "Yes — decimals are read digit by digit: 19.5 becomes nineteen point five or dezenove vírgula cinco." },
        { question: "Can it convert negative numbers?", answer: "Yes — a minus sign is written as negative in English or menos in Portuguese." },
        { question: "Why do I need this?", answer: "It is essential for writing checks, invoices, contracts and banking documents where amounts must be spelled out." },
        { question: "Is it free?", answer: "Yes, completely free with no account and nothing to install." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
        { name: "Emoji Copy-Paste", href: "/tools/text-tools/emoji-copy-paste" },
        { name: "Morse Code Translator", href: "/tools/text-tools/morse-code" },
      ]}
    >
      <NumberToWordsClient />
    </ToolLayout>
  );
}
