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
            Chronometer vs timer (and how to use both)
          </h2>
          <p className="mb-4">
            A stopwatch measures <strong>elapsed time</strong> (from a start
            gun); a timer counts <strong>remaining time</strong> (to a
            deadline). Training, cooking and experiments typically need
            both — laps on the way, a bell at the end — which is why this
            tool includes the Pomodoro cycle alongside the chronometer.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Laps</strong> capture intervals without stopping the clock — the right way to time workout rounds, repeated experiments or customer-service handling steps.</li>
            <li><strong>Centiseconds matter</strong> when comparing runs; they are noise when boiling eggs. The display gives you both without clutter.</li>
            <li><strong>Keyboard-friendly:</strong> space starts and stops — much faster than mouse hunting when your hands are busy (or floury).</li>
            <li><strong>Pomodoro built in:</strong> 25/5 focus cycles with a rest reminder — no need to reset a kitchen timer eleven times a day.</li>
          </ul>
          <p className="mb-4">
            Everything runs locally: closing the tab resets it, keeping the
            stopwatch honest (no accidental eternal runs) and your data
            private.
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
