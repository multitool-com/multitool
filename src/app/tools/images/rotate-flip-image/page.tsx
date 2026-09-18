import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RotateFlipClient from "./RotateFlipClient";

export const metadata: Metadata = {
  title: "Rotate & Flip Image - Fix Sideways Photos Online | MultiTool",
  description:
    "Rotate images 90° or 180° and flip horizontally or vertically — fix sideways photos, mirrored selfies and wrong scan orientation. Free, private, no upload.",
  keywords: [
    "rotate image",
    "flip image online",
    "rotate photo",
    "mirror image",
    "flip picture horizontally",
    "rotate jpg",
    "rotate png",
    "fix sideways photo",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/rotate-flip-image",
  },
  openGraph: {
    title: "Rotate & Flip Image - Fix Sideways Photos Online | MultiTool",
    description: "Rotate and flip images in your browser. Free, private, no upload.",
    url: "https://www.multitoolbox.online/tools/images/rotate-flip-image",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate & Flip Image",
    description: "Fix sideways photos and mirrored selfies — 100% in your browser.",
  },
};

export default function RotateFlipPage() {
  return (
    <ToolLayout
      title="Rotate & Flip Image"
      description="Turn photos 90° or 180°, flip them horizontally or vertically — and stack transforms before exporting. Fixes sideways photos, mirrored selfies and wrong scan orientation without re-encoding losses."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="rotate-flip-image"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Rotation, flipping and why photos come out wrong
          </h2>
          <p className="mb-4">
            Sideways photos usually come from <strong>EXIF orientation</strong>:
            the camera sensor captured the frame one way, your phone was held
            another, and the correction flag lives in metadata — which some
            apps ignore. Rotating the actual pixels (what this tool does)
            fixes the image everywhere, permanently, without depending on
            any flag.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Rotate 90° CW/CCW and 180°</strong> — for photos taken in portrait, scans loaded sideways and upside-down exports.</li>
            <li><strong>Flip horizontal</strong> — the mirrored-selfie fix (front cameras mirror by default); also the classic T-shirt-print trick to reverse text.</li>
            <li><strong>Flip vertical</strong> — for scanned film negatives, reflections and design experiments.</li>
            <li><strong>Transforms are lossless-safe:</strong> rotation by exact 90° steps and flips just rearrange pixels — no recompression artifacts are introduced beyond the final export you choose.</li>
            <li><strong>Stack freely:</strong> apply two 90° turns, a flip then a rotation — the preview always shows the current state.</li>
          </ul>
          <p className="mb-4">
            Typical users: anyone fixing vacation photos, real-estate agents
            correcting agent-scanned documents, designers reversing logos,
            and people preparing mirrored images for sublimation printing.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The image is transformed locally with the browser canvas. It is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I rotate a picture 90 degrees?",
          answer:
            "Select your image, click Rotate 90° (clockwise or counter-clockwise) and download. For a full upside-down fix, rotate twice or use the 180° button — the preview updates instantly.",
        },
        {
          question: "How do I unmirror a selfie?",
          answer:
            "Front cameras save selfies mirrored by default. Click 'Flip horizontal' and the image reads the way people see you in real life. Text in the background (signs, book titles) is the classic giveaway.",
        },
        {
          question: "Does rotating or flipping reduce image quality?",
          answer:
            "No. 90° rotations and flips only rearrange existing pixels — no detail is lost. Quality only depends on the export format you pick (PNG is lossless; JPG at 90+ is visually identical).",
        },
        {
          question: "Why does my photo look correct on the phone but sideways on the computer?",
          answer:
            "The photo carries an EXIF orientation flag that some apps respect and others ignore. Rotating the pixels here bakes the correct orientation into the image itself, so it looks right on every device.",
        },
        {
          question: "Can I rotate multiple photos at once?",
          answer:
            "This tool processes one image at a time to keep the live preview honest. For batches, repeat per file — each takes a few seconds and nothing is uploaded.",
        },
        {
          question: "What formats can I rotate and flip?",
          answer:
            "JPG, PNG, WebP, GIF and BMP — anything your browser can decode. Export as PNG (lossless) or JPG (smaller) regardless of the input format.",
        },
      ]}
      relatedTools={[
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "Image Cropper", href: "/tools/images/image-cropper" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "EXIF Viewer & Remover", href: "/tools/images/exif-viewer" },
      ]}
    >
      <RotateFlipClient />
    </ToolLayout>
  );
}
