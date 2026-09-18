import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BlurClient from "./BlurClient";

export const metadata: Metadata = {
  title: "Blur or Pixelate Image Parts Online - Hide Faces & Data | MultiTool",
  description:
    "Blur or pixelate parts of an image: drag a rectangle over faces, license plates, IDs, prices or messages and hide them before sharing. Free, private, no upload.",
  keywords: [
    "blur image online",
    "pixelate part of image",
    "blur face in photo",
    "hide license plate photo",
    "blur text in screenshot",
    "censor image online",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/blur-image",
  },
  openGraph: {
    title: "Blur or Pixelate Image Parts Online | MultiTool",
    description: "Hide faces, plates and data before sharing — in your browser.",
    url: "https://www.multitoolbox.online/tools/images/blur-image",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blur / Pixelate Image",
    description: "Hide sensitive parts of photos — free, private, no upload.",
  },
};

export default function BlurPage() {
  return (
    <ToolLayout
      title="Blur / Pixelate Image"
      description="Hide what should not be seen: drag a rectangle over faces, plates, documents, prices or messages and blur or pixelate exactly that region — the privacy tool for safe sharing."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="blur-image"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Blur vs pixelate — and when each wins
          </h2>
          <p className="mb-4">
            Both hide information; they fail differently, and choosing well
            matters when privacy is the goal:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Pixelation</strong> replaces the region with large blocks — it destroys structure permanently and cannot be reverse-engineered, which is why documentaries and evidence photos prefer it for faces.</li>
            <li><strong>Blur</strong> softens the region — cleaner aesthetically, but weak blurs over text can sometimes be read with sharpening filters. Rule: <strong>for text and IDs, use heavy pixelation</strong>; for faces and backgrounds, blur is fine and friendlier.</li>
            <li><strong>Strong beats subtle:</strong> if you can still read it, so can someone motivated. When in doubt, double the intensity.</li>
            <li><strong>Privacy checklist before sharing:</strong> faces of bystanders (especially children), license plates, house numbers, IDs, card numbers, prescriptions, screen notifications, and the EXIF metadata of the file itself (our EXIF Viewer &amp; Remover handles that part).</li>
            <li><strong>Draw the region generously:</strong> the tool applies the effect to the rectangle you drag — a tight selection over a tilted plate can leave corners legible.</li>
          </ul>
          <p className="mb-4">
            This is the image side of the privacy-first promise: everything
            happens in your browser, on your device.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The effect is applied locally with the browser canvas. Your
            image is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I blur a face in a photo?",
          answer:
            "Select your image, choose Blur (or Pixelate for stronger protection), drag a rectangle over the face, adjust the intensity and download. The rest of the photo stays untouched.",
        },
        {
          question: "Is pixelation safer than blur for hiding text?",
          answer:
            "Yes. Pixelation destroys the information; blur only smears it — and light blurs over text have been recovered with sharpening tools. For documents, prices and messages, use pixelation with high intensity.",
        },
        {
          question: "Can I blur multiple areas of the same image?",
          answer:
            "Yes — draw a rectangle, click Apply, then draw the next one. Each application is baked in, so you can hide as many regions as needed before downloading.",
        },
        {
          question: "Can blurred or pixelated areas be recovered?",
          answer:
            "Not with correct settings. Properly pixelated regions are mathematically destroyed. Very light blurs over simple text have occasionally been read with deconvolution — which is why the intensity guidance exists.",
        },
        {
          question: "What should I hide before posting photos publicly?",
          answer:
            "Faces of bystanders and children, license plates, house numbers, school names, documents on tables, phone/computer screens with notifications, and the file's EXIF metadata (GPS location — use our EXIF Viewer & Remover for that).",
        },
        {
          question: "Does this work on screenshots too?",
          answer:
            "Yes — screenshots are images like any other. Blur usernames, emails, phone numbers and balances before sharing support conversations publicly.",
        },
      ]}
      relatedTools={[
        { name: "EXIF Viewer & Remover", href: "/tools/images/exif-viewer" },
        { name: "Watermark Image", href: "/tools/images/watermark-image" },
        { name: "Image Cropper", href: "/tools/images/image-cropper" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
      ]}
    >
      <BlurClient />
    </ToolLayout>
  );
}
