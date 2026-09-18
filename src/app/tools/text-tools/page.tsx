import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "text-tools";


// Previews dos cards (estáticos = uma imagem; animados = antes/depois)
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "word-counter": { before: "/previews/text/word-counter-before.jpg", after: "/previews/text/word-counter-after.jpg" },
  "text-case-converter": { before: "/previews/text/text-case-converter-before.jpg", after: "/previews/text/text-case-converter-after.jpg" },
  "lorem-ipsum-generator": { before: "/previews/text/lorem-ipsum-generator-before.jpg", after: "/previews/text/lorem-ipsum-generator-after.jpg" },
  "text-diff": { before: "/previews/text/text-diff-before.jpg", after: "/previews/text/text-diff-after.jpg" },
  "slug-generator": { before: "/previews/text/slug-generator-before.jpg", after: "/previews/text/slug-generator-after.jpg" },
  "readability-checker": { before: "/previews/text/readability-checker-before.jpg", after: "/previews/text/readability-checker-after.jpg" },
  "keyword-density": { before: "/previews/text/keyword-density-before.jpg", after: "/previews/text/keyword-density-after.jpg" },
  "fancy-text-generator": { before: "/previews/text/fancy-text-generator-before.jpg", after: "/previews/text/fancy-text-generator-after.jpg" },
  "emoji-copy-paste": { before: "/previews/text/emoji-copy-paste-before.jpg", after: "/previews/text/emoji-copy-paste-after.jpg" },
  "hashtag-generator": { before: "/previews/text/hashtag-generator-before.jpg", after: "/previews/text/hashtag-generator-after.jpg" },
  "morse-code": { before: "/previews/text/morse-code-before.jpg", after: "/previews/text/morse-code-after.jpg" },
  "text-encryptor": { before: "/previews/text/text-encryptor-before.jpg", after: "/previews/text/text-encryptor-after.jpg" },
  "number-to-words": { before: "/previews/text/number-to-words-before.jpg", after: "/previews/text/number-to-words-after.jpg" },
  "text-to-speech": { before: "/previews/text/text-to-speech-before.jpg", after: "/previews/text/text-to-speech-after.jpg" },
  "typing-test": { before: "/previews/text/typing-test-before.jpg", after: "/previews/text/typing-test-after.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Free Online Text Tools - Counter, Case Converter & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Free Online Text Tools - Counter, Case Converter & More | MultiTool",
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
        Text Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Text is the raw material of the web — and text tools are the
          quiet workhorses: counting words against limits, comparing
          versions, converting case, decoding Morse, checking readability
          and keyword balance. Writers, students, marketers and developers
          each keep three or four of these bookmarked.
        </p>
        <p>
          All of them process your text locally in the browser — which for
          contracts, drafts and personal documents is not a feature, it is
          the requirement.
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
