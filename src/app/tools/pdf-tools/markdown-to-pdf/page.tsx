import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MarkdownPdfClient from "./MarkdownPdfClient";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter Online - Clean & Selectable | MultiTool",
  description:
    "Convert Markdown to PDF with real selectable text: headings, lists, bold, code and links rendered on clean A4 pages. Free, private, no upload.",
  keywords: [
    "markdown to pdf",
    "md to pdf online",
    "convert markdown",
    "markdown pdf converter",
    "readme to pdf",
    "markdown document export",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/markdown-to-pdf",
  },
  openGraph: {
    title: "Markdown to PDF Converter Online | MultiTool",
    description: "Clean, selectable-text PDFs from Markdown — in your browser.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/markdown-to-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to PDF",
    description: "Clean selectable-text PDFs — free, private, no upload.",
  },
};

export default function MarkdownToPdfPage() {
  return (
    <ToolLayout
      title="Markdown to PDF"
      description="Turn Markdown into a clean, selectable-text PDF — headings, lists, bold, code and links on proper A4 pages. The missing bridge between your notes and the world that speaks PDF."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="markdown-to-pdf"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why Markdown-to-PDF is the quiet workhorse of the AI era
          </h2>
          <p className="mb-4">
            Markdown became the default format of technical writing — READMEs,
            documentation, AI outputs, meeting notes — while the business
            world still runs on PDF. This converter builds the bridge: your{" "}
            <code className="font-mono bg-paper px-1 rounded"># headings</code>,{" "}
            <code className="font-mono bg-paper px-1 rounded">- lists</code> and{" "}
            <code className="font-mono bg-paper px-1 rounded">**emphasis**</code>{" "}
            become a real PDF with <strong>selectable, searchable text</strong>{" "}
            — not screenshots of text.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>What is rendered:</strong> H1–H3 headings (scaled hierarchy), bullet and numbered lists, bold/italic inline emphasis, fenced code blocks (monospace on soft background), horizontal rules and paragraph flow with word wrapping.</li>
            <li><strong>Selectable by construction:</strong> text is embedded as genuine PDF text — copyable, searchable and readable by screen readers.</li>
            <li><strong>Automatic pagination:</strong> content flows across A4 pages with consistent margins; headings never get orphaned at page bottoms.</li>
            <li><strong>Honest limitation:</strong> tables and images are simplified out of this renderer (kept as formatted text blocks) — for pixel-perfect layouts, print-to-PDF from a browser remains the artisanal route.</li>
            <li><strong>The reverse trip exists too:</strong> need to go the other way? That is PDF-to-text territory — see our PDF tools family.</li>
          </ul>
          <p className="mb-4">
            Use cases: shipping documentation to non-technical stakeholders,
            archiving meeting notes, turning AI-drafted content into
            shareable briefs, and delivering homework or reports with the
            formatting intact.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The PDF is typeset locally in your browser. Your Markdown is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert Markdown to PDF for free?",
          answer:
            "Paste (or load) your Markdown, click Convert, download the PDF. Real A4 pages, selectable text, no signup, no watermark — everything happens in your browser.",
        },
        {
          question: "Is the text in the PDF selectable?",
          answer:
            "Yes — the text is embedded as genuine PDF fonts, so you can select, copy and search it. That is the difference between a rendered document and a screenshot.",
        },
        {
          question: "Which Markdown features are supported?",
          answer:
            "Headings (H1–H3 and deeper as styled text), bullet and numbered lists, bold and italic, inline code and fenced code blocks, horizontal rules, links (as visible text) and paragraphs with proper wrapping. Tables and images are simplified — that is the honest trade-off of a browser-side renderer.",
        },
        {
          question: "Why not just print-to-PDF from a Markdown viewer?",
          answer:
            "That works for one-offs. This tool is faster for repeated conversions (paste → download), produces consistent margins and typography every time, and never requires installing anything or pasting private content into online editors.",
        },
        {
          question: "Can I convert very long documents?",
          answer:
            "Yes — pagination is automatic and handles dozens of pages. Very long code blocks split cleanly across page breaks.",
        },
        {
          question: "What page size does it use?",
          answer:
            "A4 with comfortable margins — the standard for documents in most of the world. Content scales to the page width with hierarchy preserved.",
        },
      ]}
      relatedTools={[
        { name: "Markdown to HTML", href: "/tools/developer-tools/markdown-to-html" },
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Metadata Editor", href: "/tools/pdf-tools/pdf-metadata" },
        { name: "PDF Compress", href: "/tools/pdf-tools/pdf-compress" },
      ]}
    >
      <MarkdownPdfClient />
    </ToolLayout>
  );
}
