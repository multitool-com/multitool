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
            Binary, hex and the bases that run the world
          </h2>
          <p className="mb-4">
            A number base is just how many symbols you count with before
            “carrying” — decimal uses 10 (0–9), binary uses 2 (0–1),{" "}
            <strong>hexadecimal</strong> uses 16 (0–9 plus A–F). The value
            is the same; only the notation changes.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Why binary exists:</strong> transistors have two reliable states — on/off. Everything digital is bits at the bottom: 8 bits = 1 byte = values 0–255.</li>
            <li><strong>Why hex is everywhere:</strong> one hex digit maps exactly to 4 bits, so a byte is always two tidy characters. Colors (#ff5f1f), MAC addresses, memory dumps and error codes all speak hex.</li>
            <li><strong>Octal</strong> (base 8) survives in file permissions on Unix systems — that curious <code className="font-mono bg-paper px-1 rounded">chmod 755</code> is octal.</li>
            <li><strong>The positional trick:</strong> 1011 in binary is 1×8 + 0×4 + 1×2 + 1×1 = 11. Every base works this way — the converter just does it instantly, any direction, with full precision up to 64-bit values.</li>
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
