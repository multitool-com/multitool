import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfToImagesClient from "./PdfToImagesClient";

export const metadata: Metadata = {
  title: "PDF to Images - Convert PDF Pages to JPG PNG Online Free | MultiTool",
  description:
    "Free PDF to image converter. Convert every page of a PDF to JPG or PNG with adjustable quality and resolution. Download all pages as a ZIP. 100% in your browser.",
  keywords: [
    "pdf to image",
    "pdf to jpg",
    "pdf to png",
    "convert pdf to image",
    "pdf to images",
    "pdf pages to jpg",
    "pdf to picture",
    "convertir pdf a imagen",
    "pdf to jpg converter online",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-to-images",
  },
  openGraph: {
    title: "PDF to Images - PDF to JPG PNG | MultiTool",
    description:
      "Convert PDF pages to JPG or PNG in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-to-images",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Images - Free & Instant",
    description: "Convert PDF pages to images. No upload, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF to Images"
      description="Convert every page of a PDF into JPG or PNG images. Choose the format, quality and resolution, then download all pages as a ZIP."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-to-images"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does this tool do?
          </h2>
          <p className="mb-4">
            It renders each page of your PDF as an image using the pdf.js
            engine and packages them into a <strong>ZIP file</strong>. Great
            for sharing pages as pictures, embedding them in documents or
            posting them on social media.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Choose the format: JPG or PNG.</li>
            <li>Adjust quality (JPG) and resolution if needed.</li>
            <li>Click <strong>CONVERT &amp; DOWNLOAD ZIP</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            JPG or PNG?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>JPG</strong> — smaller files, ideal for photos and
              sharing; the quality slider controls the trade-off.
            </li>
            <li>
              <strong>PNG</strong> — lossless and sharper for text and
              screenshots, but files are larger.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Resolution
          </h2>
          <p className="mb-4">
            The <strong>resolution</strong> option multiplies the pixel size
            of the rendered pages: 1× matches the PDF size, 1.5× and 2× give
            sharper results for printing or zooming. Higher resolution means
            bigger images and slower conversion.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Conversion runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which image formats are supported?",
          answer:
            "JPG and PNG. JPG is smaller and best for photos; PNG is lossless and crisper for text and screenshots. Both are downloaded together as a ZIP file.",
        },
        {
          question: "How do I convert only some pages?",
          answer:
            "This tool converts every page. If you need only specific pages, extract them first with our PDF Split tool, then convert the smaller file here.",
        },
        {
          question: "What is the resolution option?",
          answer:
            "It multiplies the pixel size of each rendered page. 1× matches the PDF's native size, 2× doubles it for sharper results when zooming or printing — at the cost of larger images and slower conversion.",
        },
        {
          question: "Why do I get a ZIP instead of images?",
          answer:
            "A PDF can have dozens of pages, and browsers download one file per click. The ZIP packages every page image into a single file you can unzip anywhere.",
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
        { name: "Images to PDF", href: "/tools/pdf-tools/images-to-pdf" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Compress", href: "/tools/pdf-tools/pdf-compress" },
        { name: "PDF Watermark", href: "/tools/pdf-tools/pdf-watermark" },
      ]}
    >
      <PdfToImagesClient />
    </ToolLayout>
  );
}
