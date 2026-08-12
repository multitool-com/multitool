import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Contact Us | MultiTool",
  description:
    "Get in touch with the MultiTool team. Send us your questions, feedback, tool suggestions or partnership inquiries.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: "Contact MultiTool",
    description:
      "Get in touch with the MultiTool team for questions, feedback or suggestions.",
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  const emailSubjects = [
    { label: "General question", subject: "General question" },
    { label: "Suggest a new tool", subject: "Tool suggestion" },
    { label: "Report a bug", subject: "Bug report" },
    { label: "Partnership / business", subject: "Partnership inquiry" },
    { label: "Privacy / legal", subject: "Privacy inquiry" },
  ];

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
        <span className="text-accent">CONTACT</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        CONTACT US
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">Get in touch</h1>
      <p className="text-ink/60 mb-10 text-lg">
        Have a question, suggestion, or just want to say hi? We&apos;d love to
        hear from you.
      </p>

      <div className="text-ink/80 leading-relaxed space-y-8">
        {/* Card principal com e-mail */}
        <section className="bg-white border border-ink/10 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="bg-deep rounded-lg px-6 py-4 mb-4">
              <span className="font-mono text-xs text-paper/50 tracking-widest block mb-1">
                EMAIL US
              </span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-mono text-xl font-semibold text-accent hover:underline break-all"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            <p className="text-ink/60 max-w-md">
              We read every message and typically reply within{" "}
              <strong>1-3 business days</strong>.
            </p>
          </div>
        </section>

        {/* Templates rápidos */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Quick contact
          </h2>
          <p className="mb-4">
            Click one of the topics below to open your email app with a
            pre-filled subject:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {emailSubjects.map((item) => (
              <a
                key={item.subject}
                href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
                  `[${SITE_CONFIG.name}] ${item.subject}`
                )}`}
                className="group bg-white border border-ink/10 rounded-xl p-4 hover:border-accent hover:shadow-sm transition-all flex items-center justify-between"
              >
                <span className="font-medium group-hover:text-accent transition-colors">
                  {item.label}
                </span>
                <span className="font-mono text-accent group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* O que incluir */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-3">
            What to include in your message
          </h2>
          <p className="mb-3">
            To help us respond faster and more accurately, please include the
            following (when applicable):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>For bug reports:</strong> the tool you were using, your
              browser (Chrome, Firefox, Safari, etc.), and a clear
              description of what happened
            </li>
            <li>
              <strong>For tool suggestions:</strong> what the tool should do
              and, if possible, an example of when you&apos;d use it
            </li>
            <li>
              <strong>For general questions:</strong> as much detail as you
              feel comfortable sharing
            </li>
            <li>
              <strong>For privacy inquiries:</strong> a reference to which
              part of our{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>{" "}
              your question relates to
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Frequently asked
          </h2>
          <div className="space-y-3">
            <details className="bg-white border border-ink/10 rounded-xl p-5 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>How long does it take to get a reply?</span>
                <span className="font-mono text-accent group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">
                We aim to respond to all messages within 1-3 business days.
                During busy periods, it may take a bit longer, but we&apos;ll
                always get back to you.
              </p>
            </details>

            <details className="bg-white border border-ink/10 rounded-xl p-5 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>Can I suggest a new tool?</span>
                <span className="font-mono text-accent group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">
                Absolutely! We add new tools every week, and many come
                directly from user suggestions. Send us your idea and, if
                it&apos;s useful for a broad audience, we&apos;ll add it to
                our roadmap.
              </p>
            </details>

            <details className="bg-white border border-ink/10 rounded-xl p-5 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>Do you offer partnerships or sponsorships?</span>
                <span className="font-mono text-accent group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">
                We&apos;re open to partnerships that align with our mission
                of providing free, high-quality tools. Send us a message with
                details and we&apos;ll get back to you.
              </p>
            </details>

            <details className="bg-white border border-ink/10 rounded-xl p-5 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>I found a bug — what should I do?</span>
                <span className="font-mono text-accent group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">
                Please email us with the tool name, your browser, and a short
                description of what went wrong (screenshots help a lot!).
                We&apos;ll fix it as soon as possible.
              </p>
            </details>
          </div>
        </section>

        {/* Links úteis */}
        <section className="mt-12 p-6 bg-deep rounded-xl">
          <p className="font-mono text-xs tracking-widest text-accent mb-3">
            LOOKING FOR SOMETHING ELSE?
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              href="/about"
              className="text-paper hover:text-accent transition-colors font-medium"
            >
              About us →
            </Link>
            <Link
              href="/privacy"
              className="text-paper hover:text-accent transition-colors font-medium"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="text-paper hover:text-accent transition-colors font-medium"
            >
              Terms of Service →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}