import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FlattenPdfClient from "./FlattenPdfClient";

export const metadata: Metadata = {
  title: "Flatten PDF Online - Bake Form Fields & Layers | MultiTool",
  description:
    "Flatten PDFs in your browser: turn interactive form fields, layers and annotations into permanent page content. Required by many portals. Free, private, no upload.",
  keywords: [
    "flatten pdf",
    "flatten pdf form",
    "bake pdf fields",
    "make pdf non editable",
    "pdf flattening online",
    "flatten pdf free",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/flatten-pdf",
  },
  openGraph: {
    title: "Flatten PDF Online | MultiTool",
    description: "Bake form fields into permanent content — in your browser.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/flatten-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flatten PDF",
    description: "Make PDFs final and non-editable — free, private, no upload.",
  },
};

export default function FlattenPdfPage() {
  return (
    <ToolLayout
      title="Flatten PDF"
      description="Turn interactive PDFs into final documents: form fields, checkboxes and filled values become permanent page content that no one can edit — what government portals, banks and submission systems ask for."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="flatten-pdf"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What flattening actually means
          </h2>
          <p className="mb-4">
            An interactive PDF is two layers: the <strong>static page</strong>{" "}
            and a set of <strong>live objects</strong> on top — form fields,
            annotations, layers. Flattening merges those layers into the
            page itself: the filled values become printed ink, the fields
            stop being fields.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Why portals demand it:</strong> submission systems (tax, courts, banks, HR platforms) extract what they see — and some tamper-check documents. A flattened file is final: everyone sees exactly the same thing, and nothing can be edited afterwards.</li>
            <li><strong>Fill first, flatten second:</strong> the workflow is always fill the form (in any PDF reader), then flatten here. Flattening is the wax seal — apply it last.</li>
            <li><strong>Not encryption:</strong> flattening prevents accidental edits, not determined ones — the text is still selectable. For confidentiality, combine with PDF Protect; for integrity, digital signatures.</li>
            <li><strong>Checkboxes and dropdowns</strong> bake into their visual state — the checked box stays checked, forever.</li>
            <li><strong>Text stays selectable:</strong> unlike converting pages to images, flattening keeps the text real (searchable, copyable) while freezing the layout.</li>
          </ul>
          <p className="mb-4">
            Use cases: government form submissions, signed contracts after
            filling, expense forms, insurance claims and any document whose
            &quot;final version&quot; must be unmistakably final.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Flattening happens locally with pdf-lib in your browser. Your
            PDF is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What does it mean to flatten a PDF?",
          answer:
            "It merges the interactive layer (form fields, annotations) into the static page content. Filled values become permanent ink; fields stop being editable. The document becomes final for every reader.",
        },
        {
          question: "When do I need to flatten a PDF?",
          answer:
            "When a portal or institution asks for it (very common on government and bank submissions), or when you want to guarantee a filled form cannot be altered after you send it.",
        },
        {
          question: "Should I fill the form before flattening?",
          answer:
            "Yes — always. Fill everything in your PDF reader first; flattening is the last step. After flattening, the fields no longer accept input.",
        },
        {
          question: "Is flattening the same as locking or password-protecting?",
          answer:
            "No. Flattening removes editability of fields; it does not encrypt or restrict the file. Combine with PDF Protect when you also need password security.",
        },
        {
          question: "Can a flattened PDF be edited again?",
          answer:
            "Not the form fields — they are gone. The page content itself remains ordinary PDF content, so a determined editor could still alter text the way they would with any document. Flattening prevents accidents, not forensics.",
        },
        {
          question: "Does flattening affect file size?",
          answer:
            "It usually shrinks slightly (field definitions are removed). If you also need a big reduction, follow with PDF Compress.",
        },
      ]}
      relatedTools={[
        { name: "PDF Protect (Password)", href: "/tools/pdf-tools/pdf-protect" },
        { name: "PDF Sign", href: "/tools/pdf-tools/pdf-sign" },
        { name: "PDF Metadata Editor", href: "/tools/pdf-tools/pdf-metadata" },
        { name: "PDF Compress", href: "/tools/pdf-tools/pdf-compress" },
      ]}
    >
      <FlattenPdfClient />
    </ToolLayout>
  );
}
