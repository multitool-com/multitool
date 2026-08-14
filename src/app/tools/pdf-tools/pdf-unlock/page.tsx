import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfUnlockClient from "./PdfUnlockClient";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove Password from PDF Online Free | MultiTool",
  description:
    "Free PDF unlocker. Remove the password from a PDF you own. Enter the password once, download the unlocked file. 100% in your browser, no upload.",
  keywords: [
    "unlock pdf",
    "remove password from pdf",
    "pdf unlock",
    "remove pdf password",
    "unlock pdf online",
    "decrypt pdf",
    "pdf password remover",
    "unlock protected pdf",
    "remove encryption pdf",
    "desbloquear pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-unlock",
  },
  openGraph: {
    title: "Unlock PDF - Remove Password | MultiTool",
    description:
      "Remove the password from a PDF you own, in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-unlock",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF - Free & Instant",
    description: "Remove a PDF password in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Unlock"
      description="Remove the password from a PDF — you only need the password. The unlocked file is created locally in your browser and never uploaded."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-unlock"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does unlocking a PDF do?
          </h2>
          <p className="mb-4">
            If you know the password, this tool decrypts the file and saves
            a new copy <strong>without</strong> the password — so you can
            open it anywhere without typing it again. The original file is
            never touched.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop the protected PDF (or click to choose it).</li>
            <li>Type the password and click <strong>UNLOCK &amp; DOWNLOAD</strong>.</li>
            <li>Open the downloaded file — it no longer asks for a password.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Only unlock files you own
          </h2>
          <p className="mb-4">
            This tool exists to help you recover access to{" "}
            <strong>your own</strong> documents — a file you created, or one
            where the sender gave you the password. Removing protection from
            a document you do not own may violate its terms or the law.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Decryption runs entirely in your browser. Your PDF and password
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can this tool remove a password I don't know?",
          answer:
            "No — and no honest tool can. PDF encryption has no backdoor. This tool only removes the password when you provide it. Use it on your own documents or files where you were given the password.",
        },
        {
          question: "Is the original file modified?",
          answer:
            "No. The tool reads the file, decrypts a copy in memory and downloads the unlocked version. Your original file stays exactly as it was.",
        },
        {
          question: "Will the unlocked file keep the same quality?",
          answer:
            "Yes. Unlocking only removes the encryption — the pages, text, images and formatting are copied unchanged. It is exactly the same document without the password.",
        },
        {
          question: "What if I type the wrong password?",
          answer:
            "The tool shows a clear error and nothing is downloaded. Double-check for uppercase letters, numbers and spaces — passwords are case-sensitive.",
        },
        {
          question: "The file says it is not protected — why?",
          answer:
            "Some PDFs have 'restrictions' (no printing, no copying) but no open password. This tool removes the open password; if the file opens without asking anything, there is nothing to unlock.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the file and the password never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
      ]}
    >
      <PdfUnlockClient />
    </ToolLayout>
  );
}
