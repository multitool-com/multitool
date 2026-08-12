import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Countdown Timer - Free Online Tool | MultiTool",
  description: "Create a live countdown to any date or event of your choice.",
  keywords: ["countdown timer", "countdown to date", "event countdown"],
  alternates: {
    canonical: "https://multitool.online/tools/date-time/countdown-timer",
  },
  openGraph: {
    title: "Countdown Timer | MultiTool",
    description: "Create a live countdown to any date or event of your choice.",
    url: "https://multitool.online/tools/date-time/countdown-timer",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer | MultiTool",
    description: "Create a live countdown to any date or event of your choice.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Countdown Timer"
      description="Create a live countdown to any date or event of your choice."
      categoryName="Date & Time"
      categorySlug="date-time"
      toolSlug="countdown-timer"
    />
  );
}
