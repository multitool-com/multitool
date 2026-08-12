import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools, categories } from "@/lib/tools";

// Desativa indexação do Google para páginas de busca (Boa prática de SEO!)
export const metadata: Metadata = {
  title: "Search Results | MultiTool",
  description: "Search for free online calculators, converters and generators.",
  robots: {
    index: false,
    follow: true,
  },
};

// Ferramentas populares para sugerir quando não houver resultados
const popularTools = [
  { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator" },
  { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
  { name: "Password Generator", href: "/tools/generators/password-generator" },
];

type SearchParams = Promise<{ q?: string }>;

interface Props {
  searchParams: SearchParams;
}

export default async function SearchPage({ searchParams }: Props) {
  // No Next 16/React 19, searchParams é uma Promise e precisa ser resolvida
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q || "").trim().toLowerCase();

  const allTools = getAllTools();

  // Filtra as ferramentas com base no termo de busca
  const results = query
    ? allTools.filter((tool) => {
        const nameMatch = tool.name.toLowerCase().includes(query);
        const descMatch = tool.description.toLowerCase().includes(query);
        const keywordMatch = tool.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query)
        );
        return nameMatch || descMatch || keywordMatch;
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">SEARCH RESULTS</span>
      </nav>

      {/* Header */}
      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        SEARCH SYSTEM
      </p>
      <h1 className="font-display text-3xl font-bold mb-6">
        {query ? `Search results for: "${query}"` : "Search our tools"}
      </h1>

      {/* Input de busca interno para buscar novamente */}
      <form action="/search" className="max-w-md mb-10 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Type to search again..."
          className="w-full bg-white border border-ink/15 rounded-full px-5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="bg-deep text-paper hover:bg-accent font-mono text-xs tracking-widest px-6 py-2.5 rounded-full transition-colors"
        >
          SEARCH
        </button>
      </form>

      {/* Exibição dos resultados */}
      {query === "" ? (
        // Caso o usuário acesse /search sem digitar nada
        <div className="text-center py-10 bg-white border border-ink/10 rounded-xl p-8 shadow-sm">
          <p className="text-ink/60 mb-4">Please enter a search term above to find a tool.</p>
          <Link
            href="/"
            className="font-mono text-xs tracking-widest text-accent hover:underline"
          >
            ← OR BROWSE ALL CATEGORIES
          </Link>
        </div>
      ) : results.length > 0 ? (
        // Encontrou resultados
        <div>
          <p className="font-mono text-xs text-ink/40 tracking-wider mb-4">
            FOUND {results.length} {results.length === 1 ? "RESULT" : "RESULTS"}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.categorySlug}/${tool.slug}`}
                className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] tracking-widest bg-ink/5 text-ink/50 rounded-full px-2 py-1 block w-fit mb-3">
                    {tool.categoryName.toUpperCase()}
                  </span>
                  <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-ink/60">{tool.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-accent">
                    {tool.status === "ready" ? "READY →" : "SOON →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // Nenhum resultado encontrado
        <div className="bg-white border border-ink/10 rounded-xl p-10 text-center shadow-sm">
          <span className="text-4xl mb-4 block">🔍</span>
          <h2 className="font-display text-xl font-bold mb-2">No tools found</h2>
          <p className="text-ink/60 mb-8 max-w-md mx-auto">
            We couldn&apos;t find any tools matching &quot;{query}&quot;. Try adjusting your spelling or searching for a different keyword.
          </p>

          <h3 className="font-display font-semibold mb-3">Popular tools instead:</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="font-mono text-xs tracking-widest bg-paper border border-ink/10 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
              >
                {tool.name.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link
            href="/contact?subject=Tool%20Suggestion"
            className="font-mono text-xs tracking-widest text-accent hover:underline block"
          >
            💡 SUGGEST A NEW TOOL
          </Link>
        </div>
      )}

      {/* Grid de categorias no rodapé da busca pra facilitar navegação */}
      <section className="mt-16 border-t border-ink/10 pt-12">
        <h2 className="font-display text-xl font-bold mb-6 text-center">
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