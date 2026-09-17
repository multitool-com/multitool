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
            How GPA actually works
          </h2>
          <p className="mb-4">
            GPA is a <strong>credit-weighted average</strong> of grade
            points. The formula this calculator uses:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              GPA = Σ (grade points × credits) ÷ Σ credits
            </p>
          </div>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Credits are the weight:</strong> an A in a 4-credit course moves your GPA twice as much as an A in a 2-credit course — that is the whole point of weighting.</li>
            <li><strong>Unweighted vs weighted:</strong> the standard US scale caps at 4.0 (unweighted). Honors/AP/IB courses often use a weighted scale that can exceed 5.0 — check which one your transcript uses before comparing.</li>
            <li><strong>Typical mapping:</strong> A=4.0, B=3.0, C=2.0, D=1.0, F=0 — with +/− steps in between at many schools.</li>
            <li><strong>International students:</strong> grading systems vary wildly (0–10 in the Netherlands, percentages in India, 5-point in Russia). Convert to the 4.0 scale only when the receiving institution asks for it.</li>
            <li><strong>Raising a GPA:</strong> because it is an average, early low grades dilute slowly — the fastest recovery is more (and better) weighted credits, not calculating harder.</li>
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
