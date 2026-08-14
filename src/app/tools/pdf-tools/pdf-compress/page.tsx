import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfCompressClient from "./PdfCompressClient";

export const metadata: Metadata = {
  title: "Compress PDF - Reduce PDF Size Online Free | MultiTool",
  description:
    "Free PDF compressor. Reduce the file size of a PDF by re-encoding pages as optimized images. Adjust quality and resolution. 100% in your browser, no upload.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "pdf compressor",
    "shrink pdf",
    "smaller pdf",
    "compress pdf online",
    "pdf size reducer",
    "compress pdf free",
    "make pdf smaller",
    "comprimir pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-compress",
  },
  openGraph: {
    title: "Compress PDF - Reduce PDF Size | MultiTool",
    description:
      "Reduce PDF file size in your browser. Adjust quality and resolution. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-compress",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF - Free & Instant",
    description: "Reduce PDF size in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Compress"
      description="Reduce the file size of a PDF by re-encoding each page as an optimized image. Choose the quality and resolution, then download the smaller file."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-compress"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How does compression work here?
          </h2>
          <p className="mb-4">
            The tool renders every page with a PDF engine (pdf.js) and
            re-saves it as an optimized <strong>JPEG image</strong> inside a
            new PDF. That is very effective for <strong>scanned documents
            and photo PDFs</strong> — usually 50–90% smaller — because the
            images are re-compressed.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Important trade-off
          </h2>
          <p className="mb-4">
            Because pages become images, <strong>text is no longer
            selectable or searchable</strong> in the compressed file. For
            text-only documents (a Word export, for example) this method can
            even make the file <strong>bigger</strong> — it shines on PDFs
            with photos and scans. The tool always shows the percentage, so
            you can compare before downloading.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Move the quality slider (lower = smaller file).</li>
            <li>Optionally reduce the resolution to shrink it further.</li>
            <li>Click <strong>COMPRESS &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Quality vs size
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Quality 70–80</strong> — great balance for sharing.
            </li>
            <li>
              <strong>Quality 40–60</strong> — smaller, fine for archives
              and email attachments.
            </li>
            <li>
              <strong>Resolution 0.5×</strong> — halves the pixel size;
              combined with quality 50 it shrinks scans dramatically.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Compression runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Why is the text not selectable in the compressed PDF?",
          answer:
            "This method re-renders each page as an image, so the text layer is lost. It is the trade-off for a much smaller file. For documents where you need selectable text, keep the original and only compress copies.",
        },
        {
          question: "Does it work on scanned PDFs?",
          answer:
            "Yes — that is the best use case. Scanned pages are already images, so re-compressing them as optimized JPEGs usually cuts the size by 50–90% with little visible loss.",
        },
        {
          question: "Why did my file get bigger?",
          answer:
            "PDFs that are mostly text (like a Word export) are already very compact. Converting them to images adds pixels, so the result can be larger. The tool shows the percentage — just don't download if it grew.",
        },
        {
          question: "What do the quality and resolution controls do?",
          answer:
            "Quality (10–100) sets the JPEG compression of every page — lower is smaller and slightly softer. Resolution scales the pixel size of each page: 1× keeps it, 0.5× halves it, which shrinks scans a lot.",
        },
        {
          question: "Can I compress a password-protected PDF?",
          answer:
            "No. Remove the password first with our PDF Unlock tool (you need the password), then compress the unlocked file.",
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
        { name: "PDF Unlock", href: "/tools/pdf-tools/pdf-unlock" },
        { name: "Images to PDF", href: "/tools/pdf-tools/images-to-pdf" },
      ]}
    >
      <PdfCompressClient />
    </ToolLayout>
  );
}
