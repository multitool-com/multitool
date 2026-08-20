import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UrlShortenerClient from "./UrlShortenerClient";

export const metadata: Metadata = {
  title: "URL Shortener - Shorten Links Online Free | MultiTool",
  description:
    "Free URL shortener. Turn any long link into a short, shareable URL in seconds. Copy with one click, session history included. No sign-up.",
  keywords: [
    "url shortener",
    "shorten link",
    "short url",
    "link shortener",
    "shorten url online",
    "url shortener free",
    "encurtador de link",
    "encurtar url",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/developer-tools/url-shortener",
  },
  openGraph: {
    title: "URL Shortener - Shorten Links | MultiTool",
    description:
      "Turn any long link into a short, shareable URL. Free and instant.",
    url: "https://www.multitoolbox.online/tools/developer-tools/url-shortener",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener - Free & Instant",
    description: "Shorten links in seconds. No sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="URL Shortener"
      description="Turn any long link into a short, shareable URL in seconds. Paste, shorten, copy — with a history of your recent links for the session."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="url-shortener"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste a long URL and click <strong>SHORTEN</strong>. The tool
            sends it to a shortening service that returns a compact link
            like <code className="bg-paper px-1 rounded">cleanuri.com/Ab12Cd</code>{" "}
            — much easier to share in messages, posts or print. Opening the
            short link redirects to the original address.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Paste the long URL you want to shorten.</li>
            <li>Click <strong>SHORTEN</strong>.</li>
            <li>Copy the short link with one click — or open it to test.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Privacy note
          </h2>
          <p className="mb-4">
            Shortening a link means <strong>sending it to a third-party
            service</strong> (cleanuri.com) — that is how URL shorteners
            work: the service stores the mapping and handles the redirect.
            Do not use this tool for sensitive links you would not share
            with a link-shortening provider. Everything else stays in your
            browser.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            No accounts, no tracking by this site. Your history is kept only
            in your browser for the current session.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is the short link permanent?",
          answer:
            "Short links from the service are designed to be long-lasting, but like any URL shortener, they depend on the provider keeping the service running. For critical links, keep the original too.",
        },
        {
          question: "Does the link expire?",
          answer:
            "No fixed expiry. The short link redirects as long as the service stores the mapping — there is no time limit applied.",
        },
        {
          question: "Is my link private?",
          answer:
            "The URL is sent to a third-party shortening service so it can create the redirect — that is how all URL shorteners work. Avoid shortening private or sensitive links; use it for public URLs.",
        },
        {
          question: "Can I customize the short code?",
          answer:
            "The free service generates a random short code automatically. Custom codes require a paid provider account, which is out of scope for this free tool.",
        },
        {
          question: "Why do I get an error?",
          answer:
            "The URL must be complete (with https://) and reachable. Check for typos, spaces or missing slashes, then try again.",
        },
        {
          question: "Does the tool track my data?",
          answer:
            "No. There are no accounts and no tracking by this site. Your history is stored only in your browser for the session.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "JWT Decoder", href: "/tools/developer-tools/jwt-decoder" },
        { name: "CSV ⇄ JSON", href: "/tools/developer-tools/csv-json-converter" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
      ]}
    >
      <UrlShortenerClient />
    </ToolLayout>
  );
}
