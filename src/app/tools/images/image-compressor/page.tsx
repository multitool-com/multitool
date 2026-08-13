import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor - Resize & Compress Images Online | MultiTool",
  description:
    "Free online image compressor. Reduce the file size of JPEG, PNG and WebP images with quality control and resize. 100% in your browser, no upload.",
  keywords: [
    "image compressor",
    "compress image online",
    "resize image online",
    "reduce image size",
    "photo compressor",
    "jpg compressor",
    "png compressor",
    "webp compressor",
    "image resizer",
    "shrink image",
    "compress jpeg",
    "free image compressor",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/image-compressor",
  },
  openGraph: {
    title: "Image Compressor - Resize & Compress | MultiTool",
    description:
      "Shrink JPEG, PNG and WebP images with quality control. Free and private.",
    url: "https://multitoolbox.online/tools/images/image-compressor",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor - Free & Instant",
    description: "Reduce image file size in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Image Compressor / Resizer"
      description="Shrink JPEG, PNG and WebP images: pick the output format, adjust quality and optionally resize to a maximum width. Everything runs in your browser."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="image-compressor"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How image compression works
          </h2>
          <p className="mb-4">
            Photos store more detail than the eye can see. <strong>JPEG</strong>{" "}
            and <strong>WebP</strong> drop the least noticeable parts and
            shrink the file; the <strong>quality slider</strong> controls how
            aggressive that is — lower quality, smaller file, slightly softer
            image. <strong>PNG</strong> is lossless: the quality slider does
            not apply, so the main lever for PNGs is resizing.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop an image or click “Choose an image”.</li>
            <li>Pick the output format (JPEG, PNG or WebP).</li>
            <li>Move the quality slider (JPEG/WebP) and set a max width if you like.</li>
            <li>Read the size reduction and download the result.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            JPEG vs PNG vs WebP
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>JPEG</strong> — small, universal, best for photos and
              gradients. No transparency.
            </li>
            <li>
              <strong>PNG</strong> — lossless, supports transparency; best
              for logos, screenshots and text.
            </li>
            <li>
              <strong>WebP</strong> — usually the smallest of the three and
              supported by every modern browser; keeps transparency too.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Resizing
          </h2>
          <p className="mb-4">
            Enter a <strong>max width</strong> to shrink large photos (a
            4000&nbsp;px camera shot rarely needs to be wider than 1920&nbsp;px
            for the web). The height follows automatically and the image is
            never upscaled. Resizing a photo before uploading often saves
            more than compression alone.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Compression runs entirely in your browser. Your image is{" "}
            <strong>never sent to any server</strong> and never stored —
            safe for personal photos.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which formats can I compress?",
          answer:
            "JPEG, PNG and WebP are fully supported. Other formats (GIF, BMP) usually load too, but the output is always JPEG, PNG or WebP — animated GIFs become a single still frame.",
        },
        {
          question: "Why doesn't my PNG get smaller?",
          answer:
            "PNG is lossless, so the quality slider does not apply to it. To shrink a PNG, resize it here or convert to JPEG/WebP (WebP keeps transparency and is much smaller than PNG).",
        },
        {
          question: "Which format should I choose?",
          answer:
            "Photos: JPEG or WebP (smallest). Logos, screenshots and images with transparency: PNG or WebP. WebP works in every modern browser and is usually the best balance.",
        },
        {
          question: "What does the quality slider do?",
          answer:
            "It sets JPEG/WebP compression from 10 to 100. 80 is a great default: large savings with little visible loss. Below 50 you may start to see artifacts on gradients and edges.",
        },
        {
          question: "Does resizing reduce quality?",
          answer:
            "Downscaling is standard practice and usually invisible — we only shrink, never upscale. For web use, a photo resized to 1920 px wide at 80% quality is a strong combination.",
        },
        {
          question: "Is my image uploaded anywhere?",
          answer:
            "No. The image never leaves your device — it is processed locally in your browser. Perfect for private or work photos.",
        },
      ]}
      relatedTools={[
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Image to Base64", href: "/tools/images/image-to-base64" },
        { name: "Color Palette", href: "/tools/generators/color-palette" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
      ]}
    >
      <ImageCompressorClient />
    </ToolLayout>
  );
}
