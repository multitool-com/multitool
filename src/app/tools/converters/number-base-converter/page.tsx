import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NumberBaseConverterClient from "./NumberBaseConverterClient";

export const metadata: Metadata = {
  title: "Number Base Converter - Binary, Octal, Decimal, Hex | MultiTool",
  description: "Convert numbers between binary, octal, decimal and hexadecimal instantly, with support for any base from 2 to 36.",
  keywords: ["number base converter", "binary to hex", "decimal to binary", "hex converter", "base converter", "conversor de base"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/number-base-converter",
  },
  openGraph: {
    title: "Number Base Converter - Binary, Octal, Decimal, Hex | MultiTool",
    description: "Convert numbers between binary, octal, decimal and hexadecimal instantly, with support for any base from 2 to 36.",
    url: "https://www.multitoolbox.online/tools/converters/number-base-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Base Converter - Binary, Octal, Decimal, Hex | MultiTool",
    description: "Convert numbers between binary, octal, decimal and hexadecimal instantly, with support for any base from 2 to 36.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Number Base Converter - Binary, Octal, Decimal, Hex | MultiTool"
      description="Convert numbers between binary, octal, decimal and hexadecimal instantly, with support for any base from 2 to 36."
      categoryName="converters_NAME"
      categorySlug="converters"
      toolSlug="number-base-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type a number, choose the base it is written in, and instantly see its value in binary, octal, decimal and hexadecimal. Invalid digits for the source base are rejected automatically.
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
        { question: "How do I convert decimal to binary?", answer: "Repeatedly divide by 2 and read the remainders from bottom to top. The tool does this for you." },
        { question: "Why is hexadecimal useful?", answer: "It is a compact way to write binary: every hex digit equals exactly 4 bits, making it standard in programming and colors." },
        { question: "Can I convert between any bases?", answer: "The quick view shows bases 2, 8, 10 and 16; any base from 2 to 36 is accepted as the source." },
        { question: "What are letters in base 16?", answer: "Digits 10-15 are written A-F: A=10, B=11, C=12, D=13, E=14, F=15." },
        { question: "Does it handle negative numbers?", answer: "Yes — a minus sign is preserved through the conversion." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Roman Numeral Converter", href: "/tools/converters/roman-numeral-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Time Zone Converter", href: "/tools/converters/timezone-converter" },
      ]}
    >
      <NumberBaseConverterClient />
    </ToolLayout>
  );
}
