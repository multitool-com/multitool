import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CompoundInterestClient from "./CompoundInterestClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator - Free Investment Growth | MultiTool",
  description:
    "Free compound interest calculator. See how principal, rate, compounding frequency and time grow an investment. USD, EUR, GBP and BRL.",
  keywords: [
    "compound interest calculator",
    "compound interest",
    "investment calculator",
    "interest calculator",
    "compound growth",
    "principal and interest",
    "monthly compounding",
    "savings calculator",
    "compound interest formula",
    "how compound interest works",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/finance/compound-interest",
  },
  openGraph: {
    title: "Compound Interest Calculator | MultiTool",
    description:
      "Calculate compound interest and future value. Free, instant and private.",
    url: "https://www.multitoolbox.online/tools/finance/compound-interest",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator - Free",
    description:
      "See how your money grows with compound interest. Instant results.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Compound Interest Calculator"
      description="See how an amount grows when interest is added to the balance. Set principal, annual rate, compounding frequency and years — in USD, EUR, GBP or BRL."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="compound-interest"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            The compound interest formula
          </h2>
          <p className="mb-3">
            Compound interest pays interest on both the original money and
            the interest already earned.
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 font-mono text-sm">
            A = P × (1 + r ÷ n)<sup>n × t</sup>
          </div>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>A</strong> — final amount
            </li>
            <li>
              <strong>P</strong> — principal (starting amount)
            </li>
            <li>
              <strong>r</strong> — annual interest rate as a decimal (5% =
              0.05)
            </li>
            <li>
              <strong>n</strong> — compounds per year (12 = monthly)
            </li>
            <li>
              <strong>t</strong> — time in years
            </li>
          </ul>
          <p className="mb-4">
            Interest earned = <strong>A − P</strong>. Example: $1,000 at 5%
            compounded monthly for 10 years ≈ <strong>$1,647</strong>.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Pick a currency.</li>
            <li>Enter principal, annual rate (%) and years.</li>
            <li>
              Choose how often interest compounds (yearly, monthly, daily…).
            </li>
            <li>
              Optional: add a <strong>monthly contribution</strong>.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Contributions
          </h2>
          <p className="mb-4">
            If you add money every month, the calculator uses the standard
            future-value-of-a-series formula on top of the compounded
            principal. Deposits are treated as happening at the end of each
            month.
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
          question: "What is compound interest?",
          answer:
            "Interest calculated on the starting amount plus interest already earned. The balance grows faster than simple interest, which only pays on the original principal.",
        },
        {
          question: "What does compounding frequency mean?",
          answer:
            "How often interest is added. Monthly (12 times a year) grows a little faster than yearly. Daily is only slightly faster than monthly at the same nominal rate.",
        },
        {
          question: "Is this the same as a loan / EMI calculator?",
          answer:
            "No. This tool grows savings or investments. The Loan / EMI calculator works the other way: it finds the payment needed to pay a debt down.",
        },
        {
          question: "Can I include monthly deposits?",
          answer:
            "Yes. Put a number in Monthly contribution. The extra deposits also earn compound interest for the remaining time.",
        },
        {
          question: "Are taxes and fees included?",
          answer:
            "No. The result is a pre-tax, pre-fee illustration. Real accounts may charge fees or withhold tax on interest.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded or stored.",
        },
      ]}
      relatedTools={[
        { name: "Loan / EMI Calculator", href: "/tools/finance/loan-calculator" },
        { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
        { name: "Discount Calculator", href: "/tools/finance/discount-calculator" },
        { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
      ]}
    >
      <CompoundInterestClient />
    </ToolLayout>
  );
}