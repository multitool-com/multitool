import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RandomNumberGeneratorClient from "./RandomNumberGeneratorClient";

export const metadata: Metadata = {
  title: "Random Number Generator - No Repeats, Sorted | MultiTool",
  description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
  keywords: ["random number generator", "random number between", "random integer generator", "lottery numbers", "numero aleatorio"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/random-number-generator",
  },
  openGraph: {
    title: "Random Number Generator - No Repeats, Sorted | MultiTool",
    description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
    url: "https://www.multitoolbox.online/tools/generators/random-number-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Number Generator - No Repeats, Sorted | MultiTool",
    description: "Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Random Number Generator - No Repeats, Sorted | MultiTool"
      description="Generate random numbers in any range, with options for unique values, sorting and up to 1000 numbers at once. Free."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="random-number-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Set the minimum and maximum, choose how many numbers (up to 1000) and toggle no-repeats and sorting. Perfect for draws, testing and learning probability.
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
        { question: "Are the numbers truly random?", answer: "They use the browser's cryptographic random generator where available — strong enough for any practical use." },
        { question: "Can I avoid repeats?", answer: "Yes — enable No repeats; the tool then shuffles the range and picks unique values." },
        { question: "How many numbers can I generate?", answer: "Up to 1000 at once, limited only by your range when uniqueness is on." },
        { question: "Can I sort the result?", answer: "Yes — toggle Sort ascending to order the output." },
        { question: "Can I use decimals?", answer: "The tool generates integers. For decimals, use the statistics or scientific calculator." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Dice Roller", href: "/tools/generators/dice-roller" },
        { name: "Wheel Spinner", href: "/tools/generators/wheel-spinner" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
        { name: "Giveaway Picker", href: "/tools/generators/giveaway-picker" },
      ]}
    >
      <RandomNumberGeneratorClient />
    </ToolLayout>
  );
}
