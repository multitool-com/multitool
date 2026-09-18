import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "developer-tools";


// Previews dos cards (estáticos = uma imagem; animados = antes/depois)
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "json-formatter": { before: "/previews/dev/json-formatter-before.jpg", after: "/previews/dev/json-formatter-after.jpg" },
  "base64-encoder": { before: "/previews/dev/base64-encoder-before.jpg", after: "/previews/dev/base64-encoder-after.jpg" },
  "url-encoder": { before: "/previews/dev/url-encoder-before.jpg", after: "/previews/dev/url-encoder-after.jpg" },
  "uuid-generator": { before: "/previews/dev/uuid-generator-before.jpg", after: "/previews/dev/uuid-generator-after.jpg" },
  "hash-generator": { before: "/previews/dev/hash-generator-before.jpg", after: "/previews/dev/hash-generator-after.jpg" },
  "password-strength": { before: "/previews/dev/password-strength-before.jpg", after: "/previews/dev/password-strength-after.jpg" },
  "regex-tester": { before: "/previews/dev/regex-tester-before.jpg", after: "/previews/dev/regex-tester-after.jpg" },
  "jwt-decoder": { before: "/previews/dev/jwt-decoder-before.jpg", after: "/previews/dev/jwt-decoder-after.jpg" },
  "csv-json-converter": { before: "/previews/dev/csv-json-converter-before.jpg", after: "/previews/dev/csv-json-converter-after.jpg" },
  "fake-data-generator": { before: "/previews/dev/fake-data-generator-before.jpg", after: "/previews/dev/fake-data-generator-after.jpg" },
  "url-shortener": { before: "/previews/dev/url-shortener-before.jpg", after: "/previews/dev/url-shortener-after.jpg" },
  "cron-generator": { before: "/previews/dev/cron-generator-before.jpg", after: "/previews/dev/cron-generator-after.jpg" },
  "markdown-to-html": { before: "/previews/dev/markdown-to-html-before.jpg", after: "/previews/dev/markdown-to-html-after.jpg" },
  "css-gradient-generator": { before: "/previews/dev/css-gradient-generator-before.jpg", after: "/previews/dev/css-gradient-generator-after.jpg" },
  "px-to-rem": { before: "/previews/dev/px-to-rem-before.jpg", after: "/previews/dev/px-to-rem-after.jpg" },
  "meta-tag-generator": { before: "/previews/dev/meta-tag-generator-before.jpg", after: "/previews/dev/meta-tag-generator-after.jpg" },
  "xml-formatter": { before: "/previews/dev/xml-formatter-before.jpg", after: "/previews/dev/xml-formatter-after.jpg" },
  "yaml-formatter": { before: "/previews/dev/yaml-formatter-before.jpg", after: "/previews/dev/yaml-formatter-after.jpg" },
  "sql-formatter": { before: "/previews/dev/sql-formatter-before.jpg", after: "/previews/dev/sql-formatter-after.jpg" },
  "json-to-yaml": { before: "/previews/dev/json-to-yaml-before.jpg", after: "/previews/dev/json-to-yaml-after.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Free Developer Tools - JSON, Regex, Base64 & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Free Developer Tools - JSON, Regex, Base64 & More | MultiTool",
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
        Developer Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Developer tools earn trust by being exact: a JSON parser that
          shows the precise error position, a cron builder that makes the
          day-of-week logic explicit, encoders that explain the difference
          between encoding and encryption. This is the toolkit for the
          daily 1% of the job that is not writing code.
        </p>
        <p>
          Everything runs client-side — paste real payloads without
          pasting them into a stranger&apos;s server.
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
