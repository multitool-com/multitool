import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UnixTimestampClient from "./UnixTimestampClient";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Epoch to Date & Back | MultiTool",
  description: "Convert Unix timestamps (seconds or milliseconds) to human-readable dates and vice versa, in local time or UTC. Live clock included.",
  keywords: ["unix timestamp converter", "epoch converter", "epoch to date", "timestamp to date", "unix time"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/date-time/unix-timestamp",
  },
  openGraph: {
    title: "Unix Timestamp Converter - Epoch to Date & Back | MultiTool",
    description: "Convert Unix timestamps (seconds or milliseconds) to human-readable dates and vice versa, in local time or UTC. Live clock included.",
    url: "https://multitoolbox.online/tools/date-time/unix-timestamp",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter - Epoch to Date & Back | MultiTool",
    description: "Convert Unix timestamps (seconds or milliseconds) to human-readable dates and vice versa, in local time or UTC. Live clock included.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Unix Timestamp Converter - Epoch to Date & Back | MultiTool"
      description="Convert Unix timestamps (seconds or milliseconds) to human-readable dates and vice versa, in local time or UTC. Live clock included."
      categoryName="date-time_NAME"
      categorySlug="date-time"
      toolSlug="unix-timestamp"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            The live clock shows the current Unix timestamp, updating every second. Convert any timestamp to a date (local or UTC), or any date to a timestamp — the tool auto-detects seconds vs milliseconds.
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
        { question: "What is a Unix timestamp?", answer: "The number of seconds (or milliseconds) since January 1, 1970 UTC — the standard way computers store time." },
        { question: "Does it auto-detect seconds vs milliseconds?", answer: "Yes — 10-digit values are treated as seconds, 13-digit as milliseconds." },
        { question: "Why does my timestamp look wrong?", answer: "Check the units: many APIs return milliseconds. The tool handles both." },
        { question: "Is local time different from UTC?", answer: "Yes — local time depends on your device's time zone; UTC is the global standard. Toggle between them." },
        { question: "Who uses Unix timestamps?", answer: "Developers, databases (PostgreSQL, MySQL), APIs and log files." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Date Calculator", href: "/tools/date-time/date-calculator" },
        { name: "Work Days Calculator", href: "/tools/date-time/work-days-calculator" },
        { name: "Countdown Timer", href: "/tools/date-time/countdown-timer" },
        { name: "Stopwatch", href: "/tools/date-time/stopwatch" },
      ]}
    >
      <UnixTimestampClient />
    </ToolLayout>
  );
}
