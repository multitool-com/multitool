import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WatermarkClient from "./WatermarkClient";

export const metadata: Metadata = {
  title: "Watermark Image Online - Protect Your Photos | MultiTool",
  description:
    "Add text watermarks to images: diagonal, tiled or positioned, with opacity, size and rotation control. Protect photos and proofs — free, private, no upload.",
  keywords: [
    "watermark image online",
    "add watermark to photo",
    "photo watermark maker",
    "protect images",
    "text watermark",
    "watermark photos free",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/watermark-image",
  },
  openGraph: {
    title: "Watermark Image Online | MultiTool",
    description: "Diagonal or tiled text watermarks — free, private, no upload.",
    url: "https://www.multitoolbox.online/tools/images/watermark-image",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watermark Image Online",
    description: "Protect photos with text watermarks — in your browser.",
  },
};

export default function WatermarkPage() {
  return (
    <ToolLayout
      title="Watermark Image"
      description="Protect your photos with text watermarks — single diagonal mark, tiled pattern across the whole image, or a positioned signature. Opacity, size and color under your control."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="watermark-image"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Watermarks that protect without ruining
          </h2>
          <p className="mb-4">
            A watermark is a trade-off: the harder it is to remove, the more
            it covers your work. The three modes here cover the realistic
            scenarios:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Diagonal:</strong> one large mark across the center at ~30° — the proof look. Best opacity: 25–40%; enough to ruin unauthorized use, gentle enough that clients can still evaluate the image.</li>
            <li><strong>Tiled:</strong> the mark repeated in a grid across the entire image — the mode that survives cropping. Someone cutting out a corner still carries your name.</li>
            <li><strong>Corner:</strong> a small signature in one corner — the polite default for published photos where you want credit, not a cage.</li>
            <li><strong>Include the essentials:</strong> name or brand + year (or a contact handle). A watermark without a way to find you is just noise.</li>
            <li><strong>Keep the original:</strong> always export the watermarked copy and store the clean file — you cannot remove a well-made watermark later without quality loss.</li>
          </ul>
          <p className="mb-4">
            Use cases: client proofs, portfolio images, marketplace photos,
          stock-style previews and art shared publicly before registration.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The watermark is drawn locally with the browser canvas. Your
            image is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I watermark my photos for free?",
          answer:
            "Select your image, type your name or brand, choose the mode (diagonal, tiled or corner), adjust size and opacity, and download. The entire process runs in your browser — no signup, no upload, no watermark on your watermark.",
        },
        {
          question: "What opacity should a watermark have?",
          answer:
            "25–40% for proofs and protection; 50–70% only for drafts you must make unusable. Beyond that the watermark fights the image itself — clients cannot judge what they cannot see.",
        },
        {
          question: "What is the difference between diagonal and tiled watermarks?",
          answer:
            "Diagonal places one large mark across the center — classic for proofs. Tiled repeats the text across the whole image, so even a cropped fragment still carries your name — better against image theft.",
        },
        {
          question: "Can people remove my watermark?",
          answer:
            "Determined editing can reduce small corner marks. Tiled diagonal watermarks at moderate opacity are the practical hardest to remove without visibly damaging the photo underneath. A watermark deters; registration/legal proof protects.",
        },
        {
          question: "Should I watermark images for Instagram?",
          answer:
            "Usually a small corner signature is enough — big watermarks reduce sharing, and sharing is what you want there. Use diagonal/tiled modes for client proofs and marketplaces instead.",
        },
        {
          question: "Can I use a logo instead of text?",
          answer:
            "For logo watermarks, the practical path today is rendering your logo text in a bold font here, or exporting the image and compositing the logo PNG in any editor. Native logo upload is on our roadmap.",
        },
      ]}
      relatedTools={[
        { name: "Add Text to Image", href: "/tools/images/add-text-to-image" },
        { name: "Meme Generator", href: "/tools/images/meme-generator" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "EXIF Viewer & Remover", href: "/tools/images/exif-viewer" },
      ]}
    >
      <WatermarkClient />
    </ToolLayout>
  );
}
