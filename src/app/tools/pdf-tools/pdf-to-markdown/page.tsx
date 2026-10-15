import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import PdfToMarkdownClient from "./PdfToMarkdownClient";
import { toolRobots } from "@/lib/indexing";

export const metadata: Metadata = {
  robots: toolRobots("pdf-to-markdown"),
  title: "PDF to Markdown Converter Online - Free & Private | MultiTool",
  description:
    "Convert PDF to Markdown in your browser: real headings, bullet and numbered lists, fenced code blocks and clean paragraphs. No upload, no sign-up, no watermark.",
  keywords: [
    "pdf to markdown",
    "pdf to md",
    "convert pdf to markdown",
    "extract text from pdf",
    "pdf to markdown converter",
    "pdf to md online",
    "pdf text extractor",
    "pdf to markdown free",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-to-markdown",
  },
  openGraph: {
    title: "PDF to Markdown Converter Online | MultiTool",
    description: "Clean Markdown from any PDF — in your browser.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-to-markdown",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Markdown",
    description: "Headings, lists and code blocks back out of your PDFs — free.",
  },
};

export default function PdfToMarkdownPage() {
  return (
    <ToolLayout
      title="PDF to Markdown"
      description="Turn any PDF into editable Markdown — headings, lists, code blocks and paragraphs rebuilt from the page geometry. The return trip of our Markdown to PDF converter, done entirely in your browser."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-to-markdown"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why the reverse trip is harder
          </h2>
          <p className="mb-4">
            Markdown carries <em>meaning</em>: this line is a heading, that one
            is a list item, this block is code. A PDF carries only{" "}
            <strong>glyphs with coordinates</strong> — instructions like &ldquo;draw
            this 11pt Helvetica at x=56, y=712&rdquo;. There is no paragraph, no heading,
            no bullet list inside the file. That is why converting PDF to Markdown
            is a reconstruction job, not a lookup: this tool measures the geometry
            and rebuilds the structure it can prove, then tells you honestly what it
            could not.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Lines first:</strong> text fragments sharing a baseline are
              grouped into visual lines and ordered left to right, with spaces
              inferred from the gaps between fragments.
            </li>
            <li>
              <strong>Body size is measured, not assumed:</strong> the dominant font
              size is computed by character weight, so headings are detected as
              those lines that are visibly larger than the running text.
            </li>
            <li>
              <strong>Structure follows:</strong> bullet glyphs and numbered leads
              become real lists, monospace runs become fenced code, and short bold
              lines are treated as subheadings.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What makes the output editable
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Paragraphs are glued back together:</strong> PDFs break a
              sentence at every line, so wrapped lines are rejoined — including
              words split across lines with a hyphen (<code className="font-mono bg-paper px-1 rounded">docu-</code>{" "}
              <code className="font-mono bg-paper px-1 rounded">ment</code> becomes{" "}
              <code className="font-mono bg-paper px-1 rounded">document</code>).
            </li>
            <li>
              <strong>Code keeps its indentation:</strong> monospace lines are
              rebuilt on a character grid, so indentation and alignment survive
              instead of collapsing to a single space.
            </li>
            <li>
              <strong>Running heads and page numbers disappear:</strong> text
              repeated on every page (and standalone page numbers) is detected and
              dropped, so the document reads as one continuous text.
            </li>
            <li>
              <strong>Lists keep their numbering:</strong> an ordered list stays
              ordered with the numbers printed in the PDF, not a renumbered guess.
            </li>
            <li>
              <strong>Optional YAML front matter:</strong> switch it on to prepend
              title, source file name, page count and extraction date — handy for
              static site generators and knowledge bases.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Who needs PDF to Markdown
          </h2>
          <p className="mb-4">
            Markdown is the format that AI systems, documentations and note apps
            read best. Typical uses: migrating old reports into a docs repository,
            turning research papers into notes for Obsidian or Notion, preparing
            source material for RAG pipelines and LLM prompts, editing a contract or
            a syllabus you can only get as a PDF, and keeping version history of
            documents that arrive as email attachments.
          </p>
          <p className="mb-4">
            Reorganising the result somewhere else? Then run the{" "}
            <Link
              href="/tools/pdf-tools/markdown-integrity-check"
              className="text-accent-deep underline underline-offset-2"
            >
              Markdown Integrity Check
            </Link>{" "}
            afterwards: it compares this PDF with the rewritten Markdown and lists any
            sentence, number, heading or figure that disappeared.
          </p>

          <p className="mb-4">
            Going the other way? Our{" "}
            <Link
              href="/tools/pdf-tools/markdown-to-pdf"
              className="text-accent-deep underline underline-offset-2"
            >
              Markdown to PDF
            </Link>{" "}
            converter typesets Markdown into a clean A4 PDF with selectable text.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The honest limitations
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Scanned PDFs have no text to extract.</strong> If the file is a
              photo of a page, you need OCR — real OCR engines need a server or a
              desktop app, and we will not pretend the browser can do it well. The
              tool tells you when this happens.
            </li>
            <li>
              <strong>Tables come out as lines of text</strong>, not Markdown tables.
              Cell content is preserved; the grid is not rebuilt.
            </li>
            <li>
              <strong>Multi-column layouts can interleave.</strong> Reading order is
              inferred from geometry, so columns may need a light cleanup — turn off
              &ldquo;join wrapped lines&rdquo; for those documents.
            </li>
            <li>
              <strong>Images, links and form fields are not exported.</strong> This
              is a text-to-text converter, not a layout converter.
            </li>
            <li>
              <strong>Headings are a heuristic.</strong> Fonts without size contrast
              (or bold that is not detectable in the file) mean some headings arrive
              as plain paragraphs — the toggles exist so you can tune the result
              per document.
            </li>
            <li>
              <strong>Encrypted PDFs must be unlocked first</strong> — use our{" "}
              <Link
                href="/tools/pdf-tools/pdf-unlock"
                className="text-accent-deep underline underline-offset-2"
              >
                PDF Unlock
              </Link>{" "}
              tool, then convert.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Extraction runs entirely in your browser using the pdf.js engine. Your
            PDF is <strong>never uploaded, never stored and never logged</strong> —
            contracts, medical reports and internal documents stay on your device.
            Once the page is loaded, the conversion even works offline.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert a PDF to Markdown for free?",
          answer:
            "Choose one or more PDFs, pick your extraction options, click Extract Markdown, then download the .md file (or all files as a ZIP). No sign-up, no watermark, no page limit — everything happens in your browser.",
        },
        {
          question: "Why did my PDF come out as plain text without headings or lists?",
          answer:
            "That usually means the font sizes are uniform, or the file has no real text layer. If every line is the same size, there is nothing for the tool to measure, so it returns faithful plain text instead of inventing structure. Scanned PDFs need OCR before they reach this tool.",
        },
        {
          question: "Are tables converted into Markdown tables?",
          answer:
            "No, and we prefer to say it clearly. Cell content is extracted, but it arrives as lines of text with the columns separated by spaces. Rebuilding a reliable table grid from PDF geometry is possible only with heavy guessing, which would silently corrupt data. A text export you can clean up is more honest than a table that lies.",
        },
        {
          question: "Can it read scanned or image-only PDFs?",
          answer:
            "No. Those files contain pictures of text, not text. Optical character recognition (OCR) requires models far too large to run reliably inside a browser tab, so this tool detects the situation and tells you instead of producing empty output. Run an OCR step elsewhere, then bring the resulting PDF here.",
        },
        {
          question: "Is the output good enough for AI, RAG or documentation pipelines?",
          answer:
            "For digital-born PDFs (Word, Google Docs, LaTeX, InDesign exports) the result is clean, deterministic Markdown with headings kept as structure, which is exactly what retrieval pipelines want. YAML front matter can carry the source file name and page count. Review the first page or two before bulk-processing hundreds of files.",
        },
        {
          question: "Is my PDF uploaded to your servers?",
          answer:
            "Never. The pdf.js engine runs in your browser and the extraction code reads the file locally. Nothing is transmitted, stored or logged, which is why the tool also works offline after the page loads.",
        },
      ]}
      relatedTools={[
        { name: "Markdown Integrity Check", href: "/tools/pdf-tools/markdown-integrity-check" },
        { name: "Markdown to PDF", href: "/tools/pdf-tools/markdown-to-pdf" },
        { name: "PDF to Images", href: "/tools/pdf-tools/pdf-to-images" },
        { name: "PDF Unlock", href: "/tools/pdf-tools/pdf-unlock" },
      ]}
    >
      <PdfToMarkdownClient />
    </ToolLayout>
  );
}
