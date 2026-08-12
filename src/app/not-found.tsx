import Link from "next/link";
import { categories } from "@/lib/tools";

// Ferramentas populares pra sugerir na 404
const popularTools = [
  { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
  { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
  { name: "Password Generator", href: "/tools/generators/password-generator" },
  { name: "Tip Calculator", href: "/tools/finance/tip-calculator" },
  { name: "Unit Converter", href: "/tools/converters/unit-converter" },
  { name: "Word Counter", href: "/tools/text-tools/word-counter" },
];

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      {/* Visor estilo LCD com 404 */}
      <div className="inline-block bg-deep rounded-2xl px-10 py-8 mb-8">
        <p className="font-mono text-xs text-paper/50 tracking-widest mb-2">
          ERROR
        </p>
        <p className="font-display text-7xl md:text-8xl font-bold text-accent">
          404
        </p>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
        Page not found
      </h1>
      <p className="text-ink/60 mb-10 text-lg max-w-xl mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try one of the popular tools below or explore our categories.
      </p>

      {/* CTA principal */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          href="/"
          className="font-mono text-xs tracking-widest bg-deep text-paper hover:bg-accent transition-colors rounded-full px-6 py-3"
        >
          ← BACK TO HOME
        </Link>
        <Link
          href="/contact"
          className="font-mono text-xs tracking-widest bg-white border border-ink/15 hover:border-accent hover:text-accent transition-colors rounded-full px-6 py-3"
        >
          REPORT BROKEN LINK
        </Link>
      </div>

      {/* Ferramentas populares */}
      <section className="mt-12 text-left">
        <h2 className="font-display text-xl font-semibold mb-4 text-center">
          Popular tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white border border-ink/10 rounded-xl p-4 hover:border-accent hover:shadow-sm transition-all"
            >
              <span className="font-medium group-hover:text-accent transition-colors">
                {tool.name}
              </span>
              <span className="font-mono text-accent ml-2 group-hover:translate-x-1 inline-block transition-transform">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Todas as categorias */}
      <section className="mt-12 text-left">
        <h2 className="font-display text-xl font-semibold mb-4 text-center">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/${cat.slug}`}
              className="group bg-white border border-ink/10 rounded-xl p-3 text-center hover:border-accent transition-all"
            >
              <span className="font-medium text-sm group-hover:text-accent transition-colors">
                {cat.shortName}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}