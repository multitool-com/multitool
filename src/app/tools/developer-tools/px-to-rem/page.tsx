import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PxToRemClient from "./PxToRemClient";

export const metadata: Metadata = {
  title: "PX to REM Converter - CSS Units | MultiTool",
  description: "Convert pixels to rem and rem to pixels with any root font size (default 16px). Includes a quick reference table for common sizes.",
  keywords: ["px to rem", "rem to px", "px rem converter", "css rem", "font size converter"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/px-to-rem",
  },
  openGraph: {
    title: "PX to REM Converter - CSS Units | MultiTool",
    description: "Convert pixels to rem and rem to pixels with any root font size (default 16px). Includes a quick reference table for common sizes.",
    url: "https://www.multitoolbox.online/tools/developer-tools/px-to-rem",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PX to REM Converter - CSS Units | MultiTool",
    description: "Convert pixels to rem and rem to pixels with any root font size (default 16px). Includes a quick reference table for common sizes.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_PX to REM Converter - CSS Units | MultiTool"
      description="Convert pixels to rem and rem to pixels with any root font size (default 16px). Includes a quick reference table for common sizes."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="px-to-rem"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter your root font size (16px by default), then convert either direction: px to rem or rem to px, with a quick table of the most common font sizes.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The px vs rem decision, settled
          </h2>
          <p className="mb-4">
            <strong>rem</strong> is relative to the root font-size (16px by
            default), <strong>px</strong> is absolute. That single
            difference drives the whole modern CSS strategy:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Accessibility:</strong> users who raise their browser&apos;s default text size get larger text only if you used rem. Hard-coded px ignores their choice — the #1 reason accessibility audits flag stylesheets.</li>
            <li><strong>The pattern professionals use:</strong> rem for everything that reads (font sizes, line-height, margins around text), px for things that must stay fixed (1px borders, shadows, hairlines).</li>
            <li><strong>The math:</strong> rem = px ÷ 16. The classic scale — 0.75 (12px), 0.875 (14px), 1 (16px), 1.125 (18px), 1.25 (20px), 1.5 (24px), 2 (32px) — covers 95% of real designs.</li>
            <li><strong>Media queries too:</strong> rem-based breakpoints respect user zoom consistently across browsers.</li>
          </ul>
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
        { question: "What is rem?", answer: "A CSS unit relative to the root element's font size (html). 1rem = root size, so with a 16px root, 1rem = 16px." },
        { question: "Why use rem instead of px?", answer: "Rem scales with the user's browser settings, improving accessibility — and it makes responsive design easier." },
        { question: "How do I convert?", answer: "rem = px / base. With a 16px base, 24px = 1.5rem." },
        { question: "What is the default base?", answer: "16px, the browser default — but many design systems use 14px or 10px (which makes 1rem = 10px, easy math)." },
        { question: "Does changing the base matter?", answer: "Yes — the same px value produces different rem values depending on your root font size, so always check your project's base." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "CSS Gradient Generator", href: "/tools/developer-tools/css-gradient-generator" },
        { name: "Markdown to HTML", href: "/tools/developer-tools/markdown-to-html" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
      ]}
    >
      <PxToRemClient />
    </ToolLayout>
  );
}
