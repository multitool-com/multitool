import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BMICalculatorClient from "./BMICalculatorClient";

export const metadata: Metadata = {
  title: "BMI Calculator - Body Mass Index Free Online Tool | MultiTool",
  description:
    "Calculate your BMI (Body Mass Index) instantly. Free online BMI calculator for metric and imperial units, with weight category and ideal weight range.",
  keywords: [
    "bmi calculator",
    "body mass index",
    "bmi",
    "weight calculator",
    "healthy weight",
    "bmi chart",
    "obesity calculator",
    "bmi metric",
    "bmi imperial",
  ],
  alternates: {
    canonical: "https://multitool.online/tools/health/bmi-calculator",
  },
  openGraph: {
    title: "BMI Calculator - Body Mass Index | MultiTool",
    description:
      "Calculate your BMI instantly with metric or imperial units. See your weight category and ideal weight range.",
    url: "https://multitool.online/tools/health/bmi-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator - Body Mass Index | MultiTool",
    description:
      "Calculate your BMI instantly. Metric & imperial units, weight category and ideal weight range.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Enter your height and weight to see your BMI value, category and ideal weight range."
      categoryName="Health & Fitness"
      categorySlug="health"
      toolSlug="bmi-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is BMI?
          </h2>
          <p className="mb-4">
            <strong>Body Mass Index (BMI)</strong> is a simple, widely-used
            measurement that estimates whether a person has a healthy weight
            for their height. It was developed in the 1830s by Belgian
            mathematician Adolphe Quetelet and is used worldwide by health
            professionals, fitness experts and researchers.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How is BMI calculated?
          </h2>
          <p className="mb-3">The BMI formula is:</p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              BMI = weight (kg) / height² (m)
            </p>
          </div>
          <p className="mb-4">
            For example, if you weigh <strong>70 kg</strong> and are{" "}
            <strong>1.75 m</strong> tall:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              BMI = 70 / (1.75 × 1.75) = 70 / 3.0625 ={" "}
              <strong className="text-accent">22.86</strong>
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            BMI categories (WHO standard)
          </h2>
          <p className="mb-3">
            According to the World Health Organization, adults fall into these
            categories:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Underweight:</strong> BMI below 18.5
            </li>
            <li>
              <strong>Normal weight:</strong> BMI 18.5 to 24.9
            </li>
            <li>
              <strong>Overweight:</strong> BMI 25 to 29.9
            </li>
            <li>
              <strong>Obese Class I:</strong> BMI 30 to 34.9
            </li>
            <li>
              <strong>Obese Class II:</strong> BMI 35 to 39.9
            </li>
            <li>
              <strong>Obese Class III:</strong> BMI 40 or above
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Limitations of BMI
          </h2>
          <p className="mb-4">
            While BMI is useful for population-level assessments, it has
            limitations. It doesn&apos;t distinguish between muscle and fat
            mass, so athletes with high muscle mass may register as
            &quot;overweight&quot; despite being very fit. It also
            doesn&apos;t account for age, sex, ethnicity or body composition.
            Always consult a healthcare professional for a complete health
            assessment.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All calculations happen instantly in your browser. Your height
            and weight are <strong>never sent to any server</strong> and
            never stored. This tool is 100% private and works offline once
            loaded.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a healthy BMI?",
          answer:
            "According to the WHO, a healthy BMI for adults is between 18.5 and 24.9. However, BMI is just one indicator of health — it doesn't account for muscle mass, bone density or body composition. Always consult a healthcare professional for a complete assessment.",
        },
        {
          question: "Can I use this calculator for children?",
          answer:
            "This calculator uses adult BMI standards (WHO). For children and teens (ages 2-19), BMI is interpreted differently using age- and sex-specific percentiles. Please consult your pediatrician for accurate assessments of children's BMI.",
        },
        {
          question: "Is BMI accurate for athletes and bodybuilders?",
          answer:
            "BMI can be misleading for people with high muscle mass, since muscle weighs more than fat. Athletes and bodybuilders may register as 'overweight' or 'obese' on BMI while having very low body fat. For those individuals, body fat percentage measurements are more accurate.",
        },
        {
          question: "What's the difference between metric and imperial BMI?",
          answer:
            "The BMI value is the same — only the input units differ. Metric uses kilograms and meters (or centimeters), while imperial uses pounds and feet/inches. Our calculator automatically converts and gives you the same BMI result either way.",
        },
        {
          question: "Should I lose weight if my BMI is high?",
          answer:
            "Not necessarily. BMI is a screening tool, not a diagnostic one. If your BMI is in the overweight or obese range, it's a good idea to talk to a doctor who can consider other factors like body composition, muscle mass, family history and overall health before recommending any weight change.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes! All calculations happen entirely in your browser. Your height and weight are never sent to any server, never stored, and never shared with anyone. Your privacy is fully protected.",
        },
      ]}
      relatedTools={[
        { name: "Age Calculator", href: "/tools/health/age-calculator" },
        { name: "Ideal Weight", href: "/tools/health/ideal-weight" },
        { name: "Calorie Calculator", href: "/tools/health/calorie-calculator" },
        { name: "Pregnancy Due Date", href: "/tools/health/pregnancy-due-date" },
      ]}
    >
      <BMICalculatorClient />
    </ToolLayout>
  );
}