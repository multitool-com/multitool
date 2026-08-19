import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FuelEconomyCalculatorClient from "./FuelEconomyCalculatorClient";

export const metadata: Metadata = {
  title: "Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool",
  description: "Calculate fuel consumption (km/L or MPG), liters per 100 km, fuel needed and total trip cost in metric or imperial units.",
  keywords: ["fuel economy calculator", "fuel cost calculator", "mpg calculator", "gas mileage calculator", "trip fuel cost", "consumo de combustivel"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/finance/fuel-economy-calculator",
  },
  openGraph: {
    title: "Fuel Economy Calculator - km/L, MPG & Trip Cost | MultiTool",
    description: "Calculate fuel consumption (km/L or MPG), liters per 100 km, fuel needed and total trip cost in metric or imperial units.",
    url: "https://multitoolbox.online/tools/finance/fuel-economy-calculator",
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
