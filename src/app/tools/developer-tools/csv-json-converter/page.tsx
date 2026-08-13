import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CsvJsonConverterClient from "./CsvJsonConverterClient";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - Convert CSV ⇄ JSON Online | MultiTool",
  description:
    "Free CSV to JSON converter and JSON to CSV. Paste CSV or JSON and convert instantly with custom delimiters (comma, semicolon, tab) and header-row detection. 100% in your browser.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv converter",
    "csv to json converter",
    "json to csv converter",
    "csv parser",
    "convert csv to json",
    "csv to json online",
    "csv to json free",
    "json to csv online",
  ],
  alternates: {
    canonical:
      "https://multitoolbox.online/tools/developer-tools/csv-json-converter",
  },
  openGraph: {
    title: "CSV to JSON Converter - CSV ⇄ JSON | MultiTool",
    description:
      "Convert between CSV and JSON instantly, with delimiters and header detection. Free and private.",
    url: "https://multitoolbox.online/tools/developer-tools/csv-json-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to JSON Converter - Free & Instant",
    description: "CSV ⇄ JSON in your browser. No upload, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="CSV ⇄ JSON Converter"
      description="Convert CSV to JSON or JSON to CSV instantly. Choose the delimiter, decide whether the first row is a header, and copy or download the result."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="csv-json-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is CSV?
          </h2>
          <p className="mb-4">
            <strong>CSV</strong> (Comma-Separated Values) is a table of rows
            where each line is a record and fields are separated by a
            delimiter — usually a comma, sometimes a semicolon or a tab.
            It is the format Excel and Google Sheets export by default.{" "}
            <strong>JSON</strong> stores the same data as nested
            key-value pairs, which programming languages handle more
            naturally.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Pick a direction: CSV → JSON or JSON → CSV.</li>
            <li>Paste your data (or load a sample).</li>
            <li>
              For CSV: choose the delimiter and whether the first row is a
              header.
            </li>
            <li>Read the converted result, copy it or download the file.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Header row, explained
          </h2>
          <p className="mb-4">
            With <strong>“First row is header”</strong> on,{" "}
            <code className="bg-paper px-1 rounded">name,email</code> becomes{" "}
            <code className="bg-paper px-1 rounded">{"{ \"name\": ..., \"email\": ... }"}</code>{" "}
            for every row. With it off, you get arrays of values — closer to
            the raw table. When converting JSON → CSV, the object keys
            become the header row automatically.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Commas and quotes inside fields
          </h2>
          <p className="mb-4">
            Standard CSV wraps fields in double quotes when they contain a
            delimiter, a quote or a line break, and doubles inner quotes.{" "}
            <code className="bg-paper px-1 rounded">"Oliveira, Carlos"</code>{" "}
            is one field, not two. This tool parses and generates that
            quoting for you. Files from European Excel often use{" "}
            <strong>semicolons</strong> — just switch the delimiter.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The conversion runs entirely in your browser. Your data is{" "}
            <strong>never sent to any server</strong> and never stored.
            Safe for customer lists and spreadsheets.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the difference between CSV and JSON?",
          answer:
            "CSV is a flat table: one record per line, fields split by a delimiter. JSON is nested key-value data that can express types (numbers, booleans, objects, arrays). CSV is lighter and opens in Excel; JSON is easier for APIs and code.",
        },
        {
          question: "Does my CSV need a header row?",
          answer:
            "No. Turn 'First row is header' on to get objects named after the first row, or off to get plain arrays of values. When going JSON → CSV, object keys are used as the header automatically.",
        },
        {
          question: "What if my data contains commas or quotes?",
          answer:
            "Standard CSV quoting handles it: fields with commas, quotes or line breaks are wrapped in double quotes and inner quotes are doubled. This tool parses and generates that correctly.",
        },
        {
          question: "Why do some CSV files use semicolons?",
          answer:
            "Excel in several countries (for example parts of Europe and Latin America) uses the semicolon as the default list separator. Pick the SEMICOLON option here and the file converts correctly.",
        },
        {
          question: "Can I convert the output back to the original?",
          answer:
            "Yes. Converting CSV with a header to JSON and then back with JSON → CSV reproduces the same table (round-trip), including quoted fields.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded, logged or stored.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "JWT Decoder", href: "/tools/developer-tools/jwt-decoder" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
        { name: "Base64 Encoder", href: "/tools/developer-tools/base64-encoder" },
      ]}
    >
      <CsvJsonConverterClient />
    </ToolLayout>
  );
}
