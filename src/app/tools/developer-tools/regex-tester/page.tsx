import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RegexTesterClient from "./RegexTesterClient";

export const metadata: Metadata = {
  title: "Regex Tester - Test Regular Expressions Online | MultiTool",
  description:
    "Free online regex tester. Test JavaScript regular expressions with live matches, capture groups and flags (g, i, m, s). 100% in your browser.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regexp tester",
    "test regex online",
    "javascript regex",
    "regex match",
    "regex flags",
    "capture groups",
    "regex debugger",
    "online regex",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/regex-tester",
  },
  openGraph: {
    title: "Regex Tester - Test Regular Expressions Online | MultiTool",
    description:
      "Test JavaScript regex live: matches, groups and flags. Free and private.",
    url: "https://multitoolbox.online/tools/developer-tools/regex-tester",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester - Free & Instant",
    description: "Test regular expressions in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Regex Tester"
      description="Test a JavaScript regular expression against any text. See matches, capture groups and apply flags (g, i, m, s) instantly."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="regex-tester"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a regular expression?
          </h2>
          <p className="mb-4">
            A <strong>regex</strong> is a pattern that finds text.{" "}
            <code className="bg-paper px-1 rounded">\\d+</code> means “one
            or more digits”. This tester uses the same engine as JavaScript
            in your browser.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Type a pattern (without the surrounding slashes).</li>
            <li>Toggle flags: g (global), i (ignore case), m, s.</li>
            <li>Paste the text to test.</li>
            <li>Read match count, highlighted hits and capture groups.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Common flags
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>g</strong> — find every match, not just the first
            </li>
            <li>
              <strong>i</strong> — case-insensitive
            </li>
            <li>
              <strong>m</strong> — ^ and $ match each line
            </li>
            <li>
              <strong>s</strong> — dot (.) also matches newlines
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Testing runs in your browser. Your pattern and text are{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Do I include the slashes /like this/?",
          answer:
            "No. Type only the pattern, e.g. \\d{3}-\\d{4}. Flags are the buttons, not letters after a slash.",
        },
        {
          question: "Why do I need the g flag?",
          answer:
            "Without g, JavaScript stops at the first match. Turn g on to list every hit.",
        },
        {
          question: "What are capture groups?",
          answer:
            "Parentheses save parts of a match. In (\\w+)@(\\w+), group 1 is the name and group 2 is the domain.",
        },
        {
          question: "Is this the same as Python or PCRE regex?",
          answer:
            "It is JavaScript (ECMAScript) regex — the same as in the browser and Node. Lookbehinds and some Unicode details differ from Python and PCRE.",
        },
        {
          question: "What if my pattern is invalid?",
          answer:
            "The tool shows the error from the JavaScript engine (for example an unclosed bracket) instead of matches.",
        },
        {
          question: "Is my text private?",
          answer:
            "Yes. Everything runs locally. Safe for logs and sample data.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Base64 Encoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "URL Encoder", href: "/tools/developer-tools/url-encoder" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
      ]}
    >
      <RegexTesterClient />
    </ToolLayout>
  );
}