import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MarkdownToHtmlClient from "./MarkdownToHtmlClient";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter - Instant Live Preview | MultiTool",
  description: "Convert Markdown to clean HTML instantly with a live preview. Headings, lists, links, code blocks, blockquotes and more.",
  keywords: ["markdown to html", "md to html", "markdown converter", "markdown editor", "html generator", "markdown preview"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/markdown-to-html",
  },
  openGraph: {
    title: "Markdown to HTML Converter - Instant Live Preview | MultiTool",
    description: "Convert Markdown to clean HTML instantly with a live preview. Headings, lists, links, code blocks, blockquotes and more.",
    url: "https://multitoolbox.online/tools/developer-tools/markdown-to-html",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to HTML Converter - Instant Live Preview | MultiTool",
    description: "Convert Markdown to clean HTML instantly with a live preview. Headings, lists, links, code blocks, blockquotes and more.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Markdown to HTML Converter - Instant Live Preview | MultiTool"
      description="DESC"
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="markdown-to-html"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type Markdown on the left and watch the rendered preview on the right, with the generated HTML below. It supports headings, bold, italic, links, images, ordered and unordered lists, blockquotes, inline and fenced code, and horizontal rules.
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
        { question: "What is Markdown?", answer: "A lightweight formatting syntax that uses plain symbols like #, * and - to format text, which is then converted to HTML." },
        { question: "Does it support code blocks?", answer: "Yes — wrap code in triple backticks with an optional language (like three backticks then js) and it renders as a code block with a language class." },
        { question: "Can I copy the generated HTML?", answer: "Yes — the HTML output is always visible in the text area with a one-click copy button." },
        { question: "Is my text sent to a server?", answer: "No — the conversion happens entirely in your browser. Nothing is uploaded." },
        { question: "Does it support tables?", answer: "This version covers the most common elements: headings, lists, links, images, quotes and code. Tables are planned for a future update." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
        { name: "JWT Decoder", href: "/tools/developer-tools/jwt-decoder" },
        { name: "CSV to JSON Converter", href: "/tools/developer-tools/csv-json-converter" },
      ]}
    >
      <MarkdownToHtmlClient />
    </ToolLayout>
  );
}
