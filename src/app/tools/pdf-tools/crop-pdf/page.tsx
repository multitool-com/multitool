import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CropPdfClient from "./CropPdfClient";

export const metadata: Metadata = {
  title: "Crop PDF Margins Online - Trim Page Edges | MultiTool",
  description:
    "Trim PDF margins by percentage — cut white borders from scanned pages and exports, on every page or a range. Free, private, no upload, no watermark.",
  keywords: [
    "crop pdf",
    "trim pdf margins",
    "cut pdf edges",
    "remove pdf white borders",
    "pdf page crop online",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/crop-pdf",
  },
  openGraph: {
    title: "Crop PDF Margins Online | MultiTool",
    description: "Trim PDF page edges — free, private, no upload.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/crop-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop PDF Margins",
    description: "Cut white borders from PDFs — in your browser.",
  },
};

export default function CropPdfPage() {
  return (
    <ToolLayout
      title="Crop PDF"
      description="Trim margins from PDF pages — cut the white borders of scanned pages, oversized exports and off-center documents, by percentage, on every page at once."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="crop-pdf"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Cropping a PDF without touching its content
          </h2>
          <p className="mb-4">
            PDF cropping sets the <strong>crop box</strong> — the rectangle
            readers and printers use as the visible page. The content stays
            in the file, intact and selectable; you are redefining the
            window, not cutting pixels. That is why cropping is reversible
            in editors and safe for text.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Percentage, per side:</strong> margins are trimmed as a percentage of page dimensions — 10% left + 10% right narrows an A4 into a comfortable reading column.</li>
            <li><strong>Uniform look:</strong> the same values apply to every page, keeping the document visually consistent — the fix for scanner beds and phone-scan apps that leave uneven borders.</li>
            <li><strong>Content is never rescaled:</strong> unlike a resize, the text size stays exactly as the author set it; only the window changes.</li>
            <li><strong>Reading on screens:</strong> trimming generous margins of A4 documents makes text larger on e-readers and tablets — the poor man&apos;s reflow.</li>
            <li><strong>Print margins stay sane:</strong> if you plan to print the cropped file, keep at least 5% margins so home printers do not clip the edges.</li>
          </ul>
          <p className="mb-4">
            Use cases: scanned books with black or white edges, presentation
            exports with huge margins, forms printed off-center, and
            documents destined for small screens.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The crop is applied locally with pdf-lib in your browser. Your
            PDF is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I remove white margins from a PDF?",
          answer:
            "Select your PDF, set the margin percentages per side (5–10% usually cleans scanner borders), and download. Every page gets the same trim, keeping the document consistent.",
        },
        {
          question: "Does cropping delete the content in the margins?",
          answer:
            "The content becomes hidden, not deleted — the crop box defines what readers and printers show. Editors can restore it; for recipients, it is gone from view, which is the goal.",
        },
        {
          question: "What is the difference between cropping and resizing a PDF?",
          answer:
            "Cropping changes the visible window (content stays at its original size); resizing changes the page dimensions and scales content to fit. Crop to remove borders; resize to change paper size.",
        },
        {
          question: "Can I crop just some pages?",
          answer:
            "The tool applies one setting to all pages — the right default for scans and exports. For a single odd page, extract it (PDF Split), crop, and merge back.",
        },
        {
          question: "Why do my cropped pages still print with borders?",
          answer:
            "Printers have a physical unprintable area (usually ~5mm). Keep at least 5% margins when the file is destined for paper, or use the print dialog's 'fit to page' option.",
        },
        {
          question: "Will cropping make the text bigger on my tablet?",
          answer:
            "Effectively yes — trimming margins lets the same screen show the text area larger. For heavy reading, cropping A4 articles by 10–15% per side noticeably reduces zooming.",
        },
      ]}
      relatedTools={[
        { name: "PDF Split / Extract Pages", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
        { name: "PDF Compress", href: "/tools/pdf-tools/pdf-compress" },
      ]}
    >
      <CropPdfClient />
    </ToolLayout>
  );
}
