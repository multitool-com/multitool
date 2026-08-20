import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WeightConverterClient from "./WeightConverterClient";

export const metadata: Metadata = {
  title: "Weight Converter - kg, lbs, ounces, stones & More | MultiTool",
  description:
    "Convert weight and mass units instantly: kg to lbs, pounds to kg, grams to ounces, stones and tons — all units at once. Free and private.",
  keywords: [
    "weight converter",
    "kg to lbs",
    "lbs to kg",
    "pounds to kg",
    "grams to ounces",
    "kg to stones",
    "mass converter",
    "tonnes to tons",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/weight-converter",
  },
  openGraph: {
    title: "Weight Converter - kg, lbs, ounces, stones & More | MultiTool",
    description: "Convert weight units instantly — all units at once. Free.",
    url: "https://www.multitoolbox.online/tools/converters/weight-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weight Converter",
    description: "kg ⇄ lbs, grams ⇄ ounces, stones and tons — all at once.",
  },
};

export default function WeightConverterPage() {
  return (
    <ToolLayout
      title="Weight Converter"
      description="Convert any weight or mass unit and see the result in every common unit at once — kilograms, pounds, ounces, stones and tons."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="weight-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How weight conversion works
          </h2>
          <p className="mb-4">
            Every value is converted through kilograms. The factors are the
            internationally defined ones: 1 pound (lb) = 0.45359237 kg
            exactly, 1 ounce (oz) = 28.349523125 g, 1 stone (st) = 6.35029318
            kg (14 pounds):
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Result = Value × Factor(from) ÷ Factor(to)
            </p>
          </div>
          <p className="mb-4">
            Use cases: body weight (kg ⇄ lbs ⇄ stones), recipes and cooking
            (grams ⇄ ounces), gym plates, shipping weights and freight
            (tonnes ⇄ US/UK tons). Note that &quot;ton&quot; alone is
            ambiguous: this converter shows metric tonne (1000 kg), US ton
            (907.18 kg) and UK long ton (1016.05 kg) separately.
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
          question: "How do I convert kg to lbs?",
          answer:
            "Type the value, set the 'from' unit to kilograms — the pounds row updates instantly. Rule of thumb: multiply kg by 2.20462 (or by 2.2 for a quick estimate).",
        },
        {
          question: "How do I convert pounds to kilograms?",
          answer:
            "1 lb = 0.45359237 kg exactly. Divide pounds by 2.20462 — or just type the number here and read the kg row, no mental math needed.",
        },
        {
          question: "What is a stone in weight?",
          answer:
            "A stone (st) is a British unit equal to 14 pounds (6.35 kg), still commonly used in the UK and Ireland for body weight. The converter shows stones alongside every other unit.",
        },
        {
          question: "Are US and metric tons the same?",
          answer:
            "No. A metric tonne is 1000 kg, a US (short) ton is 907.18 kg, and a UK (long) ton is 1016.05 kg. The converter lists all three so nothing gets mixed up in shipping math.",
        },
        {
          question: "Is mass the same as weight?",
          answer:
            "Strictly, mass is the amount of matter (kg) and weight is the force gravity exerts on it. In everyday use — gym, kitchen, luggage — the units here are what scales show, so 'weight converter' is the practical name.",
        },
        {
          question: "Are the conversions exact?",
          answer:
            "Yes — pound and ounce factors are exact international definitions. Results are displayed with sensible rounding for readability.",
        },
      ]}
      relatedTools={[
        { name: "Length Converter", href: "/tools/converters/length-converter" },
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Calorie / BMR Calculator", href: "/tools/health/calorie-calculator" },
      ]}
    >
      <WeightConverterClient />
    </ToolLayout>
  );
}
