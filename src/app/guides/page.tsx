import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides, formatDate } from "@/lib/guides";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Guides & Tutorials - Learn Before You Convert | MultiTool",
  description:
    "Practical guides about image formats, PDF compression and everyday file tasks — with real numbers, comparisons and free browser-based tools to act on them.",
  keywords: [
    "png vs webp",
    "heic explained",
    "compress pdf guide",
    "image format guide",
    "file size tips",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/guides`,
  },
  openGraph: {
    title: "Guides & Tutorials | MultiTool",
    description:
      "Practical guides about formats, compression and file tasks — with real numbers.",
    url: `${SITE_CONFIG.url}/guides`,
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/70 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">GUIDES</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        LEARN
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        Guides & Tutorials
      </h1>
      <p className="text-ink/70 mb-10 max-w-2xl text-lg">
        Real numbers, format comparisons and practical answers for everyday
        file tasks — each guide connects directly to the free tools that do
        the job.
      </p>

      {guides.length === 0 ? (
        <p className="text-ink/70">New guides are coming soon.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group block bg-white border border-ink/10 rounded-xl p-6 hover:border-accent hover:shadow-md transition-all"
            >
              <p className="font-mono text-[11px] tracking-widest text-accent uppercase mb-2">
                {formatDate(g.date)} · {g.readingTime} min read
              </p>
              <h2 className="font-display text-2xl font-bold group-hover:text-accent transition-colors">
                {g.title}
              </h2>
              <p className="text-ink/70 mt-2">{g.description}</p>
              {g.tools.length > 0 && (
                <p className="font-mono text-xs text-ink/40 mt-3">
                  TOOLS: {g.tools.map((t) => t.name).join(" · ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
