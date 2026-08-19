import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MetaTagGeneratorClient from "./MetaTagGeneratorClient";

export const metadata: Metadata = {
  title: "Meta Tag Generator - SEO Title & Description | MultiTool",
  description: "Generate SEO meta tags (title, description, Open Graph, Twitter) with a live Google search preview and social share preview.",
  keywords: ["meta tag generator", "seo meta tags", "meta description generator", "og tags generator", "title tag generator", "meta tags seo"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/meta-tag-generator",
  },
  openGraph: {
    title: "Meta Tag Generator - SEO Title & Description | MultiTool",
    description: "Generate SEO meta tags (title, description, Open Graph, Twitter) with a live Google search preview and social share preview.",
    url: "https://multitoolbox.online/tools/developer-tools/meta-tag-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Tag Generator - SEO Title & Description | MultiTool",
    description: "Generate SEO meta tags (title, description, Open Graph, Twitter) with a live Google search preview and social share preview.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Meta Tag Generator - SEO Title & Description | MultiTool"
      description="DESC"
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="meta-tag-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Fill in your page title, description, URL and optional image. The tool shows exactly how your result appears on Google and when shared on WhatsApp, Facebook or X (Twitter), then generates the complete HTML to paste into your page's head.
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
        { question: "What are meta tags?", answer: "HTML snippets in the page head that tell search engines and social networks what your page is about and how to display it." },
        { question: "How long should a title be?", answer: "Around 50 to 60 characters. The tool warns you when you exceed 60, since Google truncates longer titles." },
        { question: "How long should a description be?", answer: "Around 150 to 160 characters. Longer descriptions get cut off in search results." },
        { question: "What is Open Graph (og:)?", answer: "A protocol used by WhatsApp, Facebook and LinkedIn to build link previews with a title, description and image." },
        { question: "What is Twitter Card?", answer: "The equivalent preview format for X (Twitter). summary_large_image shows a big image; summary shows a small one." },
        { question: "Do I need a page type?", answer: "It helps Google understand your content: website for home pages, article for blog posts, product for store items." },
      ]}
      relatedTools={[
        { name: "CSS Gradient Generator", href: "/tools/developer-tools/css-gradient-generator" },
        { name: "Markdown to HTML", href: "/tools/developer-tools/markdown-to-html" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "URL Shortener", href: "/tools/developer-tools/url-shortener" },
      ]}
    >
      <MetaTagGeneratorClient />
    </ToolLayout>
  );
}
