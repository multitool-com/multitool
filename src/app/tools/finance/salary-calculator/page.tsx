import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

export const metadata: Metadata = {
  title: "Salary / Hourly Wage Calculator - Annual to Hourly | MultiTool",
  description: "Convert annual salary to hourly, weekly and monthly pay — or work out the annual value of an hourly rate. Free, no sign-up.",
  keywords: ["salary calculator", "hourly wage calculator", "annual to hourly", "monthly salary calculator", "paycheck calculator"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/finance/salary-calculator",
  },
  openGraph: {
    title: "Salary / Hourly Wage Calculator - Annual to Hourly | MultiTool",
    description: "Convert annual salary to hourly, weekly and monthly pay — or work out the annual value of an hourly rate. Free, no sign-up.",
    url: "https://multitoolbox.online/tools/finance/salary-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary / Hourly Wage Calculator - Annual to Hourly | MultiTool",
    description: "Convert annual salary to hourly, weekly and monthly pay — or work out the annual value of an hourly rate. Free, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Salary / Hourly Wage Calculator - Annual to Hourly | MultiTool"
      description="Convert annual salary to hourly, weekly and monthly pay — or work out the annual value of an hourly rate. Free, no sign-up."
      categoryName="finance_NAME"
      categorySlug="finance"
      toolSlug="salary-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter your annual salary (or hourly rate), your hours per week and paid weeks per year, and the tool computes every period: hourly, daily, weekly, monthly and annual — useful for comparing job offers across pay structures.
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
        { question: "How do I convert annual salary to hourly?", answer: "Divide the annual salary by the number of working weeks and then by the hours per week. The tool does this instantly." },
        { question: "How many weeks should I use?", answer: "Use your paid weeks per year: 52 if fully paid, 50 for two weeks of unpaid vacation, or fewer for part-year contracts." },
        { question: "Does it include taxes?", answer: "No — this is gross pay before taxes and deductions. For net pay, apply your local tax rules." },
        { question: "What is a standard work year?", answer: "40 hours per week x 52 weeks = 2,080 hours per year, the common full-time benchmark." },
        { question: "Can I compare hourly vs salaried offers?", answer: "Yes — switch modes to see the annual value of an hourly rate, or the hourly value of a salary, and compare apples to apples." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Loan Calculator", href: "/tools/finance/loan-calculator" },
        { name: "VAT / Sales Tax Calculator", href: "/tools/finance/vat-calculator" },
        { name: "Mortgage Calculator", href: "/tools/finance/mortgage-calculator" },
        { name: "Fuel Economy Calculator", href: "/tools/finance/fuel-economy-calculator" },
      ]}
    >
      <SalaryCalculatorClient />
    </ToolLayout>
  );
}
