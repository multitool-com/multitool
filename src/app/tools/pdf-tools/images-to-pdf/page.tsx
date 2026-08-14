import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImagesToPdfClient from "./ImagesToPdfClient";

export const metadata: Metadata = {
  title: "Images to PDF - JPG PNG WebP to PDF Converter | MultiTool",
  description:
    "Free Images to PDF converter. Turn JPG, PNG and WebP images into a single PDF document — reorder, rotate and fit pages. 100% in your browser, no upload.",
  keywords: [
    "images to pdf",
    "jpg to pdf",
    "png to pdf",
    "webp to pdf",
    "image to pdf",
    "jpeg to pdf converter",
    "convert image to pdf",
    "make pdf from images",
    "photos to pdf",
    "image to pdf converter online",
    "imagens para pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF - JPG PNG WebP to PDF | MultiTool",
    description:
      "Turn images into a single PDF in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/images-to-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Images to PDF - Free & Instant",
    description: "Convert JPG, PNG and WebP to PDF. No upload, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Images to PDF"
      description="Combine JPG, PNG and WebP images into a single PDF document. Reorder them, choose the page size and download instantly."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="images-to-pdf"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does this tool do?
          </h2>
          <p className="mb-4">
            It embeds each image as one page of a PDF — perfect for turning
            scans, phone photos or screenshots into a single document you can
            share or archive. The images are <strong>embedded, not
            compressed</strong>, so quality is preserved.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop images or click “Choose images” (you can pick many at once).</li>
            <li>Reorder with ↑ ↓ and remove with ✕ if needed.</li>
            <li>Choose the page size: match image, A4, Letter or Fit.</li>
            <li>Click <strong>CREATE PDF &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Page size options
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Match image</strong> — each page is exactly the image's
              size (good for screenshots).
            </li>
            <li>
              <strong>A4 / Letter</strong> — standard document pages; the
              image is centered and scaled to fit.
            </li>
            <li>
              <strong>Fit</strong> — like A4/Letter but with a small margin
              around the image.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The conversion runs entirely in your browser. Your images are{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which image formats are supported?",
          answer:
            "JPG, PNG and WebP are fully supported — the most common formats for photos, scans and screenshots. Other formats (GIF, BMP) usually load too, but the page becomes a single still frame for animated GIFs.",
        },
        {
          question: "Can I convert many images at once?",
          answer:
            "Yes. Select multiple files at once or drop a whole folder's images — each one becomes a page of the same PDF, in the order shown in the list.",
        },
        {
          question: "Does converting reduce image quality?",
          answer:
            "No. Images are embedded into the PDF without recompression, so quality and resolution are preserved. The PDF size is roughly the sum of the images.",
        },
        {
          question: "What is the best page size?",
          answer:
            "Match image keeps the original proportions (ideal for screenshots). A4 or Letter are better if you want to print or send the PDF as a standard document.",
        },
        {
          question: "Can I reorder the images before converting?",
          answer:
            "Yes. Use the up and down arrows to change the order, and the ✕ button to remove an image before creating the PDF.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything happens locally in your browser — the images never leave your device. Safe for scans and personal photos.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
      ]}
    >
      <ImagesToPdfClient />
    </ToolLayout>
  );
}
