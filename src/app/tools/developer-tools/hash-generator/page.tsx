import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HashGeneratorClient from "./HashGeneratorClient";

export const metadata: Metadata = {
  title: "Hash Generator - SHA-1, SHA-256, SHA-384, SHA-512 | MultiTool",
  description: "Generate cryptographic hashes of any text: SHA-1, SHA-256, SHA-384 and SHA-512. Instant, local, free.",
  keywords: ["hash generator", "sha256", "sha512", "sha1", "hash text", "checksum generator"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/hash-generator",
  },
  openGraph: {
    title: "Hash Generator - SHA-1, SHA-256, SHA-384, SHA-512 | MultiTool",
    description: "Generate cryptographic hashes of any text: SHA-1, SHA-256, SHA-384 and SHA-512. Instant, local, free.",
    url: "https://www.multitoolbox.online/tools/developer-tools/hash-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator - SHA-1, SHA-256, SHA-384, SHA-512 | MultiTool",
    description: "Generate cryptographic hashes of any text: SHA-1, SHA-256, SHA-384 and SHA-512. Instant, local, free.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Hash Generator - SHA-1, SHA-256, SHA-384, SHA-512 | MultiTool"
      description="Generate cryptographic hashes of any text: SHA-1, SHA-256, SHA-384 and SHA-512. Instant, local, free."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="hash-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste any text, pick one or more algorithms and get the hash instantly. All hashing happens locally with the Web Crypto API — your text never leaves the browser.
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
        { question: "What is a hash?", answer: "A fixed-length fingerprint of data. The same input always produces the same hash, and you can't reverse it to get the input." },
        { question: "What is SHA-256 used for?", answer: "Password storage, file integrity checks, blockchains and SSL certificates. It is the most widely used hash today." },
        { question: "Should I store passwords as SHA?", answer: "No — for passwords use a slow algorithm like bcrypt or Argon2 with a salt. SHA is for integrity checks, not passwords." },
        { question: "What is the difference between the algorithms?", answer: "Output length and strength: SHA-1 (160 bits, deprecated), SHA-256 (256 bits), SHA-384 and SHA-512 (stronger)." },
        { question: "Can I verify a file with it?", answer: "Yes — hash the file content here and compare with the published checksum." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "Base64 Encoder / Decoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "URL Encoder / Decoder", href: "/tools/developer-tools/url-encoder" },
        { name: "Text Encryptor", href: "/tools/text-tools/text-encryptor" },
      ]}
    >
      <HashGeneratorClient />
    </ToolLayout>
  );
}
