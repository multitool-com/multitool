import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CronGeneratorClient from "./CronGeneratorClient";

export const metadata: Metadata = {
  title: "Cron Generator - 5-Field Cron Expressions | MultiTool",
  description: "Build cron expressions visually with presets and dropdowns, plus a human-readable description. Compatible with Linux, AWS and GitHub Actions.",
  keywords: ["cron generator", "cron expression", "cron job", "scheduler", "crontab generator"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/cron-generator",
  },
  openGraph: {
    title: "Cron Generator - 5-Field Cron Expressions | MultiTool",
    description: "Build cron expressions visually with presets and dropdowns, plus a human-readable description. Compatible with Linux, AWS and GitHub Actions.",
    url: "https://www.multitoolbox.online/tools/developer-tools/cron-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron Generator - 5-Field Cron Expressions | MultiTool",
    description: "Build cron expressions visually with presets and dropdowns, plus a human-readable description. Compatible with Linux, AWS and GitHub Actions.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Cron Generator - 5-Field Cron Expressions | MultiTool"
      description="Build cron expressions visually with presets and dropdowns, plus a human-readable description. Compatible with Linux, AWS and GitHub Actions."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="cron-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick a preset (every minute, every 5 minutes, hourly, daily 9am, Mondays 9am, monthly) or build a custom expression with the five dropdowns — minute, hour, day of month, month and day of week — with a plain-English description.
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
        { question: "What is cron?", answer: "A standard scheduling syntax used by Linux, macOS and cloud platforms to run jobs at set times." },
        { question: "What do the five fields mean?", answer: "Minute, hour, day-of-month, month, day-of-week. An asterisk means 'every'. Example: 0 9 * * 1 = 9:00 every Monday." },
        { question: "Is it compatible with GitHub Actions?", answer: "Yes — the standard 5-field format works with cron schedule expressions on GitHub Actions, AWS, GCP and crontab." },
        { question: "What does */5 in the minute field mean?", answer: "Every 5 minutes — the slash means 'step', so */5 = 0, 5, 10... 55." },
        { question: "Does day-of-week 0 mean Sunday or Monday?", answer: "In standard cron, 0 is Sunday (some tools accept 7 as Sunday too)." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Markdown to HTML", href: "/tools/developer-tools/markdown-to-html" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Fake Data Generator", href: "/tools/developer-tools/fake-data-generator" },
      ]}
    >
      <CronGeneratorClient />
    </ToolLayout>
  );
}
