import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfSplitClient from "./PdfSplitClient";

export const metadata: Metadata = {
  title: "Split PDF - Extract Pages from PDF Online Free | MultiTool",
  description:
    "Free PDF splitter. Extract specific pages or ranges from a PDF, split into single pages, or divide into chunks of N pages. Download as PDF or ZIP. 100% in your browser.",
  keywords: [
    "split pdf",
    "extract pages from pdf",
    "pdf page extractor",
    "split pdf online",
    "extract pdf pages",
    "remove pages from pdf",
    "split pdf into pages",
    "pdf splitter",
    "extract page from pdf",
    "divide pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-split",
  },
  openGraph: {
    title: "Split PDF - Extract Pages | MultiTool",
    description:
      "Extract pages or split a PDF into multiple files. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-split",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF - Free & Instant",
    description: "Extract pages from a PDF in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Split / Extract Pages"
      description="Extract specific pages or ranges from a PDF, split it into single pages, or divide it into chunks of N pages. Download the result as a PDF or a ZIP."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-split"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What can I do with this tool?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Extract pages</strong> — pick exactly the pages you
              need (e.g. <code className="bg-paper px-1 rounded">1,3,5-8</code>)
              and save them as one new PDF.
            </li>
            <li>
              <strong>Split into single pages</strong> — every page becomes
              its own PDF, delivered as a ZIP.
            </li>
            <li>
              <strong>Split into ranges</strong> — divide the document into
              chunks of N pages (e.g. 5 pages per file).
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Pick a mode: extract, single pages or ranges.</li>
            <li>Enter the pages or chunk size and click the action button.</li>
            <li>Open the downloaded PDF — or unzip the ZIP to see all files.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Page ranges, explained
          </h2>
          <p className="mb-4">
            Write pages separated by commas, and use a dash for a range:{" "}
            <code className="bg-paper px-1 rounded">1,3,5-8</code> means pages
            1, 3, 5, 6, 7 and 8. The order you type is kept in the output,
            so <code className="bg-paper px-1 rounded">5-8,1</code> puts page
            5 first. Out-of-range numbers are rejected with a clear warning.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I extract specific pages?",
          answer:
            "Choose the Extract mode and type the pages, e.g. 1,3,5-8 for pages 1, 3, 5, 6, 7 and 8. The result is one PDF with those pages in the order you typed.",
        },
        {
          question: "Can I split every page into its own PDF?",
          answer:
            "Yes. The 'Single pages' mode creates one PDF per page and packages everything into a ZIP file, so you download a single file and unzip it on your device.",
        },
        {
          question: "What does 'split into ranges of N' mean?",
          answer:
            "It divides the document into consecutive chunks of N pages. A 20-page PDF split into ranges of 5 becomes 4 files of 5 pages each, delivered as a ZIP.",
        },
        {
          question: "Can I remove pages from a PDF?",
          answer:
            "Not directly, but extracting is the same thing in reverse: type the pages you want to KEEP (e.g. 1-3,7) and download — the rest is effectively removed in the new file.",
        },
        {
          question: "My file shows an error — why?",
          answer:
            "The tool cannot read password-protected or corrupted PDFs. Remove the password first and try again.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. The split happens entirely in your browser — the file never leaves your device. Safe for contracts and personal documents.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "Images to PDF", href: "/tools/pdf-tools/images-to-pdf" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfSplitClient />
    </ToolLayout>
  );
}
