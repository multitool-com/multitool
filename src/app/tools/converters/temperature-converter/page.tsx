import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TemperatureConverterClient from "./TemperatureConverterClient";

export const metadata: Metadata = {
  title: "Temperature Converter - Celsius, Fahrenheit, Kelvin | MultiTool",
  description:
    "Free temperature converter: instantly convert between Celsius (°C), Fahrenheit (°F), Kelvin (K) and Rankine (°R). Accurate scientific formulas, real-time results.",
  keywords: [
    "temperature converter",
    "celsius to fahrenheit",
    "fahrenheit to celsius",
    "celsius to kelvin",
    "kelvin to celsius",
    "temperature conversion",
    "c to f",
    "f to c",
    "rankine converter",
    "convert temperature online",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/temperature-converter",
  },
  openGraph: {
    title: "Temperature Converter - Celsius, Fahrenheit, Kelvin | MultiTool",
    description:
      "Convert between Celsius, Fahrenheit, Kelvin and Rankine instantly. Free and accurate.",
    url: "https://www.multitoolbox.online/tools/converters/temperature-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temperature Converter - Celsius, Fahrenheit, Kelvin",
    description:
      "Free instant temperature converter between all major scales.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Temperature Converter"
      description="Convert temperatures between Celsius, Fahrenheit, Kelvin and Rankine. Instant, accurate results using standard scientific formulas."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="temperature-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How temperature conversion works
          </h2>
          <p className="mb-4">
            Temperature can be measured on several different scales. The most
            common are Celsius, Fahrenheit and Kelvin. Each has its own zero
            point and unit size, so conversion requires simple formulas:
          </p>

          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm">
              <strong>Celsius → Fahrenheit:</strong> °F = (°C × 9/5) + 32
              <br />
              <strong>Fahrenheit → Celsius:</strong> °C = (°F − 32) × 5/9
              <br />
              <strong>Celsius → Kelvin:</strong> K = °C + 273.15
              <br />
              <strong>Kelvin → Celsius:</strong> °C = K − 273.15
              <br />
              <strong>Celsius → Rankine:</strong> °R = (°C + 273.15) × 9/5
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The temperature scales explained
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Celsius (°C):</strong> Used by most of the world. Water
              freezes at 0°C and boils at 100°C at sea level.
            </li>
            <li>
              <strong>Fahrenheit (°F):</strong> Used mainly in the United
              States. Water freezes at 32°F and boils at 212°F.
            </li>
            <li>
              <strong>Kelvin (K):</strong> The SI unit of temperature used in
              science. Starts at absolute zero (0 K = −273.15°C), the coldest
              possible temperature in the universe.
            </li>
            <li>
              <strong>Rankine (°R):</strong> Like Kelvin but uses Fahrenheit
              degree size. Mainly used in some engineering fields in the US.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Common temperature references
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Absolute zero:</strong> 0 K = −273.15°C = −459.67°F
            </li>
            <li>
              <strong>Water freezing point:</strong> 0°C = 32°F = 273.15 K
            </li>
            <li>
              <strong>Room temperature:</strong> ~20–22°C = 68–72°F
            </li>
            <li>
              <strong>Human body temperature:</strong> 37°C = 98.6°F
            </li>
            <li>
              <strong>Water boiling point (sea level):</strong> 100°C = 212°F =
              373.15 K
            </li>
            <li>
              <strong>Oven baking:</strong> 180°C = 356°F
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Quick mental conversion tricks
          </h2>
          <p className="mb-3">
            Need a rough conversion in your head? Try these shortcuts:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>°C to °F (quick):</strong> double the °C and add 30 (not
              exact, but very close for everyday temperatures)
            </li>
            <li>
              <strong>°F to °C (quick):</strong> subtract 30 from the °F and
              divide by 2
            </li>
            <li>
              <strong>Example:</strong> 20°C → 20 × 2 + 30 = 70°F (actual:
              68°F)
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All conversions happen instantly in your browser. Your values are{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What's the easiest way to convert Celsius to Fahrenheit?",
          answer:
            "Multiply the Celsius value by 9/5 (or 1.8) and add 32. Example: 25°C × 1.8 + 32 = 77°F. For a quick mental estimate, double the Celsius number and add 30.",
        },
        {
          question: "Why does the Kelvin scale not use degrees?",
          answer:
            "Kelvin is an absolute scale that starts at absolute zero (the coldest possible temperature). Since it doesn't have a subjective 'zero point' like Celsius or Fahrenheit, it's expressed as a plain unit — just 'K' instead of '°K'.",
        },
        {
          question: "What is absolute zero?",
          answer:
            "Absolute zero is the lowest possible temperature, where all molecular motion theoretically stops. It equals 0 Kelvin, −273.15°C or −459.67°F. Nothing in the universe has ever been measured at exactly this temperature.",
        },
        {
          question: "Which countries use Fahrenheit?",
          answer:
            "Fahrenheit is mainly used in the United States, its territories, the Bahamas, the Cayman Islands and Liberia. Most of the rest of the world uses Celsius as the standard for weather and daily life.",
        },
        {
          question: "What's Rankine used for?",
          answer:
            "Rankine (°R) is an absolute temperature scale like Kelvin, but based on Fahrenheit degree sizes. It's primarily used in some engineering fields in the United States, especially in thermodynamics and aerospace.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes! All calculations happen locally in your browser. Nothing is sent to any server or stored anywhere.",
        },
      ]}
      relatedTools={[
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Time Zone Converter", href: "/tools/converters/timezone-converter" },
        { name: "Number Base Converter", href: "/tools/converters/number-base-converter" },
        { name: "Roman Numeral Converter", href: "/tools/converters/roman-numeral-converter" },
      ]}
    >
      <TemperatureConverterClient />
    </ToolLayout>
  );
}