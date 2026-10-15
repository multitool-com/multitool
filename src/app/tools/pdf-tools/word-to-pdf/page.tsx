import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import WordToPdfClient from "./WordToPdfClient";
import { toolRobots } from "@/lib/indexing";

export const metadata: Metadata = {
  robots: toolRobots("word-to-pdf"),
  title: "Word to PDF Converter - DOCX and DOC, Free & Private | MultiTool",
  description:
    "Convert Word documents (.docx and legacy .doc) to PDF in your browser: headings, lists, tables, images and page numbers preserved. No upload, no sign-up, no watermark.",
  keywords: [
    "word to pdf",
    "docx to pdf",
    "doc to pdf",
    "convert word to pdf",
    "word to pdf converter",
    "docx to pdf online",
    "convert doc to pdf free",
    "word document to pdf",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/pdf-tools/word-to-pdf",
  },
  openGraph: {
    title: "Word to PDF Converter - DOCX & DOC | MultiTool",
    description: "Real A4 pages from your Word files — processed in the browser.",
    url: "https://www.multitoolbox.online/tools/pdf-tools/word-to-pdf",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word to PDF",
    description: "Convert .docx and .doc to PDF without uploading anything.",
  },
};

export default function WordToPdfPage() {
  return (
    <ToolLayout
      title="Word to PDF"
      description="Turn .docx and legacy .doc files into clean PDF documents — headings, bullet and numbered lists, tables, embedded figures and page numbers included. The file never leaves your computer."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="word-to-pdf"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why a browser can do this well
          </h2>
          <p className="mb-4">
            A .docx is not a picture of a document: it is a ZIP archive of XML that
            describes structure — this is a Heading 1, that is a numbered list item,
            this run is bold, that cell spans two columns. Because the file carries
            meaning, the conversion can be done on your own machine instead of on
            someone else&apos;s server: the tool reads the XML, rebuilds the document
            as real PDF pages and never uploads a byte.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>Structure is read, not guessed:</strong> the heading level comes
              from the style and outline level, so <code className="font-mono bg-paper px-1 rounded">#</code>{" "}
              looks like a heading, not like bigger text.
            </li>
            <li>
              <strong>Lists stay lists:</strong> bullet glyphs follow the original
              indentation, and numbered lists keep the numbering scheme
              (1, 2, 3 / a, b, c / i, ii, iii), including sub-items.
            </li>
            <li>
              <strong>Tables are rebuilt as tables</strong> with real borders, a shaded
              header row, column spans and automatic repetition of the header when a
              table crosses a page.
            </li>
            <li>
              <strong>Figures are embedded</strong> in PNG and JPEG at the size Word
              displays them, scaled to fit the page and never stretched out of
              proportion.
            </li>
            <li>
              <strong>Typography survives:</strong> accents, curly quotes, dashes,
              € and ™ are encoded properly. Symbols the built-in PDF fonts cannot
              draw (✓, →, emoji) are transliterated to their plain equivalent, and the
              report tells you exactly how many were changed or dropped.
            </li>
            <li>
              <strong>Page furniture you control:</strong> A4, Letter or Legal, three
              margin presets, body size from 9 to 14 pt, page numbers, running header
              and whether to include images.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Honest limits (and what they mean for you)
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li>
              <strong>It is a re-typeset, not a screenshot.</strong> A .docx asks Word
              to paginate; this tool lays the text out on A4 pages with its own
              typography. The content and the hierarchy are faithful; pixel-by-pixel
              line breaks of Word — especially of exotic fonts and floating
              text boxes — are not.
            </li>
            <li>
              <strong>Columns, text boxes and floating images</strong> are laid out as
              normal paragraphs in reading order instead of being positioned like in
              Word.
            </li>
            <li>
              <strong>Images in EMF, WMF, SVG, GIF, BMP or TIFF</strong> cannot be
              embedded by the PDF writer. The tool counts them and tells you which
              ones to re-save as PNG or JPEG.
            </li>
            <li>
              <strong>Legacy .doc files are text-only.</strong> The 97-2003 format is a
              binary structure that does not expose styles reliably in the browser, so
              the PDF keeps the text, the paragraphs and the detected lists and
              numbered headings — but loses fonts, colours, images and real tables.
              The reader says so in the result, and saving the file as .docx first
              gives you the full-fidelity conversion.
            </li>
            <li>
              <strong>Headers, footers, footnotes, comments and tracked changes</strong>{" "}
              are not reproduced; tracked deletions are ignored so the final text is
              the accepted one.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Where this fits in your workflow
          </h2>
          <p className="mb-4">
            Teachers and students convert handouts and assignments to send something
            that opens identically everywhere. Offices convert contracts that must not
            be edited. Writers keep drafting in Word and publish PDF. And if you are
            feeding documents into AI tools, the reverse trip is here too:{" "}
            <Link
              href="/tools/pdf-tools/pdf-to-markdown"
              className="text-accent-deep underline underline-offset-2"
            >
              PDF to Markdown
            </Link>{" "}
            extracts the text back out, and the{" "}
            <Link
              href="/tools/pdf-tools/markdown-integrity-check"
              className="text-accent-deep underline underline-offset-2"
            >
              Markdown Integrity Check
            </Link>{" "}
            proves nothing was lost in the round trip.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">Your privacy</h2>
          <p>
            The file is opened and typeset with JavaScript running in your browser.
            There is no upload, no temporary server copy and no rate limit — which is
            what makes this safe for unpublished material, contracts and internal
            reports.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert a Word document to PDF for free?",
          answer:
            "Choose one or more .docx or .doc files, adjust the page size, margins and options, click Convert to PDF and download the result — individually or all at once as a ZIP. No sign-up, no watermark, no file limit.",
        },
        {
          question: "Are images and tables kept in the PDF?",
          answer:
            "Yes for .docx: tables are rebuilt with borders, a shaded header row and column spans, and PNG/JPEG figures are embedded at the size Word displays them, scaled to fit the page. Images in EMF, WMF, SVG, GIF, BMP or TIFF cannot be embedded — the tool counts them and tells you to re-save those as PNG or JPEG.",
        },
        {
          question: "Why does my old .doc lose the formatting?",
          answer:
            "The 1997-2003 .doc format is a binary structure (an OLE container with a text map) that does not expose styles reliably in a browser. This tool reads its text map, so the words, paragraphs and detected lists survive, but fonts, colours, images and table grids do not. Saving the same file as .docx in Word or LibreOffice and converting again gives you the full conversion.",
        },
        {
          question: "Is the line breaking identical to Word's?",
          answer:
            "No, and no browser tool can promise that. Word paginates with its own layout engine and font metrics; this converter lays the content out on real PDF pages with consistent typography. Headings, lists, tables and figures keep their meaning and order, but a paginated paragraph may break at a different word than it did in Word.",
        },
        {
          question: "Can I convert several documents at once?",
          answer:
            "Yes. Drop multiple files, convert them in one go and download everything as a ZIP, or pick a single file from the list to check it first. Conversions are processed one by one in your browser, so nothing is queued on a server.",
        },
        {
          question: "Is my document uploaded to your servers?",
          answer:
            "Never. The .docx is unzipped and its XML read locally, and the PDF is written in memory in your browser. Nothing is transmitted, stored or logged, and the tool keeps working offline once the page has loaded.",
        },
      ]}
      relatedTools={[
        { name: "PDF to Markdown", href: "/tools/pdf-tools/pdf-to-markdown" },
        { name: "Markdown to PDF", href: "/tools/pdf-tools/markdown-to-pdf" },
        { name: "Images to PDF", href: "/tools/pdf-tools/images-to-pdf" },
        { name: "PDF Merge", href: "/tools/pdf-tools/pdf-merge" },
      ]}
    >
      <WordToPdfClient />
    </ToolLayout>
  );
}
