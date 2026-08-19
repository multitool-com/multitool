import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorPaletteClient from "./ColorPaletteClient";

export const metadata: Metadata = {
  title: "Color Palette Generator - HEX to Palette | MultiTool",
  description: "Generate beautiful color palettes from any base color: monochromatic, complementary, analogous, triadic and tetradic. Copy hex codes.",
  keywords: ["color palette generator", "color scheme generator", "hex color palette", "color wheel", "palette maker", "gerador de paleta"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/color-palette",
  },
  openGraph: {
    title: "Color Palette Generator - HEX to Palette | MultiTool",
    description: "Generate beautiful color palettes from any base color: monochromatic, complementary, analogous, triadic and tetradic. Copy hex codes.",
    url: "https://multitoolbox.online/tools/generators/color-palette",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator - HEX to Palette | MultiTool",
    description: "Generate beautiful color palettes from any base color: monochromatic, complementary, analogous, triadic and tetradic. Copy hex codes.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Color Palette Generator - HEX to Palette | MultiTool"
      description="Generate beautiful color palettes from any base color: monochromatic, complementary, analogous, triadic and tetradic. Copy hex codes."
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="color-palette"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick a base color and a harmony type — mono, complementary, analogous, triadic or tetradic — and instantly get a 5-color palette with hex codes ready to copy into your designs.
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
        { question: "What is a color harmony?", answer: "A combination of colors selected by their positions on the color wheel to look balanced together." },
        { question: "What is analogous?", answer: "Three neighboring colors on the wheel — calm and harmonious, like blues and greens." },
        { question: "What is complementary?", answer: "Two colors directly opposite each other — high contrast, like blue and orange." },
        { question: "What are triadic and tetradic?", answer: "Triadic: three evenly spaced colors. Tetradic: four colors forming a rectangle on the wheel." },
        { question: "What is monochromatic?", answer: "Five shades of the same hue, from dark to light — clean and professional." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "Wheel Spinner", href: "/tools/generators/wheel-spinner" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
        { name: "Dice Roller", href: "/tools/generators/dice-roller" },
      ]}
    >
      <ColorPaletteClient />
    </ToolLayout>
  );
}
