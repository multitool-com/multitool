import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Disclaimer | MultiTool",
  description:
    "Important disclaimer about the use of MultiTool's online tools, calculators and converters.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/disclaimer`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "January 2025";

export default function DisclaimerPage() {
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
        <span className="text-accent">DISCLAIMER</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        LEGAL
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">Disclaimer</h1>
      <p className="text-ink/60 mb-10">
        Last updated: <strong>{LAST_UPDATED}</strong>
      </p>

      <div className="text-ink/80 leading-relaxed space-y-6">
        <section>
          <p>
            The information and tools provided by{" "}
            <strong>{SITE_CONFIG.name}</strong> on{" "}
            <Link href="/" className="text-accent hover:underline">
              {SITE_CONFIG.domain}
            </Link>{" "}
            are for general informational and educational purposes only. All
            information and calculations are provided in good faith; however,
            we make no representation or warranty of any kind, express or
            implied, regarding the accuracy, adequacy, validity, reliability,
            availability or completeness of any information or results.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            1. General Information Only
          </h2>
          <p>
            The tools, calculators, converters and content provided on this
            website are intended for general informational purposes only. They
            should <strong>not</strong> be considered professional advice or a
            substitute for consultation with a qualified professional in the
            relevant field.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            2. No Professional Advice
          </h2>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Financial Tools
          </h3>
          <p className="mb-3">
            Our financial calculators (including but not limited to loan, EMI,
            discount, tip and salary calculators) provide estimates based on
            the information you enter. Results are for informational purposes
            only and do <strong>not</strong> constitute financial, investment,
            tax or legal advice. Always consult with a qualified financial
            advisor, accountant or licensed professional before making any
            financial decisions.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Health & Fitness Tools
          </h3>
          <p className="mb-3">
            Our health-related calculators (including but not limited to BMI,
            calorie/BMR, ideal weight, pregnancy due date and age
            calculators) provide general estimates based on standardized
            formulas. These tools are <strong>not</strong> intended to
            diagnose, treat, cure or prevent any medical condition. Always
            consult with a qualified healthcare provider, physician or
            registered dietitian for personalized medical advice, diagnosis
            or treatment.
          </p>

          <h3 className="font-display text-lg font-semibold mt-4 mb-2">
            Educational Tools
          </h3>
          <p>
            Our math and educational tools are designed to assist with
            learning and calculations. They should be used as a supplement to,
            not a replacement for, proper education, instruction or academic
            guidance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            3. Accuracy of Results
          </h2>
          <p>
            While we strive to keep our tools and information up-to-date and
            accurate, we make no warranties or representations about the
            completeness, accuracy, reliability, suitability or availability
            of any calculations or content. Any reliance you place on the
            results is <strong>strictly at your own risk</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            4. External Links
          </h2>
          <p>
            Our website may contain links to external websites that are not
            provided or maintained by us. We do not guarantee the accuracy,
            relevance, timeliness or completeness of any information on these
            external sites. The inclusion of any links does not necessarily
            imply a recommendation or endorse the views expressed within them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            5. Advertisements
          </h2>
          <p>
            Our website displays advertisements provided by third-party
            networks, including Google AdSense. These advertisements may
            include links to external products, services or websites. We do{" "}
            <strong>not</strong> endorse, recommend or guarantee any products,
            services or claims made in these advertisements. Any transactions
            or interactions with advertisers are solely between you and the
            advertiser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            6. No Liability
          </h2>
          <p>
            Under no circumstances shall {SITE_CONFIG.name}, its owners,
            operators, contributors or affiliates be liable for any direct,
            indirect, incidental, consequential, special or exemplary damages
            arising out of or in connection with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Your use of, or inability to use, the tools or website</li>
            <li>Any errors, inaccuracies or omissions in the calculations</li>
            <li>Any decisions made based on results from our tools</li>
            <li>Any interruptions or cessation of the Service</li>
            <li>Any unauthorized access to or use of our servers</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            7. User Responsibility
          </h2>
          <p>
            By using our tools and website, you acknowledge and agree that
            you are responsible for verifying any results or information
            before acting upon them. You should always seek professional
            advice tailored to your specific situation before making
            important decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            8. Changes to This Disclaimer
          </h2>
          <p>
            We reserve the right to update or modify this Disclaimer at any
            time without prior notice. Your continued use of the website
            following any changes constitutes acceptance of those changes.
            Please review this page periodically to stay informed of any
            updates.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            9. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Disclaimer,
            please contact us at:
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

        <section className="mt-10 p-5 bg-white border border-ink/10 rounded-xl">
          <p className="font-mono text-xs tracking-widest text-accent mb-2">
            IMPORTANT
          </p>
          <p className="text-ink/70">
            By using {SITE_CONFIG.name}, you acknowledge that you have read,
            understood and agree to be bound by this Disclaimer, as well as
            our{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}