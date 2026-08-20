import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  name: string;
  href: string;
}

interface Props {
  title: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  toolSlug: string;
  children: React.ReactNode; // A UI interativa da ferramenta
  howItWorks?: React.ReactNode; // Explicação textual longa
  faqs?: FAQ[];
  relatedTools?: RelatedTool[];
}

export default function ToolLayout({
  title,
  description,
  categoryName,
  categorySlug,
  toolSlug,
  children,
  howItWorks,
  faqs,
  relatedTools,
}: Props) {
  const toolUrl = `${SITE_CONFIG.url}/tools/${categorySlug}/${toolSlug}`;

  // JSON-LD: Breadcrumb schema (Google adora)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${SITE_CONFIG.url}/tools/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: toolUrl,
      },
    ],
  };

  // JSON-LD: SoftwareApplication schema (identifica como app/ferramenta)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: description,
    url: toolUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any (Web Browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  // JSON-LD: FAQ schema (estrutura semantica; rich results de FAQ nao sao
    // exibidos pela maioria dos sites desde a restricao de 2023 do Google)
  const faqSchema = faqs && faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {/* Schemas JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Breadcrumb visual */}
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-xs tracking-widest text-ink/50 mb-2"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/tools/${categorySlug}`}
            className="hover:text-accent transition-colors"
          >
            {categoryName.toUpperCase()}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-accent">TOOL</span>
        </nav>

        {/* Título + descrição */}
        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
        <p className="text-ink/60 mb-8">{description}</p>

        {/* UI interativa da ferramenta */}
        {children}

        {/* Seção "How it works" — importante pro SEO e pro AdSense */}
        {howItWorks && (
          <section className="mt-12 text-ink/80 leading-relaxed">
            {howItWorks}
          </section>
        )}

        {/* Seção FAQ — com schema pra aparecer no Google */}
        {faqs && faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white border border-ink/10 rounded-xl p-5 group"
                >
                  <summary className="font-display font-semibold cursor-pointer list-none flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="font-mono text-accent group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ink/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Ferramentas relacionadas — melhora SEO interno e retenção */}
        {relatedTools && relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold mb-4">
              Related Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="font-mono text-xs tracking-widest bg-white border border-ink/10 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
                >
                  {tool.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}