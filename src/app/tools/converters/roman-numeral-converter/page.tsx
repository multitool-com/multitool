import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RomanNumeralConverterClient from "./RomanNumeralConverterClient";

export const metadata: Metadata = {
  title: "Roman Numeral Converter - Arabic to Roman & Back | MultiTool",
  description: "Convert numbers between Arabic and Roman numerals (1-3999) instantly, with validation of canonical form.",
  keywords: ["roman numeral converter", "arabic to roman", "roman numeral translation", "mmxxvi", "conversor de numeros romanos"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/roman-numeral-converter",
  },
  openGraph: {
    title: "Roman Numeral Converter - Arabic to Roman & Back | MultiTool",
    description: "Convert numbers between Arabic and Roman numerals (1-3999) instantly, with validation of canonical form.",
    url: "https://www.multitoolbox.online/tools/converters/roman-numeral-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roman Numeral Converter - Arabic to Roman & Back | MultiTool",
    description: "Convert numbers between Arabic and Roman numerals (1-3999) instantly, with validation of canonical form.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Roman Numeral Converter - Arabic to Roman & Back | MultiTool"
      description="Convert numbers between Arabic and Roman numerals (1-3999) instantly, with validation of canonical form."
      categoryName="converters_NAME"
      categorySlug="converters"
      toolSlug="roman-numeral-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type an Arabic number and see its Roman form, or type Roman numerals and get the number back. Invalid or non-canonical inputs are flagged so you always get the standard form used today.
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
        { question: "How do Roman numerals work?", answer: "Letters represent values (I=1, V=5, X=10, L=50, C=100, D=500, M=1000). Smaller values before larger ones subtract (IV=4); after, they add (VI=6)." },
        { question: "What is the largest number supported?", answer: "3,999 (MMMCMXCIX) — the classic limit without overline notation." },
        { question: "Why is 4 written IV and not IIII?", answer: "Standard modern usage subtracts 1 from 5. Clocks sometimes still use IIII, but IV is the canonical form." },
        { question: "Does it accept lowercase roman numerals?", answer: "Yes — input is case-insensitive." },
        { question: "Where are Roman numerals still used?", answer: "Book chapters, movie copyrights, monarch names (Elizabeth II) and clock faces." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Number Base Converter", href: "/tools/converters/number-base-converter" },
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Time Zone Converter", href: "/tools/converters/timezone-converter" },
      ]}
    >
      <RomanNumeralConverterClient />
    </ToolLayout>
  );
}
