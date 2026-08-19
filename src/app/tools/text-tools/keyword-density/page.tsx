import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import KeywordDensityClient from "./KeywordDensityClient";

export const metadata: Metadata = {
  title: "Keyword Density Checker - SEO Keyword Frequency | MultiTool",
  description: "Check how often a keyword appears in your text as a percentage of all words, with a top-words frequency table. Free SEO tool.",
  keywords: ["keyword density", "keyword density checker", "seo keyword", "keyword frequency", "word frequency counter"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/keyword-density",
  },
  openGraph: {
    title: "Keyword Density Checker - SEO Keyword Frequency | MultiTool",
    description: "Check how often a keyword appears in your text as a percentage of all words, with a top-words frequency table. Free SEO tool.",
    url: "https://multitoolbox.online/tools/text-tools/keyword-density",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyword Density Checker - SEO Keyword Frequency | MultiTool",
    description: "Check how often a keyword appears in your text as a percentage of all words, with a top-words frequency table. Free SEO tool.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Keyword Density Checker - SEO Keyword Frequency | MultiTool"
      description="Check how often a keyword appears in your text as a percentage of all words, with a top-words frequency table. Free SEO tool."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="keyword-density"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste your text and type a keyword. The tool counts total words, keyword occurrences and density percentage (with an ideal 0.5-3% indicator), plus a frequency table of the 10 most common words in your text.
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
        { question: "What is keyword density?", answer: "The percentage of times a keyword appears relative to the total word count: (occurrences / total words) x 100." },
        { question: "What is the ideal density?", answer: "Most SEO guides recommend 0.5% to 3%. Higher can look like keyword stuffing to Google." },
        { question: "Does it count partial matches?", answer: "It counts exact matches of the keyword (including phrases) in the text." },
        { question: "Should I optimize for density?", answer: "Write naturally first — density is a diagnostic, not a target. Over-optimizing hurts readability." },
        { question: "What is the top words table?", answer: "The 10 most frequent words in your text with counts and percentages — useful to spot accidental repetition." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Readability Checker", href: "/tools/text-tools/readability-checker" },
        { name: "Text Diff Checker", href: "/tools/text-tools/text-diff" },
        { name: "Slug Generator", href: "/tools/text-tools/slug-generator" },
      ]}
    >
      <KeywordDensityClient />
    </ToolLayout>
  );
}
