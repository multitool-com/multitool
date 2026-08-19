import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import EmojiCopyPasteClient from "./EmojiCopyPasteClient";

export const metadata: Metadata = {
  title: "Emoji Copy-Paste - Emojis for Social Media | MultiTool",
  description: "Find and copy emojis instantly: smileys, hearts, animals, food, symbols and more. Search by name and copy with one click. Free, no sign-up.",
  keywords: ["emoji copy paste", "emoji keyboard", "copy emojis", "emojis for instagram", "emojis for whatsapp", "emojis gratis"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/emoji-copy-paste",
  },
  openGraph: {
    title: "Emoji Copy-Paste - Emojis for Social Media | MultiTool",
    description: "Find and copy emojis instantly: smileys, hearts, animals, food, symbols and more. Search by name and copy with one click. Free, no sign-up.",
    url: "https://multitoolbox.online/tools/text-tools/emoji-copy-paste",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emoji Copy-Paste - Emojis for Social Media | MultiTool",
    description: "Find and copy emojis instantly: smileys, hearts, animals, food, symbols and more. Search by name and copy with one click. Free, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Emoji Copy-Paste - Emojis for Social Media | MultiTool"
      description="Find and copy emojis instantly: smileys, hearts, animals, food, symbols and more. Search by name and copy with one click. Free, no sign-up."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="emoji-copy-paste"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Find and copy emojis instantly: smileys, hearts, animals, food, symbols and more. Search by name and copy with one click. Free, no sign-up.
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
        { question: "How do I copy an emoji?", answer: "Just click or tap any emoji — it is copied to your clipboard instantly, ready to paste anywhere." },
        { question: "Can I search for emojis?", answer: "Yes — type a keyword like heart, food or cat to filter the collection by group or by the emoji itself." },
        { question: "Are recent emojis saved?", answer: "Yes — your most-used emojis are kept at the top for the session so you can grab them faster." },
        { question: "Do the emojis work on all devices?", answer: "Yes — emojis are standard unicode characters rendered by every modern device and platform." },
        { question: "Can I use them on Instagram and WhatsApp?", answer: "Absolutely — paste them into any app, bio, caption or message." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
        { name: "Word Counter", href: "/tools/text-tools/word-counter" },
        { name: "Morse Code", href: "/tools/text-tools/morse-code" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" }
      ]}
    >
      <EmojiCopyPasteClient />
    </ToolLayout>
  );
}
