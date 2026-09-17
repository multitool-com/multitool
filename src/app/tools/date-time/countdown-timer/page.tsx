import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CountdownTimerClient from "./CountdownTimerClient";

export const metadata: Metadata = {
  title: "Countdown Timer - Live Days, Hours, Minutes, Seconds | MultiTool",
  description: "Count down to any event: days, hours, minutes and seconds, updating live. Perfect for launches, trips and deadlines.",
  keywords: ["countdown timer", "countdown to date", "event countdown", "days hours minutes seconds", "timer online"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/date-time/countdown-timer",
  },
  openGraph: {
    title: "Countdown Timer - Live Days, Hours, Minutes, Seconds | MultiTool",
    description: "Count down to any event: days, hours, minutes and seconds, updating live. Perfect for launches, trips and deadlines.",
    url: "https://www.multitoolbox.online/tools/date-time/countdown-timer",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer - Live Days, Hours, Minutes, Seconds | MultiTool",
    description: "Count down to any event: days, hours, minutes and seconds, updating live. Perfect for launches, trips and deadlines.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Countdown Timer - Live Days, Hours, Minutes, Seconds | MultiTool"
      description="Count down to any event: days, hours, minutes and seconds, updating live. Perfect for launches, trips and deadlines."
      categoryName="date-time_NAME"
      categorySlug="date-time"
      toolSlug="countdown-timer"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick a target date and time and the tool counts down live — days, hours, minutes and seconds update in real time until the moment arrives.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Timeboxing, the productivity classic
          </h2>
          <p className="mb-4">
            A countdown turns an intention into a commitment. Assigning a
            visible, shrinking block of time to a task — the technique
            experts call <strong>timeboxing</strong> — is one of the
            best-supported productivity habits: the timer creates gentle
            urgency, and the deadline kills perfectionist drift.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>25/5 Pomodoro:</strong> 25 minutes of focus, 5 of rest — the most famous timebox of all. Our <a href="/tools/date-time/stopwatch" className="text-accent-deep underline underline-offset-2">Stopwatch & Pomodoro tool</a> automates the cycle.</li>
            <li><strong>Kitchen use:</strong> recipes trust timers, not memory — tea steeps 3 minutes, cookies bake 12, resting dough 30.</li>
            <li><strong>Training intervals:</strong> 40/20 work/rest rounds, plank challenges, breathing exercises (box breathing: 4-4-4-4).</li>
            <li><strong>Kids and transitions:</strong> a visible countdown (“10 minutes until bedtime”) converts negotiations into math.</li>
          </ul>
          <p className="mb-4">
            The timer runs entirely in your browser tab — keep the tab open,
            and the alarm plays even if you switch windows. If you need to
            measure how long something <em>took</em> instead, that is the
            stopwatch&apos;s job.
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
        { question: "Does it keep counting after the target?", answer: "No — when the time comes it shows a celebration state. Pick a new date to restart." },
        { question: "Is it accurate?", answer: "Yes — it syncs to your device clock and updates four times per second." },
        { question: "Can I use it for product launches?", answer: "Yes — set the launch date and embed the countdown anywhere with the tool's URL." },
        { question: "Does it work on mobile?", answer: "Yes — fully responsive with touch support." },
        { question: "Does it save my target?", answer: "The target is kept while the page is open; bookmark the page and it is easy to set again." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Work Days Calculator", href: "/tools/date-time/work-days-calculator" },
        { name: "Unix Timestamp Converter", href: "/tools/date-time/unix-timestamp" },
        { name: "Stopwatch", href: "/tools/date-time/stopwatch" },
      ]}
    >
      <CountdownTimerClient />
    </ToolLayout>
  );
}
