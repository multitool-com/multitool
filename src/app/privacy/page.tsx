import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy | MultiTool",
  description:
    "Read our Privacy Policy to understand how MultiTool collects, uses and protects your personal information.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "January 2025";

export default function PrivacyPolicyPage() {
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
        <span className="text-accent">PRIVACY POLICY</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        LEGAL
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-ink/60 mb-10">
        Last updated: <strong>{LAST_UPDATED}</strong>
      </p>

      <div className="prose-content text-ink/80 leading-relaxed space-y-6">
        <section>
          <p>
            Welcome to <strong>{SITE_CONFIG.name}</strong> (accessible from{" "}
            <Link href="/" className="text-accent hover:underline">
              {SITE_CONFIG.domain}
            </Link>
            ). Your privacy is important to us. This Privacy Policy explains
            what information we collect, how we use it, and the choices you
            have. By using our website, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            {SITE_CONFIG.name} is designed to work entirely in your browser.
            Most of our tools do not require you to provide any personal
            information. However, we may automatically collect certain
            information when you visit the site, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Log data:</strong> IP address, browser type, browser
              version, pages visited, time and date of your visit, time spent
              on those pages, and other diagnostic data.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> Small data
              files stored on your device to help us understand how you use
              the site and to improve your experience. See our{" "}
              <Link
                href="/cookies"
                className="text-accent hover:underline"
              >
                Cookie Policy
              </Link>{" "}
              for details.
            </li>
            <li>
              <strong>Data you enter into tools:</strong> All calculations and
              conversions happen locally in your browser. We do <strong>not</strong>{" "}
              store, transmit or have access to the values you enter into our
              tools.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            2. How We Use Your Information
          </h2>
          <p className="mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To operate, maintain and improve our website</li>
            <li>To analyze usage patterns and site performance</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To display relevant advertisements (see Section 4)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            3. Third-Party Services
          </h2>
          <p className="mb-3">
            We may use third-party services that collect, monitor and analyze
            data to improve our service. These third parties have their own
            privacy policies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Analytics:</strong> Web analytics service that
              tracks and reports website traffic.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Vercel:</strong> Hosting and analytics provider.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Vercel Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            4. Advertising and Google AdSense
          </h2>
          <p className="mb-3">
            We use <strong>Google AdSense</strong>, a service by Google LLC, to
            display advertisements on our website. Google AdSense uses cookies
            and web beacons to serve ads based on your prior visits to our
            website or other websites.
          </p>
          <p className="mb-3">
            Google&apos;s use of advertising cookies enables it and its
            partners to serve ads to users based on their visit to our sites
            and/or other sites on the Internet. You may opt out of personalized
            advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            For more information about how Google uses data, please visit{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              How Google uses information from sites or apps that use our
              services
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            5. Your Rights
          </h2>
          <p className="mb-3">
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            European Users (GDPR)
          </h3>
          <p className="mb-3">
            If you are in the European Economic Area (EEA), you have the right
            to access, correct, update or request deletion of your personal
            information. You also have the right to object to processing, to
            request data portability, and to lodge a complaint with a
            supervisory authority.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            California Users (CCPA)
          </h3>
          <p className="mb-3">
            California residents have the right to know what personal
            information is collected, to request deletion, to opt out of the
            sale of personal information, and to non-discrimination for
            exercising these rights.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Brazilian Users (LGPD)
          </h3>
          <p>
            Under Brazil&apos;s Lei Geral de Proteção de Dados (LGPD),
            Brazilian users have rights including access, correction,
            anonymization, portability, deletion, and information about data
            sharing with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            6. External Services
          </h2>
          <p>
            Almost every tool on this site runs entirely in your browser and
            does not send your data to any server. Two features make small
            external requests:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>URL Shortener:</strong> the URL you provide is sent to a
              third-party link shortening service (cleanuri.com) so it can
              generate a short link. The service stores the mapping between
              the short link and your original URL in order to perform the
              redirect. Please do not submit sensitive, confidential or
              personal URLs to this tool.
            </li>
            <li>
              <strong>Currency Converter:</strong> to show live exchange
              rates, the page requests public FX prices from an external
              rates service (frankfurter.app). The amount you type is{" "}
              <strong>never</strong> sent — only standard currency codes are
              requested, and the tool also works offline with a built-in
              rate table.
            </li>
          </ul>
          <p className="mt-3">
            Apart from these requests and standard analytics (see section 5),
            your files, inputs and results stay in your browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            7. Children&apos;s Privacy
          </h2>
          <p>
            Our service is not intended for use by anyone under the age of 13.
            We do not knowingly collect personal information from children
            under 13. If you are a parent or guardian and believe your child
            has provided us with personal information, please contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            8. Data Security
          </h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, alteration, disclosure or destruction.
            However, no method of transmission over the Internet or method of
            electronic storage is 100% secure. While we strive to use
            commercially acceptable means to protect your data, we cannot
            guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date at the top. You are
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            10. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p className="mt-3">
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
      </div>
    </div>
  );
}