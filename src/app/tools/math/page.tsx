import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "math";


// Previews dos cards (estáticos = uma imagem; animados = antes/depois)
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "fraction-calculator": { after: "/previews/mat/fraction-calculator.jpg" },
  "gpa-calculator": { after: "/previews/mat/gpa-calculator.jpg" },
  "percentage-change": { after: "/previews/mat/percentage-change.jpg" },
  "ratio-calculator": { after: "/previews/mat/ratio-calculator.jpg" },
  "geometry-calculator": { after: "/previews/mat/geometry-calculator.jpg" },
  "scientific-calculator": { after: "/previews/mat/scientific-calculator.jpg" },
  "statistics-calculator": { after: "/previews/mat/statistics-calculator.jpg" },
  "aspect-ratio-calculator": { after: "/previews/mat/aspect-ratio-calculator.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Math & Education Calculators - Fractions, GPA & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Math & Education Calculators - Fractions, GPA & More | MultiTool",
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
        Math & Education Calculators
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          From splitting a bill to grading a semester, math tools earn
          their keep by removing the moment of doubt. This section covers
          the classics — fractions, percentages, ratios, statistics and
          geometry — each with the formula displayed beside the answer,
          turning every calculation into a small lesson.
        </p>
        <p>
          The goal is not just the number: it is understanding where the
          number came from, so next time you can sanity-check any result —
          including this one.
        </p>
      </section>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${category.slug}/${tool.slug}`}
            className="group bg-white border border-ink/10 rounded-xl overflow-hidden hover:border-accent hover:shadow-md transition-all relative flex flex-col"
          >
            <ToolPreview
              before={PREVIEWS[tool.slug]?.before}
              after={PREVIEWS[tool.slug]?.after}
              alt={tool.name}
              staticText="🛠️"
            />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tool.status === "ready" && (
                  <span className="font-mono text-[10px] tracking-widest bg-accent/10 text-accent rounded-full px-2 py-1">
                    READY
                  </span>
                )}
              </div>
              <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                {tool.name}
              </h2>
              <p className="text-sm text-ink/60 line-clamp-2">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
