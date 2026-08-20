import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GpaCalculatorClient from "./GpaCalculatorClient";

export const metadata: Metadata = {
  title: "GPA Calculator - 4.0 Scale, Any Credits | MultiTool",
  description: "Calculate your GPA on the 4.0 scale: add courses with letter grades and credit hours, get instant weighted GPA and total credits.",
  keywords: ["gpa calculator", "college gpa", "high school gpa", "4.0 scale", "grade point average calculator"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/gpa-calculator",
  },
  openGraph: {
    title: "GPA Calculator - 4.0 Scale, Any Credits | MultiTool",
    description: "Calculate your GPA on the 4.0 scale: add courses with letter grades and credit hours, get instant weighted GPA and total credits.",
    url: "https://www.multitoolbox.online/tools/math/gpa-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator - 4.0 Scale, Any Credits | MultiTool",
    description: "Calculate your GPA on the 4.0 scale: add courses with letter grades and credit hours, get instant weighted GPA and total credits.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_GPA Calculator - 4.0 Scale, Any Credits | MultiTool"
      description="Calculate your GPA on the 4.0 scale: add courses with letter grades and credit hours, get instant weighted GPA and total credits."
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="gpa-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Add each course with its letter grade (A+ to F) and credit hours. The tool computes the credit-weighted GPA on the 4.0 scale and shows the total credits used.
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
        { question: "How is GPA calculated?", answer: "Each letter grade maps to grade points (A=4.0, B+=3.3, etc.). Multiply each by its credits, sum everything, and divide by total credits." },
        { question: "What is a good GPA?", answer: "3.0+ is generally considered good; 3.7+ is excellent for most graduate programs and honors." },
        { question: "Can I use half credits?", answer: "Yes — credits accept decimals like 0.5 or 1.5, common for labs and seminars." },
        { question: "Does it use the weighted scale?", answer: "It uses the standard unweighted 4.0 scale. AP/IB weighted scales vary by school." },
        { question: "Can I remove a course?", answer: "Yes — use the X button next to any row." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Scientific Calculator", href: "/tools/math/scientific-calculator" },
        { name: "Percentage Change Calculator", href: "/tools/math/percentage-change" },
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" },
        { name: "Statistics Calculator", href: "/tools/math/statistics-calculator" },
      ]}
    >
      <GpaCalculatorClient />
    </ToolLayout>
  );
}
