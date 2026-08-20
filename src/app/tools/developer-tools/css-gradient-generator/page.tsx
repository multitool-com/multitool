import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CssGradientGeneratorClient from "./CssGradientGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Gradient Generator - Linear & Radial | MultiTool",
  description: "Create beautiful CSS gradients visually: pick colors, angle and type, then copy the ready-to-use code. Free, no sign-up.",
  keywords: ["css gradient generator", "gradient maker", "css background gradient", "linear gradient generator", "color gradient", "gradiente css"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/css-gradient-generator",
  },
  openGraph: {
    title: "CSS Gradient Generator - Linear & Radial | MultiTool",
    description: "Create beautiful CSS gradients visually: pick colors, angle and type, then copy the ready-to-use code. Free, no sign-up.",
    url: "https://www.multitoolbox.online/tools/developer-tools/css-gradient-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Gradient Generator - Linear & Radial | MultiTool",
    description: "Create beautiful CSS gradients visually: pick colors, angle and type, then copy the ready-to-use code. Free, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_CSS Gradient Generator - Linear & Radial | MultiTool"
      description="DESC"
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="css-gradient-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick two colors (or hit Random), choose linear or radial, drag the angle for linear gradients, and copy the generated CSS. Popular presets like Sunset and Ocean are one click away.
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
        { question: "How do I use the generated code?", answer: "Paste it into the CSS of any element, for example body with a background of linear-gradient(45deg, #ff9966 0%, #ff5e62 100%)." },
        { question: "What is a linear gradient?", answer: "A gradient that transitions between colors along a straight line. The angle controls the direction — 0deg is top-to-bottom, 90deg is left-to-right." },
        { question: "What is a radial gradient?", answer: "A gradient that radiates outward from a center point in a circle, like a spotlight." },
        { question: "Can I use the same code for both types?", answer: "The generator outputs the correct CSS for each type automatically when you switch." },
        { question: "Does the Random button create good palettes?", answer: "It picks two harmonious random hues with good saturation and lightness, so most results look great. Click again for more." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Markdown to HTML", href: "/tools/developer-tools/markdown-to-html" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
        { name: "CSV to JSON Converter", href: "/tools/developer-tools/csv-json-converter" },
      ]}
    >
      <CssGradientGeneratorClient />
    </ToolLayout>
  );
}
