import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfMergeClient from "./PdfMergeClient";

export const metadata: Metadata = {
  title: "Merge PDF - Combine PDF Files Online Free | MultiTool",
  description:
    "Free PDF merger. Combine multiple PDF files into one document in seconds, keeping your page order. No upload, no sign-up — 100% in your browser.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf",
    "pdf merger",
    "merge pdf online",
    "combine pdf files",
    "merge pdf free",
    "combine pdfs",
    "merge multiple pdf",
    "pdf merge tool",
    "juntar pdf",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-merge",
  },
  openGraph: {
    title: "Merge PDF - Combine PDF Files | MultiTool",
    description:
      "Join multiple PDFs into one file in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-merge",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF - Free & Instant",
    description: "Combine PDF files in your browser. No upload, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Merge"
      description="Combine two or more PDF files into a single document. Add files in the order you want, reorder them freely, and download the merged PDF."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-merge"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does merging a PDF do?
          </h2>
          <p className="mb-4">
            Merging appends the pages of several PDF files into one new
            document — useful for combining scans, chapters, invoices or
            reports. Pages are copied without recompression, so the result
            keeps the same quality as the originals.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop PDF files or click “Choose files” (you can pick many at once).</li>
            <li>Check the list — use ↑ ↓ to reorder and ✕ to remove a file.</li>
            <li>Click <strong>MERGE &amp; DOWNLOAD</strong>.</li>
            <li>Open the downloaded merged file to confirm the order.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Order matters
          </h2>
          <p className="mb-4">
            The merged file follows the order of the list from top to
            bottom. Files are added in the order you select them — use the
            arrow buttons to fix the sequence before merging.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Merging runs entirely in your browser. Your PDFs are{" "}
            <strong>never sent to any server</strong> and never stored —
            safe for contracts, invoices and personal documents.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I merge more than two PDFs at once?",
          answer:
            "Yes, as many as you need. Use “Choose files” to select several at once, or drop them one after another — every added file appears in the list.",
        },
        {
          question: "Is the quality of the merged PDF reduced?",
          answer:
            "No. Pages are copied without recompression, so images and text keep their original quality. The final size is roughly the sum of the originals.",
        },
        {
          question: "My file shows an error — why?",
          answer:
            "The tool cannot read files that are password-protected or corrupted. Remove the password first (our PDF Protect/Unlock tools are coming soon) and try again.",
        },
        {
          question: "Are my files uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the PDFs never leave your device. This is why we don't need an account or a file limit.",
        },
        {
          question: "Does it work with scanned PDFs?",
          answer:
            "Yes. Scanned PDFs are images inside the document, and merging copies every page as-is, scanned or not.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "No hard limit — the only constraint is your browser's memory. Very large files take a little longer, but the merge itself runs locally.",
        },
      ]}
      relatedTools={[
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "Images to PDF", href: "/tools/pdf-tools/images-to-pdf" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfMergeClient />
    </ToolLayout>
  );
}
