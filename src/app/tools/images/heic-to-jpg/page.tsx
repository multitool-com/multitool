import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HeicToJpgClient from "./HeicToJpgClient";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter - Convert iPhone Photos Online | MultiTool",
  description:
    "Convert HEIC and HEIF photos (iPhone default) to JPG online, free and private. Choose quality, download instantly — no upload, no watermark.",
  keywords: [
    "heic to jpg",
    "heic converter",
    "convert heic to jpg",
    "heic to jpeg",
    "heif to jpg",
    "iphone photo converter",
    "heic viewer",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/heic-to-jpg",
  },
  openGraph: {
    title: "HEIC to JPG Converter - Convert iPhone Photos Online | MultiTool",
    description:
      "Convert HEIC/HEIF iPhone photos to JPG in your browser. Private, free.",
    url: "https://www.multitoolbox.online/tools/images/heic-to-jpg",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEIC to JPG Converter",
    description: "Convert iPhone HEIC photos to JPG online — private and free.",
  },
};

export default function HeicToJpgPage() {
  return (
    <ToolLayout
      title="HEIC to JPG"
      description="Convert HEIC and HEIF photos — the default iPhone format — to universal JPG. Pick the quality and download instantly."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="heic-to-jpg"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is HEIC and why convert it?
          </h2>
          <p className="mb-4">
            HEIC (High Efficiency Image Container) is the format iPhones use
            by default since iOS 11. It saves roughly half the space of JPG
            at similar quality — but many websites, older computers and
            Windows apps still can&apos;t open it. Converting to JPG makes the
            photo work everywhere.
          </p>
          <p className="mb-4">
            This tool decodes the HEIC file entirely inside your browser,
            re-encodes it as JPG with the quality you choose, and hands you
            the download directly. The photo is never uploaded anywhere.
          </p>
          <p className="mb-4">
            Limitations: HEIC is &quot;lossy&quot;, so re-encoding to JPG at
            ~90% quality keeps photos looking identical in practice. Converting
            does not remove Apple&apos;s effect edits stored in the file —
            export from the Photos app first if you need those applied.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The conversion happens locally in your browser. Your photo is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert HEIC to JPG without uploading my photos?",
          answer:
            "You just did the hard part — you are on a page that converts locally. Select your HEIC file, choose a quality and click Convert. The file is decoded and re-encoded inside your browser; nothing is sent anywhere.",
        },
        {
          question: "Why are my iPhone photos HEIC instead of JPG?",
          answer:
            "Since iOS 11, Apple saves photos as HEIC by default because it takes about half the storage of JPG. You can change this in Settings → Camera → Formats → Most Compatible, or simply convert here when needed.",
        },
        {
          question: "Does converting HEIC to JPG reduce quality?",
          answer:
            "Both formats are lossy, but at 90% quality the difference is virtually invisible. If you want the best result, avoid converting the same file multiple times — always convert from the original HEIC.",
        },
        {
          question: "Can I convert HEIC to PNG or WebP instead?",
          answer:
            "This page focuses on JPG, the most compatible choice. For other formats, convert to JPG here and then use our JPG / PNG / WebP Converter, or use WebP to JPG / PNG to WebP tools for those specific jobs.",
        },
        {
          question: "Does it work on Windows, Mac and Android?",
          answer:
            "Yes — the conversion runs in the browser, so it works on any modern system. The first conversion loads the decoder once, so it may take a few extra seconds.",
        },
        {
          question: "Is there a limit on file size or number of photos?",
          answer:
            "No hard limit. This tool converts one photo at a time, entirely on your device — large files just take a little longer on slower phones.",
        },
      ]}
      relatedTools={[
        { name: "WebP to JPG Converter", href: "/tools/images/webp-to-jpg" },
        { name: "PNG to WebP Converter", href: "/tools/images/png-to-webp" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
      ]}
    >
      <HeicToJpgClient />
    </ToolLayout>
  );
}
