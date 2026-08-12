import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Cookie Policy | MultiTool",
  description:
    "Learn how MultiTool uses cookies and similar tracking technologies to improve your experience.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/cookies`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "January 2025";

export default function CookiePolicyPage() {
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
        <span className="text-accent">COOKIE POLICY</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        LEGAL
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">Cookie Policy</h1>
      <p className="text-ink/60 mb-10">
        Last updated: <strong>{LAST_UPDATED}</strong>
      </p>

      <div className="text-ink/80 leading-relaxed space-y-6">
        <section>
          <p>
            This Cookie Policy explains what cookies are, how{" "}
            <strong>{SITE_CONFIG.name}</strong> uses them, the types of
            cookies we use, and how you can control your cookie preferences.
            By using our website, you consent to the use of cookies in
            accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are placed on your device
            (computer, tablet, mobile phone) when you visit a website. They
            are widely used to make websites work more efficiently, remember
            your preferences, provide analytics data, and deliver relevant
            advertising.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            2. Types of Cookies We Use
          </h2>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Essential Cookies
          </h3>
          <p className="mb-3">
            These cookies are necessary for the website to function properly.
            They enable core functionality such as security, network
            management and accessibility. You cannot opt out of these cookies.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Analytics Cookies
          </h3>
          <p className="mb-3">
            We use analytics cookies (such as Google Analytics) to understand
            how visitors interact with our website. These cookies help us
            improve the site by collecting and reporting information
            anonymously, such as which pages are visited most often and how
            users navigate the site.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Advertising Cookies
          </h3>
          <p className="mb-3">
            We use advertising cookies through <strong>Google AdSense</strong>{" "}
            and its partners to serve you ads that are more relevant to you
            and your interests. These cookies may track your browsing behavior
            across websites and build a profile of your interests to show you
            personalized advertisements.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Functional Cookies
          </h3>
          <p>
            These cookies allow the website to remember choices you make (such
            as your preferred language or region) and provide enhanced, more
            personal features.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            3. Third-Party Cookies
          </h2>
          <p className="mb-3">
            In addition to our own cookies, we may also use various
            third-party cookies to report usage statistics of the service and
            deliver advertisements. These may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google AdSense:</strong> Serves personalized
              advertisements based on your browsing behavior.{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Learn more
              </a>
            </li>
            <li>
              <strong>Google Analytics:</strong> Tracks and reports website
              traffic anonymously.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Learn more
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            4. How to Control Cookies
          </h2>
          <p className="mb-3">
            You have the right to decide whether to accept or reject cookies.
            You can manage your cookie preferences through several methods:
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Browser Settings
          </h3>
          <p className="mb-3">
            Most web browsers allow you to control cookies through their
            settings preferences. You can typically find these options in the
            &quot;Options&quot; or &quot;Preferences&quot; menu of your
            browser. Here are links for the most common browsers:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Opt-Out of Personalized Ads
          </h3>
          <p>
            You can opt out of personalized advertising by visiting:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google Ads Settings
              </a>
            </li>
            <li>
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Digital Advertising Alliance (US)
              </a>
            </li>
            <li>
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Your Online Choices (EU)
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            5. Impact of Disabling Cookies
          </h2>
          <p>
            Please note that if you choose to disable cookies, some features
            of our website may not function properly. Essential cookies are
            required for the site to work, and disabling them may prevent you
            from using certain tools or features.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            6. Changes to This Cookie Policy
          </h2>
          <p>
            We may update our Cookie Policy from time to time to reflect
            changes in the cookies we use or for operational, legal or
            regulatory reasons. We encourage you to periodically review this
            page to stay informed about our use of cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            7. More Information
          </h2>
          <p>
            For more details on how we handle your personal data, please read
            our{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            8. Contact Us
          </h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us at:
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