import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfSignClient from "./PdfSignClient";

export const metadata: Metadata = {
  title: "Sign PDF - Sign PDF Online Free | MultiTool",
  description:
    "Free PDF signer. Draw your signature with your mouse or finger, place it on the page and download the signed PDF. 100% in your browser, no account.",
  keywords: [
    "sign pdf",
    "pdf signature",
    "sign pdf online",
    "digital signature pdf",
    "sign pdf free",
    "sign a pdf document",
    "draw signature on pdf",
    "pdf signer",
    "electronic signature",
    "assinar pdf",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-sign",
  },
  openGraph: {
    title: "Sign PDF - Sign PDF Online | MultiTool",
    description:
      "Draw your signature and place it on a PDF in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-sign",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign PDF - Free & Instant",
    description: "Draw and place your signature on any PDF. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Sign"
      description="Draw your signature with the mouse or your finger, place it on any page of a PDF, and download the signed document. Everything runs in your browser."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-sign"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does this tool do?
          </h2>
          <p className="mb-4">
            You draw a signature once (with the mouse, trackpad or touch),
            then place it on the PDF page where you need it — like signing
            a paper document with a pen. The signature is{" "}
            <strong>embedded as an image</strong> on the page.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Draw your signature in the box (or upload a signature image).</li>
            <li>Choose the page and click the spot where it should appear.</li>
            <li>Drag the signature to fine-tune, then download.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Is this a legal signature?
          </h2>
          <p className="mb-4">
            This is a <strong>visual</strong> signature — the image of your
            handwriting on the document. It is fine for many everyday
            agreements, but it is <strong>not</strong> a qualified
            electronic signature (like the ones with certificates used for
            legal filings in many countries). For documents that require a
            certified signature, use a dedicated e-signature provider.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Signing runs entirely in your browser. Your PDF and signature
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I draw my signature with the mouse?",
          answer:
            "Yes. Draw in the signature box with the mouse or trackpad. On touch devices you can sign with your finger. You can also upload a signature image (PNG with transparency works best).",
        },
        {
          question: "Can I place the signature anywhere on the page?",
          answer:
            "Yes. After drawing, pick the page and click where the signature should go. You can drag it afterwards to fine-tune the position.",
        },
        {
          question: "Is this signature legally binding?",
          answer:
            "It is a visual signature — the image of your handwriting on the document. That is accepted for many everyday agreements, but it is not a qualified electronic signature with a certificate. Use a certified e-signature service for legal filings that require one.",
        },
        {
          question: "Can I sign multiple pages?",
          answer:
            "Yes. Select the page you want to sign, place the signature, then move to another page and place it again. Each page can have its own signature.",
        },
        {
          question: "Can I remove the signature and redraw it?",
          answer:
            "Yes. Use the eraser button to clear the drawing, or 'clear signature' to start over. You can also change the color or thickness before drawing.",
        },
        {
          question: "Is my document uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the PDF and the signature never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfSignClient />
    </ToolLayout>
  );
}
