import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MortgageCalculatorClient from "./MortgageCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Calculator - Monthly Payment Estimator | MultiTool",
  description: "Free mortgage calculator. Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term.",
  keywords: ["mortgage calculator", "home loan calculator", "monthly payment calculator", "mortgage payment", "house payment calculator"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/finance/mortgage-calculator",
  },
  openGraph: {
    title: "Mortgage Calculator - Monthly Payment Estimator | MultiTool",
    description: "Free mortgage calculator. Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term.",
    url: "https://multitoolbox.online/tools/finance/mortgage-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Calculator - Monthly Payment Estimator | MultiTool",
    description: "Free mortgage calculator. Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Mortgage Calculator - Monthly Payment Estimator | MultiTool"
      description="Free mortgage calculator. Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term."
      categoryName="finance_NAME"
      categorySlug="finance"
      toolSlug="mortgage-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Free mortgage calculator. Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term.
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
        { question: "How is the monthly payment calculated?", answer: "With the standard amortization formula: principal x monthly rate x (1+rate)^n / ((1+rate)^n - 1), where n is the number of monthly payments." },
        { question: "What does the total interest mean?", answer: "It is the difference between what you borrow and what you pay back over the full term — often more than the loan itself at high rates." },
        { question: "Does it include taxes and insurance?", answer: "No — it estimates principal and interest only. Property taxes, insurance and fees vary by location." },
        { question: "What is a good down payment?", answer: "20% avoids private mortgage insurance in many places, but lower down payments are common. The tool shows your down payment percentage." },
        { question: "Can I compare different terms?", answer: "Yes — change the term (15, 20, 30 years) and rate to see how monthly payments and total interest change." },
        { question: "Is my data private?", answer: "Yes — everything runs in your browser. Nothing is sent or stored." }
      ]}
      relatedTools={[
        { name: "Loan / EMI Calculator", href: "/tools/finance/loan-calculator" },
        { name: "Compound Interest", href: "/tools/finance/compound-interest" },
        { name: "Discount Calculator", href: "/tools/finance/discount-calculator" },
        { name: "VAT Calculator", href: "/tools/finance/vat-calculator" }
      ]}
    >
      <MortgageCalculatorClient />
    </ToolLayout>
  );
}
