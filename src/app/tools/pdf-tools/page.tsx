import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "pdf-tools";

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: `${category.name} Tools - Free Online Calculators | MultiTool`,
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: `${category.name} Tools | MultiTool`,
        description: category.seoDescription,
        url: `${SITE_CONFIG.url}/tools/${category.slug}`,
        siteName: "MultiTool",
        type: "website",
        locale: "en_US",
      },
    }
  : {};

export default function CategoryPage() {
  if (!category) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{category.name.toUpperCase()}</span>
      </nav>

      {/* Header */}
      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        CATEGORY
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        {category.name} Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${category.slug}/${tool.slug}`}
            className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all relative"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-xs text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              {tool.status === "coming-soon" && (
                <span className="font-mono text-[10px] tracking-widest bg-ink/5 text-ink/50 rounded-full px-2 py-1">
                  SOON
                </span>
              )}
              {tool.status === "ready" && (
                <span className="font-mono text-[10px] tracking-widest bg-accent/10 text-accent rounded-full px-2 py-1">
                  READY
                </span>
              )}
            </div>
            <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-ink/60">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
