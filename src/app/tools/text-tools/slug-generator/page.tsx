import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SlugGeneratorClient from "./SlugGeneratorClient";

export const metadata: Metadata = {
  title: "Slug Generator - URL-Friendly Text | MultiTool",
  description: "Convert any title into a clean URL slug: lowercase, accents removed, spaces replaced. Perfect for blog posts and SEO.",
  keywords: ["slug generator", "url slug", "seo slug", "clean url", "gerador de slug"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/slug-generator",
  },
  openGraph: {
    title: "Slug Generator - URL-Friendly Text | MultiTool",
    description: "Convert any title into a clean URL slug: lowercase, accents removed, spaces replaced. Perfect for blog posts and SEO.",
    url: "https://www.multitoolbox.online/tools/text-tools/slug-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slug Generator - URL-Friendly Text | MultiTool",
    description: "Convert any title into a clean URL slug: lowercase, accents removed, spaces replaced. Perfect for blog posts and SEO.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Slug Generator - URL-Friendly Text | MultiTool"
      description="Convert any title into a clean URL slug: lowercase, accents removed, spaces replaced. Perfect for blog posts and SEO."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="slug-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type a title or phrase and instantly get a URL-friendly slug: lowercase, accents stripped, special characters removed and spaces replaced by your choice of separator (-, _ or .).
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
        { question: "What is a slug?", answer: "The readable part of a URL that identifies a page, like /tools/text-tools/slug-generator." },
        { question: "Why remove accents?", answer: "Most URLs work best with plain ASCII — 'café' becomes 'cafe', avoiding encoding issues and duplicate URLs." },
        { question: "Which separator should I use?", answer: "Hyphens (-) are recommended by Google for readability; underscores and dots are alternatives." },
        { question: "Does it handle emoji?", answer: "Yes — emoji and symbols are stripped automatically." },
        { question: "Is this good for SEO?", answer: "Yes — descriptive, lowercase, hyphenated slugs match how Google recommends URLs be structured." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Keyword Density Checker", href: "/tools/text-tools/keyword-density" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
      ]}
    >
      <SlugGeneratorClient />
    </ToolLayout>
  );
}
