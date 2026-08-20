import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Base64EncoderClient from "./Base64EncoderClient";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder - Text to Base64 | MultiTool",
  description: "Encode text to Base64 and decode Base64 back to text instantly, with full UTF-8 support for emoji and accents. Free developer tool.",
  keywords: ["base64 encoder", "base64 decoder", "base64 encode", "base64 decode", "base64 converter"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/base64-encoder",
  },
  openGraph: {
    title: "Base64 Encoder / Decoder - Text to Base64 | MultiTool",
    description: "Encode text to Base64 and decode Base64 back to text instantly, with full UTF-8 support for emoji and accents. Free developer tool.",
    url: "https://www.multitoolbox.online/tools/developer-tools/base64-encoder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder / Decoder - Text to Base64 | MultiTool",
    description: "Encode text to Base64 and decode Base64 back to text instantly, with full UTF-8 support for emoji and accents. Free developer tool.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Base64 Encoder / Decoder - Text to Base64 | MultiTool"
      description="Encode text to Base64 and decode Base64 back to text instantly, with full UTF-8 support for emoji and accents. Free developer tool."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="base64-encoder"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Choose Encode or Decode, paste your input and convert instantly. Encoding uses UTF-8 so emoji, accents and any Unicode text survive the round trip perfectly.
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
        { question: "What is Base64?", answer: "A way to represent binary data as ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). Used in emails, URLs and data URIs." },
        { question: "Why does my text get mangled?", answer: "Legacy tools treat text as Latin-1. This tool uses UTF-8, so emoji and accents encode and decode correctly." },
        { question: "Where is Base64 used?", answer: "Embedding images in HTML/CSS (data:image/png;base64,...), JWT tokens, email attachments and API payloads." },
        { question: "Does Base64 compress data?", answer: "No — it expands data by about 33%." },
        { question: "Is decoding safe?", answer: "Invalid Base64 is detected and reported instead of showing garbage." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "URL Encoder / Decoder", href: "/tools/developer-tools/url-encoder" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
      ]}
    >
      <Base64EncoderClient />
    </ToolLayout>
  );
}
