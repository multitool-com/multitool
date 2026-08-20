import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FancyTextGeneratorClient from "./FancyTextGeneratorClient";

export const metadata: Metadata = {
  title: "Fancy Text Generator - Cool Fonts & Styles Online | MultiTool",
  description: "Convert your text into fancy unicode styles: bold, italic, cursive, monospace, upside down and more. Copy with one click for bios and messages. Free.",
  keywords: ["fancy text generator", "fancy fonts", "cool text generator", "cursive text", "unicode text", "letras diferentes"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/fancy-text-generator",
  },
  openGraph: {
    title: "Fancy Text Generator - Cool Fonts & Styles Online | MultiTool",
    description: "Convert your text into fancy unicode styles: bold, italic, cursive, monospace, upside down and more. Copy with one click for bios and messages. Free.",
    url: "https://www.multitoolbox.online/tools/text-tools/fancy-text-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fancy Text Generator - Cool Fonts & Styles Online | MultiTool",
    description: "Convert your text into fancy unicode styles: bold, italic, cursive, monospace, upside down and more. Copy with one click for bios and messages. Free.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Fancy Text Generator - Cool Fonts & Styles Online | MultiTool"
      description="Convert your text into fancy unicode styles: bold, italic, cursive, monospace, upside down and more. Copy with one click for bios and messages. Free."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="fancy-text-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Convert your text into fancy unicode styles: bold, italic, cursive, monospace, upside down and more. Copy with one click for bios and messages. Free.
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
        { question: "What styles are available?", answer: "Bold, italic, cursive, monospace, upside-down and small caps — all generated with unicode characters, no fonts to download." },
        { question: "Will the fancy text work everywhere?", answer: "Mostly, but some apps and platforms don't render all unicode characters. It works great in social media bios, messages and posts." },
        { question: "Is it safe to use on social media?", answer: "Yes — it is plain unicode text, not a script or link. Perfect for Instagram, TikTok, WhatsApp and more." },
        { question: "Can I copy each style separately?", answer: "Yes — every style has its own Copy button, so you can grab just the one you want." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Word Counter", href: "/tools/text-tools/word-counter" },
        { name: "Emoji Copy-Paste", href: "/tools/text-tools/emoji-copy-paste" },
        { name: "Morse Code", href: "/tools/text-tools/morse-code" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" }
      ]}
    >
      <FancyTextGeneratorClient />
    </ToolLayout>
  );
}
