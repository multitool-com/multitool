import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AddTextClient from "./AddTextClient";

export const metadata: Metadata = {
  title: "Add Text to Image Online - Text on Photos | MultiTool",
  description:
    "Write text over photos: quotes, promos, announcements and labels — with position, size, color and outline control. Free, private, runs in your browser.",
  keywords: [
    "add text to image",
    "write on photo online",
    "text over image",
    "put text on picture",
    "photo text editor",
    "quote image maker",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/add-text-to-image",
  },
  openGraph: {
    title: "Add Text to Image Online | MultiTool",
    description: "Quotes, promos and labels on photos — in your browser.",
    url: "https://www.multitoolbox.online/tools/images/add-text-to-image",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Text to Image",
    description: "Write text over photos — free, private, no upload.",
  },
};

export default function AddTextPage() {
  return (
    <ToolLayout
      title="Add Text to Image"
      description="Write on your photos — quotes, promos, announcements, labels — with full control of position, size, color and outline. The fast path from photo to shareable graphic."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="add-text-to-image"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Text on photos that people actually read
          </h2>
          <p className="mb-4">
            Every social feed is a scroll contest, and text is how a photo
            earns the pause. Three practical rules do most of the work:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Contrast is survival:</strong> light text on dark photo areas, dark on light — and the outline (stroke) option guarantees readability over any background. No outline, no guarantee.</li>
            <li><strong>Short and big beats long and small:</strong> a 3–6 word headline at large size; put sentences in the caption, not the image.</li>
            <li><strong>Margins matter:</strong> keep text away from the edges (10% inset) — platforms crop corners and overlays cover the bottom of vertical posts.</li>
          </ul>
          <p className="mb-4">
            The nine-position grid places text without fighting a cursor:
            top/center/bottom × left/center/right, with a live preview on
            your actual image. Common uses: quote cards, promo badges,
            announcement graphics, event dates on photos, labeled
            before/after pairs (pairs beautifully with our Merge Images
            tool).
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The text is drawn locally with the browser canvas. Your image is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I write text on a photo online?",
          answer:
            "Select your image, type the text, choose where it sits on the nine-position grid and adjust size, color and outline. The preview updates live; download as PNG or JPG when it looks right.",
        },
        {
          question: "How do I make sure the text is readable on any background?",
          answer:
            "Turn on the outline option — the stroke around each letter keeps light text legible over light areas and vice versa. Combined with a strong color choice, it survives every background.",
        },
        {
          question: "Can I add multiple text blocks?",
          answer:
            "This tool places one text block (which can be several lines). For two blocks — like a title plus a date — run the downloaded image through the tool a second time, or use the Meme Generator's top/bottom format.",
        },
        {
          question: "What font size should I use?",
          answer:
            "The slider is relative to image width, so the same setting works for any photo size. 6–8% of width reads as a headline; 3–4% as a caption. Check the preview at full size before exporting.",
        },
        {
          question: "Does adding text reduce the photo quality?",
          answer:
            "No — text is drawn over the original pixels at full resolution. Export as PNG for perfect fidelity, or JPG at 90+ quality for smaller files.",
        },
        {
          question: "Can I use this for memes?",
          answer:
            "You can — but the Meme Generator next door automates the classic format (big top and bottom captions in the meme typeface) in one step.",
        },
      ]}
      relatedTools={[
        { name: "Meme Generator", href: "/tools/images/meme-generator" },
        { name: "Watermark Image", href: "/tools/images/watermark-image" },
        { name: "Merge Images", href: "/tools/images/merge-images" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
      ]}
    >
      <AddTextClient />
    </ToolLayout>
  );
}
