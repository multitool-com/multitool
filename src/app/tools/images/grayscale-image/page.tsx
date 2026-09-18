import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GrayscaleClient from "./GrayscaleClient";

export const metadata: Metadata = {
  title: "Convert Image to Grayscale (Black & White) Online | MultiTool",
  description:
    "Turn photos into black and white with adjustable intensity. The classic luminance formula, live preview, PNG/JPG export — free, private, no upload.",
  keywords: [
    "grayscale image",
    "black and white photo converter",
    "convert image to grayscale",
    "bw image online",
    "monochrome photo",
    "desaturate image",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/grayscale-image",
  },
  openGraph: {
    title: "Convert Image to Grayscale Online | MultiTool",
    description: "Black & white photos with adjustable intensity — in your browser.",
    url: "https://www.multitoolbox.online/tools/images/grayscale-image",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grayscale Image Converter",
    description: "Turn photos black & white — free, private, no upload.",
  },
};

export default function GrayscalePage() {
  return (
    <ToolLayout
      title="Grayscale Image"
      description="Convert any photo to black and white — with an intensity slider so you can go fully monochrome or keep a hint of color. Classic luminance math, live preview."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="grayscale-image"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            The math behind good black &amp; white
          </h2>
          <p className="mb-4">
            Naive grayscale averages red, green and blue — and produces muddy,
            flat images. Real converters use the{" "}
            <strong>luminance formula</strong> from the ITU-R BT.601 standard,
            which weights channels by how human eyes perceive brightness:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Gray = 0.299 × R + 0.587 × G + 0.114 × B
            </p>
          </div>
          <p className="mb-4">
            Green dominates because our eyes are most sensitive to it. The
            result matches what a good photographer gets from a channel-based
            conversion in an editor — skies keep depth, skin keeps dimension.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Intensity slider:</strong> 100% is pure monochrome; 50% is a tasteful desaturation — the fade between is computed per pixel, live.</li>
            <li><strong>Sepia toggle:</strong> warm monotone alternative (also formula-based), for vintage looks and archival-style documents.</li>
            <li><strong>Use cases:</strong> document scans for printing, professional headshots with color accents elsewhere, product photos needing uniformity, and classic portraits.</li>
            <li><strong>Batch tip:</strong> converting many photos? Apply the same settings per file — identical sliders, consistent results.</li>
          </ul>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Conversion happens pixel-by-pixel in your browser. Your photo is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert a photo to black and white?",
          answer:
            "Select your image, drag the intensity slider to 100% for full monochrome (or less for a partial effect), then download as PNG or JPG. The preview updates instantly.",
        },
        {
          question: "What is the difference between grayscale and black and white?",
          answer:
            "Technically, 'black and white' often means 1-bit (only pure black and pure white, like old faxes). What most people want is grayscale — the full range of gray tones. This tool produces true grayscale.",
        },
        {
          question: "Does the intensity slider stack with sepia?",
          answer:
            "No — sepia is an alternative monotone look. Use grayscale mode for classic B&W, sepia mode for the warm vintage tone; the toggle switches between them.",
        },
        {
          question: "Will converting reduce the image quality or size?",
          answer:
            "Quality: no — pixel dimensions stay the same (export as PNG for zero loss). Size: grayscale images often get slightly smaller as JPG/PNG because there is less color information to encode.",
        },
        {
          question: "Can I grayscale a photo but keep one thing in color?",
          answer:
            "That selective-color effect requires region masking, which is beyond a global converter. A trick: grayscale the photo here, then in any simple editor paste the original object back on top.",
        },
        {
          question: "Does it work with HEIC photos from iPhone?",
          answer:
            "Convert HEIC to JPG first with our HEIC to JPG tool, then grayscale here — two clicks total, everything local.",
        },
      ]}
      relatedTools={[
        { name: "Rotate & Flip Image", href: "/tools/images/rotate-flip-image" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Add Image Border", href: "/tools/images/add-border" },
      ]}
    >
      <GrayscaleClient />
    </ToolLayout>
  );
}
