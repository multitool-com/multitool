import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "How We Build Our Tools — Methodology & Quality",
  description:
    "How MultiTool's 130+ tools are built, tested and kept private: the engineering standards, the testing process and the privacy-first architecture behind every calculator and converter.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/how-we-build`,
  },
  openGraph: {
    title: "How We Build Our Tools | MultiTool",
    description:
      "The engineering standards, testing process and privacy-first architecture behind every tool.",
    url: `${SITE_CONFIG.url}/how-we-build`,
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl font-bold mt-10 mb-3">{children}</h2>
);

export default function HowWeBuildPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-ink/80 leading-relaxed">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">HOW WE BUILD</span>
      </nav>

      <h1 className="font-display text-4xl font-extrabold text-ink mb-4">
        How we build our tools
      </h1>
      <p className="text-lg text-ink/70 mb-2">
        130+ tools, one standard: every calculator, converter and game on
        this site is built the same way — engineered to be exact, tested
        before published, and private by architecture.
      </p>

      <H>1. Private by architecture, not by promise</H>
      <p>
        Almost every tool on MultiTool runs <strong>100% in your
        browser</strong>. Your PDFs are processed by your own device; your
        texts, numbers and images never travel to a server — there is no
        upload endpoint to send them to. The two exceptions in the entire
        catalog (URL shortening, which calls a shortening service by
        design, and live exchange rates, which request public currency
        prices — never your amounts) are documented openly in our{" "}
        <Link href="/privacy" className="text-accent-deep underline underline-offset-2">
          Privacy Policy
        </Link>
        . This is the architecture review boards call{" "}
        <em>privacy by design</em>: privacy that does not depend on trust.
      </p>

      <H>2. Tested before published</H>
      <p>
        Every tool ships with a battery of automated checks executed before
        deployment. Calculators are validated against known reference
        values (a currency converter against defined exact factors, a
        statistics engine against textbook datasets). Generators and games
        run logic tests in simulated conditions — the Sudoku engine, for
        example, verifies in every batch that each generated puzzle has
        exactly one solution. If a build fails any check, it does not
        deploy.
      </p>

      <H>3. Content you can verify</H>
      <p>
        Our editorial rule: every calculation shows its formula, every
        comparison shows its numbers, and every health or finance tool
        shows its limitations. The guides that accompany the tools ({" "}
        <Link href="/guides" className="text-accent-deep underline underline-offset-2">
          see all
        </Link>
        ) exist to explain the <em>why</em> — which image format to pick,
        how much a PDF can really shrink, what a token is — with real
        numbers you can check, not vague claims.
      </p>

      <H>4. Honest about limits</H>
      <p>
        Estimates are labeled as estimates (token counts, calorie needs,
        AI costs). Tools that can be wrong in dangerous ways — electrical
        load, health decisions — say so on the page and recommend a
        professional. We would rather lose a click than mislead a reader.
      </p>

      <H>5. Fast because it is engineered</H>
      <p>
        The site scores 100/100 (desktop) and 96/100 (mobile) on Google
        PageSpeed — optimized images, self-hosted fonts, no tracking
        bloat. Speed is part of quality: a tool that takes seconds to
        appear is a worse tool.
      </p>

      <H>Found an issue?</H>
      <p>
        Bugs and suggestions make the site better — reach us through the{" "}
        <Link href="/contact" className="text-accent-deep underline underline-offset-2">
          contact page
        </Link>
        . Corrections ship fast.
      </p>
    </div>
  );
}
