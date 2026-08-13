import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JpgPngWebpConverterClient from "./JpgPngWebpConverterClient";

export const metadata: Metadata = {
  title: "JPG to PNG & WebP Converter - Free Image Format Converter | MultiTool",
  description:
    "Free image format converter. Convert images between JPG, PNG and WebP instantly in your browser. Transparency, quality control and download. No upload, no sign-up.",
  keywords: [
    "jpg to png",
    "png to jpg",
    "jpg to webp",
    "webp to jpg",
    "png to webp",
    "webp to png",
    "image format converter",
    "image converter online",
    "convert image format",
    "photo converter",
    "free image converter",
    "jpeg converter",
  ],
  alternates: {
    canonical:
      "https://multitoolbox.online/tools/images/jpg-png-webp-converter",
  },
  openGraph: {
    title: "JPG / PNG / WebP Converter | MultiTool",
    description:
      "Convert images between JPG, PNG and WebP instantly. Free and private.",
    url: "https://multitoolbox.online/tools/images/jpg-png-webp-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG / PNG / WebP Converter - Free & Instant",
    description: "Convert image formats in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="JPG / PNG / WebP Converter"
      description="Convert any image between JPG, PNG and WebP. Transparency is preserved (PNG/WebP) or flattened to white (JPG), with quality control for JPG and WebP."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="jpg-png-webp-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is an image format?
          </h2>
          <p className="mb-4">
            An image format is the way pixels are stored.{" "}
            <strong>JPG (JPEG)</strong> compresses photos aggressively and is
            the most universal format, but it has no transparency.{" "}
            <strong>PNG</strong> is lossless and keeps transparency — great
            for logos and screenshots. <strong>WebP</strong> is modern:
            usually the smallest of the three and it supports transparency
            too.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop an image or click “Choose an image”.</li>
            <li>Pick the output format: JPG, PNG or WebP.</li>
            <li>Adjust quality (JPG/WebP only) if you like.</li>
            <li>Download the converted file.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Which format should I use?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Photos</strong> — JPG or WebP (WebP is usually
              smaller).
            </li>
            <li>
              <strong>Logos, screenshots, text</strong> — PNG or WebP to
              keep sharp edges and transparency.
            </li>
            <li>
              <strong>Web pages</strong> — WebP everywhere: every modern
              browser supports it.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Transparency and JPG
          </h2>
          <p className="mb-4">
            JPG cannot store transparency. When you convert a PNG or WebP
            with transparent areas to JPG, those areas are filled with{" "}
            <strong>white</strong>. To keep transparency, convert to PNG or
            WebP instead.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The conversion runs entirely in your browser. Your image is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which conversions are supported?",
          answer:
            "Every direction between JPG, PNG and WebP. Other formats (GIF, BMP) usually load too, but the output is always JPG, PNG or WebP — animated GIFs become a single still frame.",
        },
        {
          question: "Why does my image turn white where it was transparent?",
          answer:
            "JPG has no transparency channel. When converting a PNG or WebP to JPG, transparent areas are filled with white. Use PNG or WebP as the output to keep transparency.",
        },
        {
          question: "Does converting reduce quality?",
          answer:
            "JPG → PNG is lossless. PNG/WebP → JPG re-encodes the image, so the quality slider matters: 90 is an excellent default, 80 still looks great for photos. WebP → JPG and JPG → WebP always re-encode.",
        },
        {
          question: "Is WebP supported everywhere?",
          answer:
            "Yes. Every modern browser (Chrome, Edge, Firefox, Safari) has supported WebP for years, including Windows, macOS, iOS and Android. It is the recommended format for web images.",
        },
        {
          question: "Why is my PNG-to-JPG conversion so much smaller?",
          answer:
            "JPG compresses photos far more than PNG by dropping detail the eye barely notices. For photographs this is fine; for screenshots with text, keep PNG or WebP to stay crisp.",
        },
        {
          question: "Is my image uploaded anywhere?",
          answer:
            "No. The image never leaves your device — everything is processed locally in your browser. Safe for private or work images.",
        },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "Image to Base64", href: "/tools/images/image-to-base64" },
        { name: "Color Palette", href: "/tools/generators/color-palette" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
      ]}
    >
      <JpgPngWebpConverterClient />
    </ToolLayout>
  );
}
