import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import VatCalculatorClient from "./VatCalculatorClient";

export const metadata: Metadata = {
  title: "VAT / Sales Tax Calculator - GST, IVA & More | MultiTool",
  description:
    "Free VAT, GST and sales tax calculator. Add or remove tax from a price. Presets for common rates. USD, EUR, GBP and BRL.",
  keywords: [
    "vat calculator",
    "sales tax calculator",
    "gst calculator",
    "tax calculator",
    "add vat",
    "remove vat",
    "iva calculator",
    "sales tax",
    "gst inclusive",
    "net and gross",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/finance/vat-calculator",
  },
  openGraph: {
    title: "VAT / Sales Tax Calculator | MultiTool",
    description:
      "Add or remove VAT, GST or sales tax from any price. Free and private.",
    url: "https://multitoolbox.online/tools/finance/vat-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAT / Sales Tax Calculator - Free",
    description: "Add or remove tax from a price instantly.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="VAT / Sales Tax Calculator"
      description="Add tax to a net price or extract tax from a gross price. Works for VAT, GST, IVA and US sales tax — with common rate presets."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="vat-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How VAT / sales tax is calculated
          </h2>
          <p className="mb-3">
            Two directions, one rate:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 font-mono text-sm">
            tax = net × (rate ÷ 100)
            <br />
            gross = net + tax
            <br />
            <br />
            net = gross ÷ (1 + rate ÷ 100)
            <br />
            tax = gross − net
          </div>
          <p className="mb-4">
            Example: net <strong>100</strong> at <strong>20%</strong> → tax
            20, gross 120. A ticket that already says 120 including 20% VAT
            has a net of 100.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Choose currency and whether the amount is net or gross.</li>
            <li>Type the amount and the tax rate (or tap a preset).</li>
            <li>Read net, tax and gross.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            VAT vs GST vs sales tax
          </h2>
          <p className="mb-4">
            The arithmetic is the same. Names change by country:{" "}
            <strong>VAT / IVA</strong> in much of Europe and Latin America,{" "}
            <strong>GST</strong> in India and others,{" "}
            <strong>sales tax</strong> in the US (often on top of the shelf
            price). Presets are typical headline rates — always confirm the
            rate that applies to your city or product.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All math runs in your browser. Your numbers are{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I add 20% VAT to a price?",
          answer:
            "Set mode to Net (tax exclusive), enter the price and 20. Gross = net × 1.20. A 50 item becomes 60.",
        },
        {
          question: "How do I remove VAT from a gross price?",
          answer:
            "Set mode to Gross (tax inclusive). Net = gross ÷ (1 + rate/100). 120 including 20% VAT is 100 net and 20 tax.",
        },
        {
          question: "Does this work for GST in India?",
          answer:
            "Yes. Use the 5%, 12%, 18% or 28% presets. It is the same inclusive/exclusive math as VAT.",
        },
        {
          question: "Is US sales tax included in the shelf price?",
          answer:
            "Usually not. US sales tax is typically added at the register (net mode). VAT in the EU is usually already in the advertised price (gross mode).",
        },
        {
          question: "Are these official legal rates?",
          answer:
            "No. Presets are common headline rates to save typing. Your invoice must use the rate your tax authority requires.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded or stored.",
        },
      ]}
      relatedTools={[
        { name: "Compound Interest", href: "/tools/finance/compound-interest" },
        { name: "Discount Calculator", href: "/tools/finance/discount-calculator" },
        { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
        { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
      ]}
    >
      <VatCalculatorClient />
    </ToolLayout>
  );
}