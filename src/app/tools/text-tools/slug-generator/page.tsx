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
            What makes a great URL slug
          </h2>
          <p className="mb-4">
            A slug is the readable part of a URL after the domain. Search
            engines and humans both read it — a clean slug tells both what
            the page is about before clicking.
          </p>
          <div className="bg-white border border-ink/10 rounded-lg overflow-hidden my-3 text-sm">
            {[
              ["“10 Tips For a Better Garden!!”", "10-tips-better-garden"],
              ["How to Make  French  Toast (2026)", "how-make-french-toast"],
              ["Onde Comprar Café Especial em SP?", "onde-comprar-cafe-especial-sp"],
              ["Product Review: Best Laptops", "product-review-best-laptops"],
            ].map(([a, b], i) => (
              <div key={a} className={`flex justify-between gap-4 px-4 py-2 ${i % 2 ? "bg-paper/60" : ""}`}>
                <span className="text-ink/60 line-through decoration-ink/30">{a}</span>
                <span className="font-mono text-accent whitespace-nowrap">{b}</span>
              </div>
            ))}
          </div>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Lowercase, hyphen-separated</strong> — the universal convention; underscores and spaces break links and readability.</li>
            <li><strong>3–6 words maximum</strong> — keep the keywords, drop stopwords (a, the, of, in) that add nothing.</li>
            <li><strong>Accents and symbols out</strong> — ç becomes c, ã becomes a: URLs must travel through any system uncorrupted.</li>
            <li><strong>Stable forever:</strong> once a slug is published and indexed, changing it breaks links and SEO. Choose well, then keep it — or set up a redirect if you must change.</li>
          </ul>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Where your slug lives
          </h2>
          <p className="mb-4">
            Anatomy of a URL:{" "}
            <code className="font-mono bg-paper px-1 rounded">https://site.com/category/your-slug</code>{" "}
            — protocol, domain, path, slug. The slug is the only part you
            usually control at authoring time, which makes it your
            on-page SEO handshake: it appears in search results, in shared
            links, in browser history and often as the anchor text when
            people paste the link raw in chats and documents.
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
