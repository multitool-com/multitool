import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PdfRepairClient from "./PdfRepairClient";

export const metadata: Metadata = {
  title: "PDF Repair - Fix Corrupted PDF Files Online | MultiTool",
  description: "Rebuild corrupted or broken PDF files: the tool re-creates a clean, valid PDF structure page by page. Free, private, in your browser.",
  keywords: ["pdf repair", "fix corrupted pdf", "repair pdf online", "broken pdf fixer", "corrupted pdf recovery"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-repair",
  },
  openGraph: {
    title: "PDF Repair - Fix Corrupted PDF Files Online | MultiTool",
    description: "Rebuild corrupted or broken PDF files: the tool re-creates a clean, valid PDF structure page by page. Free, private, in your browser.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-repair",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Repair - Fix Corrupted PDF Files Online | MultiTool",
    description: "Rebuild corrupted or broken PDF files: the tool re-creates a clean, valid PDF structure page by page. Free, private, in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_PDF Repair - Fix Corrupted PDF Files Online | MultiTool"
      description="Rebuild corrupted or broken PDF files: the tool re-creates a clean, valid PDF structure page by page. Free, private, in your browser."
      categoryName="pdf-tools_NAME"
      categorySlug="pdf-tools"
      toolSlug="pdf-repair"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Upload a damaged PDF and the tool parses its pages and re-saves the document with a fresh, valid structure — dropping broken cross-references and orphaned objects that make readers fail.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs entirely in your browser. Nothing you type is
            ever sent to any server or stored.
          </p>
        </>
      }
      faqs={[
        { question: "What kind of damage can it fix?", answer: "Broken cross-reference tables, truncated trailers, orphaned objects and files rejected by readers. Severe binary corruption cannot always be recovered." },
        { question: "Will it fix password-protected PDFs?", answer: "No — encrypted files must be unlocked first. Use the PDF Unlock tool, then repair." },
        { question: "Does it change my content?", answer: "The text, layout and images are preserved; only the internal structure is rebuilt." },
        { question: "Is my file uploaded anywhere?", answer: "No — everything runs locally in your browser." },
        { question: "Why is the repaired file sometimes larger?", answer: "The rebuild normalizes internal structures and may drop compression on some objects — size differences are normal." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
        { name: "PDF Unlock", href: "/tools/pdf-tools/pdf-unlock" },
        { name: "PDF Compress", href: "/tools/pdf-tools/pdf-compress" },
        { name: "PDF Metadata Editor", href: "/tools/pdf-tools/pdf-metadata" },
      ]}
    >
      <PdfRepairClient />
    </ToolLayout>
  );
}
