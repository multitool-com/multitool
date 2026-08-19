import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImageCropperClient from "./ImageCropperClient";

export const metadata: Metadata = {
  title: "Image Cropper - Crop Photos Online | MultiTool",
  description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private.",
  keywords: ["image cropper", "crop photo online", "crop image", "square crop", "crop tool", "cortar imagem"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/image-cropper",
  },
  openGraph: {
    title: "Image Cropper - Crop Photos Online | MultiTool",
    description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private.",
    url: "https://multitoolbox.online/tools/images/image-cropper",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Cropper - Crop Photos Online | MultiTool",
    description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Image Cropper - Crop Photos Online | MultiTool"
      description="Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private."
      categoryName="images_NAME"
      categorySlug="images"
      toolSlug="image-cropper"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Upload an image, pick a crop ratio (free, 1:1, 4:3, 3:2, 16:9, 9:16), drag the image inside the crop box and zoom as needed, then crop and download the result as PNG.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs entirely in your browser. Nothing you type is
            ever sent to any server or stored.
          </p>
        </>
      }
      faqs={[
        { question: "What ratios are available?", answer: "Free, 1:1 (profile pictures), 4:3, 3:2, 16:9 (thumbnails and video), and 9:16 (stories and reels)." },
        { question: "Is my image uploaded?", answer: "No — everything runs locally in your browser. Nothing is sent to any server." },
        { question: "What format does it download?", answer: "PNG, preserving full quality. The crop is exported at the exact crop-box resolution." },
        { question: "Can I zoom in?", answer: "Yes — use the zoom slider from 0.5x to 4x to frame the perfect shot." },
        { question: "Does it work on mobile?", answer: "Yes — drag with your finger thanks to touch/pointer support." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "JPG PNG WEBP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Image to Base64", href: "/tools/images/image-to-base64" },
        { name: "Favicon Generator", href: "/tools/images/favicon-generator" },
      ]}
    >
      <ImageCropperClient />
    </ToolLayout>
  );
}
