import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfNumberPagesClient from "./PdfNumberPagesClient";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF - Number PDF Pages Online Free | MultiTool",
  description:
    "Free tool to add page numbers to a PDF. Choose the position (bottom center, bottom right, top), starting number, font size and prefix. 100% in your browser, no upload.",
  keywords: [
    "add page numbers to pdf",
    "number pdf pages",
    "pdf page numbers",
    "add page numbers pdf",
    "page number tool",
    "insert page numbers pdf",
    "pdf page numbering",
    "numerar pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-number-pages",
  },
  openGraph: {
    title: "Add Page Numbers to PDF | MultiTool",
    description:
      "Add page numbers to any PDF in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-number-pages",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Page Numbers to PDF - Free & Instant",
    description: "Number PDF pages in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Number Pages"
      description="Add page numbers to a PDF — choose the position, starting number, size and prefix. The numbers are drawn on every page as text."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-number-pages"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does this tool do?
          </h2>
          <p className="mb-4">
            It draws a page number on every page of your PDF — for example{" "}
            <code className="bg-paper px-1 rounded">1, 2, 3…</code> or{" "}
            <code className="bg-paper px-1 rounded">Page 1 of 10</code>.
            The numbers are added as text, so they stay crisp and selectable.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Choose the position, starting number and size.</li>
            <li>Optionally add a prefix (e.g. "Page") and total.</li>
            <li>Click <strong>ADD NUMBERS &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Options explained
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Start at</strong> — the first page's number (default
              1; use 0 for covers).
            </li>
            <li>
              <strong>Prefix / Suffix</strong> — e.g. "Page " before and " of
              10" after the number.
            </li>
            <li>
              <strong>Include total</strong> — shows "3 of 10" style
              numbering.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Numbering runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I choose where the numbers appear?",
          answer:
            "Yes. Choose bottom center, bottom right, top center or top right. Bottom center is the classic book style; bottom right is common for reports.",
        },
        {
          question: "Can I start numbering from a specific number?",
          answer:
            "Yes. The 'start at' option lets you begin at any number — useful for documents with a cover where the first numbered page should be 1 even if it's page 3 of the file.",
        },
        {
          question: "Can I show 'Page X of Y'?",
          answer:
            "Yes. Turn on 'include total' and the numbers show as '3 of 10'. You can also add a prefix (e.g. 'Page') and suffix text.",
        },
        {
          question: "Does numbering change the content?",
          answer:
            "No. The numbers are drawn over a copy as text — the original content stays intact and selectable. The original file is never modified.",
        },
        {
          question: "My file shows an error — why?",
          answer:
            "The tool cannot read password-protected or corrupted PDFs. Remove the password first with PDF Unlock and try again.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the file never leaves your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Reorder", href: "/tools/pdf-tools/pdf-reorder" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
        { name: "PDF Watermark", href: "/tools/pdf-tools/pdf-watermark" },
      ]}
    >
      <PdfNumberPagesClient />
    </ToolLayout>
  );
}
