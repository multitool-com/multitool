import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DateCalculatorClient from "./DateCalculatorClient";

export const metadata: Metadata = {
  title: "Date Calculator - Days Between Dates & Add Days | MultiTool",
  description: "Count the exact number of days between two dates, or add and subtract days from any date. Free, instant, precise.",
  keywords: ["date calculator", "days between dates", "add days to date", "days from date", "date difference", "calculadora de datas"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/date-time/date-calculator",
  },
  openGraph: {
    title: "Date Calculator - Days Between Dates & Add Days | MultiTool",
    description: "Count the exact number of days between two dates, or add and subtract days from any date. Free, instant, precise.",
    url: "https://www.multitoolbox.online/tools/date-time/date-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date Calculator - Days Between Dates & Add Days | MultiTool",
    description: "Count the exact number of days between two dates, or add and subtract days from any date. Free, instant, precise.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Date Calculator - Days Between Dates & Add Days | MultiTool"
      description="Count the exact number of days between two dates, or add and subtract days from any date. Free, instant, precise."
      categoryName="date-time_NAME"
      categorySlug="date-time"
      toolSlug="date-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Two modes: Days Between counts the exact calendar days between two dates (including both), and Add/Subtract moves any date forward or backward by a chosen number of days.
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
        { question: "How are days between dates counted?", answer: "Both dates are included in the count using calendar-day precision, ignoring time of day." },
        { question: "Can I subtract days?", answer: "Yes — enter a negative number in the Add/Subtract mode, e.g. -30 for thirty days earlier." },
        { question: "Is it useful for deadlines?", answer: "Absolutely — count days until a contract ends, a project deadline or a visa window." },
        { question: "Does it handle month boundaries?", answer: "Yes, the browser's calendar logic handles months and leap years correctly." },
        { question: "Can I see the weekday?", answer: "Yes — results show the weekday of each date." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Work Days Calculator", href: "/tools/date-time/work-days-calculator" },
        { name: "Countdown Timer", href: "/tools/date-time/countdown-timer" },
        { name: "Days Until Date", href: "/tools/date-time/days-until-date" },
        { name: "Unix Timestamp Converter", href: "/tools/date-time/unix-timestamp" },
      ]}
    >
      <DateCalculatorClient />
    </ToolLayout>
  );
}
