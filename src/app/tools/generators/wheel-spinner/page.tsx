import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WheelSpinnerClient from "./WheelSpinnerClient";

export const metadata: Metadata = {
  title: "Wheel Spinner - Random Picker | MultiTool",
  description: "Spin the wheel to pick a random winner from your list. Add options, spin with animation, and get a fair result every time.",
  keywords: ["wheel spinner", "random picker", "spin the wheel", "name picker", "roleta online"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/wheel-spinner",
  },
  openGraph: {
    title: "Wheel Spinner - Random Picker | MultiTool",
    description: "Spin the wheel to pick a random winner from your list. Add options, spin with animation, and get a fair result every time.",
    url: "https://multitoolbox.online/tools/generators/wheel-spinner",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheel Spinner - Random Picker | MultiTool",
    description: "Spin the wheel to pick a random winner from your list. Add options, spin with animation, and get a fair result every time.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Wheel Spinner - Random Picker | MultiTool"
      description="Spin the wheel to pick a random winner from your list. Add options, spin with animation, and get a fair result every time."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="wheel-spinner"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type your options (one per line), then spin. The wheel animates through several rotations and lands on a randomly selected winner with a satisfying reveal.
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
        { question: "Is the result fair?", answer: "Yes — the winner is chosen with the browser's random generator before the wheel animates to it." },
        { question: "How many options can I add?", answer: "As many as you like; each gets an equal slice and a distinct color." },
        { question: "Can I reuse the same list?", answer: "Yes — the list stays in the text area, so spin as many times as you need." },
        { question: "What can I use it for?", answer: "Picking winners in giveaways, deciding where to eat, choosing a team member or any random decision." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive with touch support." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Giveaway Picker", href: "/tools/generators/giveaway-picker" },
        { name: "Dice Roller", href: "/tools/generators/dice-roller" },
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
      ]}
    >
      <WheelSpinnerClient />
    </ToolLayout>
  );
}
