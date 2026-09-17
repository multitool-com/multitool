import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WorkDaysCalculatorClient from "./WorkDaysCalculatorClient";

export const metadata: Metadata = {
  title: "Work Days Calculator - Business Days Between Dates | MultiTool",
  description: "Count business days (Monday-Friday) between two dates, excluding weekends and your own holidays. Free and precise.",
  keywords: ["work days calculator", "business days calculator", "working days between dates", "business days count", "dias uteis"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/date-time/work-days-calculator",
  },
  openGraph: {
    title: "Work Days Calculator - Business Days Between Dates | MultiTool",
    description: "Count business days (Monday-Friday) between two dates, excluding weekends and your own holidays. Free and precise.",
    url: "https://www.multitoolbox.online/tools/date-time/work-days-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Days Calculator - Business Days Between Dates | MultiTool",
    description: "Count business days (Monday-Friday) between two dates, excluding weekends and your own holidays. Free and precise.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Work Days Calculator - Business Days Between Dates | MultiTool"
      description="Count business days (Monday-Friday) between two dates, excluding weekends and your own holidays. Free and precise."
      categoryName="date-time_NAME"
      categorySlug="date-time"
      toolSlug="work-days-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter a start and end date, optionally list holidays in YYYY-MM-DD format (comma separated), and the tool counts the business days between them, excluding weekends and any holidays you provide.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Business days, explained
          </h2>
          <p className="mb-4">
            A business day is any day that is not a weekend day — that is the
            convention contracts, banks and shipping companies use. This
            calculator counts days excluding Saturdays and Sundays, which
            matches the default almost everywhere in the world.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Holidays vary by country:</strong> national and local holidays are not subtracted automatically. If your deadline is “5 business days” and there is a holiday in between, add it manually to be safe.</li>
            <li><strong>Counting conventions differ:</strong> some contracts count the start day, others do not. If the result matters legally, check which convention applies — the difference is one full day.</li>
            <li><strong>Deadlines that land on a weekend</strong> usually slide to the next business day in most jurisdictions — but verify for your case.</li>
          </ul>
          <p className="mb-4">
            Common uses: SLA and delivery deadlines, notice periods in
            contracts, project planning, payroll and overtime windows, and
            “respond within X business days” promises. For plain calendar
            differences (weekends included), use the{" "}
            <a href="/tools/date-time/date-calculator" className="text-accent-deep underline underline-offset-2">Date Calculator</a>.
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
        { question: "What counts as a work day?", answer: "Monday to Friday. Weekends (Saturday and Sunday) are always excluded." },
        { question: "How do I add holidays?", answer: "Type them comma-separated in the holiday field, e.g. 2026-12-25, 2026-01-01. They are excluded from the count." },
        { question: "Are the start and end dates counted?", answer: "Yes — if they are weekdays (and not holidays), both are included." },
        { question: "Can I count backwards?", answer: "Yes — the tool handles reversed date ranges correctly." },
        { question: "Why would I need this?", answer: "Contract deadlines, delivery promises, HR leave calculations and project planning all use business days." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Countdown Timer", href: "/tools/date-time/countdown-timer" },
        { name: "Days Until Date", href: "/tools/date-time/days-until-date" },
        { name: "Unix Timestamp Converter", href: "/tools/date-time/unix-timestamp" },
      ]}
    >
      <WorkDaysCalculatorClient />
    </ToolLayout>
  );
}
