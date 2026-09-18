import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "converters";


// Previews dos cards (estáticos = uma imagem; animados = antes/depois)
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "unit-converter": { before: "/previews/conv/unit-converter-before.jpg", after: "/previews/conv/unit-converter-after.jpg" },
  "temperature-converter": { before: "/previews/conv/temperature-converter-before.jpg", after: "/previews/conv/temperature-converter-after.jpg" },
  "timezone-converter": { before: "/previews/conv/timezone-converter-before.jpg", after: "/previews/conv/timezone-converter-after.jpg" },
  "number-base-converter": { before: "/previews/conv/number-base-converter-before.jpg", after: "/previews/conv/number-base-converter-after.jpg" },
  "roman-numeral-converter": { before: "/previews/conv/roman-numeral-converter-before.jpg", after: "/previews/conv/roman-numeral-converter-after.jpg" },
  "currency-converter": { before: "/previews/conv/currency-converter-before.jpg", after: "/previews/conv/currency-converter-after.jpg" },
  "shoe-size-converter": { before: "/previews/conv/shoe-size-converter-before.jpg", after: "/previews/conv/shoe-size-converter-after.jpg" },
  "length-converter": { before: "/previews/conv/length-converter-before.jpg", after: "/previews/conv/length-converter-after.jpg" },
  "weight-converter": { before: "/previews/conv/weight-converter-before.jpg", after: "/previews/conv/weight-converter-after.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Free Online Converters - Units, Currency & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Free Online Converters - Units, Currency & More | MultiTool",
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
        Online Converters
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Conversion is really translation — same value, different
          language. The trap is never the arithmetic; it is the hidden
          rules: the imperial gallon vs the US one, daylight saving
          shifting time zones, shoe systems disagreeing by brand.
        </p>
        <p>
          These converters handle the arithmetic and the traps, using
          internationally defined factors and showing every unit at once —
          because usually you want the answer in more than one language.
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
