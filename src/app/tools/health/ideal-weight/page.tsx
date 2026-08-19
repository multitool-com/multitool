import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import IdealWeightClient from "./IdealWeightClient";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator - 4 Classic Formulas | MultiTool",
  description: "Find your ideal body weight with the Devine, Robinson, Miller and Hamwi formulas, plus your healthy BMI range.",
  keywords: ["ideal weight calculator", "healthy weight range", "ideal body weight", "devine formula", "peso ideal"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/ideal-weight",
  },
  openGraph: {
    title: "Ideal Weight Calculator - 4 Classic Formulas | MultiTool",
    description: "Find your ideal body weight with the Devine, Robinson, Miller and Hamwi formulas, plus your healthy BMI range.",
    url: "https://multitoolbox.online/tools/health/ideal-weight",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Weight Calculator - 4 Classic Formulas | MultiTool",
    description: "Find your ideal body weight with the Devine, Robinson, Miller and Hamwi formulas, plus your healthy BMI range.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Ideal Weight Calculator - 4 Classic Formulas | MultiTool"
      description="Find your ideal body weight with the Devine, Robinson, Miller and Hamwi formulas, plus your healthy BMI range."
      categoryName="health_NAME"
      categorySlug="health"
      toolSlug="ideal-weight"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Choose your gender and enter your height and weight. The tool applies the four classic ideal weight formulas and shows your healthy BMI range (18.5-24.9) with your current BMI highlighted.
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
        { question: "What formulas are used?", answer: "Devine, Robinson, Miller and Hamwi — four classic clinical formulas for estimating ideal body weight by height and gender." },
        { question: "What is a healthy BMI range?", answer: "18.5 to 24.9 is considered healthy for most adults. The tool converts that range into kilograms for your height." },
        { question: "Are these formulas accurate?", answer: "They are estimates that do not account for muscle mass or body composition. Athletes often exceed them healthily." },
        { question: "What is the Devine formula?", answer: "Men: 50 kg + 2.3 kg per inch over 5 feet. Women: 45.5 kg + 2.3 kg per inch over 5 feet." },
        { question: "Is ideal weight the same for everyone of my height?", answer: "No — frame size, muscle and age matter. Use the range, not a single number." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
        { name: "Calorie / BMR Calculator", href: "/tools/health/calorie-calculator" },
        { name: "Age Calculator", href: "/tools/health/age-calculator" },
        { name: "Pregnancy Due Date Calculator", href: "/tools/health/pregnancy-due-date" },
      ]}
    >
      <IdealWeightClient />
    </ToolLayout>
  );
}
