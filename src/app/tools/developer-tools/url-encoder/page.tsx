import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UrlEncoderClient from "./UrlEncoderClient";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder - Percent-Encoding | MultiTool",
  description: "Percent-encode and decode URLs: encode whole URLs or just query parameters, with automatic handling of special characters.",
  keywords: ["url encoder", "url decoder", "percent encoding", "url encode", "url decode", "encodeuri"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/url-encoder",
  },
  openGraph: {
    title: "URL Encoder / Decoder - Percent-Encoding | MultiTool",
    description: "Percent-encode and decode URLs: encode whole URLs or just query parameters, with automatic handling of special characters.",
    url: "https://multitoolbox.online/tools/developer-tools/url-encoder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder / Decoder - Percent-Encoding | MultiTool",
    description: "Percent-encode and decode URLs: encode whole URLs or just query parameters, with automatic handling of special characters.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_URL Encoder / Decoder - Percent-Encoding | MultiTool"
      description="Percent-encode and decode URLs: encode whole URLs or just query parameters, with automatic handling of special characters."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="url-encoder"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste a URL or a query string and encode or decode it. Component mode percent-encodes every special character (ideal for query values); Full URL mode preserves URL structure while encoding the rest.
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
        { question: "What is URL encoding?", answer: "Percent-encoding: special characters are replaced by %XX codes so URLs remain valid — spaces become %20, café becomes caf%C3%A9." },
        { question: "What is the difference between the two modes?", answer: "Component mode encodes everything including & and = (use for query values); Full URL mode keeps the URL structure readable (use for whole URLs)." },
        { question: "When do I need to encode?", answer: "Whenever you build URLs with user input: search queries, redirects, mailto links or API calls." },
        { question: "Why does decode fail sometimes?", answer: "Malformed percent sequences like %ZZ are invalid — the tool warns you instead of guessing." },
        { question: "Does it handle UTF-8?", answer: "Yes — accented characters and emoji encode correctly." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Base64 Encoder / Decoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
      ]}
    >
      <UrlEncoderClient />
    </ToolLayout>
  );
}
