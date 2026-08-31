import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import { SITE_CONFIG } from "@/lib/tools";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/guides/${guide.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      title: guide.title,
      description: guide.description,
      url: `${SITE_CONFIG.url}/guides/${guide.slug}`,
      siteName: "MultiTool",
      publishedTime: guide.date,
      modifiedTime: guide.updated,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const others = getAllGuides().filter((g) => g.slug !== guide.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: SITE_CONFIG.name },
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
    mainEntityOfPage: `${SITE_CONFIG.url}/guides/${guide.slug}`,
    inLanguage: "en",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/70 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-accent transition-colors">
          GUIDES
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{guide.title.slice(0, 40)}…</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">
        {guide.title}
      </h1>
      <p className="text-ink/70 text-lg mb-3">{guide.description}</p>
      <p className="font-mono text-xs text-ink/70 mb-8">
        UPDATED {guide.updated.toUpperCase()} · {guide.readingTime} MIN READ
      </p>

      <div
        className="guide-body"
        dangerouslySetInnerHTML={{ __html: guide.html }}
      />

      {/* CTA: ferramentas relacionadas */}
      {guide.tools.length > 0 && (
        <aside className="mt-10 bg-white border border-ink/10 rounded-xl p-6">
          <p className="font-mono text-xs tracking-widest text-accent mb-4">
            DO IT NOW — FREE & PRIVATE
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {guide.tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-start gap-3 border border-ink/10 rounded-lg p-4 hover:border-accent hover:shadow-sm transition-all"
              >
                <span className="text-accent font-mono group-hover:translate-x-1 transition-transform">
                  →
                </span>
                <span>
                  <span className="font-display font-semibold block group-hover:text-accent transition-colors">
                    {t.name}
                  </span>
                  <span className="text-xs text-ink/70">{t.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* outros guias */}
      {others.length > 0 && (
        <section className="mt-10 pt-8 border-t border-ink/10">
          <p className="font-mono text-xs tracking-widest text-ink/70 mb-4">
            MORE GUIDES
          </p>
          <div className="flex flex-col gap-3">
            {others.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group font-display text-lg font-semibold hover:text-accent transition-colors"
              >
                <span className="text-accent font-mono text-sm mr-2">→</span>
                {g.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
