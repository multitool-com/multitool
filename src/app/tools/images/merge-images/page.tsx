import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MergeImagesClient from "./MergeImagesClient";

export const metadata: Metadata = {
  title: "Merge Images Side by Side or Stacked Online | MultiTool",
  description:
    "Combine two or more images side by side or top to bottom — with gap, background color and smart height matching. Before/after comparisons in seconds. Free and private.",
  keywords: [
    "merge images online",
    "combine two photos side by side",
    "before after image maker",
    "stack images vertically",
    "join images into one",
    "photo collage two images",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/merge-images",
  },
  openGraph: {
    title: "Merge Images Side by Side or Stacked | MultiTool",
    description: "Combine photos with gap and alignment control — in your browser.",
    url: "https://www.multitoolbox.online/tools/images/merge-images",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge Images Online",
    description: "Side by side or stacked — free, private, no upload.",
  },
};

export default function MergeImagesPage() {
  return (
    <ToolLayout
      title="Merge Images"
      description="Combine two or more images into one — side by side for comparisons, stacked vertically for tall layouts — with gap, alignment and background control."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="merge-images"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why side-by-side images work
          </h2>
          <p className="mb-4">
            The brain compares effortlessly when things sit{" "}
            <strong>next to each other</strong> — which is why before/after
            pairs, versus comparisons and step sequences are the most shared
            image format on the web. This tool builds them without any
            editor: select the images, pick the direction, download.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Height matching (side-by-side):</strong> images with different heights are aligned at the top by default — enable 'match height' to scale all to the first image's height for a clean strip.</li>
            <li><strong>Stack mode:</strong> top-to-bottom for tall layouts — receipts, chat screenshots, recipe steps, vertical carousels turned into one image.</li>
            <li><strong>Gap and background:</strong> separate the images with a gap over a white, black or custom background — a subtle gap makes comparisons easier to read than zero-distance.</li>
            <li><strong>Order control:</strong> images render in selection order; re-select in the sequence you want (before first, after second).</li>
            <li><strong>Labeling tip:</strong> add 'BEFORE/AFTER' text on top of each image first with our Add Text to Image tool, then merge here for a finished comparison card.</li>
          </ul>
          <p className="mb-4">
            Use cases: progress photos, renovation before/after, product
            comparison, screenshot stitching, proof screenshots and
            portfolio pairs.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Images are composited locally with the browser canvas. They are{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I put two pictures side by side?",
          answer:
            "Select both images (the file picker allows multiple), keep 'Horizontal' direction and download. The result is one image with both photos left-to-right, in selection order.",
        },
        {
          question: "How do I make a before and after picture?",
          answer:
            "Select the 'before' photo first and the 'after' second, choose horizontal mode with a small gap, and download. For a more polished card, add BEFORE/AFTER labels to each image first with our Add Text to Image tool.",
        },
        {
          question: "What if my images have different heights?",
          answer:
            "By default they align at the top on a shared canvas. Enable 'match height' to scale every image to the first one's height — the standard look for comparison strips.",
        },
        {
          question: "Can I stack images vertically instead?",
          answer:
            "Yes — switch direction to 'Vertical' and the images flow top to bottom. Useful for receipts, chat exports and step-by-step sequences.",
        },
        {
          question: "How many images can I combine?",
          answer:
            "Up to six per merge. For bigger collages, merge in batches (combine results) — or keep it simple: beyond six, a collage grid communicates better than a strip.",
        },
        {
          question: "Does merging reduce image quality?",
          answer:
            "No — images are drawn at their original resolution (unless height-matching scales one down). Export as PNG for zero loss.",
        },
      ]}
      relatedTools={[
        { name: "Add Text to Image", href: "/tools/images/add-text-to-image" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "Add Image Border", href: "/tools/images/add-border" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
      ]}
    >
      <MergeImagesClient />
    </ToolLayout>
  );
}
