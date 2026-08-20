import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FractionCalculatorClient from "./FractionCalculatorClient";

export const metadata: Metadata = {
  title: "Fraction Calculator - Add, Subtract, Multiply, Divide | MultiTool",
  description: "Add, subtract, multiply and divide fractions with instant simplification and step-by-step results, including mixed numbers.",
  keywords: ["fraction calculator", "add fractions", "simplify fractions", "fraction simplifier", "mixed number calculator", "calculadora de fracoes"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/fraction-calculator",
  },
  openGraph: {
    title: "Fraction Calculator - Add, Subtract, Multiply, Divide | MultiTool",
    description: "Add, subtract, multiply and divide fractions with instant simplification and step-by-step results, including mixed numbers.",
    url: "https://www.multitoolbox.online/tools/math/fraction-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraction Calculator - Add, Subtract, Multiply, Divide | MultiTool",
    description: "Add, subtract, multiply and divide fractions with instant simplification and step-by-step results, including mixed numbers.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Fraction Calculator - Add, Subtract, Multiply, Divide | MultiTool"
      description="Add, subtract, multiply and divide fractions with instant simplification and step-by-step results, including mixed numbers."
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="fraction-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter two fractions (numerator over denominator), pick an operation and the tool computes the result instantly, always reduced to its simplest form — with the decimal equivalent shown as well.
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
        { question: "How do I add fractions?", answer: "Find a common denominator (multiply both denominators), convert the numerators, add them, then simplify. The tool does this for you." },
        { question: "Can it handle mixed numbers?", answer: "The result is displayed as a mixed number when the numerator is larger than the denominator, e.g. 7/2 becomes 3 1/2." },
        { question: "Why can't the denominator be zero?", answer: "Division by zero is undefined in mathematics, so the tool rejects it." },
        { question: "Does it simplify automatically?", answer: "Yes — every result is reduced using the greatest common divisor." },
        { question: "Can I multiply and divide fractions?", answer: "Yes — multiply straight across, and divide by flipping the second fraction and multiplying." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Percentage Change Calculator", href: "/tools/math/percentage-change" },
        { name: "Ratio Calculator", href: "/tools/math/ratio-calculator" },
        { name: "Scientific Calculator", href: "/tools/math/scientific-calculator" },
        { name: "GPA Calculator", href: "/tools/math/gpa-calculator" },
      ]}
    >
      <FractionCalculatorClient />
    </ToolLayout>
  );
}
