import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import ToolPreview from "@/components/ToolPreview";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "generators";


// Previews dos cards — estáticos: uma imagem mostra o resultado
const PREVIEWS: Record<string, { before?: string; after?: string }> = {
  "password-generator": { after: "/previews/gen/password-generator.jpg" },
  "random-number-generator": { after: "/previews/gen/random-number-generator.jpg" },
  "qr-code-generator": { after: "/previews/gen/qr-code-generator.jpg" },
  "color-palette": { after: "/previews/gen/color-palette.jpg" },
  "dice-roller": { after: "/previews/gen/dice-roller.jpg" },
  "wheel-spinner": { after: "/previews/gen/wheel-spinner.jpg" },
  "giveaway-picker": { after: "/previews/gen/giveaway-picker.jpg" },
  "love-calculator": { after: "/previews/gen/love-calculator.jpg" },
  "coin-flip": { after: "/previews/gen/coin-flip.jpg" },
  "username-generator": { after: "/previews/gen/username-generator.jpg" },
  "random-word-generator": { after: "/previews/gen/random-word-generator.jpg" },
  "pet-business-name-generator": { after: "/previews/gen/pet-business-name-generator.jpg" },
};

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: "Free Online Generators - Passwords, QR Codes & More | MultiTool",
      description: category.seoDescription,
      alternates: {
        canonical: `${SITE_CONFIG.url}/tools/${category.slug}`,
      },
      openGraph: {
        title: "Free Online Generators - Passwords, QR Codes & More | MultiTool",
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
        Generators & Fun Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>


      {/* Intro editorial */}
      <section className="max-w-3xl mb-10 text-ink/70 leading-relaxed">
        <p className="mb-3">
          Generators turn a decision into a button: strong passwords, QR
          codes, random draws, palettes, usernames, spinners. Behind the
          fun there is serious engineering — cryptographic randomness for
          secrets, uniform probability for fair draws, and color harmony
          rules for palettes that actually look designed.
        </p>
        <p>
          Every result is generated on your device, the moment you click —
          nothing is stored, nothing is sent.
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
