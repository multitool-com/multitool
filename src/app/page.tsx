import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, categories, getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "MultiTool - Free Online Calculators, Converters & Utilities",
  description:
    "40+ free online tools: calculators, converters, generators and utilities for finance, health, math, developers and more. No sign-up, instant results.",
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: "MultiTool - Free Online Calculators, Converters & Utilities",
    description:
      "40+ free online tools: calculators, converters, generators and utilities. No sign-up, instant results.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: SITE_CONFIG.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiTool - Free Online Tools",
    description:
      "40+ free online calculators, converters and generators. Instant results, no sign-up.",
  },
};

const heroTools = [
  { name: "Percentage Calculator", href: "/tools/finance/percentage-calculator", pos: "left-6 top-20" },
  { name: "Word Counter", href: "/tools/text-tools/word-counter", pos: "left-10 top-1/2 -translate-y-1/2" },
  { name: "Password Generator", href: "/tools/generators/password-generator", pos: "left-8 bottom-24" },
  { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator", pos: "right-6 top-20" },
  { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter", pos: "right-10 top-1/2 -translate-y-1/2" },
  { name: "Token Counter", href: "/tools/ai-tools/token-counter", pos: "right-8 bottom-28" },
  { name: "Temperature Converter", href: "/tools/converters/temperature-converter", pos: "left-1/2 -translate-x-1/2 bottom-16" },
];

export default function Home() {
  const totalTools = getAllTools().length;
  const totalCategories = categories.length;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[520px]">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/hero.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-deep/50" />
        </div>

        {/* 7 tool bullets — desktop only */}
        <div className="hidden lg:block" aria-hidden="false">
          {heroTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`absolute ${tool.pos} z-10 font-mono text-[10px] tracking-widest bg-deep/70 text-paper border border-paper/25 rounded-full px-4 py-2 backdrop-blur-sm hover:border-accent hover:text-accent focus:outline-none focus:border-accent focus:text-accent transition-colors`}
            >
              {tool.name.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="font-mono text-xs tracking-widest text-accent mb-4">
            FREE · NO SIGN-UP · INSTANT RESULTS
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-4 leading-tight">
            Every Tool you need,
            <br />
            in one place.
          </h1>
          <p className="text-paper/70 max-w-xl mx-auto mb-8">
            {totalTools}+ simple, fast utility tools for everyday math,
            conversions and text — built to just work, right in your
            browser.
          </p>

          <form
            action="/search"
            role="search"
            aria-label="Search tools"
            className="max-w-md mx-auto flex items-center gap-2"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search tools
            </label>
            <input
              id="hero-search"
              type="text"
              name="q"
              placeholder="Search tools..."
              aria-label="Search tools"
              className="w-full bg-paper rounded-full px-5 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </form>
        </div>

        {/* faixa de régua */}
        <div
          className="relative h-1.5 w-full"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #ff5f1f 0 2px, transparent 2px 14px)",
          }}
        />
      </section>

      {/* GRID DE CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-2">
          <h2 className="font-display text-2xl font-bold">
            Browse by category
          </h2>
          <p className="font-mono text-xs tracking-widest text-ink/40">
            {totalCategories} CATEGORIES &middot; {totalTools}+ TOOLS
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/tools/${cat.slug}`}
              className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md focus:outline-none focus:border-accent focus:shadow-md transition-all"
            >
              <span className="font-mono text-xs text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-semibold text-lg mt-1 mb-1 group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-ink/60">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEÇÃO DE VALOR */}
      <section className="bg-white border-y border-ink/5">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                Lightning Fast
              </h2>
              <p className="text-sm text-ink/60">
                All tools run instantly in your browser. No waiting, no
                loading screens.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🔒</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                100% Private
              </h2>
              <p className="text-sm text-ink/60">
                Your data never leaves your device. Everything runs locally,
                nothing is stored.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💯</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                Always Free
              </h2>
              <p className="text-sm text-ink/60">
                Every tool is free forever. No sign-ups, no paywalls, no
                hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="font-mono text-xs tracking-widest text-accent mb-3">
          NEW TOOLS EVERY WEEK
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
          Miss a tool? Let us know.
        </h2>
        <p className="text-ink/60 mb-6 max-w-lg mx-auto">
          We add new calculators, converters and utilities every week. If
          there&apos;s something specific you need, we&apos;d love to hear
          from you.
        </p>
        <Link
          href="/contact"
          className="inline-block font-mono text-xs tracking-widest bg-deep text-paper hover:bg-accent focus:bg-accent focus:outline-none transition-colors rounded-full px-6 py-3"
        >
          SUGGEST A TOOL →
        </Link>
      </section>
    </div>
  );
}