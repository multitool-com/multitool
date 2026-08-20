import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import XmlFormatterClient from "./XmlFormatterClient";

export const metadata: Metadata = {
  title: "XML Formatter - Beautify & Minify XML Online | MultiTool",
  description:
    "Format and validate XML online with 2 or 4 space indentation, or minify it. Instant syntax error detection. Free, private, no upload.",
  keywords: [
    "xml formatter",
    "format xml online",
    "xml beautifier",
    "xml validator",
    "xml pretty print",
    "minify xml",
    "xml prettifier",
  ],
  alternates: {
    canonical:
      "https://www.multitoolbox.online/tools/developer-tools/xml-formatter",
  },
  openGraph: {
    title: "XML Formatter - Beautify & Minify XML Online | MultiTool",
    description: "Format, validate and minify XML online. Private and free.",
    url: "https://www.multitoolbox.online/tools/developer-tools/xml-formatter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "XML Formatter",
    description: "Beautify, validate and minify XML online — 100% in your browser.",
  },
};

export default function XmlFormatterPage() {
  return (
    <ToolLayout
      title="XML Formatter"
      description="Paste XML to beautify it with clean indentation, validate the syntax, or minify it to a single compact line."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="xml-formatter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How the XML formatter works
          </h2>
          <p className="mb-4">
            Formatting re-prints your document with one element per line and
            consistent 2-space (or 4-space) indentation, keeping attributes,
            comments, CDATA sections and processing instructions intact.
            Minifying does the opposite: it strips the whitespace between
            tags to shrink the file for transmission.
          </p>
          <p className="mb-4">
            Validation uses the browser&apos;s native XML parser. If the
            document is not well-formed — a missing closing tag, an
            unescaped <code>&amp;</code>, mismatched quotes — the exact
            parser message is shown instead of broken output.
          </p>
          <p className="mb-4">
            Note: this checks well-formedness (syntax), not validity against
            a DTD or XSD schema. For quick, schema-free day-to-day XML work,
            that&apos;s exactly what you need.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Formatting and validation happen locally in your browser. Your
            XML is <strong>never sent to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I format (beautify) XML online?",
          answer:
            "Paste your XML, choose 2 or 4 spaces of indentation and click Format. The result is properly indented and ready to read or share. Click Copy to grab it.",
        },
        {
          question: "How can I check if my XML is valid?",
          answer:
            "Paste it and click Validate (or Format). If the syntax is wrong, you'll see the browser parser's exact error message — like which tag is unclosed and where.",
        },
        {
          question: "What's the difference between valid and well-formed XML?",
          answer:
            "Well-formed means syntactically correct: tags closed, one root element, attributes quoted. Valid additionally means it follows the rules of a DTD/XSD schema. This tool checks well-formedness, which covers most everyday needs.",
        },
        {
          question: "Does minifying XML break anything?",
          answer:
            "No — whitespace between elements is not meaningful in most XML, so removing it is safe. Whitespace inside text content is preserved. If a document uses xml:space=\"preserve\", be careful as usual.",
        },
        {
          question: "Can it handle large XML files?",
          answer:
            "Yes, comfortably into the several-MB range, since everything runs locally in a modern browser tab.",
        },
        {
          question: "Is my XML private?",
          answer:
            "Yes. Everything runs client-side — your data never leaves your browser, which matters for config files and API payloads with sensitive values.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "YAML Formatter", href: "/tools/developer-tools/yaml-formatter" },
        { name: "SQL Formatter", href: "/tools/developer-tools/sql-formatter" },
        { name: "CSV ⇄ JSON Converter", href: "/tools/developer-tools/csv-json-converter" },
      ]}
    >
      <XmlFormatterClient />
    </ToolLayout>
  );
}
