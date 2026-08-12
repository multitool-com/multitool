import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TipCalculatorClient from "./TipCalculatorClient";

export const metadata: Metadata = {
  title: "Tip Calculator - Split Bill & Gratuity | MultiTool",
  description:
    "Free tip calculator: calculate tip amount, total bill and split evenly between people. Quick preset percentages, round-up option and multi-currency support.",
  keywords: [
    "tip calculator",
    "gratuity calculator",
    "split bill calculator",
    "restaurant tip",
    "tip percentage",
    "how much to tip",
    "bill splitter",
    "tip calculator per person",
  ],
  alternates: {
    canonical: "https://multitool.online/tools/finance/tip-calculator",
  },
  openGraph: {
    title: "Tip Calculator - Split Bill & Gratuity | MultiTool",
    description:
      "Calculate tip, total bill and split evenly between people. Free, fast and simple.",
    url: "https://multitool.online/tools/finance/tip-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Calculator - Split Bill & Gratuity",
    description:
      "Calculate tip, total bill and split evenly between people. Free & instant.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Tip Calculator"
      description="Calculate tip amount, total bill and split evenly between people. Perfect for restaurants, bars and group meals."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="tip-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to calculate a tip
          </h2>
          <p className="mb-4">
            To calculate a tip, multiply the bill amount by the tip percentage
            (as a decimal). Then add that to the bill for the total:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Tip = Bill × (Tip % ÷ 100)
              <br />
              Total = Bill + Tip
            </p>
          </div>
          <p className="mb-4">
            <strong>Example:</strong> A $50 bill with a 18% tip:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Tip = $50 × 0.18 = $9.00
              <br />
              Total = $50 + $9 = <strong className="text-accent">$59.00</strong>
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How much should you tip?
          </h2>
          <p className="mb-3">
            Tipping customs vary widely between countries. Here are common
            guidelines:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>United States:</strong> 15–20% at restaurants, 20% for
              good service. Tipping is expected and often factored into
              servers&apos; wages.
            </li>
            <li>
              <strong>Canada:</strong> 15–18% at restaurants.
            </li>
            <li>
              <strong>United Kingdom:</strong> 10–15% or a service charge is
              often included in the bill.
            </li>
            <li>
              <strong>Europe (most countries):</strong> 5–10% or just rounding
              up the bill. Service is often included.
            </li>
            <li>
              <strong>Japan:</strong> No tipping — it can be considered rude.
            </li>
            <li>
              <strong>Australia:</strong> Tipping is not required, but 10% for
              excellent service is appreciated.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Splitting the bill
          </h2>
          <p className="mb-4">
            When you&apos;re dining with friends and want to split the total
            evenly, divide the total (bill + tip) by the number of people. Our
            calculator does this automatically — just adjust the &quot;Split
            between&quot; slider.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Round up feature
          </h2>
          <p className="mb-4">
            The &quot;Round up total&quot; toggle rounds the final total to
            the next whole number (e.g., $59.23 becomes $60.00). This is
            common courtesy in many countries and simplifies cash payments.
            The extra amount goes toward the tip.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Tips on tipping etiquette
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Check the bill first — some restaurants include a service charge
              (especially for groups of 6+)
            </li>
            <li>
              Tip on the pre-tax amount if you want to be technically correct,
              but tipping on the total is more common
            </li>
            <li>
              For exceptional service, consider going above the standard
              percentage
            </li>
            <li>
              Cash tips are often preferred by servers because they receive
              them directly
            </li>
          </ul>

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
          question: "What's a standard tip in the US?",
          answer:
            "15–20% is standard at sit-down restaurants in the United States. 15% is acceptable for average service, 18% is common, and 20%+ is generous. For bars, $1–2 per drink or 15–20% of the tab is typical. Delivery drivers usually get 10–15% or at least $3–5.",
        },
        {
          question: "Do I tip on tax or before tax?",
          answer:
            "Technically, tipping on the pre-tax amount is more accurate since tax isn't part of the service. However, most people tip on the total amount for simplicity. This calculator uses the amount you enter — so decide which figure to input based on your preference.",
        },
        {
          question: "Should I tip when service is bad?",
          answer:
            "In countries where tipping is expected (US, Canada), it's still customary to leave at least 10% even for poor service, and speak with the manager separately. Withholding a tip entirely is considered extreme. In other countries, no tip for bad service is more acceptable.",
        },
        {
          question: "How do I split a bill unevenly?",
          answer:
            "This calculator splits the bill evenly. For uneven splits (e.g., one person had more expensive items), you'd need to calculate each person's share manually or use a specialized bill-splitting app. We may add uneven splitting in a future update!",
        },
        {
          question: "Should tips be in cash or on the card?",
          answer:
            "Both are acceptable, but many servers prefer cash because they receive it immediately and it's not subject to processing delays or company withholding. If you tip on the card, the server usually receives it within a pay cycle.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes! All calculations happen locally in your browser. Nothing is sent to any server or stored anywhere.",
        },
      ]}
      relatedTools={[
        { name: "Discount Calculator", href: "/tools/finance/discount-calculator" },
        { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
        { name: "Loan Calculator", href: "/tools/finance/loan-calculator" },
        { name: "Salary Calculator", href: "/tools/finance/salary-calculator" },
      ]}
    >
      <TipCalculatorClient />
    </ToolLayout>
  );
}