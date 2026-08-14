import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfWatermarkClient from "./PdfWatermarkClient";

export const metadata: Metadata = {
  title: "PDF Watermark - Add Watermark to PDF Online Free | MultiTool",
  description:
    "Free PDF watermark tool. Add a text or image watermark to every page of a PDF with position, rotation and opacity controls. 100% in your browser, no upload.",
  keywords: [
    "pdf watermark",
    "add watermark to pdf",
    "watermark pdf",
    "pdf watermark online",
    "add text to pdf",
    "stamp pdf",
    "pdf logo watermark",
    "watermark pdf free",
    "marca d'água pdf",
    "marca de agua pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-watermark",
  },
  openGraph: {
    title: "PDF Watermark - Add Watermark to PDF | MultiTool",
    description:
      "Add a text or image watermark to every page of a PDF. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-watermark",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Watermark - Free & Instant",
    description: "Add a text or logo watermark to any PDF. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Watermark"
      description="Stamp a text or image watermark on every page of a PDF. Choose the position, rotation, size and opacity — perfect for drafts and branded documents."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-watermark"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a watermark?
          </h2>
          <p className="mb-4">
            A watermark is a text or logo stamped over the content of every
            page — like "DRAFT", "CONFIDENTIAL" or your company logo. It
            marks the document's status and ownership without blocking the
            reading.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Type the watermark text (or upload a logo image).</li>
            <li>Choose the position, rotation, size and opacity.</li>
            <li>Click <strong>ADD WATERMARK &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Text or image?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Text</strong> — fast and crisp; the font is embedded
              automatically.
            </li>
            <li>
              <strong>Image</strong> — a logo (PNG with transparency works
              best) placed on every page.
            </li>
          </ul>
          <p className="mb-4">
            The <strong>opacity</strong> slider (10–100%) controls how
            visible the watermark is — lower values keep the document easy
            to read while still marking it.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Watermarking runs entirely in your browser. Your PDF and logo
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I add a text watermark?",
          answer:
            "Yes. Type the text (e.g. DRAFT, CONFIDENTIAL, your name or company) and it is stamped on every page. You can adjust the size, position, rotation and opacity.",
        },
        {
          question: "Can I use my logo as a watermark?",
          answer:
            "Yes. Switch to the image option and upload a logo — PNG with transparency works best. It is placed on every page at the size and position you choose.",
        },
        {
          question: "Does watermarking change the original content?",
          answer:
            "No. The watermark is drawn over the pages in a new copy — the original text, images and links stay intact and selectable. The original file is never modified.",
        },
        {
          question: "What is a good opacity for a watermark?",
          answer:
            "For marking a document without hiding content, 20–40% is typical. For 'CONFIDENTIAL' stamps you want people to notice, 50–80% works well. 100% is fully solid.",
        },
        {
          question: "Can I rotate the watermark diagonally?",
          answer:
            "Yes. The diagonal option rotates the text (or image) across the page — the classic watermark look. You can also keep it horizontal with center, top or bottom positions.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the file and the logo never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfWatermarkClient />
    </ToolLayout>
  );
}
