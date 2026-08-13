import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JwtDecoderClient from "./JwtDecoderClient";

export const metadata: Metadata = {
  title: "JWT Decoder - Decode JSON Web Tokens Online | MultiTool",
  description:
    "Free online JWT decoder. Decode the header and payload of any JSON Web Token (JWT) into readable JSON instantly. 100% in your browser, no sign-up.",
  keywords: [
    "jwt decoder",
    "jwt decode",
    "json web token decoder",
    "decode jwt online",
    "jwt parser",
    "jwt inspector",
    "jwt io alternative",
    "base64url decode",
    "jwt header",
    "jwt payload",
    "decode token online",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder - Decode JSON Web Tokens Online | MultiTool",
    description:
      "Paste any JWT and read its header, payload and claims in clean JSON. Free and private.",
    url: "https://multitoolbox.online/tools/developer-tools/jwt-decoder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder - Free & Instant",
    description: "Decode JWT header and payload in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="JWT Decoder"
      description="Paste any JSON Web Token and read its header, payload and claims as readable JSON. Decoding happens locally in your browser."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="jwt-decoder"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a JWT?
          </h2>
          <p className="mb-4">
            A <strong>JSON Web Token (JWT)</strong> is a compact string used to
            transmit claims between parties — for example to keep a user logged
            in. It has three parts separated by dots:{" "}
            <code className="bg-paper px-1 rounded">header.payload.signature</code>
            . Each part is <strong>base64url</strong> encoded, which is why the
            token looks like random letters and numbers.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Paste a JWT (or click “Load sample”).</li>
            <li>Read the header — algorithm and token type.</li>
            <li>Read the payload — the claims (subject, expiry, roles…).</li>
            <li>Copy the decoded JSON with one click.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The three parts
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Header</strong> — metadata such as the signing algorithm
              (<code className="bg-paper px-1 rounded">HS256</code>,{" "}
              <code className="bg-paper px-1 rounded">RS256</code>…).
            </li>
            <li>
              <strong>Payload</strong> — the claims:{" "}
              <code className="bg-paper px-1 rounded">sub</code> (subject),{" "}
              <code className="bg-paper px-1 rounded">exp</code> (expiry),{" "}
              <code className="bg-paper px-1 rounded">iat</code> (issued at),
              <code className="bg-paper px-1 rounded"> aud</code> (audience) and
              any custom data.
            </li>
            <li>
              <strong>Signature</strong> — proves the token was not tampered
              with. This tool decodes it but does not verify it (verification
              needs the secret or public key).
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Decoding runs entirely in your browser. Your token is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a JWT?",
          answer:
            "A JSON Web Token is a three-part string (header.payload.signature) used to pass claims between systems, such as login sessions or API access. Each part is base64url-encoded JSON.",
        },
        {
          question: "Can I decode a JWT without the secret?",
          answer:
            "Yes. The header and payload are only encoded, not encrypted. Anyone can read them — which is exactly why you should never put passwords or sensitive data inside a token payload.",
        },
        {
          question: "Does this tool verify the signature?",
          answer:
            "No. It decodes the three parts only. Verifying a signature requires the HMAC secret (HS256) or the public key (RS256 / ES256), which this free tool does not ask for.",
        },
        {
          question: "Is a JWT encrypted?",
          answer:
            "No. Base64url is an encoding, not encryption. Anyone who obtains a token can read its header and payload. Use JWE for encryption, or keep sensitive data out of the payload.",
        },
        {
          question: "Why does my token show an error?",
          answer:
            "A valid JWT must have exactly three parts separated by dots, and the header and payload must be valid base64url JSON. Check that you copied the full token, including the last dot and signature.",
        },
        {
          question: "Is it safe to paste my token here?",
          answer:
            "Yes — everything runs in your browser and nothing is uploaded. Still, avoid pasting tokens from production environments into any online tool as a general security habit.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Base64 Encoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
      ]}
    >
      <JwtDecoderClient />
    </ToolLayout>
  );
}
