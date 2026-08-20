import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LengthConverterClient from "./LengthConverterClient";

export const metadata: Metadata = {
  title: "Length Converter - cm, inches, feet, meters & More | MultiTool",
  description:
    "Convert length and distance units instantly: cm to inches, meters to feet, km to miles and more. See all units at once. Free and private.",
  keywords: [
    "length converter",
    "cm to inches",
    "inches to cm",
    "meters to feet",
    "km to miles",
    "feet to meters",
    "distance converter",
    "mm to inches",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/length-converter",
  },
  openGraph: {
    title: "Length Converter - cm, inches, feet, meters & More | MultiTool",
    description: "Convert length units instantly — see all units at once. Free.",
    url: "https://www.multitoolbox.online/tools/converters/length-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Length Converter",
    description: "cm ⇄ inches, meters ⇄ feet, km ⇄ miles — all units at once.",
  },
};

export default function LengthConverterPage() {
  return (
    <ToolLayout
      title="Length Converter"
      description="Convert any length or distance unit and see the result in every common unit at once — metric and imperial."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="length-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How length conversion works
          </h2>
          <p className="mb-4">
            Every value is converted through meters, the SI base unit. Each
            unit has an exact factor — for example 1 inch = 0.0254 m
            exactly (by international definition since 1959), 1 foot =
            0.3048 m, 1 mile = 1609.344 m:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Result = Value × Factor(from) ÷ Factor(to)
            </p>
          </div>
          <p className="mb-4">
            Use cases: body measurements (cm ⇄ inches), height (meters ⇄
            feet), screen and furniture sizes, running and cycling
            distances (km ⇄ miles), and navigation (nautical miles).
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
          question: "How do I convert cm to inches?",
          answer:
            "Type the value, set the 'from' unit to centimeters — the inches row updates instantly. The rule: 1 inch = 2.54 cm exactly, so divide by 2.54.",
        },
        {
          question: "How many feet are in a meter?",
          answer:
            "1 meter = 3.2808 feet (3 feet 3.37 inches). Conversely 1 foot = 0.3048 m exactly. Type 1 in the converter and read the whole table.",
        },
        {
          question: "How do I convert km to miles?",
          answer:
            "1 km = 0.62137 miles; 1 mile = 1.609344 km. Select kilometers as the source unit and the miles value appears immediately — great for race distances and road trips.",
        },
        {
          question: "What's the difference between mile and nautical mile?",
          answer:
            "A land mile is 1609.344 m; a nautical mile is exactly 1852 m (one minute of latitude), used in aviation and sea navigation.",
        },
        {
          question: "Why does the converter show all units at once?",
          answer:
            "Because that's usually what you actually want — one input, every answer. There's no second dropdown to misconfigure, and comparing units side by side builds intuition.",
        },
        {
          question: "Are the conversions exact?",
          answer:
            "Yes — the factors are the internationally defined exact values (inch = 25.4 mm, foot = 0.3048 m, etc.). Results are displayed with sensible rounding.",
        },
      ]}
      relatedTools={[
        { name: "Weight Converter", href: "/tools/converters/weight-converter" },
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Currency Converter", href: "/tools/converters/currency-converter" },
      ]}
    >
      <LengthConverterClient />
    </ToolLayout>
  );
}
