import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "Color Palette / HEX-RGB - Free Online Tool | MultiTool",
  description: "Convert colors between HEX, RGB, HSL and generate palettes.",
  keywords: ["color converter", "hex to rgb", "color palette generator"],
  alternates: {
    canonical: "https://multitool.online/tools/generators/color-palette",
  },
  openGraph: {
    title: "Color Palette / HEX-RGB | MultiTool",
    description: "Convert colors between HEX, RGB, HSL and generate palettes.",
    url: "https://multitool.online/tools/generators/color-palette",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette / HEX-RGB | MultiTool",
    description: "Convert colors between HEX, RGB, HSL and generate palettes.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="Color Palette / HEX-RGB"
      description="Convert colors between HEX, RGB, HSL and generate palettes."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="color-palette"
    />
  );
}
