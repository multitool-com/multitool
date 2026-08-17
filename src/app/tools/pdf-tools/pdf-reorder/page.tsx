import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfReorderClient from "./PdfReorderClient";

export const metadata: Metadata = {
  title: "Reorder PDF - Organize & Remove PDF Pages Online Free | MultiTool",
  description:
    "Free PDF page organizer. Reorder pages with up/down arrows, remove pages you don't need, and download the new PDF. 100% in your browser, no upload.",
  keywords: [
    "reorder pdf pages",
    "pdf page organizer",
    "remove pages from pdf",
    "delete pdf pages",
    "reorder pdf",
    "organize pdf pages",
    "pdf page order",
    "remove page from pdf",
    "pdf rearrange",
    "reorganizar pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-reorder",
  },
  openGraph: {
    title: "Reorder PDF - Organize & Remove Pages | MultiTool",
    description:
      "Reorder PDF pages and remove unwanted ones in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-reorder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reorder PDF - Free & Instant",
    description: "Organize PDF pages in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Reorder / Remove Pages"
      description="Reorder the pages of a PDF and remove the ones you don't need. See the page list, move pages with the arrows, and download the organized document."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-reorder"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does this tool do?
          </h2>
          <p className="mb-4">
            It lets you <strong>reorder</strong> the pages of a PDF (move a
            page up or down) and <strong>remove</strong> the pages you don't
            want — then saves a new PDF with the new page order. The
            original file is never touched.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Use the arrows to move pages up or down.</li>
            <li>Click the ✕ on pages you want to remove.</li>
            <li>Click <strong>REORDER &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Removing pages
          </h2>
          <p className="mb-4">
            Click the <strong>✕</strong> next to a page to remove it from
            the list. Removed pages are not in the downloaded file — useful
            for dropping blank pages, covers or annexes. You can always
            reload the original file to start over.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Reordering runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I move a page to the beginning or end?",
          answer:
            "Yes — use the up and down arrows repeatedly to move any page anywhere in the order. Each arrow click moves the page one position.",
        },
        {
          question: "How do I remove a page?",
          answer:
            "Click the ✕ button next to the page in the list. It disappears from the list and will not be in the downloaded file. Reload the original to bring it back.",
        },
        {
          question: "Does reordering change the content of the pages?",
          answer:
            "No. The pages are copied in the new order without modification — text, images, links and quality are exactly the same.",
        },
        {
          question: "Can I remove the first or last page?",
          answer:
            "Yes. The ✕ works on any page, including the first and last ones. Removing a cover page before the title page is a common use.",
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
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
        { name: "PDF Watermark", href: "/tools/pdf-tools/pdf-watermark" },
      ]}
    >
      <PdfReorderClient />
    </ToolLayout>
  );
}
