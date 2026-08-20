import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UsernameGeneratorClient from "./UsernameGeneratorClient";

export const metadata: Metadata = {
  title: "Username Generator - Cool Usernames Online | MultiTool",
  description: "Generate cool, unique usernames for games, social media and more. Mix styles, leet variations and copy with one click. Free, no sign-up.",
  keywords: ["username generator", "cool usernames", "gamertag generator", "name ideas", "social media username"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/username-generator",
  },
  openGraph: {
    title: "Username Generator - Cool Usernames Online | MultiTool",
    description: "Generate cool, unique usernames for games, social media and more. Mix styles, leet variations and copy with one click. Free, no sign-up.",
    url: "https://www.multitoolbox.online/tools/generators/username-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Username Generator - Cool Usernames Online | MultiTool",
    description: "Generate cool, unique usernames for games, social media and more. Mix styles, leet variations and copy with one click. Free, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Username Generator - Cool Usernames Online | MultiTool"
      description="Generate cool, unique usernames for games, social media and more. Mix styles, leet variations and copy with one click. Free, no sign-up."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="username-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Generate cool, unique usernames for games, social media and more. Mix styles, leet variations and copy with one click. Free, no sign-up.
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
        { question: "Are the usernames unique?", answer: "Each generation creates unique combinations from word lists, so duplicates within a batch are avoided. Availability on each platform still needs checking." },
        { question: "What styles are available?", answer: "Mix (adjective+noun), Word (clean combos) and Leet (letters replaced with numbers like 5h4d0w). Add suffixes and numbers for more variety." },
        { question: "Can I generate many at once?", answer: "Yes — choose up to 20 usernames per batch and copy each one individually." },
        { question: "Are they good for gaming?", answer: "Absolutely — the style is built for gamertags: cool, short and memorable. Try the leet style for an edgy look." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive and touch-friendly." },
        { question: "Is my data private?", answer: "Yes — everything runs in your browser. Nothing is sent or stored." }
      ]}
      relatedTools={[
        { name: "Password Generator", href: "/tools/generators/password-generator" },
        { name: "Love Calculator", href: "/tools/generators/love-calculator" },
        { name: "Random Word Generator", href: "/tools/generators/random-word-generator" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" }
      ]}
    >
      <UsernameGeneratorClient />
    </ToolLayout>
  );
}
