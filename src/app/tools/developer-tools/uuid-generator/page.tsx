import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UuidGeneratorClient from "./UuidGeneratorClient";

export const metadata: Metadata = {
  title: "UUID Generator - v4 Random UUIDs | MultiTool",
  description: "Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool.",
  keywords: ["uuid generator", "uuid v4", "generate uuid", "guid generator", "random uuid"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator - v4 Random UUIDs | MultiTool",
    description: "Generate 1 to 100 cryptographically secure random UUIDs (v4) at once, in upper or lower case. Free developer tool.",
    url: "https://www.multitoolbox.online/tools/developer-tools/uuid-generator",
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
            UUIDs explained
          </h2>
          <p className="mb-4">
            A version 4 UUID contains <strong>122 random bits</strong>. The
            math: even generating a billion UUIDs per second, you would need
            about 10 years to have a 50% chance of a single collision. In
            practice: unique forever.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Where used:</strong> database keys, distributed systems, trace/request IDs, unique file names.</li>
            <li><strong>Identifier, not secret</strong> — a UUID proves uniqueness, not ownership. Never use one as a password or API key.</li>
            <li><strong>Uppercase toggle</strong> — same value, different visual style; some legacy systems expect caps.</li>
          </ul>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            A peek inside a UUID
          </h2>
          <p className="mb-4">
            Look closely at a v4 UUID:{" "}
            <code className="font-mono bg-paper px-1 rounded">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>.
            The <strong>4</strong> marks the version; the first character of
            the third group (<strong>y</strong>) is always 8, 9, a or b —
            the variant marker. You are literally seeing the structure of
            the standard in every ID.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>1 in 10²²:</strong> the chance of a single collision in a system generating a billion v4 UUIDs per year for 100 years. Engineering practice treats them as unique with confidence.</li>
            <li><strong>UUID v7 — the new trend:</strong> time-ordered IDs (timestamp prefix + randomness) that sort chronologically, perfect as database keys in modern systems.</li>
            <li><strong>How many do you need?</strong> Generate in bulk here for data seeding, trace IDs, test fixtures, unique file names — with one click each copies cleanly.</li>
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
