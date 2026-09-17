import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TextEncryptorClient from "./TextEncryptorClient";

export const metadata: Metadata = {
  title: "Text Encryptor - AES-256 Encrypt & Decrypt | MultiTool",
  description: "Encrypt any text with AES-256-GCM using a passphrase, and decrypt it back. Military-grade cryptography, 100% in your browser.",
  keywords: ["text encryptor", "encrypt text", "aes encryption", "decrypt text", "cipher online", "criptografar texto"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/text-encryptor",
  },
  openGraph: {
    title: "Text Encryptor - AES-256 Encrypt & Decrypt | MultiTool",
    description: "Encrypt any text with AES-256-GCM using a passphrase, and decrypt it back. Military-grade cryptography, 100% in your browser.",
    url: "https://www.multitoolbox.online/tools/text-tools/text-encryptor",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Encryptor - AES-256 Encrypt & Decrypt | MultiTool",
    description: "Encrypt any text with AES-256-GCM using a passphrase, and decrypt it back. Military-grade cryptography, 100% in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Text Encryptor - AES-256 Encrypt & Decrypt | MultiTool"
      description="Encrypt any text with AES-256-GCM using a passphrase, and decrypt it back. Military-grade cryptography, 100% in your browser."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="text-encryptor"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type your text and a passphrase, then encrypt. The output is a compact Base64 payload (salt + IV + ciphertext). Paste it back with the same passphrase to decrypt — nowhere else can.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Encoding, hashing, encryption — the 30-second version
          </h2>
          <p className="mb-4">
            Three words people mix up constantly, each with a different
            job:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Encoding</strong> (Base64, URL-encode) makes data travel safely — anyone can reverse it. It protects <em>format</em>, not <em>secrets</em>.</li>
            <li><strong>Hashing</strong> (SHA-256…) is a one-way fingerprint — great for verifying integrity and passwords, impossible to “decrypt”.</li>
            <li><strong>Encryption</strong> (what this tool does) transforms text so only someone with the <strong>key</strong> can read it back. The key is the secret — not the algorithm.</li>
          </ul>
          <p className="mb-4">
            This tool applies real symmetric encryption in your browser:
            type a message, choose a passphrase, and the ciphertext can
            only be reversed with the same passphrase. Use cases that make
            sense: sharing a note with someone who will receive the key
            through another channel, keeping a diary entry scrambled from
            prying eyes, or adding a layer to a message that must cross
            insecure hands.
          </p>
          <p className="mb-4">
            One honest rule: for serious confidentiality (legal, medical,
            corporate), use audited tools and key management — a browser
            cipher is excellent for everyday privacy, not for state
            secrets.
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
        { question: "What algorithm is used?", answer: "AES-256-GCM — the same authenticated encryption used in TLS, with PBKDF2 key derivation (100,000 iterations)." },
        { question: "Is it secure?", answer: "Yes — encryption happens locally with the Web Crypto API. Your text and passphrase never leave your device." },
        { question: "What if I forget the passphrase?", answer: "The data is mathematically unrecoverable. There is no backdoor — keep your passphrase safe." },
        { question: "Can someone decrypt without the passphrase?", answer: "No — without the passphrase, brute-forcing AES-256 would take longer than the age of the universe." },
        { question: "Why is the output so long?", answer: "It stores the salt and IV needed to decrypt, plus the ciphertext and authentication tag." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
        { name: "Base64 Encoder / Decoder", href: "/tools/developer-tools/base64-encoder" },
        { name: "Password Strength Checker", href: "/tools/developer-tools/password-strength" },
        { name: "Morse Code Translator", href: "/tools/text-tools/morse-code" },
      ]}
    >
      <TextEncryptorClient />
    </ToolLayout>
  );
}
