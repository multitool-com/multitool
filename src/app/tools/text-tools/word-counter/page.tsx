import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Word Counter - Count Words, Characters & Sentences | MultiTool",
  description:
    "Free online word counter: count words, characters (with & without spaces), sentences, paragraphs and reading time. Perfect for essays, articles, tweets and SEO.",
  keywords: [
    "word counter",
    "character counter",
    "word count tool",
    "count words online",
    "text counter",
    "character count",
    "words per minute",
    "reading time calculator",
    "essay word counter",
    "tweet character counter",
  ],
  alternates: {
    canonical: "https://multitool.online/tools/text-tools/word-counter",
  },
  openGraph: {
    title: "Word Counter - Count Words, Characters & Sentences | MultiTool",
    description:
      "Count words, characters, sentences, paragraphs and reading time instantly. Free and private.",
    url: "https://multitool.online/tools/text-tools/word-counter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Counter - Count Words & Characters",
    description:
      "Free online word counter with reading time, character count and more.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, paragraphs and reading time in your text. Perfect for essays, articles, social media posts and SEO."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="word-counter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How the word counter works
          </h2>
          <p className="mb-4">
            This tool analyzes your text in real time and gives you:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Word count:</strong> total number of words separated by
              spaces, tabs or line breaks.
            </li>
            <li>
              <strong>Character count:</strong> with and without spaces (useful
              for tweets, meta descriptions, SMS).
            </li>
            <li>
              <strong>Sentence count:</strong> number of sentences (based on
              periods, question marks and exclamation marks).
            </li>
            <li>
              <strong>Paragraph count:</strong> number of paragraphs separated
              by line breaks.
            </li>
            <li>
              <strong>Reading time:</strong> estimated time to read the text
              (based on 225 words per minute — the average adult reading
              speed).
            </li>
            <li>
              <strong>Speaking time:</strong> estimated time to speak the text
              out loud (based on 130 words per minute).
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Common word count limits
          </h2>
          <p className="mb-3">
            Different platforms and formats have specific character or word
            limits:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Twitter / X post:</strong> 280 characters
            </li>
            <li>
              <strong>SMS message:</strong> 160 characters
            </li>
            <li>
              <strong>Meta description (SEO):</strong> 150–160 characters
            </li>
            <li>
              <strong>Meta title (SEO):</strong> 50–60 characters
            </li>
            <li>
              <strong>Instagram caption:</strong> 2,200 characters
            </li>
            <li>
              <strong>LinkedIn post:</strong> 3,000 characters
            </li>
            <li>
              <strong>Facebook post:</strong> 63,206 characters (but 40–80
              perform best)
            </li>
            <li>
              <strong>College essay:</strong> typically 500–650 words
            </li>
            <li>
              <strong>Blog post (SEO-friendly):</strong> 1,500–2,500 words
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why word count matters
          </h2>
          <p className="mb-4">
            Whether you&apos;re writing an essay, publishing a blog post,
            crafting a tweet or optimizing for SEO, staying within (or hitting)
            specific word and character limits is essential. Search engines,
            social platforms and academic institutions all have preferred
            lengths for optimal performance.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Reading time explained
          </h2>
          <p className="mb-4">
            The average adult reads at around <strong>225 words per
            minute</strong> for silent reading and <strong>130 words per
            minute</strong> when reading aloud. This calculator uses those
            averages to give you a realistic estimate — perfect for
            journalists, podcasters, speakers and content creators.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All counting happens instantly in your browser. Your text is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How does the word counter count words?",
          answer:
            "The tool counts any sequence of characters separated by spaces, tabs or line breaks as one word. Numbers, hyphenated words (like 'well-known') and contractions (like 'don't') each count as a single word.",
        },
        {
          question: "What's the difference between characters with and without spaces?",
          answer:
            "'Characters with spaces' counts every character in your text including spaces, tabs and line breaks. 'Characters without spaces' counts only letters, numbers, punctuation and symbols. Both are useful — Twitter counts spaces, but many databases don't.",
        },
        {
          question: "How is reading time calculated?",
          answer:
            "Reading time is based on the average adult silent reading speed of 225 words per minute (WPM). Speaking time uses 130 WPM, which is the average pace for clear speech. These are widely accepted averages used by publishers and educators.",
        },
        {
          question: "How are sentences counted?",
          answer:
            "Sentences are counted by detecting sentence-ending punctuation: periods (.), question marks (?) and exclamation marks (!). Abbreviations like 'Mr.' or 'e.g.' may occasionally cause small variations, but the count is accurate for typical writing.",
        },
        {
          question: "Is there a maximum text length?",
          answer:
            "No! You can paste text of any length — from a single tweet to an entire book. All processing happens in your browser, so there's no server limit.",
        },
        {
          question: "Is my text private?",
          answer:
            "Yes! All counting happens locally in your browser. Your text is never sent to any server or stored anywhere.",
        },
      ]}
      relatedTools={[
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Lorem Ipsum Generator", href: "/tools/text-tools/lorem-ipsum-generator" },
        { name: "Slug Generator", href: "/tools/text-tools/slug-generator" },
        { name: "Text Diff Checker", href: "/tools/text-tools/text-diff" },
      ]}
    >
      <WordCounterClient />
    </ToolLayout>
  );
}