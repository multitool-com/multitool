import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MemeClient from "./MemeClient";

export const metadata: Metadata = {
  title: "Meme Generator Online - Free Meme Maker | MultiTool",
  description:
    "Create memes online with your own images: classic top/bottom captions in the meme typeface, adjustable size. Free, private, no watermark, no signup.",
  keywords: [
    "meme generator",
    "meme maker online",
    "create meme",
    "meme creator free",
    "add meme text to photo",
    "make your own meme",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/meme-generator",
  },
  openGraph: {
    title: "Meme Generator Online - Free Meme Maker | MultiTool",
    description: "Classic top/bottom meme captions — free, private, no watermark.",
    url: "https://www.multitoolbox.online/tools/images/meme-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meme Generator",
    description: "Make memes with your images — free, private, no watermark.",
  },
};

export default function MemePage() {
  return (
    <ToolLayout
      title="Meme Generator"
      description="Turn any image into a meme — classic top and bottom captions in the meme typeface, with the proportions that make the format read instantly."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="meme-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why memes look like memes
          </h2>
          <p className="mb-4">
            The format is a visual grammar: white uppercase letters with a
            black outline, top line = setup, bottom line = punchline, in a
            condensed sans-serif that survived from the Impact era because
            it simply <strong>reads at thumbnail size</strong>. This tool
            reproduces that grammar over your image — the punchline
            engineering stays yours.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Setup and punchline:</strong> top text sets the scene, bottom delivers the twist. The funniest memes usually have the fewest words per line — 3 to 8.</li>
            <li><strong>Automatic wrapping:</strong> long lines wrap and shrink to fit the image width — the layout logic from the classics, applied live.</li>
            <li><strong>Readable by construction:</strong> white fill + black stroke stays legible over any photo, bright or dark — the same outline trick our Add Text tool uses.</li>
            <li><strong>Any image works:</strong> screenshots, pet photos, stock expressions, your own face. Reaction images and relatable-humor formats carry furthest.</li>
            <li><strong>No watermark, ever:</strong> your meme downloads clean — add your handle as the bottom text if you want credit built in.</li>
          </ul>
          <p className="mb-4">
            Use cases: group-chat comedy, community inside jokes, light
            marketing that doesn&apos;t take itself seriously, and
            workshop-training slides that keep people awake.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The captions are drawn locally with the browser canvas. Your
            image is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I make a meme with my own picture?",
          answer:
            "Select your image, type the top text (setup) and the bottom text (punchline), adjust the text size if needed, and download. Your image + the classic format = instant meme.",
        },
        {
          question: "Do I need to use a meme template?",
          answer:
            "No — any image works. Templates are popular because the expression already carries emotion, but screenshots, pet photos and your own camera roll are equally valid canvases.",
        },
        {
          question: "Why white text with black outline?",
          answer:
            "That combination stays readable over any background at any size — the reason it became the standard. The outline is the load-bearing part; without it, white text vanishes over bright skies.",
        },
        {
          question: "Can I use just the top or just the bottom text?",
          answer:
            "Yes — leave the other field empty. Single-caption formats (label at the bottom) are a perfectly respectable meme genre.",
        },
        {
          question: "Is there a watermark on the download?",
          answer:
            "No. The PNG downloads clean. If you want credit, add your handle to the bottom text or use the Watermark tool for a subtle corner signature.",
        },
        {
          question: "What makes a meme actually funny?",
          answer:
            "Beyond format: specificity. 'When the printer works' is weaker than a precise, relatable moment people recognize from their own lives. Setup creates expectation; punchline breaks it with as few words as possible.",
        },
      ]}
      relatedTools={[
        { name: "Add Text to Image", href: "/tools/images/add-text-to-image" },
        { name: "Watermark Image", href: "/tools/images/watermark-image" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "Merge Images", href: "/tools/images/merge-images" },
      ]}
    >
      <MemeClient />
    </ToolLayout>
  );
}
