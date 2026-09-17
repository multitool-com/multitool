import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LoremIpsumGeneratorClient from "./LoremIpsumGeneratorClient";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Words, Paragraphs | MultiTool",
  description: "Generate Lorem Ipsum placeholder text with the exact number of words and paragraphs you need. Free, instant, copy-ready.",
  keywords: ["lorem ipsum generator", "lorem ipsum", "placeholder text", "dummy text generator", "fake text"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/lorem-ipsum-generator",
  },
  openGraph: {
    title: "Lorem Ipsum Generator - Words, Paragraphs | MultiTool",
    description: "Generate Lorem Ipsum placeholder text with the exact number of words and paragraphs you need. Free, instant, copy-ready.",
    url: "https://www.multitoolbox.online/tools/text-tools/lorem-ipsum-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator - Words, Paragraphs | MultiTool",
    description: "Generate Lorem Ipsum placeholder text with the exact number of words and paragraphs you need. Free, instant, copy-ready.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Lorem Ipsum Generator - Words, Paragraphs | MultiTool"
      description="Generate Lorem Ipsum placeholder text with the exact number of words and paragraphs you need. Free, instant, copy-ready."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="lorem-ipsum-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Choose how many words per paragraph and how many paragraphs, optionally start with the classic 'Lorem ipsum dolor sit amet', and generate clean Latin placeholder text ready to copy into designs and layouts.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The 2,000-year-old placeholder
          </h2>
          <p className="mb-4">
            Lorem ipsum is scrambled Latin — adapted from a passage of
            Cicero written around 45 BC. Printers in the 1500s used it to
            show page layouts, and half a millennium later, designers still
            do, for one good reason:{" "}
            <strong>it looks like text but reads like nothing</strong>.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Why not real text?</strong> readable content invites reviewers to edit copy when they should be evaluating layout, contrast and hierarchy. Dummy text keeps attention on design.</li>
            <li><strong>Word/paragraph control:</strong> generate exactly the amount a mockup needs — headings to body copy ratio that matches the real design.</li>
            <li><strong>For testing:</strong> feeds, tables, truncation (“…” after 3 lines) and overflow bugs all need text of a precise length. Lorem gives you arbitrary lengths on demand.</li>
            <li><strong>The rule:</strong> placeholder in, placeholder out — never let lorem ipsum reach production. Real content always breaks a layout differently than the dummy did.</li>
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
        { question: "What is Lorem Ipsum?", answer: "Scrambled Latin placeholder text used since the 1500s to fill layouts before real content exists." },
        { question: "Why use it instead of typing random text?", answer: "Its letter distribution matches natural language, so designs look realistic without distracting the eye with readable words." },
        { question: "Can I control the length?", answer: "Yes — set words per paragraph (up to 1000) and paragraph count (up to 50)." },
        { question: "Does it always start with 'Lorem ipsum'?", answer: "Only if you keep the classic option on — toggle it off for fully random text." },
        { question: "Is it free for commercial use?", answer: "Yes — Lorem Ipsum is public domain and free to use anywhere." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Slug Generator", href: "/tools/text-tools/slug-generator" },
        { name: "Text Diff Checker", href: "/tools/text-tools/text-diff" },
      ]}
    >
      <LoremIpsumGeneratorClient />
    </ToolLayout>
  );
}
