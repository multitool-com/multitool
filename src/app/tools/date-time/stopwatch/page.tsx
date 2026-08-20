import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StopwatchClient from "./StopwatchClient";

export const metadata: Metadata = {
  title: "Stopwatch, Timer & Pomodoro - Online Time Tools | MultiTool",
  description: "Free online stopwatch with laps, countdown timer and Pomodoro timer. Precise, with sound alerts. Works on any device, no download.",
  keywords: ["stopwatch", "online timer", "countdown timer", "pomodoro timer", "stopwatch online", "cronometro"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/date-time/stopwatch",
  },
  openGraph: {
    title: "Stopwatch, Timer & Pomodoro - Online Time Tools | MultiTool",
    description: "Free online stopwatch with laps, countdown timer and Pomodoro timer. Precise, with sound alerts. Works on any device, no download.",
    url: "https://www.multitoolbox.online/tools/date-time/stopwatch",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stopwatch, Timer & Pomodoro - Online Time Tools | MultiTool",
    description: "Free online stopwatch with laps, countdown timer and Pomodoro timer. Precise, with sound alerts. Works on any device, no download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Stopwatch, Timer & Pomodoro - Online Time Tools | MultiTool"
      description="Free online stopwatch with laps, countdown timer and Pomodoro timer. Precise, with sound alerts. Works on any device, no download."
      categoryName="date-time_NAME"
      categorySlug="date-time"
      toolSlug="stopwatch"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Free online stopwatch with laps, countdown timer and Pomodoro timer. Precise, with sound alerts. Works on any device, no download.
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
        { question: "How precise is the stopwatch?", answer: "It uses requestAnimationFrame with millisecond precision — accurate to about 10ms, displayed with hundredths of a second." },
        { question: "Can I record laps?", answer: "Yes — the Lap button records each split, keeping up to 10 laps for the session." },
        { question: "How does the countdown timer work?", answer: "Enter minutes, press Start, and the timer counts down with a beep when finished." },
        { question: "What is the Pomodoro technique?", answer: "25 minutes of focused work followed by 5 minutes of break, alternating automatically. The tool tracks completed sessions." },
        { question: "Does the sound work on mobile?", answer: "Yes — the alert uses the Web Audio API and works on all devices." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Days Until Date", href: "/tools/date-time/days-until-date" },
        { name: "Countdown Timer", href: "/tools/date-time/countdown-timer" },
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Work Days Calculator", href: "/tools/date-time/work-days-calculator" }
      ]}
    >
      <StopwatchClient />
    </ToolLayout>
  );
}
