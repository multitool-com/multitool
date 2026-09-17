import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AspectRatioCalculatorClient from "./AspectRatioCalculatorClient";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator - 16:9, 4:3 & More | MultiTool",
  description: "Simplify any width and height to its aspect ratio (16:9, 4:3, 1:1) and find the missing dimension for videos, images and screens.",
  keywords: ["aspect ratio calculator", "16:9 calculator", "aspect ratio converter", "resolution ratio", "video aspect ratio", "image ratio"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/aspect-ratio-calculator",
  },
  openGraph: {
    title: "Aspect Ratio Calculator - 16:9, 4:3 & More | MultiTool",
    description: "Simplify any width and height to its aspect ratio (16:9, 4:3, 1:1) and find the missing dimension for videos, images and screens.",
    url: "https://www.multitoolbox.online/tools/math/aspect-ratio-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aspect Ratio Calculator - 16:9, 4:3 & More | MultiTool",
    description: "Simplify any width and height to its aspect ratio (16:9, 4:3, 1:1) and find the missing dimension for videos, images and screens.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Aspect Ratio Calculator - 16:9, 4:3 & More | MultiTool"
      description="DESC"
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="aspect-ratio-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter any width and height and the tool simplifies them to the classic aspect ratio (like 16:9) using the greatest common divisor. You can also pick a target ratio and one known side to find the missing dimension — perfect for resizing videos, images or screens without distortion.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Aspect ratios you meet every day
          </h2>
          <p className="mb-4">
            Aspect ratio is shape expressed as numbers — width ÷ height.
            Once you see them, they are everywhere:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>16:9</strong> — the universal video standard (YouTube, TVs, monitors). From 1920×1080 to 3840×2160, same shape.</li>
            <li><strong>9:16</strong> — the vertical revolution (Stories, Reels, TikTok). The exact inverse of TV.</li>
            <li><strong>4:5 and 1:1</strong> — feed posts; portraits perform best on reach, squares survive everywhere.</li>
            <li><strong>3:2 and 4:3</strong> — classic photography (35mm film was 3:2) and tablets/older screens.</li>
            <li><strong>21:9 (“ultrawide”)</strong> — cinematic monitors; movies themselves use even wider anamorphic ratios.</li>
          </ul>
          <p className="mb-4">
            The calculator&apos;s daily job: <strong>scaling without
            distortion</strong>. To fit 16:9 content into a 4:5 slot, you
            compute the matching height (or width) and crop the overflow —
            that is what every smart thumbnail does. For the full table of
            exact pixel sizes per platform, see our{" "}
            <a href="/guides/social-media-image-sizes" className="text-accent-deep underline underline-offset-2">social media sizes guide</a>.
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
        { question: "How do I calculate an aspect ratio?", answer: "Divide both width and height by their greatest common divisor. For example, 1920 divided by 120 is 16 and 1080 divided by 120 is 9, giving 16:9." },
        { question: "What does 16:9 mean?", answer: "It means that for every 16 units of width there are 9 units of height. It is the standard for HD and Full HD video." },
        { question: "What is the aspect ratio of 1920x1080?", answer: "1920x1080 simplifies to 16:9, the most common widescreen format." },
        { question: "How do I resize without distortion?", answer: "Keep the same ratio: if your target is 16:9 and you know the width, the height is width times 9 divided by 16." },
        { question: "Does it work for vertical video?", answer: "Yes — 9:16 is included as a preset, ideal for reels, shorts and stories." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Percentage Change Calculator", href: "/tools/math/percentage-change" },
        { name: "Scientific Calculator", href: "/tools/math/scientific-calculator" },
        { name: "Statistics Calculator", href: "/tools/math/statistics-calculator" },
        { name: "Ratio Calculator", href: "/tools/math/ratio-calculator" },
      ]}
    >
      <AspectRatioCalculatorClient />
    </ToolLayout>
  );
}
