import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImageCropperClient from "./ImageCropperClient";

export const metadata: Metadata = {
  title: "Image Cropper - Crop Photos Online | MultiTool",
  description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private.",
  keywords: ["image cropper", "crop photo online", "crop image", "square crop", "crop tool", "cortar imagem"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/image-cropper",
  },
  openGraph: {
    title: "Image Cropper - Crop Photos Online | MultiTool",
    description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag to position, zoom, then download as PNG. 100% private.",
    url: "https://www.multitoolbox.online/tools/images/image-cropper",
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
            Crop with intention
          </h2>
          <p className="mb-4">
            Cropping is composition, not just trimming. Two principles do
            most of the work:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Rule of thirds:</strong> place the subject where the grid lines intersect (the preset overlays help) — off-center compositions feel more alive than centered ones.</li>
            <li><strong>Headroom and direction:</strong> leave a little space above heads, and more space in front of a face (or moving object) than behind it.</li>
          </ul>
          <div className="bg-white border border-ink/10 rounded-lg overflow-hidden my-3 text-sm">
            {[
              ["1:1", "profile photos, avatars, grid posts"],
              ["4:5", "Instagram/Facebook feed portraits"],
              ["9:16", "Stories, Reels, TikTok covers"],
              ["16:9", "thumbnails, banners, YouTube"],
            ].map(([a, b], i) => (
              <div key={a} className={`flex justify-between gap-4 px-4 py-2 ${i % 2 ? "bg-paper/60" : ""}`}>
                <span className="font-mono text-ink/70">{a}</span>
                <span className="text-accent">{b}</span>
              </div>
            ))}
          </div>
          <p className="mb-4">
            <strong>Crop ≠ resize:</strong> cropping cuts content to change
            the shape; resizing scales everything without removing anything.
            Crop first (shape), then{" "}
            <a href="/tools/images/image-resizer" className="text-accent-deep underline underline-offset-2">resize</a>{" "}
            to the exact pixels — the full workflow with every platform size
            lives in our{" "}
            <a href="/guides/social-media-image-sizes" className="text-accent-deep underline underline-offset-2">social media sizes guide</a>.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Straighten, then crop
          </h2>
          <p className="mb-4">
            Two pro habits that instantly improve most photos:{" "}
            <strong>straighten the horizon first</strong> (a 1° tilt is
            subconsciously annoying; align water lines and buildings with
            the frame edges), then crop for composition. And a fact that
            surprises people: cropping does <strong>not</strong> reduce
            resolution of what remains — the pixels you keep stay
            pixel-perfect, so a tight crop of a sharp photo stays sharp.
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
