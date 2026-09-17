import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StatisticsCalculatorClient from "./StatisticsCalculatorClient";

export const metadata: Metadata = {
  title: "Statistics Calculator - Mean, Median, Mode Online | MultiTool",
  description: "Free statistics calculator. Compute mean, median, mode, range, variance and standard deviation from any list of numbers. Instant results.",
  keywords: ["statistics calculator", "mean median mode calculator", "standard deviation calculator", "variance calculator", "statistics solver"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/statistics-calculator",
  },
  openGraph: {
    title: "Statistics Calculator - Mean, Median, Mode Online | MultiTool",
    description: "Free statistics calculator. Compute mean, median, mode, range, variance and standard deviation from any list of numbers. Instant results.",
    url: "https://www.multitoolbox.online/tools/math/statistics-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statistics Calculator - Mean, Median, Mode Online | MultiTool",
    description: "Free statistics calculator. Compute mean, median, mode, range, variance and standard deviation from any list of numbers. Instant results.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Statistics Calculator - Mean, Median, Mode Online | MultiTool"
      description="Free statistics calculator. Compute mean, median, mode, range, variance and standard deviation from any list of numbers. Instant results."
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="statistics-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Free statistics calculator. Compute mean, median, mode, range, variance and standard deviation from any list of numbers. Instant results.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Mean, median, mode: when to use which
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Mean</strong> uses every value — perfect for symmetric data, but one billionaire in the room drags the “average income” far above what anyone earns.</li>
            <li><strong>Median</strong> is the middle value — the honest choice for skewed data. That is why income and housing reports quote medians, not means.</li>
            <li><strong>Mode</strong> is the most frequent value — for categories (most sold shoe size) and for spotting repeated results.</li>
            <li><strong>Standard deviation</strong> measures spread: two classes can share a mean of 70 while one has everyone at 68–72 and the other ranges 40–100. The spread is the story the mean hides.</li>
            <li><strong>Sample vs population:</strong> if your data is a sample of a bigger group, the calculator&apos;s sample standard deviation (dividing by n−1) is the statistically correct one — the correction exists precisely to keep small samples honest.</li>
          </ul>
          <p className="mb-4">
            Paste or type your numbers and the tool computes the full set —
            count, sum, mean, median, mode, min/max, range, variance and
            both deviations — instantly, locally.
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
        { question: "What statistics does it calculate?", answer: "Count, sum, mean, median, mode, min, max, range, variance and standard deviation — plus the sorted list." },
        { question: "What is the difference between mean and median?", answer: "The mean is the average (sum / count). The median is the middle value when sorted — more robust to outliers." },
        { question: "How is mode defined?", answer: "The mode is the value that appears most often. If several values tie, all of them are shown." },
        { question: "Which variance formula is used?", answer: "The population variance (sum of squared deviations / N). For sample variance, use the Bessel correction manually." },
        { question: "Can I paste a large list?", answer: "Yes — numbers can be separated by commas, spaces or semicolons, and any amount works." },
        { question: "Is it free?", answer: "Yes, completely free with no account." }
      ]}
      relatedTools={[
        { name: "Scientific Calculator", href: "/tools/math/scientific-calculator" },
        { name: "Percentage Increase / Decrease", href: "/tools/math/percentage-change" },
        { name: "GPA Calculator", href: "/tools/math/gpa-calculator" },
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" }
      ]}
    >
      <StatisticsCalculatorClient />
    </ToolLayout>
  );
}
