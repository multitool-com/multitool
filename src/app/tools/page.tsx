import type { Metadata } from "next";
import Link from "next/link";
import { categories, SITE_CONFIG } from "@/lib/tools";
import ToolsHubClient from "./ToolsHubClient";

export const metadata: Metadata = {
  title: "All Tools - Every Free Online Tool | MultiTool",
  description: `Browse all ${categories.reduce((acc, c) => acc + c.tools.length, 0)} free online tools: PDF, image, developer, math, finance, health calculators, converters and generators. Fast, private, no sign-up.`,
  keywords: [
    "free online tools",
    "all tools",
    "web tools list",
    "online calculators",
    "online converters",
    "pdf tools",
    "image tools",
    "developer tools",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
  },
  openGraph: {
    title: "All Tools - Every Free Online Tool | MultiTool",
    description:
      "Browse every free online tool: PDF, image, developer, math, finance, health, converters and generators.",
    url: `${SITE_CONFIG.url}/tools`,
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Tools - MultiTool",
    description: `All ${categories.reduce((acc, c) => acc + c.tools.length, 0)} free online tools in one place.`,
  },
};

export default function AllToolsPage() {
  const allTools = categories.flatMap((cat) =>
    cat.tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      catSlug: cat.slug,
      catName: cat.name,
    }))
  );
  const catList = categories.map((c) => ({ slug: c.slug, name: c.name, short: c.shortName }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">ALL TOOLS</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        DIRECTORY
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        All Tools — {allTools.length} and Counting
      </h1>
      <p className="text-ink/60 mb-8 max-w-2xl text-lg">
        Every calculator, converter, generator and utility on MultiTool.
        Search by name or filter by category — everything is free, works
        instantly and runs in your browser.
      </p>

      <ToolsHubClient tools={allTools} categories={catList} />

      <section className="mt-16 border-t border-ink/10 pt-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-2">
          {[
            {
              q: "Are all these tools really free?",
              a: "Yes — every tool on MultiTool is free, with no sign-up, no watermark and no usage limits. The project is supported by unobtrusive ads.",
            },
            {
              q: "How many tools does MultiTool have?",
              a: `${allTools.length} across ${categories.length} categories: PDF, images, developer utilities, math and finance calculators, health, converters, generators, AI helpers and classic browser games.`,
            },
            {
              q: "Do my files get uploaded anywhere?",
              a: "Almost every tool processes files locally in your browser — they never leave your device. The only exceptions (URL shortening and live exchange rates) are documented in our Privacy Policy.",
            },
            {
              q: "Can I use MultiTool on my phone?",
              a: "Yes. Every tool is responsive and works on any modern browser — desktop, tablet or phone. Nothing to install.",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="bg-white border border-ink/10 rounded-xl px-5 py-4 group"
            >
              <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-accent group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink/60 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
