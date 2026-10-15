import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, categories, getAllTools } from "@/lib/tools";
import { getAllGuides } from "@/lib/guides";

const TOTAL_TOOLS = getAllTools().length;
const TOTAL_GUIDES = getAllGuides().length;

export const metadata: Metadata = {
  title: "MultiTool — Free Online Calculators, Converters & Utilities",
  description: `${TOTAL_TOOLS} free online tools and ${TOTAL_GUIDES} written guides: PDF, image, text, finance, health and developer utilities that run entirely in your browser. No sign-up, nothing uploaded.`,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: "MultiTool — Free Online Calculators, Converters & Utilities",
    description: `${TOTAL_TOOLS} free browser-based tools plus ${TOTAL_GUIDES} practical guides. No sign-up, nothing uploaded.`,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: SITE_CONFIG.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiTool — Free Online Tools",
    description: `${TOTAL_TOOLS} free tools that run in your browser, with written guides explaining the math behind them.`,
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
      <section className="relative overflow-hidden min-h-[520px]">
        <div className="absolute inset-0" aria-hidden="true">
          <picture>
            <source srcSet="/hero.webp" type="image/webp" />
            <img
              src="/hero.jpg"
              alt=""
              width={1621}
              height={970}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-deep/50" />
        </div>

        <div className="hidden lg:block">
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

        <link
      rel="preload"
      as="image"
      href="/hero.webp"
      type="image/webp"
      fetchPriority="high"
    />
    <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="font-mono text-xs tracking-widest text-accent mb-4">
            FREE · NO SIGN-UP · INSTANT RESULTS
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-4 leading-tight">
            Every Tool you need,
            <br />
            in one place.
          </h1>
          <p className="text-paper/70 max-w-2xl mx-auto mb-8">
            {totalTools} tools for PDF, images, text, finance, maths and
            everyday conversions — plus written guides that explain the numbers
            behind them. Everything is processed inside your browser, so your
            files never leave your device.
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
              className="w-full bg-paper rounded-full px-5 py-3 text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </form>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pt-14 pb-2">
        <p className="font-mono text-xs tracking-widest text-accent-deep uppercase mb-3">
          What this site is
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          A toolbox built to be used, not to collect your files
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          MultiTool gathers the small utilities that keep interrupting real
          work: merging a PDF before sending it, converting a HEIC photo from a
          phone, checking how long a text takes to read out loud, comparing two
          AI models by price, calculating a loan, rotating a scanned page the
          right way up. Each one is a single page that does one job — no
          account, no installation, no watermark, no "upgrade to continue".
        </p>
        <p className="text-ink/80 leading-relaxed mb-4">
          The engine behind almost every tool runs <strong>inside your
          browser</strong>. PDF merging, image compression, format conversion,
          Word-to-PDF, password generation: the file is read on your own machine
          and the result is written on your own machine. That is why the tools
          work offline once the page has loaded, why they are fast even on large
          files, and why you can use them with contracts, medical documents or
          unpublished coursework without uploading anything anywhere. The few
          exceptions — where a tool genuinely needs an external service — say so
          on their own page and in the{" "}
          <Link href="/privacy" className="text-accent-deep underline underline-offset-2">
            privacy policy
          </Link>.
        </p>
        <p className="text-ink/80 leading-relaxed mb-4">
          Every tool is free and stays free. The site is supported by
          advertising, which is why you may see ads next to the tools — we do
          not sell data, we do not run accounts, and there is nothing to
          subscribe to.
        </p>

        <h2 className="font-display text-2xl md:text-3xl font-bold mt-12 mb-4">
          How tools get published here
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          A tool only goes live when it actually works on real files and its
          page explains what it does in plain language: what the result means,
          which limits it has, and when a different approach is better. We
          recently went through the whole catalogue and pulled the thinnest
          pages out of search engines until they meet the same bar — a page is
          only indexable here when it carries its own explanation, not just a
          button. Guessing is not a feature: when a limitation is real (a
          scanned PDF needs OCR, a chart cannot be compared automatically, a
          legacy <code className="font-mono text-xs">.doc</code> loses its
          formatting), the page says it outright instead of pretending.
        </p>
        <p className="text-ink/80 leading-relaxed">
          The written{" "}
          <Link href="/guides" className="text-accent-deep underline underline-offset-2">
            guides
          </Link>{" "}
          follow the same rule. They exist to answer the question behind the
          tool — how much a PDF can really be compressed, why a lossless format
          can still shrink a file, what those image dimensions in social media
          actually are — with numbers and tables you can check, and a direct
          link to the tool that performs the operation. The engineering
          standards behind both are documented in{" "}
          <Link href="/how-we-build" className="text-accent-deep underline underline-offset-2">
            how we build
          </Link>.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-2">
          <h2 className="font-display text-2xl font-bold">
            Browse by category
          </h2>
          <p className="font-mono text-xs tracking-widest text-ink/70">
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
              <span className="font-mono text-xs text-ink/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-semibold text-lg mt-1 mb-1 group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-ink/70">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-xs tracking-widest text-accent-deep uppercase mb-2">
              Learn
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              From our guides
            </h2>
          </div>
          <Link
            href="/guides"
            className="text-sm font-medium text-accent-deep underline underline-offset-2 whitespace-nowrap"
          >
            All guides →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {getAllGuides().slice(0, 3).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all"
            >
              <p className="font-mono text-[10px] tracking-widest text-ink/70 mb-2">
                GUIDE · {g.readingTime} MIN
              </p>
              <h3 className="font-display font-bold text-lg leading-snug group-hover:text-accent transition-colors">
                {g.title}
              </h3>
              <p className="text-sm text-ink/70 mt-2 line-clamp-2">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-ink/5">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                Lightning Fast
              </h2>
              <p className="text-sm text-ink/70">
                All tools run instantly in your browser. No waiting, no
                loading screens.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🔒</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                Privacy-First
              </h2>
              <p className="text-sm text-ink/70">
                Files are processed locally with JavaScript — nothing is
                uploaded. The few tools that need an external service say so on
                their page;{" "}
                <Link href="/privacy" className="text-accent-deep underline underline-offset-2">
                  the privacy policy
                </Link>{" "}
                lists them all.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💯</div>
              <h2 className="font-display font-semibold text-lg mb-2">
                Always Free
              </h2>
              <p className="text-sm text-ink/70">
                Every tool is free, with no sign-up and no paywall. The site is
                funded by advertising, never by your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          What these tools do not do
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          Being useful also means being precise about the gaps. The tools do
          not read scanned documents (OCR needs more than a browser can
          offer), they do not replace a spreadsheet for modelling, and they do
          not turn a phone photo into a professionally typeset PDF. The
          converters do not guess: if a file has no text layer, the page tells
          you instead of returning empty output. If you need an operation that
          is genuinely beyond what a browser can do safely, we would rather
          tell you than pretend otherwise.
        </p>
        <p className="text-ink/80 leading-relaxed mb-10">
          The tools are used by students finishing coursework, by freelancers
          sending budgets and reports, by small offices that need a contract in
          PDF before the end of the day, by developers converting a payload to
          Base64, and by anyone who needs an answer in thirty seconds without
          installing anything.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="font-mono text-xs tracking-widest text-accent-deep mb-3">
          NEW TOOLS EVERY WEEK
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
          Miss a tool? Let us know.
        </h2>
        <p className="text-ink/70 mb-6 max-w-xl mx-auto">
          New calculators, converters and utilities are added regularly — and
          each one only goes live when it works on real files and its page
          explains the result. If there is something specific you need, or a
          page here got something wrong, write to us: reports from people using
          the tools are how the catalogue improves.
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