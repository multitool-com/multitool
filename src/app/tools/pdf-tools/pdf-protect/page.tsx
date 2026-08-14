import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfProtectClient from "./PdfProtectClient";

export const metadata: Metadata = {
  title: "Protect PDF - Password Protect PDF Online Free | MultiTool",
  description:
    "Free PDF password protector. Encrypt a PDF with a password so only people with the password can open it. Optionally restrict printing and copying. 100% in your browser, no upload.",
  keywords: [
    "protect pdf",
    "password protect pdf",
    "pdf password",
    "encrypt pdf",
    "lock pdf",
    "pdf password protect online",
    "secure pdf",
    "add password to pdf",
    "pdf encryption",
    "proteger pdf",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-protect",
  },
  openGraph: {
    title: "Protect PDF - Password Protect PDF | MultiTool",
    description:
      "Encrypt a PDF with a password in your browser. Free and private.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-protect",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protect PDF - Free & Instant",
    description: "Lock a PDF with a password. No upload, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Protect (Password)"
      description="Encrypt a PDF with a password so only people who know it can open the file. Optionally restrict printing and copying. Everything runs in your browser."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-protect"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What does password protection do?
          </h2>
          <p className="mb-4">
            Protecting a PDF encrypts its contents: anyone who opens the
            file must type the <strong>password</strong> before the pages
            are shown. This tool applies standard PDF encryption (AES-256)
            — the same kind used by professional PDF editors.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Type a password and repeat it to confirm.</li>
            <li>Optionally restrict printing and copying.</li>
            <li>Click <strong>PROTECT &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Choosing a strong password
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Use at least 8 characters.</li>
            <li>Mix letters, numbers and symbols.</li>
            <li>
              Do not use the same password you use for email or banking.
            </li>
            <li>
              <strong>There is no way to recover a forgotten password</strong>{" "}
              — keep it somewhere safe.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Encryption runs entirely in your browser. Your PDF and password
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What type of encryption is used?",
          answer:
            "Standard PDF encryption with a 256-bit AES cipher (PDF 2.0 security handler), the same kind used by professional PDF editors. Files open normally in Acrobat, Chrome, Edge, Firefox and most PDF readers after you type the password.",
        },
        {
          question: "Can the password be recovered if I forget it?",
          answer:
            "No. PDF encryption has no backdoor — neither we nor anyone else can recover a forgotten password. Store it in a password manager and never rely on a 'hint' to remember it.",
        },
        {
          question: "Can I restrict printing or copying?",
          answer:
            "Yes. Tick the restrictions before protecting: 'prevent printing', 'prevent copying' and 'prevent editing'. These are permission flags stored in the encrypted file — most PDF readers honor them.",
        },
        {
          question: "Can I remove the password later?",
          answer:
            "Yes — if you know the password. Load the protected file here with its password (a PDF Unlock tool is planned), or open it in a PDF editor and save without restrictions.",
        },
        {
          question: "Will the protected file work on phones and tablets?",
          answer:
            "Yes. The password prompt is handled by the PDF reader app itself — iOS Files, Android PDF viewers and desktop readers all support password-protected PDFs.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Encryption happens locally in your browser — the file and the password never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Split", href: "/tools/pdf-tools/pdf-split" },
        { name: "PDF Rotate", href: "/tools/pdf-tools/pdf-rotate" },
        { name: "PDF Sign", href: "/tools/pdf-tools/pdf-sign" },
      ]}
    >
      <PdfProtectClient />
    </ToolLayout>
  );
}
