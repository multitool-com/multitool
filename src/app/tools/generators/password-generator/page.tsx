import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PasswordGeneratorClient from "./PasswordGeneratorClient";

export const metadata: Metadata = {
  title: "Password Generator - Free Strong Random Passwords | MultiTool",
  description:
    "Generate strong, secure random passwords instantly. Free online password generator with customizable length, symbols, numbers and copy-to-clipboard.",
  keywords: [
    "password generator",
    "strong password",
    "secure password generator",
    "random password",
    "password creator",
    "free password generator",
    "safe password",
    "wifi password generator",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/password-generator",
  },
  openGraph: {
    title: "Password Generator - Free Strong Random Passwords | MultiTool",
    description:
      "Generate strong, secure passwords instantly. Customizable, private, and free.",
    url: "https://www.multitoolbox.online/tools/generators/password-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator - Free Strong Random Passwords",
    description:
      "Generate strong, secure passwords instantly. Customizable, private, and free.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure random passwords instantly. Customize length, character types and copy with one click."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="password-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why use a password generator?
          </h2>
          <p className="mb-4">
            The strongest passwords are <strong>long, random and unique</strong>.
            Humans are terrible at creating random passwords — we tend to reuse
            them, use predictable patterns (like &quot;password123&quot; or a
            child&apos;s birthday), or make them too short. A password
            generator eliminates these problems by using cryptographic
            randomness to create passwords that are virtually impossible to
            guess or crack.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What makes a password strong?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Length</strong> — the single most important factor. A
              12-character password takes days to crack; a 16-character
              password could take centuries.
            </li>
            <li>
              <strong>Variety</strong> — mixing uppercase, lowercase, numbers
              and symbols exponentially increases the number of possible
              combinations.
            </li>
            <li>
              <strong>Randomness</strong> — no words, no patterns, no
              personal info. Truly random strings are the hardest to guess.
            </li>
            <li>
              <strong>Uniqueness</strong> — never reuse passwords between
              accounts. If one is leaked, all your accounts stay safe.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How this generator works
          </h2>
          <p className="mb-4">
            Our password generator uses your browser&apos;s built-in{" "}
            <strong>Web Crypto API</strong> (specifically{" "}
            <code className="font-mono text-xs bg-paper border border-ink/10 rounded px-1.5 py-0.5">
              crypto.getRandomValues()
            </code>
            ) — the same cryptographic source used by banking sites and
            password managers. This produces true random values, not
            predictable pseudo-random ones.
          </p>
          <p className="mb-4">
            You can customize the length (8 to 128 characters) and choose
            which character types to include. You can also exclude ambiguous
            characters like <strong>l, 1, I, O, 0</strong> to make passwords
            easier to type manually.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Best practices for password security
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Use at least <strong>16 characters</strong> for important
              accounts (email, banking)
            </li>
            <li>
              Store passwords in a <strong>reputable password manager</strong>{" "}
              (Bitwarden, 1Password, etc.) — never in plain text or sticky
              notes
            </li>
            <li>
              Enable <strong>two-factor authentication (2FA)</strong> wherever
              possible
            </li>
            <li>
              <strong>Never reuse</strong> the same password across multiple
              sites
            </li>
            <li>
              Change passwords immediately if a service reports a data breach
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            <strong>All passwords are generated locally in your browser.</strong>{" "}
            Nothing is sent to any server, nothing is stored, and nothing is
            logged. You can even disconnect from the internet after loading
            this page — it will still work perfectly.
          </p>
        </>
      }
      faqs={[
        {
          question: "Are these passwords truly random?",
          answer:
            "Yes. We use the browser's Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random values — the same standard used by banks, password managers and security software.",
        },
        {
          question: "Is my password sent to any server?",
          answer:
            "No, absolutely not. Passwords are generated entirely in your browser using JavaScript. Nothing is sent, stored or logged anywhere. You can verify this by disconnecting from the internet — the tool will still work.",
        },
        {
          question: "How long should my password be?",
          answer:
            "For most accounts, 16 characters is a good minimum. For sensitive accounts (email, banking, password manager master password), aim for 20+ characters. Length matters more than complexity — a long random password is stronger than a short complex one.",
        },
        {
          question: "What are ambiguous characters and why exclude them?",
          answer:
            "Ambiguous characters like l (lowercase L), 1 (one), I (uppercase i), O (uppercase o) and 0 (zero) can be visually confused. Excluding them makes passwords easier to read and type manually, but reduces the pool of characters slightly. If you use a password manager, you don't need to exclude them.",
        },
        {
          question: "Should I include symbols?",
          answer:
            "Yes, if the website allows them. Symbols dramatically increase the number of possible combinations, making brute-force attacks much harder. However, some legacy systems don't accept symbols — in that case, just increase the length to compensate.",
        },
        {
          question: "How should I store the generated password?",
          answer:
            "Use a reputable password manager like Bitwarden (free, open-source), 1Password or KeePass. Never store passwords in plain text files, browser autofill without a master password, or on sticky notes. A password manager is safer than any password you can memorize.",
        },
      ]}
      relatedTools={[
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
      ]}
    >
      <PasswordGeneratorClient />
    </ToolLayout>
  );
}