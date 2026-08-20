import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YamlFormatterClient from "./YamlFormatterClient";

export const metadata: Metadata = {
  title: "YAML Formatter - Beautify & Validate YAML Online | MultiTool",
  description:
    "Format and validate YAML online with consistent indentation, instant error messages with line numbers. Free, private, runs in your browser.",
  keywords: [
    "yaml formatter",
    "format yaml online",
    "yaml validator",
    "yaml beautifier",
    "yaml linter",
    "yaml pretty print",
    "check yaml syntax",
  ],
  alternates: {
    canonical:
      "https://www.multitoolbox.online/tools/developer-tools/yaml-formatter",
  },
  openGraph: {
    title: "YAML Formatter - Beautify & Validate YAML Online | MultiTool",
    description: "Format and validate YAML online. Private and free.",
    url: "https://www.multitoolbox.online/tools/developer-tools/yaml-formatter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML Formatter",
    description: "Beautify and validate YAML online — 100% in your browser.",
  },
};

export default function YamlFormatterPage() {
  return (
    <ToolLayout
      title="YAML Formatter"
      description="Paste YAML to normalize it with clean, consistent indentation — and catch syntax errors instantly with line numbers."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="yaml-formatter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How the YAML formatter works
          </h2>
          <p className="mb-4">
            The formatter parses your document and re-prints it with
            consistent 2-space (or 4-space) indentation, normalized quoting
            and clean list spacing. That removes the accumulated quirks of
            files edited by many hands — mixed tabs, odd spacing, drifting
            styles.
          </p>
          <p className="mb-4">
            Because YAML is parsed rather than regex-edited, formatting is
            semantics-preserving: the output loads to exactly the same data.
            If anything fails — bad indentation, a duplicate key, an
            unterminated quote — you get the parser error with the line
            number, which makes fixing CI configs, Docker Compose files and
            Kubernetes manifests much faster.
          </p>
          <p className="mb-4">
            Limitations: YAML anchors and multi-document streams
            (&quot;---&quot; separators) are parsed, but formatting focuses
            on single-document files.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Parsing and formatting happen locally in your browser. Your YAML
            is <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I format YAML online?",
          answer:
            "Paste your YAML, pick 2 or 4 spaces, click Format. The document is re-printed with consistent indentation that you can copy with one click.",
        },
        {
          question: "How do I find an error in my YAML?",
          answer:
            "Paste it and click Validate (or Format). If the syntax is broken, you'll see the exact parser message including the line number — the #1 way to fix failing pipelines and configs.",
        },
        {
          question: "Why is indentation so important in YAML?",
          answer:
            "Unlike JSON, YAML uses indentation to define structure. One wrong space can change meaning or break the file entirely. The formatter normalizes everything to your chosen style.",
        },
        {
          question: "Does formatting change my data?",
          answer:
            "No. The file is parsed and re-printed — the data it loads to is identical. Only the presentation (spacing, quoting) is normalized.",
        },
        {
          question: "Can I convert YAML to JSON too?",
          answer:
            "Yes — use our JSON ⇄ YAML Converter for two-way conversion. This page focuses on formatting and validation.",
        },
        {
          question: "Is my configuration private?",
          answer:
            "Yes. Everything runs client-side, so configs with tokens or internal hostnames never leave your browser.",
        },
      ]}
      relatedTools={[
        { name: "JSON ⇄ YAML Converter", href: "/tools/developer-tools/json-to-yaml" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "XML Formatter", href: "/tools/developer-tools/xml-formatter" },
        { name: "SQL Formatter", href: "/tools/developer-tools/sql-formatter" },
      ]}
    >
      <YamlFormatterClient />
    </ToolLayout>
  );
}
