import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PasswordStrengthClient from "./PasswordStrengthClient";

export const metadata: Metadata = {
  title: "Password Strength Checker - Test Passwords | MultiTool",
  description: "Check how strong your password is: score from very weak to strong, entropy estimate and 6 security checks. 100% local.",
  keywords: ["password strength", "password checker", "password test", "strong password", "verificador de senha"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/password-strength",
  },
  openGraph: {
    title: "Password Strength Checker - Test Passwords | MultiTool",
    description: "Check how strong your password is: score from very weak to strong, entropy estimate and 6 security checks. 100% local.",
    url: "https://www.multitoolbox.online/tools/developer-tools/password-strength",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Strength Checker - Test Passwords | MultiTool",
    description: "Check how strong your password is: score from very weak to strong, entropy estimate and 6 security checks. 100% local.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Password Strength Checker - Test Passwords | MultiTool"
      description="Check how strong your password is: score from very weak to strong, entropy estimate and 6 security checks. 100% local."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="password-strength"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type a password and watch the score update live: length, character variety, patterns, common passwords and estimated entropy bits. Everything is evaluated locally — nothing is sent anywhere.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What a strength checker can and cannot know
          </h2>
          <p className="mb-4">
            This tool estimates strength from <strong>entropy</strong> —
            length plus variety of characters — and flags the patterns
            crackers try first: dictionary words, keyboard walks
            (qwerty…123), repeated characters and predictable substitutions
            (a→@, o→0 add almost nothing; every cracking tool tries them
            automatically).
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Length is the lever that matters:</strong> each additional random character multiplies the work to crack it; symbols are garnish. The difference between 8 and 14 characters is days versus centuries.</li>
            <li><strong>What it cannot know:</strong> whether the password is reused on other sites, appears in a public data leak, or is written on a sticky note. Those risks sink more accounts than weak entropy ever did.</li>
            <li><strong>The three rules that actually protect you:</strong> unique password per site (a manager makes this easy), long and random where it matters, and 2FA on email and finance.</li>
            <li><strong>Checking is safe here:</strong> the analysis runs locally in your browser — nothing is transmitted or stored. Still, prefer testing variations rather than pasting your real, current passwords anywhere.</li>
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
        { question: "What is entropy?", answer: "A measure of unpredictability in bits. Each bit doubles the guesses needed: 50+ bits is reasonable, 80+ is strong." },
        { question: "Why is length the most important factor?", answer: "Every extra character multiplies the combinations exponentially, far more than adding symbols does." },
        { question: "What passwords are flagged as common?", answer: "A list of the most breached passwords (password, 123456, qwerty…) is checked locally." },
        { question: "Is my password sent to a server?", answer: "No — the check runs entirely in your browser. Nothing is transmitted." },
        { question: "What makes a strong password?", answer: "12+ characters mixing cases, numbers and symbols, without patterns like aaa or 123." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
        { name: "Password Generator", href: "/tools/generators/password-generator" },
        { name: "Text Encryptor", href: "/tools/text-tools/text-encryptor" },
      ]}
    >
      <PasswordStrengthClient />
    </ToolLayout>
  );
}
