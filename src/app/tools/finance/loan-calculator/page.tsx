import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LoanCalculatorClient from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Loan Calculator - EMI & Amortization Schedule | MultiTool",
  description:
    "Free online loan calculator with EMI calculation and amortization schedule. Calculate monthly payments, total interest and see your loan breakdown.",
  keywords: [
    "loan calculator",
    "emi calculator",
    "mortgage calculator",
    "monthly payment",
    "amortization schedule",
    "loan interest",
    "personal loan",
    "car loan",
    "home loan",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/finance/loan-calculator",
  },
  openGraph: {
    title: "Loan Calculator - EMI & Amortization | MultiTool",
    description:
      "Calculate your monthly loan payments (EMI), total interest and see full amortization schedule. Free & instant.",
    url: "https://www.multitoolbox.online/tools/finance/loan-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Calculator - EMI & Amortization | MultiTool",
    description:
      "Calculate monthly loan payments, total interest and amortization schedule. Free online tool.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Loan / EMI Calculator"
      description="Calculate your monthly loan payment (EMI), total interest and see the full amortization schedule. Enter loan amount, interest rate and term to get started."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="loan-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is EMI?
          </h2>
          <p className="mb-4">
            <strong>EMI (Equated Monthly Installment)</strong> is the fixed
            amount you pay to a lender every month to repay a loan. It includes
            both principal and interest components, structured so that your
            loan is fully paid off by the end of the term.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How is EMI calculated?
          </h2>
          <p className="mb-3">The EMI formula is:</p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> - 1)
            </p>
          </div>
          <p className="mb-3">Where:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>P</strong> = Principal loan amount
            </li>
            <li>
              <strong>r</strong> = Monthly interest rate (annual rate ÷ 12 
              100)
            </li>
            <li>
              <strong>n</strong> = Number of monthly payments (loan term in
              months)
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Understanding the amortization schedule
          </h2>
          <p className="mb-4">
            An amortization schedule shows how each payment is split between
            principal and interest. In the early months, most of your payment
            goes toward interest. Over time, more goes toward the principal.
            This is why paying extra early in the loan term can save you
            significant interest.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Example calculation
          </h2>
          <p className="mb-3">
            If you borrow <strong>$10,000</strong> at <strong>6% annual
            interest</strong> for <strong>5 years (60 months)</strong>:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Monthly payment (EMI) = <strong className="text-accent">$193.33</strong>
              <br />
              Total paid = $11,599.80
              <br />
              Total interest = $1,599.80
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All calculations happen instantly in your browser. Your loan
            details are <strong>never sent to any server</strong> and never
            stored. This tool is 100% private.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a good interest rate for a loan?",
          answer:
            "Interest rates vary by loan type, credit score and market conditions. As of 2025, personal loans typically range from 6% to 36%, mortgages from 3% to 8%, and auto loans from 4% to 12%. Your credit score is the biggest factor — higher scores get lower rates.",
        },
        {
          question: "How can I reduce my EMI?",
          answer:
            "You can reduce your EMI by: (1) extending the loan term (though you'll pay more interest overall), (2) negotiating a lower interest rate, (3) making a larger down payment, or (4) improving your credit score before applying.",
        },
        {
          question: "What happens if I make extra payments?",
          answer:
            "Extra payments go directly toward the principal, which reduces the total interest you'll pay and can shorten your loan term. Even small extra payments each month can save you thousands over the life of a mortgage.",
        },
        {
          question: "Is EMI the same as monthly payment?",
          answer:
            "Yes, EMI (Equated Monthly Installment) is the same as your monthly payment. It's a fixed amount that includes both principal and interest, calculated so the loan is fully paid by the end of the term.",
        },
        {
          question: "Does this calculator include fees or taxes?",
          answer:
            "This calculator shows the base EMI based on principal, interest rate and term. It doesn't include origination fees, insurance, property taxes or other charges that may be part of your actual payment. Check with your lender for the complete picture.",
        },
        {
          question: "Is my loan information private?",
          answer:
            "Yes! All calculations happen entirely in your browser. Your loan amount, interest rate and term are never sent to any server, never stored, and never shared. Your privacy is fully protected.",
        },
      ]}
      relatedTools={[
        { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
        { name: "Discount Calculator", href: "/tools/finance/discount-calculator" },
        { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
        { name: "Salary Calculator", href: "/tools/finance/salary-calculator" },
      ]}
    >
      <LoanCalculatorClient />
    </ToolLayout>
  );
}