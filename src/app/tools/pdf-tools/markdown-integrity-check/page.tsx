import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import MarkdownIntegrityClient from "./MarkdownIntegrityClient";
import { toolRobots } from "@/lib/indexing";

export const metadata: Metadata = {
  robots: toolRobots("markdown-integrity-check"),
  title: "Markdown Integrity Check - Compare PDF and Markdown | MultiTool",
  description:
    "Compare the original PDF with an edited Markdown file and see exactly which sentences, numbers, headings and figures went missing. Free, private, runs in your browser.",
  keywords: [
    "compare pdf and markdown",
    "markdown integrity check",
    "did markdown lose content",
    "pdf markdown diff",
    "check markdown missing text",
    "verify pdf conversion",
    "content loss checker",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/markdown-integrity-check",
  },
  openGraph: {
    title: "Markdown Integrity Check — PDF vs Markdown | MultiTool",
    description: "Find out what an edit dropped, without re-reading the whole document.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/markdown-integrity-check",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Integrity Check",
    description:
      "Missing sentences, changed numbers, lost figures — found before you publish.",
  },
};

export default function MarkdownIntegrityCheckPage() {
  return (
    <ToolLayout
      title="Markdown Integrity Check"
      description="Drop the original PDF and the edited Markdown: you get a line-by-line verdict of what survived, what was reworded and what disappeared — including numbers and figure references. No reading the whole document again."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="markdown-integrity-check"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            The problem this tool solves
          </h2>
          <p className="mb-4">
            Converting a PDF to Markdown and then asking an editor, a template or an
            AI assistant to &ldquo;just reorganise the layout&rdquo; is the fastest way to publish
            study material. It is also the fastest way to lose a paragraph, a
            percentage or a figure nobody notices until a student asks about it.
            Proofreading page by page does not scale, and a plain text diff is
            useless once headings become bold lines and lists become tables.
          </p>
          <p className="mb-4">
            This checker compares the <strong>content</strong>, not the formatting:
            it ignores case, accents, quotes, dashes, list markers, table pipes and
            section order, and reports what a reader would actually miss.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What is verified
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Text units:</strong> every sentence, list item and heading of
              the original is looked up in the edited file, word by word. Units
              where wording changed are reported separately with the missing words,
              so you can judge whether it was a rewrite or a deletion.
            </li>
            <li>
              <strong>Numbers:</strong> values are compared as numbers, not as text —
              <code className="font-mono bg-paper px-1 rounded">1.240</code>,{" "}
              <code className="font-mono bg-paper px-1 rounded">1240</code> and{" "}
              <code className="font-mono bg-paper px-1 rounded">336,0</code> versus{" "}
              <code className="font-mono bg-paper px-1 rounded">336</code> are the
              same figure written differently, while{" "}
              <code className="font-mono bg-paper px-1 rounded">96,4%</code> turning
              into <code className="font-mono bg-paper px-1 rounded">96%</code> is a
              real change and gets flagged.
            </li>
            <li>
              <strong>Headings:</strong> a section that was renamed or dropped
              appears in its own list, even if its text moved elsewhere.
            </li>
            <li>
              <strong>Figures:</strong> embedded raster images are counted per page
              in the original PDF and compared with the image references
              (<code className="font-mono bg-paper px-1 rounded">![…](…)</code> and{" "}
              <code className="font-mono bg-paper px-1 rounded">&lt;img&gt;</code>) in
              the Markdown.
            </li>
            <li>
              <strong>Additions:</strong> extra words in the edited file are counted
              but never penalised — layout wrappers, captions and navigation are
              normal.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The workflow it was built for
          </h2>
          <ol className="mb-4 list-decimal pl-5 space-y-1.5">
            <li>Convert the PDF with our PDF to Markdown tool and keep that file as the baseline.</li>
            <li>
              Let the layout be reworked — another editor, another template, another
              tool.
            </li>
            <li>
              Run this check: original PDF against the reworked Markdown. Fix what
              appears in red, and repeat until the verdict is INTACT.
            </li>
            <li>
              Stash the downloaded report next to the project so the next revision
              starts from a known-good state.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Honest limits
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Images cannot be compared, only counted.</strong> No text
              comparison can tell whether a chart was replaced by a different chart.
              For illustrated material, keep the original PDF open (or export its
              pages with <Link href="/tools/pdf-tools/pdf-to-images" className="text-accent-deep underline underline-offset-2">PDF to Images</Link>) and do a visual pass on the pages that contain figures.
            </li>
            <li>
              <strong>Charts drawn as vector graphics are not counted.</strong> They
              are indistinguishable from table borders in the file format; the tool
              says when a document has no raster figures so you know the count is not
              the whole story.
            </li>
            <li>
              <strong>Rewording is not loss.</strong> A sentence that was rewritten
              appears under &ldquo;Reworded&rdquo; with the words that disappeared — the
              decision to accept it is yours, which is why it is not scored as
              missing.
            </li>
            <li>
              <strong>Scanned PDFs have nothing to compare.</strong> If the original
              has no text layer, OCR it first.
            </li>
            <li>
              <strong>Very long documents:</strong> the comparison is instant, but
              review the lists from the top — the first missing item is usually the
              one that matters.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Both files are read and compared inside your browser. Nothing is
            uploaded, stored or logged — which matters when the material is
            unpublished course content, a contract or an internal report. The tool
            keeps working offline once the page has loaded.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I check if my Markdown lost any content?",
          answer:
            "Choose the original PDF as the baseline and the edited .md as the candidate, then click Check Integrity. You get a verdict, a recovery percentage and explicit lists of missing text, reworded sentences, changed numbers, renamed headings and unreferenced figures.",
        },
        {
          question: "Does it compare the formatting too?",
          answer:
            "No — and that is on purpose. Reformatting is exactly what a layout rework changes: headings become bold paragraphs, lists become tables, lines get rewrapped. The checker normalises case, accents, quotes, dashes, list markers, pipes and section order, then verifies that the content itself survived.",
        },
        {
          question: "Can it confirm that my images and charts are intact?",
          answer:
            "It counts the embedded raster figures in the PDF and compares that with the image references in the Markdown, so you know if any figure was left behind. What no automatic check can do is tell whether a chart was replaced by a different chart — for that, compare the pages visually. The tool tells you which pages contain figures so the manual pass takes seconds.",
        },
        {
          question: "It says a sentence is 'reworded'. Is that a problem?",
          answer:
            "Not necessarily. A rewrite that keeps the meaning is fine; the report shows which words of the original are gone so you can decide. Deletions appear separately as missing text, because nothing replaced them.",
        },
        {
          question: "Can I compare two Markdown files instead of a PDF?",
          answer:
            "Yes. Use the baseline button to load an earlier .md or .txt as the reference — the ideal baseline is the file produced by the PDF to Markdown converter, before the layout was reworked. Everything else works the same way.",
        },
        {
          question: "Is my document uploaded anywhere?",
          answer:
            "No. The PDF is parsed with the pdf.js engine inside your browser and the edited file is read locally, so unpublished course material, contracts and internal reports stay on your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF to Markdown", href: "/tools/pdf-tools/pdf-to-markdown" },
        { name: "Markdown to PDF", href: "/tools/pdf-tools/markdown-to-pdf" },
        { name: "PDF to Images", href: "/tools/pdf-tools/pdf-to-images" },
        { name: "Text Diff", href: "/tools/text-tools/text-diff" },
      ]}
    >
      <MarkdownIntegrityClient />
    </ToolLayout>
  );
}
