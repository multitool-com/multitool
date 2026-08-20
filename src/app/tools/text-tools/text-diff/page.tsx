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
