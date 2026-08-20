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
