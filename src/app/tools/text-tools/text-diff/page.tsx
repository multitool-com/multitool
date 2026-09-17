import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TextDiffClient from "./TextDiffClient";

export const metadata: Metadata = {
  title: "Text Diff Checker - Compare Texts Side by Side | MultiTool",
  description: "Compare two texts and see exactly what changed: added lines in green, removed lines in red. Side-by-side or unified view.",
  keywords: ["text diff", "compare text", "diff checker", "text comparison", "line diff tool"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/text-diff",
  },
  openGraph: {
    title: "Text Diff Checker - Compare Texts Side by Side | MultiTool",
    description: "Compare two texts and see exactly what changed: added lines in green, removed lines in red. Side-by-side or unified view.",
    url: "https://www.multitoolbox.online/tools/text-tools/text-diff",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Checker - Compare Texts Side by Side | MultiTool",
    description: "Compare two texts and see exactly what changed: added lines in green, removed lines in red. Side-by-side or unified view.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Text Diff Checker - Compare Texts Side by Side | MultiTool"
      description="Compare two texts and see exactly what changed: added lines in green, removed lines in red. Side-by-side or unified view."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="text-diff"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste the original and the modified text. The tool runs a line-level diff algorithm and highlights additions in green and removals in red, with statistics on how many lines changed.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to read a diff
          </h2>
          <p className="mb-4">
            A diff compares two texts line by line and shows what changed.
            Two views help different jobs:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Side-by-side</strong> — best for revisions and proofreading: original left, new right, eye catches movement.</li>
            <li><strong>Unified</strong> — best for code review: one stream with − removed and + added lines.</li>
            <li><strong>Ignore whitespace/case</strong> when you care about content, not formatting — avoids false positives from re-indentation.</li>
            <li><strong>Classic uses:</strong> contract versions, changelogs, homework before/after, detecting accidental edits in configs.</li>
          </ul>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Diff thinking: a skill disguised as a tool
          </h2>
          <p className="mb-4">
            Reading a diff quickly is a genuine professional skill —
            lawyers compare contracts, editors compare drafts, developers
            review code, and analysts compare exported reports. The
            discipline is the same:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Scan for moved blocks first:</strong> most “changes” are text that traveled. Ignore position, hunt for what actually appeared or vanished.</li>
            <li><strong>Small words carry the risk:</strong> contracts are won and lost on “may” vs “shall”, “within 5 days” vs “within five (5) business days”. Zoom into single-word changes.</li>
            <li><strong>Numbers deserve a second pass:</strong> dates, amounts, quantities — read digits character by character; 2026 vs 2028 is the diff your eye loves to skip.</li>
            <li><strong>Clean both texts first:</strong> paste plain text (not from formatted PDFs) so line breaks and quote marks don&apos;t flood the diff with fake changes.</li>
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
        { question: "How does the diff work?", answer: "It uses the classic longest-common-subsequence algorithm on lines, the same technique behind git's diff." },
        { question: "What do the colors mean?", answer: "Green = added lines, red = removed lines, plain = unchanged. In side-by-side mode, one side is dimmed where the other changed." },
        { question: "What is unified view?", answer: "A single list where every change is shown inline with + and - markers — like a patch file." },
        { question: "Can I compare large texts?", answer: "Yes — the tool handles hundreds of lines without trouble." },
        { question: "Is my text stored anywhere?", answer: "No — everything stays in your browser." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Keyword Density Checker", href: "/tools/text-tools/keyword-density" },
        { name: "Slug Generator", href: "/tools/text-tools/slug-generator" },
      ]}
    >
      <TextDiffClient />
    </ToolLayout>
  );
}
