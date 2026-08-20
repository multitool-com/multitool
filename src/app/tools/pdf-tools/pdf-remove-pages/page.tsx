import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfRemovePagesClient from "./PdfRemovePagesClient";

export const metadata: Metadata = {
  title: "Remove Pages from PDF - Delete PDF Pages Online | MultiTool",
  description:
    "Delete pages from a PDF online — select pages to remove or keep, download the result instantly. Free, private, no upload, no watermark.",
  keywords: [
    "remove pages from pdf",
    "delete pdf pages",
    "pdf page remover",
    "cut pdf pages",
    "remove pdf page",
    "erase pages pdf",
    "pdf deleter",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-remove-pages",
  },
  openGraph: {
    title: "Remove Pages from PDF - Delete PDF Pages Online | MultiTool",
    description: "Delete unwanted pages from PDFs in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-remove-pages",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Pages from PDF",
    description: "Delete PDF pages online — private, free, no upload.",
  },
};

export default function PdfRemovePagesPage() {
  return (
    <ToolLayout
      title="Remove Pages from PDF"
      description="Delete the pages you don't want — blank pages, ads, old drafts. Type pages and ranges, or flip to keep-only mode, and download the clean PDF."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-remove-pages"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How page removal works
          </h2>
          <p className="mb-4">
            Your PDF is loaded entirely in the browser. A new document is
            assembled with only the pages that survive your selection —
            nothing is re-encoded, so text stays sharp and selectable, forms
            and links keep working, and quality is unchanged.
          </p>
          <p className="mb-4">
            Two modes: <strong>Remove</strong> deletes the pages you list
            (e.g. <code>2,5,8-10</code>); <strong>Keep</strong> does the
            opposite — everything except the listed pages is dropped. Keep
            mode is ideal when you only want page 1–3 of a 40-page report.
          </p>
          <p className="mb-4">
            Limitations: encrypted/password-protected PDFs must be unlocked
            first (use our PDF Unlock). Pages are removed whole — for
            cutting a page range into a separate file, use PDF Split.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The PDF is processed locally in your browser. It is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I delete pages from a PDF for free?",
          answer:
            "Select your PDF, type the pages to remove (e.g. 1,3,7-9) and click Remove & Download. The new file is generated in your browser — free, no watermark, no signup.",
        },
        {
          question: "How do I keep only certain pages of a PDF?",
          answer:
            "Switch the mode to KEEP. Now type the pages you want (e.g. 1-3) and everything else is removed. Same one-click download.",
        },
        {
          question: "Does removing pages reduce PDF quality?",
          answer:
            "No. Pages are copied as-is into the new document — no re-compression, no rasterization. Text remains selectable and searchable.",
        },
        {
          question: "Can I remove pages from a password-protected PDF?",
          answer:
            "Encrypted PDFs must be unlocked first. Use our PDF Unlock tool, then remove pages from the unlocked copy.",
        },
        {
          question: "What's the difference between removing pages and splitting?",
          answer:
            "Removing deletes unwanted pages and gives you one smaller file. Splitting cuts a PDF into several files (one per page or per range). If you want page 5 saved as its own document, use PDF Split; if you want page 5 gone, use this tool.",
        },
        {
          question: "Is my document private?",
          answer:
            "Yes — this is the core of MultiTool. The PDF never leaves your device; the whole operation runs client-side in the browser.",
        },
      ]}
      relatedTools={[
        { name: "PDF Split / Extract Pages", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Reorder / Remove Pages", href: "/tools/pdf-tools/pdf-reorder" },
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfRemovePagesClient />
    </ToolLayout>
  );
}
