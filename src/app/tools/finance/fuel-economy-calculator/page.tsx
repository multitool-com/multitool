import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FuelEconomyCalculatorClient from "./FuelEconomyCalculatorClient";

export const metadata: Metadata = {
  title: "Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool",
  description: "Calculate fuel consumption (km/L or MPG), liters per 100 km, fuel needed and total trip cost in metric or imperial units.",
  keywords: ["fuel economy calculator", "fuel cost calculator", "mpg calculator", "gas mileage calculator", "trip fuel cost", "consumo de combustivel"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/finance/fuel-economy-calculator",
  },
  openGraph: {
    title: "Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool",
    description: "Calculate fuel consumption (km/L or MPG), liters per 100 km, fuel needed and total trip cost in metric or imperial units.",
    url: "https://www.multitoolbox.online/tools/finance/fuel-economy-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool",
    description: "Calculate fuel consumption (km/L or MPG), liters per 100 km, fuel needed and total trip cost in metric or imperial units.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool"
      description="DESC"
      categoryName="finance_NAME"
      categorySlug="finance"
      toolSlug="fuel-economy-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            In Consumption mode, enter distance and fuel used to get km/L (or MPG) plus L/100km. In Trip Cost mode, enter your consumption, distance and fuel price to see exactly how much fuel the trip needs and what it costs, per trip and per kilometer or mile.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            MPG, L/100km and km/L, translated
          </h2>
          <p className="mb-4">
            Three systems measure the same thing, and one of them{" "}
            <strong>inverts the logic</strong> — the source of endless
            confusion:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>MPG (US) and km/L:</strong> distance per unit of fuel — <em>higher is better</em>.</li>
            <li><strong>L/100km (Europe, Brazil):</strong> fuel per distance — <em>lower is better</em>. A car that does 12 km/L consumes 8.3 L/100km.</li>
            <li><strong>Imperial gallon trap:</strong> UK mpg uses a bigger gallon — 40 UK mpg ≈ 33 US mpg. Comparing across articles without checking the gallon is a classic error.</li>
            <li><strong>What the numbers hide:</strong> consumption varies ±25% with driving style, tires, AC and city vs highway. Use your own fill-up data (km driven ÷ liters filled) for a real personal figure.</li>
            <li><strong>Cost math that matters:</strong> at 20,000 km/year, the gap between 10 and 14 km/L is ~570 liters a year — real money. The calculator turns efficiency into currency per month or year.</li>
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
        { question: "How do I calculate km/L?", answer: "Divide the distance driven by the fuel used. Example: 500 km with 40 liters equals 12.5 km/L." },
        { question: "What is L/100km?", answer: "Liters consumed per 100 kilometers — the standard fuel consumption measure in Europe and Brazil. Lower is better." },
        { question: "What is MPG?", answer: "Miles per gallon, used mainly in the US. Higher is better. One MPG equals about 0.425 km/L." },
        { question: "How do I calculate trip cost?", answer: "Divide the distance by your consumption to get fuel needed, then multiply by the fuel price. The tool does all of it." },
        { question: "Can I switch between metric and imperial?", answer: "Yes — one click switches between km and liters or miles and gallons." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Mortgage Calculator", href: "/tools/finance/mortgage-calculator" },
        { name: "VAT / Sales Tax Calculator", href: "/tools/finance/vat-calculator" },
        { name: "Compound Interest Calculator", href: "/tools/finance/compound-interest" },
        { name: "Loan Calculator", href: "/tools/finance/loan-calculator" },
      ]}
    >
      <FuelEconomyCalculatorClient />
    </ToolLayout>
  );
}
