import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";


// Previews estáticos dos cards
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "prompt-generator": { after: "/previews/ai/prompt-generator.jpg" },
  "token-counter": { after: "/previews/ai/token-counter.jpg" },
  "ai-cost-calculator": { after: "/previews/ai/ai-cost-calculator.jpg" },
  "ai-coding-tools": { after: "/previews/ai/ai-coding-tools.jpg" },
  "free-ai-directory": { after: "/previews/ai/free-ai-directory.jpg" },
  "llm-model-comparison": { after: "/previews/ai/llm-model-comparison.jpg" },
  "system-prompt-builder": { after: "/previews/ai/system-prompt-builder.jpg" },
};

const category = getCategoryBySlug("ai-tools")!;

export const metadata: Metadata = {
  title: "Free AI Tools - Prompts, Token Counter & AI Costs | MultiTool",
  description: category.seoDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools/ai-tools`,
  },
  openGraph: {
    title: "Free AI Tools - Prompts, Token Counter & AI Costs | MultiTool",
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
        AI Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-xl">{category.seoDescription}</p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Working with AI is a new literacy: writing better prompts,
          counting tokens against model limits, comparing models by price
          and capability, and estimating what an idea costs at scale
          before committing to it. These tools exist for the practical
          side of the AI era — no API keys, no sign-ups.
        </p>
        <p>
          Token counts are close estimates (the exact tokenizer varies by
          model); cost math uses published list prices. Good enough for
          planning — and a habit worth building before the invoice
          arrives.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={
              tool.status === "ready"
                ? `/tools/ai-tools/${tool.slug}`
                : "#"
            }
            className={`border border-ink/10 rounded-xl overflow-hidden transition-all flex flex-col ${
              tool.status === "ready"
                ? "bg-white hover:border-accent hover:shadow-md cursor-pointer"
                : "bg-paper/50 cursor-default opacity-75"
            }`}
          >
            <ToolPreview
              before={PREVIEWS[tool.slug]?.before}
              after={PREVIEWS[tool.slug]?.after}
              alt={tool.name}
              staticText="🤖"
            />
            <div className="p-5 flex flex-col flex-1">
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
              <p className="text-sm text-ink/60 line-clamp-2">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}