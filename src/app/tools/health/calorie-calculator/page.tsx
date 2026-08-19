import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CalorieCalculatorClient from "./CalorieCalculatorClient";

export const metadata: Metadata = {
  title: "Calorie / BMR Calculator - Daily Calories | MultiTool",
  description: "Calculate your BMR (Mifflin-St Jeor) and daily calorie target for weight loss, maintenance or gain. Free and private.",
  keywords: ["calorie calculator", "bmr calculator", "daily calorie intake", "calories to lose weight", "tdee calculator", "calorias por dia"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/calorie-calculator",
  },
  openGraph: {
    title: "Calorie / BMR Calculator - Daily Calories | MultiTool",
    description: "Calculate your BMR (Mifflin-St Jeor) and daily calorie target for weight loss, maintenance or gain. Free and private.",
    url: "https://multitoolbox.online/tools/health/calorie-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie / BMR Calculator - Daily Calories | MultiTool",
    description: "Calculate your BMR (Mifflin-St Jeor) and daily calorie target for weight loss, maintenance or gain. Free and private.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Calorie / BMR Calculator - Daily Calories | MultiTool"
      description="Calculate your BMR (Mifflin-St Jeor) and daily calorie target for weight loss, maintenance or gain. Free and private."
      categoryName="health_NAME"
      categorySlug="health"
      toolSlug="calorie-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter your gender, age, height, weight and activity level. The tool computes your Basal Metabolic Rate with the Mifflin-St Jeor equation and multiplies it by an activity factor to show your maintenance calories, plus targets for losing (cut) and gaining (bulk).
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
        { question: "What is BMR?", answer: "Basal Metabolic Rate — the calories your body burns at complete rest just to keep you alive." },
        { question: "What equation is used?", answer: "Mifflin-St Jeor: 10 x weight(kg) + 6.25 x height(cm) - 5 x age, plus 5 for men or minus 161 for women." },
        { question: "How many calories to lose weight?", answer: "A deficit of about 500 kcal per day leads to roughly 0.5 kg of fat loss per week. The cut target applies that." },
        { question: "What is TDEE?", answer: "Total Daily Energy Expenditure — BMR multiplied by an activity factor (1.2 sedentary up to 1.9 very active)." },
        { question: "Are these numbers exact?", answer: "They are estimates. Real needs vary with muscle mass, hormones and daily activity — adjust based on your results over a few weeks." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
        { name: "Ideal Weight Calculator", href: "/tools/health/ideal-weight" },
        { name: "Age Calculator", href: "/tools/health/age-calculator" },
        { name: "Pregnancy Due Date Calculator", href: "/tools/health/pregnancy-due-date" },
      ]}
    >
      <CalorieCalculatorClient />
    </ToolLayout>
  );
}
