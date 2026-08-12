import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_CONFIG, categories } from "@/lib/tools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} - Free Online Calculators & Converters`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "online tools",
    "free calculator",
    "converter",
    "generator",
    "utility tools",
    "web tools",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Free Online Calculators & Converters`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} - Free Online Calculators & Converters`,
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  verification: {
    google: "bmPXHsHy6C5LgUU38FFAS05LSiCamLz-AKj6_5aY9AY",
    // Como obter:
    //   1. Acesse https://search.google.com/search-console
    //   2. Adicione seu site (URL do Vercel ou domínio final)
    //   3. Escolha "HTML tag" como método de verificação
    //   4. Copie APENAS o valor do content="..." (o código longo)
    //   5. Cole abaixo, dentro das aspas
    // google: "SEU-CODIGO-AQUI",
    //
    // Outros buscadores (opcional):
    // yandex: "seu-codigo-yandex",
    // yahoo: "seu-codigo-yahoo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema Organization — identifica o site como uma organização para o Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
  };

  // Schema WebSite — habilita a "sitelinks search box" no Google
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink font-sans">
        {/* Skip to content — acessibilidade (leitores de tela + teclado) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:text-paper focus:px-4 focus:py-2 focus:rounded-full focus:font-mono focus:text-xs focus:tracking-widest"
        >
          Skip to main content
        </a>

        {/* HEADER */}
        <header className="bg-deep sticky top-0 z-50" role="banner">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label={`${SITE_CONFIG.name} — Home`}
              className="font-display text-xl font-bold text-paper tracking-tight focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-deep rounded-md"
            >
              Multi<span className="text-accent">Tool</span>
            </Link>

            {/* Busca */}
            <form
              action="/search"
              role="search"
              aria-label="Search tools"
              className="flex-1 max-w-md hidden md:block"
            >
              <label htmlFor="header-search" className="sr-only">
                Search tools
              </label>
              <input
                id="header-search"
                type="text"
                name="q"
                placeholder="Search tools..."
                aria-label="Search tools"
                className="w-full bg-paper/95 border border-transparent rounded-full px-4 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </form>

            {/* Nav de categorias */}
            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-3 text-xs font-medium"
            >
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tools/${cat.slug}`}
                  className="text-paper/75 hover:text-accent focus:outline-none focus:text-accent transition-colors whitespace-nowrap"
                >
                  {cat.shortName}
                </Link>
              ))}
            </nav>
          </div>
          {/* faixa de régua */}
          <div
            className="h-1.5 w-full"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #ff5f1f 0 2px, transparent 2px 14px)",
            }}
          />
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-deep mt-16" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Coluna 1: Sobre */}
              <div>
                <Link
                  href="/"
                  aria-label={`${SITE_CONFIG.name} — Home`}
                  className="font-display text-xl font-bold text-paper tracking-tight inline-block mb-3"
                >
                  Multi<span className="text-accent">Tool</span>
                </Link>
                <p className="text-paper/60 text-sm leading-relaxed">
                  Free, fast and reliable online tools for everyday tasks.
                </p>
              </div>

              {/* Coluna 2: Categorias (parte 1) */}
              <nav aria-label="Categories">
                <h2 className="font-mono text-xs tracking-widest text-accent mb-4">
                  CATEGORIES
                </h2>
                <ul className="space-y-2 text-sm">
                  {categories.slice(0, 5).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/tools/${cat.slug}`}
                        className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Coluna 3: Categorias (parte 2) */}
              <nav aria-label="More tools">
                <h2 className="font-mono text-xs tracking-widest text-accent mb-4">
                  MORE TOOLS
                </h2>
                <ul className="space-y-2 text-sm">
                  {categories.slice(5).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/tools/${cat.slug}`}
                        className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Coluna 4: Legal */}
              <nav aria-label="Company and legal">
                <h2 className="font-mono text-xs tracking-widest text-accent mb-4">
                  COMPANY
                </h2>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/about"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cookies"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="text-paper/70 hover:text-accent focus:text-accent focus:outline-none transition-colors"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="border-t border-paper/10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-paper/40">
              <p>
                © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
                reserved.
              </p>
              <p className="font-mono">
                Made with care for a faster, simpler web.
              </p>
            </div>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-M03VJPSYZZ" />
    </html>
  );
}