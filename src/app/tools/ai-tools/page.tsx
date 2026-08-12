import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";

const category = getCategoryBySlug("ai-tools")!;

export const metadata: Metadata = {
  title: `${category.name} Tools - Free AI Utilities | ${SITE_CONFIG.name}`,
  description: category.seoDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools/ai-tools`,
  },
  openGraph: {
    title: `${category.name} Tools | ${SITE_CONFIG.name}`,
    description: category.seoDescription,
    url: `${SITE_CONFIG.url}/tools/ai-tools`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: SITE_CONFIG.locale,
  },
};

export default function AiToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="font-mono text-xs tracking-widest text-ink/50 mb-2">
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{category.name.toUpperCase()}</span>
      </nav>

      <span className="font-mono text-xs tracking-widest text-accent">
        CATEGORY
      </span>
      <h1 className="font-display text-4xl font-bold mt-1 mb-3">
        {category.name} Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-xl">{category.seoDescription}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={
              tool.status === "ready"
                ? `/tools/ai-tools/${tool.slug}`
                : "#"
            }
            className={`border border-ink/10 rounded-xl p-5 transition-all ${
              tool.status === "ready"
                ? "bg-white hover:border-accent hover:shadow-md cursor-pointer"
                : "bg-paper/50 cursor-default opacity-75"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-ink/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full ${
                  tool.status === "ready"
                    ? "bg-accent/15 text-accent"
                    : "bg-ink/5 text-ink/40"
                }`}
              >
                {tool.status === "ready" ? "READY" : "SOON"}
              </span>
            </div>
            <h2 className="font-display font-semibold mb-1">{tool.name}</h2>
            <p className="text-sm text-ink/60">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}