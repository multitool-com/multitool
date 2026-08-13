import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PercentageChangeClient from "./PercentageChangeClient";

export const metadata: Metadata = {
  title: "Percentage Increase / Decrease Calculator | MultiTool",
  description:
    "Free percentage change calculator. Find the percent increase or decrease between two numbers, plus the absolute difference. Instant, private, no sign-up.",
  keywords: [
    "percentage change",
    "percent increase",
    "percent decrease",
    "percentage increase calculator",
    "percentage decrease calculator",
    "percent difference",
    "percent change formula",
    "how to calculate percentage change",
    "increase decrease calculator",
    "percentage growth",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/math/percentage-change",
  },
  openGraph: {
    title: "Percentage Increase / Decrease Calculator | MultiTool",
    description:
      "Calculate percent increase or decrease between two numbers instantly.",
    url: "https://multitoolbox.online/tools/math/percentage-change",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Increase / Decrease - Free",
    description:
      "Find the percent change between two numbers. Instant and private.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Percentage Increase / Decrease"
      description="Calculate the percentage change between an original value and a new value. See whether it went up or down, and by how much."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="percentage-change"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            The percentage change formula
          </h2>
          <p className="mb-3">
            Percentage change answers: “how big is the move from A to B,
            relative to A?”
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 font-mono text-sm">
            change % = ((new − original) ÷ original) × 100
          </div>
          <p className="mb-4">
            Example: a price goes from <strong>80 to 100</strong>.
            (100 − 80) ÷ 80 × 100 = <strong>+25%</strong> (increase).
            From 100 back to 80 is <strong>−20%</strong> (decrease). The
            two directions are not the same size — that is expected.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Enter the <strong>original</strong> value (the starting
              number).
            </li>
            <li>
              Enter the <strong>new</strong> value.
            </li>
            <li>
              Read the <strong>percent change</strong>, the absolute
              difference and whether it is an increase or a decrease.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Increase vs decrease vs “difference”
          </h2>
          <p className="mb-4">
            <strong>Percentage change</strong> is always relative to the
            original number and can be negative.{" "}
            <strong>Percentage difference</strong> is a different formula
            (usually the gap divided by the average of the two numbers)
            and is always positive. This tool does <em>change</em>, which
            is what people mean by “sales were up 12%”.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            A zero original value
          </h2>
          <p className="mb-4">
            You cannot divide by zero. If the original value is 0, a
            percentage change is undefined (going from nothing to
            something is not a finite percent).
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All math runs in your browser. Your numbers are{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the formula for percentage increase?",
          answer:
            "((new − original) / original) × 100. A positive result is an increase. A negative result is a decrease. Example: 50 → 75 is +50%.",
        },
        {
          question: "Why is 100 → 80 a 20% decrease, but 80 → 100 a 25% increase?",
          answer:
            "Each percent is relative to a different starting point. 20 is 20% of 100, but 25% of 80. The calculator is doing that on purpose.",
        },
        {
          question: "Is percentage change the same as percentage difference?",
          answer:
            "No. Change uses the original value as the base and can be signed (+/−). Difference usually uses the average of the two numbers and is unsigned. Use change for growth rates.",
        },
        {
          question: "Can I calculate a percent decrease in price?",
          answer:
            "Yes. Put the old price as Original and the sale price as New. A $40 item on sale for $30 is a 25% decrease.",
        },
        {
          question: "What if the original number is zero?",
          answer:
            "Percentage change is undefined. The tool shows a dash instead of a fake number. Going from 0 to 10 is not “infinity percent” in any useful business sense.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded or stored.",
        },
      ]}
      relatedTools={[
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" },
        { name: "GPA Calculator", href: "/tools/math/gpa-calculator" },
        { name: "Ratio Calculator", href: "/tools/math/ratio-calculator" },
        { name: "Geometry Calculator", href: "/tools/math/geometry-calculator" },
      ]}
    >
      <PercentageChangeClient />
    </ToolLayout>
  );
}