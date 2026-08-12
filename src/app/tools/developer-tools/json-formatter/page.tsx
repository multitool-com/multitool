import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter, Validator & Beautifier | MultiTool",
  description:
    "Free online JSON formatter and validator. Beautify, minify, validate and fix JSON instantly. Works with large files, all in your browser — no uploads.",
  keywords: [
    "json formatter",
    "json validator",
    "json beautifier",
    "json prettifier",
    "json minifier",
    "format json online",
    "validate json",
    "json parser",
    "json linter",
    "pretty print json",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter, Validator & Beautifier | MultiTool",
    description:
      "Beautify, minify and validate JSON instantly. Free, fast and private — no uploads.",
    url: "https://multitoolbox.online/tools/developer-tools/json-formatter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter, Validator & Beautifier",
    description:
      "Free online JSON formatter, validator and minifier.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, beautify and minify JSON data instantly. Detects syntax errors and shows them clearly. Perfect for developers and API testing."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="json-formatter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is JSON?
          </h2>
          <p className="mb-4">
            <strong>JSON</strong> (JavaScript Object Notation) is the most
            common data format used on the web. It&apos;s human-readable,
            language-independent and used by virtually every API, config file
            and modern application. A valid JSON document contains objects{" "}
            <code className="bg-paper px-1 rounded">{`{}`}</code>, arrays{" "}
            <code className="bg-paper px-1 rounded">[]</code>, strings,
            numbers, booleans and <code className="bg-paper px-1 rounded">null</code>.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What this tool does
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Beautify (Format):</strong> adds proper indentation and
              line breaks so JSON becomes easy to read.
            </li>
            <li>
              <strong>Minify:</strong> removes all unnecessary whitespace and
              line breaks to reduce file size (useful for production).
            </li>
            <li>
              <strong>Validate:</strong> checks whether your JSON is
              syntactically correct and shows the exact error location if not.
            </li>
            <li>
              <strong>Copy & Download:</strong> copy the result to clipboard or
              download it as a <code className="bg-paper px-1 rounded">.json</code> file.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Common JSON syntax rules
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Keys must be wrapped in <strong>double quotes</strong> ("key")</li>
            <li>Strings must use <strong>double quotes</strong>, not single quotes</li>
            <li>No <strong>trailing commas</strong> allowed after the last item</li>
            <li>No <strong>comments</strong> (unlike JavaScript)</li>
            <li>Numbers don&apos;t use quotes; booleans are <code className="bg-paper px-1 rounded">true</code>/<code className="bg-paper px-1 rounded">false</code></li>
          </ul>

          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm mb-2"><strong>❌ Invalid JSON:</strong></p>
            <pre className="font-mono text-xs overflow-x-auto">{`{
  name: 'John',       // no quotes on key, single quotes
  age: 30,
  city: 'New York',   // trailing comma
}`}</pre>
            <p className="font-mono text-sm mb-2 mt-4"><strong>✅ Valid JSON:</strong></p>
            <pre className="font-mono text-xs overflow-x-auto">{`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`}</pre>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            When to use each mode
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Beautify:</strong> when reading, debugging or editing
              JSON — makes structure clear.
            </li>
            <li>
              <strong>Minify:</strong> when sending JSON over the network or
              storing it — reduces size significantly.
            </li>
            <li>
              <strong>Validate:</strong> when you get an API error and need to
              know exactly where the JSON is broken.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All processing happens instantly in your browser. Your JSON is{" "}
            <strong>never sent to any server</strong> and never stored. Safe
            for confidential data.
          </p>
        </>
      }
      faqs={[
        {
          question: "What's the difference between beautify and minify?",
          answer:
            "Beautify (or 'pretty print') adds indentation and line breaks to make JSON easy to read. Minify does the opposite: it removes all whitespace so the JSON takes as little space as possible — ideal for network transmission and production APIs.",
        },
        {
          question: "How can I fix an 'Unexpected token' error?",
          answer:
            "This error usually means invalid syntax: a missing comma, extra comma, unquoted key, single quotes instead of double quotes, or a stray character. The validator will show you the line and position where the problem starts — check just before that spot.",
        },
        {
          question: "Can I paste very large JSON files?",
          answer:
            "Yes! Since processing happens locally in your browser, there's no upload limit. Files with tens of thousands of lines are handled instantly. Very large files (100MB+) may briefly freeze your browser tab while formatting.",
        },
        {
          question: "Does JSON allow comments?",
          answer:
            "No. Standard JSON does not support comments (unlike JavaScript). If you need comments, use JSON5 or JSONC — but those aren't accepted by most parsers. This tool follows the strict JSON spec.",
        },
        {
          question: "Why do my single quotes cause errors?",
          answer:
            "JSON requires double quotes (\") around all strings and keys. Single quotes ('), even though valid in JavaScript, are not valid in JSON. Replace all single quotes with double quotes to fix this.",
        },
        {
          question: "Is my JSON data private?",
          answer:
            "Yes! Everything happens in your browser using JavaScript's built-in JSON parser. Nothing is uploaded, logged or stored anywhere. Safe for API keys, tokens and confidential data.",
        },
      ]}
      relatedTools={[
        { name: "Base64 Encoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "URL Encoder", href: "/tools/developer-tools/url-encoder" },
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
      ]}
    >
      <JsonFormatterClient />
    </ToolLayout>
  );
}