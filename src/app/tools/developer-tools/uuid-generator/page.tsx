import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UuidGeneratorClient from "./UuidGeneratorClient";

export const metadata: Metadata = {
  title: "UUID Generator - v4 Random UUIDs | MultiTool",
  description: "Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool.",
  keywords: ["uuid generator", "uuid v4", "generate uuid", "guid generator", "random uuid"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator - v4 Random UUIDs | MultiTool",
    description: "Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool.",
    url: "https://multitoolbox.online/tools/developer-tools/uuid-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator - v4 Random UUIDs | MultiTool",
    description: "Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_UUID Generator - v4 Random UUIDs | MultiTool"
      description="Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="uuid-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Choose how many UUIDs you need (1-100), optionally uppercase, and generate. Uses the browser's cryptographically secure random number generator — every ID is unique and unpredictable.
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
        { question: "What is a UUID?", answer: "A 128-bit identifier formatted as 8-4-4-4-12 hex digits, like 3f2c9a1e-7b44-4d21-9c55-0a1b2c3d4e5f. Also called GUID." },
        { question: "What is version 4?", answer: "Version 4 UUIDs are randomly generated. 122 of the 128 bits are random, making collisions practically impossible." },
        { question: "Is it really secure?", answer: "Yes — the tool uses crypto.randomUUID, backed by the operating system's secure random source." },
        { question: "Are collisions possible?", answer: "Theoretically yes, but you would need billions of UUIDs; the chance of one collision is astronomically small." },
        { question: "Where are UUIDs used?", answer: "Database primary keys, API IDs, session tokens, filenames and distributed systems." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
        { name: "Base64 Encoder / Decoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "URL Encoder / Decoder", href: "/tools/developer-tools/url-encoder" },
        { name: "Password Strength Checker", href: "/tools/developer-tools/password-strength" },
      ]}
    >
      <UuidGeneratorClient />
    </ToolLayout>
  );
}
