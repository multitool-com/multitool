import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DiscountCalculatorClient from "./DiscountCalculatorClient";

export const metadata: Metadata = {
  title: "Discount Calculator - Sale Price & Savings | MultiTool",
  description:
    "Calculate discount, sale price and total savings instantly. Free online discount calculator with reverse mode and double-discount support.",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percentage off calculator",
    "savings calculator",
    "how much off",
    "discount percentage",
    "double discount",
    "final price calculator",
  ],
  alternates: {
    canonical: "https://multitool.online/tools/finance/discount-calculator",
  },
  openGraph: {
    title: "Discount Calculator - Sale Price & Savings | MultiTool",
    description:
      "Calculate discount, sale price and total savings instantly. Reverse mode and double-discount included.",
    url: "https://multitool.online/tools/finance/discount-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discount Calculator - Sale Price & Savings",
    description:
      "Calculate discount, sale price and total savings instantly. Free & fast.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Discount Calculator"
      description="Calculate discount, sale price and savings. Perfect for shopping, sales and stacked promotions."
      categoryName="Finance"
      categorySlug="finance"
      toolSlug="discount-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How to calculate a discount
          </h2>
          <p className="mb-4">
            To calculate the final price after a discount, multiply the
            original price by the discount percentage, then subtract the
            result from the original price:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Sale Price = Original Price − (Original Price × Discount% ÷ 100)
            </p>
          </div>
          <p className="mb-4">
            <strong>Example:</strong> A $100 shirt with a 25% discount:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Sale Price = $100 − ($100 × 0.25) = $100 − $25 ={" "}
              <strong className="text-accent">$75</strong>
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Reverse discount: finding the discount percentage
          </h2>
          <p className="mb-3">
            If you know the original price and the sale price, you can find
            the discount percentage with:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 my-3">
            <p className="font-mono text-sm text-center">
              Discount % = ((Original − Sale) ÷ Original) × 100
            </p>
          </div>
          <p className="mb-4">
            Use the <strong>Reverse mode</strong> toggle in the calculator to
            do this instantly.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Stacked discounts (double promotions)
          </h2>
          <p className="mb-4">
            When stores offer &quot;50% off + 20% extra&quot;, the discounts
            are <strong>not simply added</strong> to make 70%. They&apos;re
            applied in sequence:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Original price: $100</li>
            <li>After first discount (50%): $50</li>
            <li>After second discount (20% of $50): $40</li>
            <li>
              <strong>Total effective discount:</strong> 60% (not 70%)
            </li>
          </ul>
          <p className="mb-4">
            Enable the <strong>Double discount</strong> toggle to calculate
            these stacked promotions correctly.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            When to use a discount calculator
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Shopping</strong> — quickly know how much you&apos;ll
              actually pay
            </li>
            <li>
              <strong>Black Friday / seasonal sales</strong> — compare
              multiple offers
            </li>
            <li>
              <strong>Business pricing</strong> — set discounted prices for
              customers
            </li>
            <li>
              <strong>Coupon stacking</strong> — see the real value of
              layered promotions
            </li>
            <li>
              <strong>Reverse verification</strong> — check if a store is
              honest about the &quot;70% off&quot; they advertise
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
          question: "How do I calculate 20% off?",
          answer:
            "Multiply the original price by 0.20 to get the discount amount, then subtract from the original. Example: $50 × 0.20 = $10 discount, so the sale price is $50 − $10 = $40. Or just enter the values in the calculator above!",
        },
        {
          question: "Are stacked discounts the same as adding them?",
          answer:
            "No! Stacked discounts are applied one after another, not summed. '50% off + 20% off' is not a 70% total discount — it's actually 60% (100 → 50 → 40). Use our Double Discount toggle to see the true effective discount.",
        },
        {
          question: "Can I calculate the original price from a discounted one?",
          answer:
            "Yes. Use the Reverse Mode toggle: enter the sale price and the discount percentage, and the calculator will show you what the original price was.",
        },
        {
          question: "Does this include taxes?",
          answer:
            "No, this calculator only handles the discount itself. Taxes (VAT, sales tax) are applied separately by stores, usually on the discounted price. If you need to add tax, do so after calculating the discount.",
        },
        {
          question: "What's the difference between % off and % of price?",
          answer:
            "'25% off' means you subtract 25% from the original (final price = 75% of original). '25% of price' means the discount is 25% (or 25 dollars, depending on context). This calculator uses the standard '% off' interpretation.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. All calculations happen locally in your browser. Nothing is sent to any server, nothing is stored. Complete privacy.",
        },
      ]}
      relatedTools={[
        { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
        { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
        { name: "Loan Calculator", href: "/tools/finance/loan-calculator" },
        { name: "Salary Calculator", href: "/tools/finance/salary-calculator" },
      ]}
    >
      <DiscountCalculatorClient />
    </ToolLayout>
  );
}