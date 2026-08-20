import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Image Resizer - Resize Photos to Exact Dimensions | MultiTool",
  description:
    "Resize images to exact pixel dimensions online. Keep aspect ratio or set custom width and height, choose format and quality — free, private, no upload.",
  keywords: [
    "image resizer",
    "resize image online",
    "resize photo",
    "change image dimensions",
    "image width height",
    "resize jpg",
    "resize png",
    "resize webp",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/image-resizer",
  },
  openGraph: {
    title: "Image Resizer - Resize Photos to Exact Dimensions | MultiTool",
    description:
      "Resize images to exact pixel dimensions online. Private, free, no upload.",
    url: "https://www.multitoolbox.online/tools/images/image-resizer",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Resizer - Resize Photos Online",
    description:
      "Set exact width and height, keep aspect ratio, pick format — all in your browser.",
  },
};

export default function ImageResizerPage() {
  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize any image to exact pixel dimensions. Keep the aspect ratio locked or set a custom width and height, pick the output format and quality."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="image-resizer"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How image resizing works
          </h2>
          <p className="mb-4">
            Resizing redraws your picture on a canvas with a new width and
            height in pixels, then re-encodes it. When the aspect ratio is
            locked, the height is calculated automatically:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              New Height = Original Height × (New Width ÷ Original Width)
            </p>
          </div>
          <p className="mb-4">
            Resizing is not the same as cropping: no part of the image is
            cut off — the whole picture is scaled. Use cases: making
            thumbnails, fitting store or social media size requirements,
            shrinking photos for email, or preparing images for the web.
          </p>
          <p className="mb-4">
            Limitations: enlarging beyond roughly 2× the original size makes
            pictures look soft, because the browser has to invent pixels
            that were never captured. For smaller files with the same
            dimensions, use a compressor instead.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Your image is processed locally with the browser canvas. It is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I resize an image without losing quality?",
          answer:
            "Downscaling (making an image smaller) keeps quality very well. Avoid enlarging more than ~2× — the bigger the stretch, the softer the result. Also re-encode as PNG (lossless) or high-quality JPG/WebP (quality 85+) for best results.",
        },
        {
          question: "What's the difference between resizing and cropping?",
          answer:
            "Resizing scales the whole picture to new dimensions — nothing is removed. Cropping cuts out a region and discards the rest. Need to cut? Use our Image Cropper; need to scale? You are in the right place.",
        },
        {
          question: "How do I keep the image from looking stretched?",
          answer:
            "Keep the lock (aspect ratio) enabled — the height adjusts automatically when you change the width. Unlock it only when you intentionally want a different proportion.",
        },
        {
          question: "Which output format should I choose?",
          answer:
            "Photos look best and stay small as JPG or WebP (quality ~85). Screenshots, logos and images with sharp edges or transparency are better as PNG. 'Keep original' only changes the dimensions.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "There is no hard limit, but very large images (50+ megapixels) may be slow or fail on devices with little memory, because everything runs inside your browser.",
        },
        {
          question: "Is my image private?",
          answer:
            "Yes. The resize happens 100% in your browser with the HTML canvas — the file never leaves your device and nothing is stored.",
        },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "Image Cropper", href: "/tools/images/image-cropper" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "PNG to WebP Converter", href: "/tools/images/png-to-webp" },
      ]}
    >
      <ImageResizerClient />
    </ToolLayout>
  );
}
