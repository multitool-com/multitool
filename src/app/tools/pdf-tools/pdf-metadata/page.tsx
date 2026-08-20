import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfMetadataClient from "./PdfMetadataClient";

export const metadata: Metadata = {
  title: "PDF Metadata Editor - Edit PDF Title & Author Online Free | MultiTool",
  description:
    "Free PDF metadata editor. View and edit the title, author, subject and keywords of a PDF. 100% in your browser, no upload, no sign-up.",
  keywords: [
    "pdf metadata",
    "edit pdf title",
    "pdf properties",
    "pdf metadata editor",
    "change pdf title",
    "pdf author",
    "pdf keywords",
    "edit pdf info",
    "editar metadados pdf",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/pdf-metadata",
  },
  openGraph: {
    title: "PDF Metadata Editor - Edit PDF Info | MultiTool",
    description:
      "View and edit PDF metadata: title, author, subject and keywords. Free and private.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/pdf-metadata",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Metadata Editor - Free & Instant",
    description: "Edit PDF title, author, subject and keywords. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Metadata Editor"
      description="View and edit the metadata of a PDF — title, author, subject and keywords. Useful for organizing documents and improving how they appear in file lists and search."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-metadata"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is PDF metadata?
          </h2>
          <p className="mb-4">
            Metadata is the <strong>information about the document</strong>{" "}
            stored inside the file: title, author, subject and keywords. It
            is what file explorers and document managers show, and what
            search engines use to understand a PDF's content.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop a PDF file (or click to choose it).</li>
            <li>Read the current metadata that is loaded automatically.</li>
            <li>Edit the fields you want to change.</li>
            <li>Click <strong>SAVE &amp; DOWNLOAD</strong>.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why update metadata?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Organization</strong> — a proper title and author make
              files easy to find.
            </li>
            <li>
              <strong>Professional look</strong> — "document.pdf" becomes a
              real title when someone opens it.
            </li>
            <li>
              <strong>Search</strong> — keywords help search engines and
              document managers index the file.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Editing runs entirely in your browser. Your PDF is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What metadata can I edit?",
          answer:
            "The title, author, subject and keywords of the PDF. These are the standard fields shown by file explorers, document managers and search engines.",
        },
        {
          question: "Does editing metadata change the content?",
          answer:
            "No. Only the document information is updated — the pages, text and images stay exactly as they were. The original file is never modified.",
        },
        {
          question: "Can I remove metadata instead of editing it?",
          answer:
            "Yes. Clear the fields you want to remove and save — the downloaded PDF will have empty metadata for those fields.",
        },
        {
          question: "Why is some metadata missing when I load a file?",
          answer:
            "Many PDFs are created without metadata (especially exports and scans). Empty fields simply mean the file never had that information — you can fill it in.",
        },
        {
          question: "My file shows an error — why?",
          answer:
            "The tool cannot read password-protected or corrupted PDFs. Remove the password first with PDF Unlock and try again.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. Everything happens locally in your browser — the file never leaves your device.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Protect", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Number Pages", href: "/tools/pdf-tools/pdf-number-pages" },
        { name: "PDF Unlock", href: "/tools/pdf-tools/pdf-unlock" },
      ]}
    >
      <PdfMetadataClient />
    </ToolLayout>
  );
}
