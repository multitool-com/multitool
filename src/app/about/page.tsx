import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, categories, getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About Us | MultiTool",
  description:
    "Learn about MultiTool — our mission to provide free, fast and reliable online tools for everyday tasks. No sign-ups, no hassle.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: "About MultiTool",
    description:
      "Learn about our mission to provide free, fast and reliable online tools.",
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  const totalTools = getAllTools().length;
  const totalCategories = categories.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">ABOUT</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        ABOUT US
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        Every tool you need, in one place.
      </h1>
      <p className="text-ink/60 mb-10 text-lg">
        Free, fast and reliable online utilities — built to just work.
      </p>

      <div className="text-ink/80 leading-relaxed space-y-6">
        <section>
          <h2 className="font-display text-2xl font-semibold mt-4 mb-3">
            Our Story
          </h2>
          <p className="mb-3">
            <strong>{SITE_CONFIG.name}</strong> was born from a simple
            frustration: needing a quick calculator, converter or generator,
            and having to sift through cluttered websites full of pop-ups,
            sign-up walls and confusing interfaces just to do a 5-second
            task.
          </p>
          <p>
            We believe that everyday utilities should be{" "}
            <strong>instant, distraction-free, and free of charge</strong>.
            So we built {SITE_CONFIG.name} — a growing collection of
            hand-crafted online tools that just work, right in your browser,
            with no downloads, no accounts and no nonsense.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            Our Mission
          </h2>
          <p>
            To make everyday digital tasks{" "}
            <strong>fast, simple and accessible to everyone</strong> —
            regardless of technical skill, location or budget. Whether
            you&apos;re a student calculating your GPA, a shopper checking a
            discount, a developer decoding Base64, or a parent estimating a
            due date, we want you to get your answer in seconds.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            What We Offer
          </h2>
          <p className="mb-3">
            {SITE_CONFIG.name} currently provides <strong>{totalTools}+ tools</strong>{" "}
            across <strong>{totalCategories} categories</strong>, and we&apos;re
            adding new ones every week:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className="group bg-white border border-ink/10 rounded-xl p-4 hover:border-accent hover:shadow-sm transition-all"
              >
                <h3 className="font-display font-semibold mb-1 group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-ink/60">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            Our Principles
          </h2>
          <ul className="space-y-4">
            <li>
              <strong className="text-ink">🚀 Speed First.</strong> Every tool
              loads in under a second and runs entirely in your browser. No
              waiting, no lag.
            </li>
            <li>
              <strong className="text-ink">🔒 Privacy Respected.</strong> Your
              data stays on your device. We don&apos;t store, transmit or peek
              at anything you type into our tools.
            </li>
            <li>
              <strong className="text-ink">🎯 No Distractions.</strong> No
              pop-ups, no forced sign-ups, no auto-playing videos. Just clean,
              focused tools.
            </li>
            <li>
              <strong className="text-ink">💯 Always Free.</strong> Every tool
              on {SITE_CONFIG.name} is 100% free. We&apos;re supported by
              non-intrusive advertising so you don&apos;t have to pay a cent.
            </li>
            <li>
              <strong className="text-ink">📱 Works Everywhere.</strong> Our
              tools work on any device with a modern browser — desktop,
              tablet or mobile.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            How We Make Money
          </h2>
          <p className="mb-3">
            Since our tools are free to use, {SITE_CONFIG.name} is supported
            entirely by <strong>advertising</strong>. We use Google AdSense to
            display relevant ads on our pages. This allows us to keep the
            servers running, develop new tools and continuously improve
            existing ones — all without ever charging you.
          </p>
          <p>
            We work hard to keep ads unobtrusive and never let them get in
            the way of the tools themselves. If you&apos;d like to support us,
            simply visiting the site or sharing it with friends helps more
            than you might think. 💛
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            Continuously Growing
          </h2>
          <p>
            We add <strong>new tools every week</strong>. If there&apos;s a
            calculator, converter or utility you&apos;d love to see on{" "}
            {SITE_CONFIG.name}, we&apos;d love to hear from you. Your
            suggestions directly shape what we build next.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            Get in Touch
          </h2>
          <p className="mb-3">
            Have a question, suggestion, bug report or partnership idea?
            We&apos;d love to hear from you.
          </p>
          <p>
            Reach us at:{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-accent hover:underline font-mono"
            >
              {SITE_CONFIG.email}
            </a>
          </p>
          <p className="mt-2">
            Or visit our{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact page
            </Link>
            .
          </p>
        </section>

        {/* CTA final */}
        <section className="mt-12 p-6 bg-deep rounded-xl text-center">
          <p className="font-mono text-xs tracking-widest text-accent mb-2">
            READY TO START?
          </p>
          <h2 className="font-display text-2xl font-bold text-paper mb-3">
            Explore all our tools
          </h2>
          <p className="text-paper/70 mb-4">
            Free, fast and always available — no account required.
          </p>
          <Link
            href="/"
            className="inline-block font-mono text-xs tracking-widest bg-accent text-paper hover:bg-accent/80 transition-colors rounded-full px-6 py-3"
          >
            BROWSE TOOLS →
          </Link>
        </section>
      </div>
    </div>
  );
}