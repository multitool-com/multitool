import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PercentageCalculatorClient from "./PercentageCalculatorClient";

export const metadata: Metadata = {
  title: "Percentage Calculator - What is X% of Y | MultiTool",
  description:
    "Free online percentage calculator. Instantly find what X% of Y is, with the formula and examples. Fast, private, no sign-up — runs entirely in your browser.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "what is x percent of y",
    "calculate percentage of a number",
    "percentage of a number",
    "how to calculate percentage",
    "percent calculator online",
  ],
  alternates: {
    canonical:
      "https://www.multitoolbox.online/tools/finance/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator - What is X% of Y | MultiTool",
    description:
      "Free online percentage calculator. Instantly find what X% of Y is, with formula and examples — everything runs in your browser.",
    url: "https://www.multitoolbox.online/tools/finance/percentage-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator - What is X% of Y",
    description:
      "Free online percentage calculator. Instant, private, no sign-up.",
  },
};

export default function PercentageCalculatorPage() {
  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Quickly calculate what percentage of a number is. Enter a percentage and a value below to get an instant result."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="percentage-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to calculate a percentage
          </h2>
          <p className="mb-4">
            To find what a percentage of a number is, multiply the number by
            the percentage and divide by 100:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Result = (Percentage ÷ 100) × Value
            </p>
          </div>
          <p className="mb-4">
            For example, to find 10% of 200, you calculate (10 ÷ 100) × 200,
            which equals 20. The same formula works for any values — sales
            tax, discounts, tips, interest rates, test scores or progress
            toward a goal.
          </p>
          <p className="mb-4">
            A quick mental shortcut for common cases: 10% of any number is
            just that number with the decimal point moved one place left
            (10% of 250 = 25). Double it for 20%, halve it for 5%, and
            combine them for values like 15% (10% + 5%).
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All calculations happen instantly in your browser. Your values
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I calculate a percentage of a number?",
          answer:
            "Multiply the number by the percentage and divide by 100. Example: 15% of 80 = (15 ÷ 100) × 80 = 12. Or simply type both values in the calculator above for an instant answer.",
        },
        {
          question: "What is the percentage formula?",
          answer:
            "Part = (Percentage ÷ 100) × Whole. For example, 25% of 200 = (25 ÷ 100) × 200 = 50. This is the same as multiplying the whole by the decimal form of the percentage (200 × 0.25).",
        },
        {
          question: "Can I use decimal percentages like 12.5%?",
          answer:
            "Yes. The calculator accepts decimals. For example, 12.5% of 80 = (12.5 ÷ 100) × 80 = 10. This is useful for tax rates like 7.25% or loan rates like 3.75%.",
        },
        {
          question: "How do I quickly calculate 10%, 15% or 20% of a value?",
          answer:
            "Move the decimal point one place to the left to get 10% (10% of 45 = 4.5). For 20%, double that (9). For 5%, halve it (2.25). For 15%, add 10% + 5% (4.5 + 2.25 = 6.75).",
        },
        {
          question: "Does this calculator work on mobile?",
          answer:
            "Yes. The calculator is fully responsive and works on any modern browser — desktop, tablet or phone. There is nothing to install and no account required.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Every calculation runs locally in your browser. Your numbers are never transmitted to a server and never stored anywhere.",
        },
      ]}
      relatedTools={[
        {
          name: "Discount Calculator",
          href: "/tools/finance/discount-calculator",
        },
        { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
        { name: "Loan Calculator", href: "/tools/finance/loan-calculator" },
        {
          name: "Compound Interest Calculator",
          href: "/tools/finance/compound-interest",
        },
      ]}
    >
      <PercentageCalculatorClient />
    </ToolLayout>
  );
}
