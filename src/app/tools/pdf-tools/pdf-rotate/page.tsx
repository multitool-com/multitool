import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfRotateClient from "./PdfRotateClient";

export const metadata: Metadata = {
  title: "Rotate PDF - Rotate PDF Pages Online Free | MultiTool",
  description:
    "Free PDF rotator. Rotate all pages or selected pages 90, 180 or 270 degrees. Fix sideways scans and upside-down documents in your browser, no upload.",
  keywords: [
    "rotate pdf",
    "rotate pdf pages",
    "pdf rotate online",
    "rotate pdf free",
    "rotate pdf 90 degrees",
    "turn pdf sideways",
    "fix upside down pdf",
    "pdf orientation",
    "rotate pages in pdf",
    "girar pdf",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-rotate",
  },
  openGraph: {
    title: "Rotate PDF - Rotate Pages | MultiTool",
    description:
      "Rotate PDF pages 90, 180 or 270 degrees in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-rotate",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF - Free & Instant",
    description: "Fix sideways or upside-down PDF pages. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Rotate"
      description="Rotate PDF pages 90, 180 or 270 degrees — the whole document or only the pages you choose. Perfect for fixing sideways scans."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-rotate"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why rotate a PDF?
          </h2>
          <p className="mb-4">
            Scanners and phone cameras often save pages sideways or upside
            down. Instead of re-scanning, this tool stores a{" "}
            <strong>rotation instruction</strong> in each page — the text
            stays selectable and the file is not re-rendered, so quality is
            untouched.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>
              Pick a mode: rotate <strong>all pages</strong> or{" "}
              <strong>selected pages</strong>.
            </li>
            <li>Choose the angle: 90°, 180° or 270°.</li>
            <li>Click <strong>ROTATE &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Selected pages, explained
          </h2>
          <p className="mb-4">
            In the <strong>selected pages</strong> mode, type the pages to
            rotate, e.g. <code className="bg-paper px-1 rounded">1,3,5-8</code>{" "}
            (commas for individual pages, dashes for ranges). Only those
            pages rotate — the rest stay as they are.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Rotation runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Does rotating reduce quality?",
          answer:
            "No. The tool stores a rotation instruction per page instead of re-rendering the image, so text stays selectable and the file keeps its original quality and size.",
        },
        {
          question: "Can I rotate only some pages?",
          answer:
            "Yes. Use 'selected pages' mode and type the pages, e.g. 1,3,5-8 for pages 1, 3, 5, 6, 7 and 8. The other pages remain unchanged.",
        },
        {
          question: "Which angles are supported?",
          answer:
            "90°, 180° and 270° clockwise. A 90° rotation fixes sideways pages, 180° fixes upside-down pages, and 270° fixes pages rotated the other way.",
        },
        {
          question: "Will the text still be selectable after rotating?",
          answer:
            "Yes. Because rotation is stored as metadata, text, links and search still work normally in the rotated file — unlike re-rendering methods that flatten everything to an image.",
        },
        {
          question: "My file shows an error — why?",
          answer:
            "The tool cannot read password-protected or corrupted PDFs. Remove the password first and try again.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the file never leaves your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Sign", href: "/tools/pdf-tools/pdf-sign" },
      ]}
    >
      <PdfRotateClient />
    </ToolLayout>
  );
}
