import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RatioCalculatorClient from "./RatioCalculatorClient";

export const metadata: Metadata = {
  title: "Ratio Calculator - Simplify & Solve for X | MultiTool",
  description: "Simplify any ratio (12:8 to 3:2) or solve for the missing value in a proportion a:b = c:x. Free and instant.",
  keywords: ["ratio calculator", "simplify ratio", "ratio solver", "proportion calculator", "solve for x ratio"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/ratio-calculator",
  },
  openGraph: {
    title: "Ratio Calculator - Simplify & Solve for X | MultiTool",
    description: "Simplify any ratio (12:8 to 3:2) or solve for the missing value in a proportion a:b = c:x. Free and instant.",
    url: "https://www.multitoolbox.online/tools/math/ratio-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratio Calculator - Simplify & Solve for X | MultiTool",
    description: "Simplify any ratio (12:8 to 3:2) or solve for the missing value in a proportion a:b = c:x. Free and instant.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Ratio Calculator - Simplify & Solve for X | MultiTool"
      description="Simplify any ratio (12:8 to 3:2) or solve for the missing value in a proportion a:b = c:x. Free and instant."
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="ratio-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Two modes: Simplify reduces any pair to its lowest form using the greatest common divisor, and Solve for X computes the missing term of a proportion with a step-by-step explanation.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Ratios, proportions and scaling
          </h2>
          <p className="mb-4">
            A ratio compares two quantities (2:3), and a proportion states
            two ratios are equal (2:3 = 4:6). Scaling is just solving for
            the missing piece — the classic{" "}
            <strong>cross-multiplication</strong>:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              a : b = c : x  →  x = (b × c) ÷ a
            </p>
          </div>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Recipes:</strong> a cake for 4 uses 2 cups flour to 3 cups milk; for 10 guests, scale both by 2.5 — the taste is identical because the ratio is.</li>
            <li><strong>Part-to-part vs part-to-whole:</strong> “2:3 flour to milk” is part-to-part; “2 of every 5 parts is flour” is part-to-whole. Mixing them up is the #1 ratio mistake.</li>
            <li><strong>Maps and models:</strong> scale 1:50 means one measured unit represents 50 real units — architects and model builders live on this.</li>
            <li><strong>Screen proportions:</strong> 16:9 is a ratio; that is why aspect ratios and this calculator are cousins.</li>
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
        { question: "How do I simplify a ratio?", answer: "Divide both numbers by their greatest common divisor. Example: 12:8 divided by 4 gives 3:2." },
        { question: "How do I solve a proportion?", answer: "For a:b = c:x, x = (b x c) / a. The tool shows the full calculation." },
        { question: "Where are ratios used?", answer: "Recipes, scaling designs, mixing solutions, odds and financial ratios like debt-to-equity." },
        { question: "Can the ratio have decimals?", answer: "The tool rounds to whole numbers for the simplified form; use Solve for X for decimal results." },
        { question: "What does a:b mean?", answer: "For every a units of the first quantity there are b units of the second." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" },
        { name: "Percentage Change Calculator", href: "/tools/math/percentage-change" },
        { name: "Aspect Ratio Calculator", href: "/tools/math/aspect-ratio-calculator" },
        { name: "Geometry Calculator", href: "/tools/math/geometry-calculator" },
      ]}
    >
      <RatioCalculatorClient />
    </ToolLayout>
  );
}
