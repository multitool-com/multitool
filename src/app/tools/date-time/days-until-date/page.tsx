import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DaysUntilDateClient from "./DaysUntilDateClient";

export const metadata: Metadata = {
  title: "Days Until Date - Countdown How Many Days Left | MultiTool",
  description:
    "Free days until date calculator. Count days, weeks, months and hours remaining until a birthday, holiday, wedding or deadline. Instant countdown in your browser.",
  keywords: [
    "days until",
    "countdown days",
    "days remaining",
    "days until date",
    "how many days until",
    "countdown calculator",
    "days left until",
    "event countdown",
    "days until christmas",
    "days until birthday",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/date-time/days-until-date",
  },
  openGraph: {
    title: "Days Until Date - Countdown How Many Days Left | MultiTool",
    description:
      "Count days, weeks and months until any date. Free, instant and private.",
    url: "https://multitoolbox.online/tools/date-time/days-until-date",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Days Until Date - Free Countdown",
    description:
      "How many days until your event? Instant countdown in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Days Until Date"
      description="Count how many days, weeks, months and hours remain until any date — a birthday, holiday, wedding, exam or deadline."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="days-until-date"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How “days until” is counted
          </h2>
          <p className="mb-4">
            The tool compares <strong>today</strong> (in your browser&apos;s
            timezone) with the date you pick. It counts calendar midnights
            between the two dates, then also shows the same gap as weeks,
            months (average 30.44 days), hours and minutes.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Pick a <strong>target date</strong> (or tap a preset such as
              New Year).
            </li>
            <li>
              Read the big number: <strong>days remaining</strong>.
            </li>
            <li>
              Use the cards for weeks, months, hours and the weekday of
              that date.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why the number can differ by one day
          </h2>
          <p className="mb-4">
            Time zones and “part of today” matter. If it is 11 p.m. on
            Monday and the event is Wednesday morning, some people say
            “1 day” and others say “2 days”. This calculator uses whole
            calendar dates in <em>your</em> local timezone, which matches
            how most “days until Christmas” pages work.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Past dates
          </h2>
          <p className="mb-4">
            If you pick a date that already happened, the tool shows how
            many days have <strong>passed since</strong> that date instead
            of a countdown.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The countdown runs in your browser. The date you pick is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How many days until a date is calculated?",
          answer:
            "The tool takes today's date in your local timezone and subtracts it from the target date, counting midnights in between. Hours and minutes use the time remaining until midnight at the start of that date.",
        },
        {
          question: "Does it use my time zone?",
          answer:
            "Yes. It uses the timezone of the device you are on. Someone in Tokyo and someone in New York can see a different 'days left' for the same calendar date if it is already the next day on one side of the world.",
        },
        {
          question: "What if I pick a date in the past?",
          answer:
            "You will see how many days have passed since that date, labelled clearly as a past event — useful for anniversaries.",
        },
        {
          question: "Are months exact?",
          answer:
            "Days and weeks are exact. The months figure is an average (365.25 / 12 ≈ 30.44 days) so February and 31-day months stay simple. Use days when you need a precise deadline.",
        },
        {
          question: "Can I count down to Christmas or New Year?",
          answer:
            "Yes. Use the preset buttons. Christmas and New Year roll to next year automatically after the date has passed.",
        },
        {
          question: "Is my date private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded or stored.",
        },
      ]}
      relatedTools={[
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Countdown Timer", href: "/tools/date-time/countdown-timer" },
        { name: "Work Days Calculator", href: "/tools/date-time/work-days-calculator" },
        { name: "Unix Timestamp Converter", href: "/tools/date-time/unix-timestamp" },
      ]}
    >
      <DaysUntilDateClient />
    </ToolLayout>
  );
}