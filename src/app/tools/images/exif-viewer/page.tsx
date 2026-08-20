import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ExifViewerClient from "./ExifViewerClient";

export const metadata: Metadata = {
  title: "EXIF Viewer & Remover - See and Strip Photo Metadata | MultiTool",
  description:
    "View the EXIF metadata hidden in your photos (camera, date, GPS) and download a clean copy with all metadata removed. 100% private, no upload.",
  keywords: [
    "exif viewer",
    "exif remover",
    "remove exif",
    "exif data",
    "photo metadata",
    "exif checker",
    "strip exif",
    "gps data photo",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/exif-viewer",
  },
  openGraph: {
    title: "EXIF Viewer & Remover - See and Strip Photo Metadata | MultiTool",
    description:
      "Inspect EXIF metadata (camera, date, GPS) and download a clean copy. Private, free.",
    url: "https://www.multitoolbox.online/tools/images/exif-viewer",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EXIF Viewer & Remover",
    description: "See and strip EXIF metadata from photos — 100% in your browser.",
  },
};

export default function ExifViewerPage() {
  return (
    <ToolLayout
      title="EXIF Viewer & Remover"
      description="See every piece of metadata your camera writes into photos — model, settings, date, GPS location — then download a clean copy with it all removed."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="exif-viewer"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is EXIF metadata?
          </h2>
          <p className="mb-4">
            EXIF is information your camera or phone writes inside every
            photo: camera brand and model, lens, exposure settings, the
            date and time, software used — and often the exact GPS
            coordinates where the picture was taken. Anyone who receives
            the file can read it.
          </p>
          <p className="mb-4">
            This tool reads that metadata locally and shows it in plain
            language. The &quot;Download clean copy&quot; button re-draws
            the photo on a browser canvas — canvas images carry no EXIF —
            and gives you a fresh JPG with zero metadata, at the quality you
            choose.
          </p>
          <p className="mb-4">
            Limitations: the clean copy is re-encoded as JPG (slight
            recompression at 95% quality, visually identical). EXIF lives
            mainly in JPG/TIFF/HEIC files — PNG screenshots usually have
            none.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            This is the whole point of the tool: everything is analyzed{" "}
            <strong>locally in your browser</strong>. The photo is never
            uploaded, and the clean copy is generated on your device.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I check if a photo has GPS location in it?",
          answer:
            "Select the file here — if GPS data exists, you'll see latitude and longitude in the GPS section. That's the exact spot where the photo was taken, readable by anyone with the file.",
        },
        {
          question: "How do I remove EXIF data from a photo?",
          answer:
            "Select the photo, scroll to the metadata table and click 'Download clean copy'. The downloaded JPG contains the image only — camera info, dates, GPS and software tags are all gone.",
        },
        {
          question: "Do social networks strip EXIF automatically?",
          answer:
            "Most do (Instagram, Facebook and Twitter remove EXIF on upload), but messengers, email attachments and cloud links often keep the file untouched. When in doubt, clean it before sending.",
        },
        {
          question: "Does removing EXIF reduce image quality?",
          answer:
            "The clean copy is re-encoded as JPG at 95% quality — visually identical. The image pixels stay the same; only the invisible metadata block disappears.",
        },
        {
          question: "Why does my photo show 'No EXIF metadata found'?",
          answer:
            "Screenshots, images exported by some apps, and pictures that were already cleaned have no EXIF. PNG files generally don't carry EXIF either. That's good news — nothing to leak.",
        },
        {
          question: "Can I remove EXIF from many photos at once?",
          answer:
            "This tool processes one photo at a time to keep the metadata table readable. For batches, repeat per file — it takes a few seconds each and nothing is uploaded.",
        },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "HEIC to JPG Converter", href: "/tools/images/heic-to-jpg" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
      ]}
    >
      <ExifViewerClient />
    </ToolLayout>
  );
}
