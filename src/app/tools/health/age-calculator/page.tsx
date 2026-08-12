import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AgeCalculatorClient from "./AgeCalculatorClient";

export const metadata: Metadata = {
  title: "Age Calculator - How Old Am I? Free Online Tool | MultiTool",
  description:
    "Calculate your exact age in years, months, weeks, days, hours and minutes. Free online age calculator with instant results — no sign-up required.",
  keywords: [
    "age calculator",
    "how old am i",
    "date of birth calculator",
    "exact age calculator",
    "age in days",
    "age in months",
    "birthday calculator",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/age-calculator",
  },
  openGraph: {
    title: "Age Calculator - How Old Am I? | MultiTool",
    description:
      "Calculate your exact age in years, months, weeks, days, hours and minutes. Instant results.",
    url: "https://multitoolbox.online/tools/health/age-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator - How Old Am I? | MultiTool",
    description:
      "Calculate your exact age in years, months, days, hours and minutes. Free & instant.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, weeks, days, hours and minutes. Enter your date of birth to get started."
      categoryName="Health & Fitness"
      categorySlug="health"
      toolSlug="age-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            About the Age Calculator
          </h2>
          <p className="mb-4">
            The <strong>Age Calculator</strong> is a fast, free online tool
            that calculates your exact age based on your date of birth. Unlike
            simply subtracting your birth year from the current year, this
            calculator considers months and days to give you the most precise
            answer possible &mdash; down to the minute.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How it works
          </h2>
          <p className="mb-4">
            The calculator takes your date of birth and compares it to the
            current date and time. It then breaks down the difference into
            multiple units so you can see exactly how long you&apos;ve been
            alive:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Years, months and days</strong> &mdash; the traditional
              way to express age, calculated with calendar precision
            </li>
            <li>
              <strong>Total months, weeks and days</strong> &mdash; useful for
              milestones like &quot;100 months old&quot; or &quot;10,000 days
              alive&quot;
            </li>
            <li>
              <strong>Total hours and minutes</strong> &mdash; a fun way to
              see how much time you&apos;ve experienced
            </li>
            <li>
              <strong>Days until next birthday</strong> &mdash; so you can
              start planning your celebration
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            When to use an age calculator
          </h2>
          <p className="mb-4">
            An age calculator is useful in many situations: filling out
            forms that require your exact age, calculating age for legal or
            medical purposes, tracking a baby&apos;s growth in weeks or
            months, comparing ages between family members, or simply
            satisfying curiosity about how many days you&apos;ve been on this
            planet.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All calculations happen instantly in your browser. Your date of
            birth is <strong>never sent to any server</strong> and never
            stored. This tool is 100% private and works even without an
            internet connection once loaded.
          </p>
        </>
      }
      faqs={[
        {
          question: "How accurate is this age calculator?",
          answer:
            "Our age calculator is extremely accurate. It considers years, months, days, hours and minutes, and accounts for leap years automatically. It uses your device's current date and time as the reference point.",
        },
        {
          question: "Does it account for leap years?",
          answer:
            "Yes. The calculator uses JavaScript's built-in Date object, which correctly handles leap years, different month lengths, and daylight saving time transitions.",
        },
        {
          question: "Is my date of birth stored or shared?",
          answer:
            "No. All calculations happen locally in your browser. Your date of birth is never sent to any server, never stored, and never shared with anyone. Your privacy is fully protected.",
        },
        {
          question: "Can I calculate the age between two specific dates?",
          answer:
            "Currently, this tool uses today's date as the reference. If you'd like a feature to calculate age between two custom dates, please let us know via our contact page — we add new features every week!",
        },
        {
          question: "What if I don't know my exact birth time?",
          answer:
            "No problem! You can leave the time field blank and the calculator will use midnight (00:00) as a default. This will give you your age accurate to the day, which is what most people need.",
        },
        {
          question: "Why is my age different in years vs. total days?",
          answer:
            "Because a year has approximately 365.25 days (accounting for leap years). So 10 years is roughly 3,653 days, but your exact total depends on how many leap years occurred during your lifetime.",
        },
      ]}
      relatedTools={[
        { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
        { name: "Days Until Date", href: "/tools/date-time/days-until-date" },
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Pregnancy Due Date", href: "/tools/health/pregnancy-due-date" },
      ]}
    >
      <AgeCalculatorClient />
    </ToolLayout>
  );
}