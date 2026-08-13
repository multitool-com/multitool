import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UnitConverterClient from "./UnitConverterClient";

export const metadata: Metadata = {
  title: "Unit Converter - Length, Weight, Volume, Area & Speed | MultiTool",
  description:
    "Free unit converter for length, weight, volume, area, speed and digital storage. Convert metric and imperial instantly in your browser. No sign-up.",
  keywords: [
    "unit converter",
    "metric converter",
    "imperial converter",
    "length converter",
    "weight converter",
    "kg to lbs",
    "cm to inches",
    "miles to km",
    "volume converter",
    "unit conversion",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/converters/unit-converter",
  },
  openGraph: {
    title: "Unit Converter - Length, Weight, Volume & More | MultiTool",
    description:
      "Convert length, weight, volume, area, speed and data units instantly. Metric and imperial. Free and private.",
    url: "https://multitoolbox.online/tools/converters/unit-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter - Free Metric & Imperial",
    description:
      "Convert length, weight, volume, area, speed and storage units instantly.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert length, weight, volume, area, speed and digital storage between metric and imperial units. Pick a category, type a value and get an instant result."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="unit-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a unit converter?
          </h2>
          <p className="mb-4">
            A <strong>unit converter</strong> changes a measurement from one
            system to another — for example centimetres to inches, kilograms
            to pounds, or litres to US gallons. This tool covers the units
            people search for most: length, mass, volume, area, speed and
            digital storage.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Choose a <strong>category</strong> (Length, Weight, Volume,
              Area, Speed or Data).
            </li>
            <li>
              Enter the <strong>value</strong> and pick the unit you have.
            </li>
            <li>
              Pick the <strong>unit you want</strong>. The result updates
              as you type.
            </li>
            <li>
              Use <strong>SWAP</strong> to flip the two units.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Metric vs imperial
          </h2>
          <p className="mb-4">
            Most of the world uses <strong>metric</strong> (metre, kilogram,
            litre). The United States still uses <strong>imperial / US
            customary</strong> (inch, pound, gallon). This converter uses
            standard factors (1 inch = 2.54 cm exactly, 1 lb = 0.45359237
            kg). US liquid gallons are used for volume, not the UK gallon.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Digital storage
          </h2>
          <p className="mb-4">
            Storage here uses the common <strong>decimal SI</strong> scale
            (1 KB = 1,000 bytes, 1 MB = 1,000 KB) that disk makers print on
            the box. Operating systems often show <em>kibibytes</em> (1,024).
            The two systems differ by about 7% at the gigabyte level.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All conversions run instantly in your browser. Nothing is{" "}
            <strong>sent to any server</strong> or stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I convert kg to lbs?",
          answer:
            "Open the Weight category, type your value in kilograms and set the output unit to pounds (lb). 1 kilogram = 2.2046226218 pounds. The result updates as you type.",
        },
        {
          question: "Is 1 inch exactly 2.54 centimetres?",
          answer:
            "Yes. Since 1959 the international inch is defined as exactly 2.54 centimetres. All length conversions in this tool start from that definition.",
        },
        {
          question: "Which gallon does this converter use?",
          answer:
            "The US liquid gallon (3.785411784 litres), which is what you will see on fuel and milk in the United States. The UK imperial gallon is larger (about 4.546 litres) and is not used here.",
        },
        {
          question: "Why is my hard drive smaller than the box says?",
          answer:
            "Drive makers use 1 GB = 1,000,000,000 bytes. Windows often shows 1 GiB = 1,073,741,824 bytes. This tool follows the decimal (SI) labels printed on packaging.",
        },
        {
          question: "Can I convert temperature here?",
          answer:
            "Temperature is a separate tool because it is not a simple multiply — it uses offset formulas (°C, °F, K). Use the Temperature Converter in this same category.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded, logged or stored.",
        },
      ]}
      relatedTools={[
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Time Zone Converter", href: "/tools/converters/timezone-converter" },
        { name: "Number Base Converter", href: "/tools/converters/number-base-converter" },
        { name: "Roman Numeral Converter", href: "/tools/converters/roman-numeral-converter" },
      ]}
    >
      <UnitConverterClient />
    </ToolLayout>
  );
}