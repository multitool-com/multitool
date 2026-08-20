import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToYamlClient from "./JsonToYamlClient";

export const metadata: Metadata = {
  title: "JSON to YAML Converter - Convert Both Ways Online | MultiTool",
  description:
    "Convert JSON to YAML and YAML to JSON online, both directions, with instant validation and error messages. Free, private, no upload.",
  keywords: [
    "json to yaml",
    "yaml to json",
    "convert json to yaml",
    "json yaml converter",
    "yaml json online",
    "json2yaml",
    "yaml2json",
  ],
  alternates: {
    canonical:
      "https://www.multitoolbox.online/tools/developer-tools/json-to-yaml",
  },
  openGraph: {
    title: "JSON to YAML Converter - Convert Both Ways Online | MultiTool",
    description: "Convert JSON ⇄ YAML both ways in your browser. Free and private.",
    url: "https://www.multitoolbox.online/tools/developer-tools/json-to-yaml",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON ⇄ YAML Converter",
    description: "Convert JSON to YAML and back — 100% in your browser.",
  },
};

export default function JsonToYamlPage() {
  return (
    <ToolLayout
      title="JSON ⇄ YAML"
      description="Convert JSON to YAML and YAML back to JSON — for Kubernetes, Compose, Ansible, CI configs and any tool that speaks both."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="json-to-yaml"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Converting between JSON and YAML
          </h2>
          <p className="mb-4">
            JSON and YAML describe the same data structures — objects,
            arrays, strings, numbers, booleans and null. The converter
            parses your input into memory and re-serializes it in the other
            format, so the result is semantically identical: same keys, same
            values, same nesting.
          </p>
          <p className="mb-4">
            Why convert? Kubernetes and Docker Compose want YAML, but most
            APIs and tools emit JSON; Ansible playbooks are YAML while cloud
            responses are JSON. Being able to flip between them makes
            pasting API examples into configs (and back) painless.
          </p>
          <p className="mb-4">
            Errors are reported with position information — invalid JSON
            shows the parser position, invalid YAML shows the line number —
            so a stray comma or bad indent is easy to find.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Conversion happens locally in your browser. Your data is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert JSON to YAML?",
          answer:
            "Choose the JSON → YAML direction, paste your JSON and click Convert. You get clean 2-space YAML ready for Kubernetes, Compose or Ansible. Invalid JSON shows the exact parser error.",
        },
        {
          question: "How do I convert YAML to JSON?",
          answer:
            "Switch to YAML → JSON, paste the YAML and convert. The output is standard formatted JSON — perfect for tools and APIs that expect it.",
        },
        {
          question: "Is YAML a superset of JSON?",
          answer:
            "Almost. Every JSON document is valid YAML (flow style), and YAML adds block style, comments and anchors. Edge cases exist — like duplicate keys or non-string keys — but everyday config files convert perfectly.",
        },
        {
          question: "Are comments preserved when converting YAML to JSON?",
          answer:
            "No — JSON has no comments, so they're dropped. Converting back will not restore them. Keep the YAML as the source of truth when comments matter.",
        },
        {
          question: "What about big files?",
          answer:
            "Multi-megabyte documents convert quickly since everything runs locally in your browser with no round trip.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. The conversion is 100% client-side — nothing is uploaded, which matters for configs containing tokens or internal endpoints.",
        },
      ]}
      relatedTools={[
        { name: "YAML Formatter", href: "/tools/developer-tools/yaml-formatter" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "XML Formatter", href: "/tools/developer-tools/xml-formatter" },
        { name: "CSV ⇄ JSON Converter", href: "/tools/developer-tools/csv-json-converter" },
      ]}
    >
      <JsonToYamlClient />
    </ToolLayout>
  );
}
