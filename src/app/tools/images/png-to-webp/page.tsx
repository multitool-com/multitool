import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PngToWebpClient from "./PngToWebpClient";

export const metadata: Metadata = {
  title: "PNG to WebP Converter - Convert PNG Images Online | MultiTool",
  description:
    "Convert PNG images to WebP and cut file size by 25%+ with the quality you choose. Batch + ZIP download. Free, private, no upload.",
  keywords: [
    "png to webp",
    "convert png to webp",
    "png webp converter",
    "webp converter online",
    "reduce png size",
    "png to webp batch",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/png-to-webp",
  },
  openGraph: {
    title: "PNG to WebP Converter - Convert PNG Images Online | MultiTool",
    description: "Convert PNG to smaller WebP files in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/images/png-to-webp",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to WebP Converter",
    description: "Convert PNG to WebP and save 25%+ — private, free, batch supported.",
  },
};

export default function PngToWebpPage() {
  return (
    <ToolLayout
      title="PNG to WebP"
      description="Convert PNG images to WebP — typically 25–35% smaller at the same visual quality. Batch supported, ZIP download."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="png-to-webp"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why convert PNG to WebP?
          </h2>
          <p className="mb-4">
            PNG is the lossless standard — perfect quality, but heavy.
            WebP compresses the same picture ~25–35% smaller at visually
            identical quality, which makes pages load faster and saves
            storage. Every modern browser displays WebP, and most platforms
            (including social media and stores) accept it today.
          </p>
          <p className="mb-4">
            This page re-encodes your PNGs as WebP inside your browser with
            the quality you choose. Use case: optimizing images for websites,
            reducing app asset sizes, or shrinking photo libraries.
          </p>
          <p className="mb-4">
            Limitations: WebP with quality below ~100 is lossy — for
            pixel-perfect needs keep the PNG. Old software (pre-2020) may not
            open WebP. Chrome, Edge and Firefox encode WebP natively; older
            Safari versions may fail to export — in that case use the JPG /
            PNG / WebP Converter as fallback.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Conversion is 100% local, in your browser. Your images are{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How much smaller will my PNGs be as WebP?",
          answer:
            "For photos and complex images, typically 25–35% smaller at quality 85–90 with no visible difference. For flat logos and screenshots the saving can be even larger. Each converted file shows its new size so you can compare.",
        },
        {
          question: "Does PNG to WebP support transparency?",
          answer:
            "Yes — WebP supports full alpha transparency, so transparent PNG areas stay transparent in the WebP output.",
        },
        {
          question: "What quality should I choose?",
          answer:
            "90% is a safe default that looks identical to the original for almost every image. For maximum savings where slight softness is acceptable, try 80%.",
        },
        {
          question: "Can I convert multiple PNGs at once?",
          answer:
            "Yes — select as many files as you want, click Convert All, then Download All to get everything in a single ZIP.",
        },
        {
          question: "Is WebP better than JPG for websites?",
          answer:
            "Usually yes: WebP files are smaller than JPG at the same quality, and smaller files mean faster pages and better SEO. Convert your PNGs here and JPGs with our WebP to JPG tool's reverse flow (the multi-format converter handles any direction).",
        },
        {
          question: "Is my data private?",
          answer:
            "Completely. The conversion happens in your browser with the HTML canvas — no file is ever uploaded or stored.",
        },
      ]}
      relatedTools={[
        { name: "WebP to JPG Converter", href: "/tools/images/webp-to-jpg" },
        { name: "HEIC to JPG Converter", href: "/tools/images/heic-to-jpg" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
      ]}
    >
      <PngToWebpClient />
    </ToolLayout>
  );
}
