import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ReadabilityClient from "./ReadabilityClient";

export const metadata: Metadata = {
  title: "Readability Checker - Flesch Score & Reading Level | MultiTool",
  description:
    "Free readability checker. Measure the Flesch Reading Ease score and Flesch-Kincaid grade level of any text. Word, sentence and syllable counts. 100% in your browser.",
  keywords: [
    "readability checker",
    "flesch reading ease",
    "flesch kincaid",
    "readability score",
    "reading level test",
    "text readability",
    "grade level checker",
    "readability test online",
    "flesch score",
    "writing level checker",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/readability-checker",
  },
  openGraph: {
    title: "Readability Checker - Flesch Score | MultiTool",
    description:
      "Measure the reading level of any text with Flesch scores. Free and private.",
    url: "https://multitoolbox.online/tools/text-tools/readability-checker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Readability Checker - Free & Instant",
    description: "Flesch Reading Ease and grade level for any text.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Readability Checker"
      description="Measure how easy your text is to read with the Flesch Reading Ease score and the Flesch-Kincaid grade level, plus word, sentence and syllable counts."
      categoryName="Text Tools"
      categorySlug="text-tools"
      toolSlug="readability-checker"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is readability?
          </h2>
          <p className="mb-4">
            Readability measures how easy a text is to understand. The{" "}
            <strong>Flesch Reading Ease</strong> score goes from 0 to 100 —
            the higher, the easier. The{" "}
            <strong>Flesch-Kincaid grade level</strong> tells you the US
            school grade a reader needs to understand the text.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The formulas
          </h2>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 font-mono text-sm">
            ease = 206.835 − 1.015 × (words ÷ sentences)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;− 84.6 × (syllables ÷ words)
            <br />
            <br />
            grade = 0.39 × (words ÷ sentences)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 11.8 × (syllables ÷ words) − 15.59
          </div>
          <p className="mb-4">
            Both formulas use the same three ingredients:{" "}
            <strong>words</strong>, <strong>sentences</strong> and{" "}
            <strong>syllables</strong>. That is why this tool also shows each
            count separately.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What the scores mean
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>90–100</strong> — Very easy (children's books)
            </li>
            <li>
              <strong>60–70</strong> — Plain English (most popular
              magazines)
            </li>
            <li>
              <strong>30–50</strong> — Difficult (academic writing)
            </li>
            <li>
              <strong>0–30</strong> — Very difficult (legal documents)
            </li>
          </ul>
          <p className="mb-4">
            Most websites aim for a grade level of <strong>8 or lower</strong>{" "}
            so the widest audience can read them.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Paste or type your text (or load a sample).</li>
            <li>Read the Flesch score, the grade level and the verdict.</li>
            <li>Check the word, sentence and syllable counts.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The analysis runs entirely in your browser. Your text is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the Flesch Reading Ease score?",
          answer:
            "A number from 0 to 100 that estimates how easy a text is to read. Higher = easier: 90–100 is very easy (children's books), 60–70 is plain English (popular magazines), below 30 is very difficult (legal documents).",
        },
        {
          question: "What is the Flesch-Kincaid grade level?",
          answer:
            "It converts the same word/sentence/syllable statistics into the US school grade needed to understand the text. Grade 8 means an average 13–14-year-old can read it. Most websites aim for 8 or lower.",
        },
        {
          question: "How are syllables counted?",
          answer:
            "By a standard approximation algorithm: each run of vowels counts as one syllable, with rules for silent e and common endings. It is very accurate for English but not perfect for every word.",
        },
        {
          question: "What is a good readability score for a website?",
          answer:
            "A Flesch Reading Ease of 60–70 and a grade level of 8 or lower is the sweet spot for general audiences. Technical or academic content can intentionally target higher levels.",
        },
        {
          question: "Does readability affect SEO?",
          answer:
            "Indirectly. Google does not use Flesch scores directly, but easy-to-read text tends to keep visitors longer, which improves engagement signals. Clear, simple writing is a safe SEO investment.",
        },
        {
          question: "Is my text private?",
          answer:
            "Yes. Everything is analyzed locally in your browser. Nothing is uploaded, logged or stored — safe for drafts and private documents.",
        },
      ]}
      relatedTools={[
        { name: "Word Counter", href: "/tools/text-tools/word-counter" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Keyword Density", href: "/tools/text-tools/keyword-density" },
        { name: "Text Diff Checker", href: "/tools/text-tools/text-diff" },
      ]}
    >
      <ReadabilityClient />
    </ToolLayout>
  );
}
