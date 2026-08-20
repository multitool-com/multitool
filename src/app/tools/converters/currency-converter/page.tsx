import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CurrencyConverterClient from "./CurrencyConverterClient";

export const metadata: Metadata = {
  title: "Currency Converter - USD, EUR, GBP, BRL & More | MultiTool",
  description:
    "Free currency converter for USD, EUR, GBP, BRL, INR, JPY and more. Convert any amount instantly. Rates update from public ECB data when available.",
  keywords: [
    "currency converter",
    "exchange rate",
    "usd to eur",
    "usd to brl",
    "gbp to usd",
    "inr converter",
    "money converter",
    "forex calculator",
    "dollar to real",
    "currency calculator",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/currency-converter",
  },
  openGraph: {
    title: "Currency Converter - USD, EUR, GBP, BRL & More | MultiTool",
    description:
      "Convert between major world currencies instantly. Free and private amounts.",
    url: "https://www.multitoolbox.online/tools/converters/currency-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Converter - Free FX Calculator",
    description:
      "Convert USD, EUR, GBP, BRL, INR and more. Instant results.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Currency Converter"
      description="Convert an amount between USD, EUR, GBP, BRL, INR, JPY and other major currencies. Your numbers stay in the browser; rates come from public reference data."
      categoryName="Converters"
      categorySlug="converters"
      toolSlug="currency-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How this converter works
          </h2>
          <p className="mb-4">
            Enter an amount, pick a <strong>from</strong> currency and a{" "}
            <strong>to</strong> currency. The tool multiplies by the
            exchange rate. When the network is available it loads mid-market
            reference rates (ECB via Frankfurter). If that fails, it uses
            a built-in fallback table so the page still works.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use it
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Type the <strong>amount</strong>.</li>
            <li>Choose the currency you have and the one you want.</li>
            <li>Use <strong>SWAP</strong> to flip the pair.</li>
            <li>Read the converted amount and the rate used.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Are these the rates my bank will use?
          </h2>
          <p className="mb-4">
            No. Banks and cards add a spread or fee. These are{" "}
            <strong>indicative mid-market</strong> rates for planning, not
            a quote you can trade. Always confirm with your bank before a
            large transfer.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The amount you type never leaves this page. If rates are
            refreshed, the request only asks for public FX prices — it does{" "}
            <strong>not</strong> send your numbers or store them.
          </p>
        </>
      }
      faqs={[
        {
          question: "Where do the exchange rates come from?",
          answer:
            "When possible, from the Frankfurter API (European Central Bank reference rates). If that request fails, the tool uses a built-in fallback table. Both are mid-market style rates, not bank sell rates.",
        },
        {
          question: "Why is my card charge different?",
          answer:
            "Card networks and banks add a markup (often 1–4%) and may use a different day's rate. Use this tool for a ballpark figure, then check your bank.",
        },
        {
          question: "Can I convert Brazilian real (BRL) and Indian rupee (INR)?",
          answer:
            "Yes. BRL, INR, USD, EUR, GBP, JPY, CAD, AUD and several other majors are included.",
        },
        {
          question: "How often do rates update?",
          answer:
            "ECB reference rates typically update on European business days. The page fetches the latest set when you open it. Crypto and exotic pairs are not included.",
        },
        {
          question: "Is this a place to buy currency?",
          answer:
            "No. It is a calculator only. We do not sell FX, take deposits or open accounts.",
        },
        {
          question: "Is the amount I type private?",
          answer:
            "Yes. The number stays in your browser. A rate refresh, if it happens, does not include your amount.",
        },
      ]}
      relatedTools={[
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Time Zone Converter", href: "/tools/converters/timezone-converter" },
        { name: "Number Base Converter", href: "/tools/converters/number-base-converter" },
      ]}
    >
      <CurrencyConverterClient />
    </ToolLayout>
  );
}