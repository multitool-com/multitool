import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "health";


// Previews dos cards (estáticos = uma imagem; animados = antes/depois)
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "bmi-calculator": { after: "/previews/hel/bmi-calculator.jpg" },
  "age-calculator": { after: "/previews/hel/age-calculator.jpg" },
  "pregnancy-due-date": { after: "/previews/hel/pregnancy-due-date.jpg" },
  "calorie-calculator": { after: "/previews/hel/calorie-calculator.jpg" },
  "ideal-weight": { after: "/previews/hel/ideal-weight.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Health & Fitness Calculators - BMI, Calories & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Health & Fitness Calculators - BMI, Calories & More | MultiTool",
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
        Health & Fitness Calculators
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Health numbers are reference points, not verdicts. BMI is a
          screening tool (muscular people often score “overweight” on it),
          calorie estimates are starting points, and ideal weight formulas
          disagree with each other on purpose — they were built for
          different populations.
        </p>
        <p>
          These calculators show the formula, the source and the
          limitations of each result — informational, never a substitute
          for a professional who can see the whole picture.
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
