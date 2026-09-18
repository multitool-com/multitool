import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "images";


// Previews "before/after" — imagens demo geradas localmente (efeitos reais)
const PREVIEWS: Record<string, { before: string; after: string }> = {
  "image-compressor": { before: "/previews/images/compress-before.jpg", after: "/previews/images/compress-after.jpg" },
  "jpg-png-webp-converter": { before: "/previews/images/base-before.jpg", after: "/previews/images/convert-after.jpg" },
  "image-to-base64": { before: "/previews/images/base-before.jpg", after: "/previews/images/base64-after.jpg" },
  "favicon-generator": { before: "/previews/images/base-before.jpg", after: "/previews/images/favicon-after.jpg" },
  "image-cropper": { before: "/previews/images/base-before.jpg", after: "/previews/images/crop-after.jpg" },
  "image-resizer": { before: "/previews/images/base-before.jpg", after: "/previews/images/resize-after.jpg" },
  "heic-to-jpg": { before: "/previews/images/heic-before.jpg", after: "/previews/images/heic-after.jpg" },
  "webp-to-jpg": { before: "/previews/images/webpjpg-before.jpg", after: "/previews/images/webpjpg-after.jpg" },
  "png-to-webp": { before: "/previews/images/pngwebp-before.jpg", after: "/previews/images/pngwebp-after.jpg" },
  "exif-viewer": { before: "/previews/images/doc-before.jpg", after: "/previews/images/exif-after.jpg" },
  "rotate-flip-image": { before: "/previews/images/selfie-before-16x9.jpg", after: "/previews/images/rotate-after.jpg" },
  "grayscale-image": { before: "/previews/images/base-before.jpg", after: "/previews/images/grayscale-after.jpg" },
  "add-border": { before: "/previews/images/base-before.jpg", after: "/previews/images/border-after.jpg" },
  "merge-images": { before: "/previews/images/base-before.jpg", after: "/previews/images/merge-after.jpg" },
  "watermark-image": { before: "/previews/images/base-before.jpg", after: "/previews/images/watermark-after.jpg" },
  "add-text-to-image": { before: "/previews/images/base-before.jpg", after: "/previews/images/text-after.jpg" },
  "meme-generator": { before: "/previews/images/portrait-before.jpg", after: "/previews/images/meme-after.jpg" },
  "blur-image": { before: "/previews/images/doc-before.jpg", after: "/previews/images/blur-after.jpg" },
  "profile-picture-maker": { before: "/previews/images/portrait-before.jpg", after: "/previews/images/profile-after.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Free Image Tools - Compress, Convert & Resize Online | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Free Image Tools - Compress, Convert & Resize Online | MultiTool",
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
        Image Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Image work is mostly three jobs: smaller (compress), different
          shape (crop and resize), different format (convert) — plus the
          privacy job of seeing and stripping EXIF metadata before sharing.
          These tools do all four entirely in your browser, which for
          family photos and confidential documents is exactly the point.
        </p>
        <p>
          Pair them with our guides — PNG vs WebP, HEIC explained, social
          media sizes — to know <em>what</em> to choose before{" "}
          <em>how</em>.
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
              staticText="🖼️"
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
