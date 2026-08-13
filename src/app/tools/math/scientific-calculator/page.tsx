import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ScientificCalculatorClient from "./ScientificCalculatorClient";

export const metadata: Metadata = {
  title: "Scientific Calculator - Free Online Calculator | MultiTool",
  description:
    "Free online scientific calculator. Trigonometry, logarithms, powers, roots, π and constants. Keyboard support, history and copy results. 100% in your browser.",
  keywords: [
    "scientific calculator",
    "online calculator",
    "calculator online free",
    "trigonometry calculator",
    "log calculator",
    "math calculator",
    "scientific calculator online",
    "cos sin tan calculator",
    "square root calculator",
    "pi calculator",
    "algebra calculator",
    "engineering calculator",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/math/scientific-calculator",
  },
  openGraph: {
    title: "Scientific Calculator - Free Online | MultiTool",
    description:
      "Full scientific calculator in your browser: trig, logs, powers, roots. Free and private.",
    url: "https://multitoolbox.online/tools/math/scientific-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scientific Calculator - Free & Instant",
    description: "Calculate anything with trig, logs and powers. No install.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Scientific Calculator"
      description="A full scientific calculator in your browser: trigonometry, logarithms, powers and roots, π and e, keyboard support and calculation history."
      categoryName="Math & Education"
      categorySlug="math"
      toolSlug="scientific-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What can it do?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Trigonometry</strong> — sin, cos, tan, arcsin,
              arccos, arctan (degrees or radians).
            </li>
            <li>
              <strong>Logarithms</strong> — log base 10, ln (natural log),
              and any base with xʸ.
            </li>
            <li>
              <strong>Powers &amp; roots</strong> — x², xʸ, √, ∛, and
              reciprocals (1/x).
            </li>
            <li>
              <strong>Constants</strong> — π and e, plus parentheses for
              grouping.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Click the buttons or type with your keyboard (0–9, + − × ÷, .).</li>
            <li>Toggle DEG / RAD before using trigonometry.</li>
            <li>Press = (or Enter) to calculate.</li>
            <li>Every result is saved in history — click an entry to reuse it.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Keyboard shortcuts
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Enter</strong> — calculate · <strong>Backspace</strong>{" "}
              — delete last · <strong>Escape</strong> — clear all
            </li>
            <li>
              <strong>*</strong> multiply · <strong>/</strong> divide ·{" "}
              <strong>^</strong> power · <strong>( )</strong> parentheses
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Degrees or radians?
          </h2>
          <p className="mb-4">
            Trigonometry works in the unit you choose. In{" "}
            <strong>degrees</strong>, sin(30) = 0.5. In{" "}
            <strong>radians</strong>, sin(π/6) = 0.5. The default is
            degrees — switch to radians for calculus and physics.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The calculator runs entirely in your browser. Nothing you type
            is <strong>ever sent to any server</strong> or stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is this calculator free?",
          answer:
            "Yes, completely free with no sign-up, no ads and nothing to install. It runs in your browser and works offline after the page loads.",
        },
        {
          question: "How do I calculate trigonometric functions?",
          answer:
            "Choose DEG or RAD first, then press sin, cos or tan and enter the angle. For example, DEG + sin(30) = 0.5. For inverse functions use asin, acos or atan.",
        },
        {
          question: "How do I calculate logarithms?",
          answer:
            "Press log for base-10 logarithm or ln for the natural logarithm, then enter the number. For any other base, use the formula log_b(x) = ln(x) ÷ ln(b), or press xʸ.",
        },
        {
          question: "Can I use the keyboard?",
          answer:
            "Yes. Numbers and operators work directly, Enter calculates, Backspace deletes the last character and Escape clears everything. The ^ key is the power operator.",
        },
        {
          question: "What is the difference between DEG and RAD?",
          answer:
            "The angle unit used by trigonometric functions. Degrees divide a circle into 360 parts (sin 30° = 0.5); radians divide it into 2π (sin π/6 = 0.5). Use RAD for calculus and physics formulas.",
        },
        {
          question: "Where is my calculation history stored?",
          answer:
            "Only in your browser's memory for this session. Closing the tab clears it — nothing is uploaded or saved anywhere.",
        },
      ]}
      relatedTools={[
        { name: "Percentage Increase / Decrease", href: "/tools/math/percentage-change" },
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" },
        { name: "GPA Calculator", href: "/tools/math/gpa-calculator" },
        { name: "Ratio Calculator", href: "/tools/math/ratio-calculator" },
      ]}
    >
      <ScientificCalculatorClient />
    </ToolLayout>
  );
}
