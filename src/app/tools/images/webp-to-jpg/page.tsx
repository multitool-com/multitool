import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WebpToJpgClient from "./WebpToJpgClient";

export const metadata: Metadata = {
  title: "WebP to JPG Converter - Convert WebP Images Online | MultiTool",
  description:
    "Convert WebP images to JPG online, one or many at a time (ZIP download). Free, private, no upload, no watermark — runs entirely in your browser.",
  keywords: [
    "webp to jpg",
    "convert webp to jpg",
    "webp to jpeg",
    "webp converter",
    "webp to png",
    "open webp",
    "change webp to jpg",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/webp-to-jpg",
  },
  openGraph: {
    title: "WebP to JPG Converter - Convert WebP Images Online | MultiTool",
    description: "Convert WebP to JPG in your browser. Free, private, batch + ZIP.",
    url: "https://www.multitoolbox.online/tools/images/webp-to-jpg",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebP to JPG Converter",
    description: "Convert WebP images to JPG online — private, free, batch supported.",
  },
};

export default function WebpToJpgPage() {
  return (
    <ToolLayout
      title="WebP to JPG"
      description="Convert WebP images to universal JPG — one file or a whole batch, with a ZIP download for all results."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="webp-to-jpg"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why convert WebP to JPG?
          </h2>
          <p className="mb-4">
            WebP is a modern format from Google that compresses images
            ~25–35% smaller than JPG at similar quality. The catch: some
            older apps, editors and workflows still only accept JPG. This
            page converts your WebP files to JPG with the quality you
            choose — no upload, no watermark.
          </p>
          <p className="mb-4">
            Your browser decodes the WebP, redraws it on a canvas and
            re-encodes it as JPG. That happens entirely on your device. Note
            that WebP files with transparency get a white background when
            they become JPG, because JPG does not support transparency.
          </p>
          <p className="mb-4">
            Limitations: converting lossy → lossy slightly recompresses the
            image. Use quality 90%+ to keep results visually identical.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All conversion happens locally in your browser. Your images are{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert WebP to JPG for free?",
          answer:
            "Right here: select your WebP files, set the quality and click Convert. Each result gets a Download button, and Download All packs everything into a ZIP — all free, all in your browser.",
        },
        {
          question: "Will I lose quality converting WebP to JPG?",
          answer:
            "Both formats are lossy, so there is a small recompression. At 90% quality or higher the difference is practically invisible. If you need a lossless format, convert to PNG instead using the multi-format converter.",
        },
        {
          question: "What happens to transparency in WebP files?",
          answer:
            "JPG does not support transparency, so transparent areas become white. If you need to keep transparency, convert to PNG with our JPG / PNG / WebP Converter.",
        },
        {
          question: "Can I convert many WebP files at once?",
          answer:
            "Yes. Select multiple files (or drop a whole folder selection), convert them in one click and download everything as a single ZIP.",
        },
        {
          question: "Why can't I open WebP files on my computer?",
          answer:
            "WebP is supported by all modern browsers, but some older image viewers and editors don't handle it. Converting to JPG makes the file universally compatible.",
        },
        {
          question: "Is it safe to convert private images here?",
          answer:
            "Yes. The tool runs 100% client-side — your files are processed in your browser and never sent to any server.",
        },
      ]}
      relatedTools={[
        { name: "HEIC to JPG Converter", href: "/tools/images/heic-to-jpg" },
        { name: "PNG to WebP Converter", href: "/tools/images/png-to-webp" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
      ]}
    >
      <WebpToJpgClient />
    </ToolLayout>
  );
}
