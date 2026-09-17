import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ShoeSizeConverterClient from "./ShoeSizeConverterClient";

export const metadata: Metadata = {
  title: "Shoe Size Converter - US, UK, EU & CM | MultiTool",
  description: "Convert shoe sizes between US, UK, EU and centimeters for men and women. Instant, accurate size charts with no sign-up.",
  keywords: ["shoe size converter", "shoe size chart", "us to eu shoe size", "shoe size in cm", "uk to us size", "tamanho de sapato"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/shoe-size-converter",
  },
  openGraph: {
    title: "Shoe Size Converter - US, UK, EU & CM | MultiTool",
    description: "Convert shoe sizes between US, UK, EU and centimeters for men and women. Instant, accurate size charts with no sign-up.",
    url: "https://www.multitoolbox.online/tools/converters/shoe-size-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoe Size Converter - US, UK, EU & CM | MultiTool",
    description: "Convert shoe sizes between US, UK, EU and centimeters for men and women. Instant, accurate size charts with no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Shoe Size Converter - US, UK, EU & CM | MultiTool"
      description="DESC"
      categoryName="converters_NAME"
      categorySlug="converters"
      toolSlug="shoe-size-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Choose your gender, pick the size system you know (US, UK, EU or centimeters) and type your size. The tool finds the matching row in its reference table and shows every equivalent instantly, with the full size chart below.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why shoe sizes are a mess (and how to shop safely)
          </h2>
          <p className="mb-4">
            Shoe sizes are the wild west of measurements: the US, UK and EU
            systems are all different, and brands apply their own
            interpretations on top. The only honest anchor is{" "}
            <strong>your foot in centimeters</strong>.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Measure at the end of the day:</strong> feet swell and get up to half a size bigger by evening. Measure standing, both feet, longest toe to heel — many people have one foot longer than the other (size the bigger one).</li>
            <li><strong>The sneaker rule:</strong> athletic shoes usually run with ~1 cm of toe room; formal shoes fit closer. That is why the same foot needs different numbers by shoe type.</li>
            <li><strong>US vs UK trap:</strong> US men&apos;s sizes are roughly one unit above UK for the same foot; US women&apos;s adds another offset. Amazon listings that mix systems are the source of most bad buys.</li>
            <li><strong>When shopping abroad online:</strong> convert your centimeters to the brand&apos;s own size chart — not to a generic conversion. The converter gives you the map; the brand chart is the territory.</li>
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
        { question: "How do I convert US to EU shoe size?", answer: "For men, EU is roughly US plus 33 (US 9 is about EU 42.5). For women, EU is roughly US plus 31 (US 8 is about EU 39). The exact values are in the chart." },
        { question: "How do I measure my foot size?", answer: "Stand on a piece of paper, trace your foot, and measure the distance from your heel to your longest toe in centimeters. Compare that to the CM column." },
        { question: "Are UK and US sizes the same?", answer: "No — UK men's sizes are about half a size smaller than US, and UK women's sizes are about two sizes smaller." },
        { question: "Do sizes vary between brands?", answer: "Yes. Nike, Adidas and European brands can differ slightly. Always use the centimeter measurement as your safest reference." },
        { question: "Can I convert kids' sizes?", answer: "This tool covers men's and women's sizes. For kids, measuring the foot in centimeters is the most reliable approach." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Currency Converter", href: "/tools/converters/currency-converter" },
        { name: "Number Base Converter", href: "/tools/converters/number-base-converter" },
      ]}
    >
      <ShoeSizeConverterClient />
    </ToolLayout>
  );
}
