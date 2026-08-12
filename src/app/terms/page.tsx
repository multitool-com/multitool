import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Terms of Service | MultiTool",
  description:
    "Read the Terms of Service for using MultiTool — our free online utility tools and calculators.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "January 2025";

export default function TermsPage() {
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
        <span className="text-accent">TERMS OF SERVICE</span>
      </nav>

      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        LEGAL
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        Terms of Service
      </h1>
      <p className="text-ink/60 mb-10">
        Last updated: <strong>{LAST_UPDATED}</strong>
      </p>

      <div className="text-ink/80 leading-relaxed space-y-6">
        <section>
          <p>
            Welcome to <strong>{SITE_CONFIG.name}</strong>. These Terms of
            Service (&quot;Terms&quot;) govern your access to and use of{" "}
            <Link href="/" className="text-accent hover:underline">
              {SITE_CONFIG.domain}
            </Link>{" "}
            (the &quot;Service&quot;) operated by {SITE_CONFIG.name}. Please
            read these Terms carefully before using our Service.
          </p>
          <p className="mt-3">
            By accessing or using the Service, you agree to be bound by these
            Terms. If you disagree with any part of the Terms, you may not
            access the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            1. Use of Service
          </h2>
          <p className="mb-3">
            {SITE_CONFIG.name} provides free online tools including
            calculators, converters, generators and other utilities. You may
            use our Service for personal or commercial purposes, subject to
            these Terms.
          </p>
          <p>You agree <strong>not</strong> to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Violate any applicable laws or regulations</li>
            <li>
              Attempt to gain unauthorized access to any part of the Service,
              other accounts, or computer systems
            </li>
            <li>
              Interfere with, disrupt or overload the Service or servers
            </li>
            <li>
              Use automated systems (bots, scrapers) to access the Service in
              a manner that sends more requests than a human could reasonably
              produce
            </li>
            <li>
              Reverse engineer, decompile or disassemble any portion of the
              Service
            </li>
            <li>Transmit any viruses, worms or other malicious code</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            2. Intellectual Property
          </h2>
          <p>
            The Service and its original content, features and functionality
            are and will remain the exclusive property of {SITE_CONFIG.name}{" "}
            and its licensors. The Service is protected by copyright,
            trademark and other laws of both the United States and foreign
            countries. Our trademarks and trade dress may not be used in
            connection with any product or service without our prior written
            consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            3. User Content
          </h2>
          <p>
            Our tools may allow you to input data (such as numbers, text,
            dates) for calculations and conversions. All processing happens
            locally in your browser — we do not store, transmit or claim any
            ownership over the data you enter. You retain all rights to any
            information you input.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            4. Accuracy of Information
          </h2>
          <p>
            While we strive to provide accurate and up-to-date tools, we make
            no warranties or representations about the accuracy, reliability,
            completeness or timeliness of any content, calculations or
            results provided by our Service. See our{" "}
            <Link href="/disclaimer" className="text-accent hover:underline">
              Disclaimer
            </Link>{" "}
            for more information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            5. Third-Party Links and Services
          </h2>
          <p>
            Our Service may contain links to third-party websites or services
            that are not owned or controlled by {SITE_CONFIG.name}. We have no
            control over, and assume no responsibility for, the content,
            privacy policies or practices of any third-party websites or
            services. You acknowledge and agree that we shall not be
            responsible or liable for any damage or loss caused by or in
            connection with the use of any such content, goods or services
            available on or through any such websites.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            6. Advertising
          </h2>
          <p>
            Our Service is supported by advertising, including but not limited
            to Google AdSense. By using our Service, you acknowledge and agree
            that advertisements may be displayed. We do not endorse, warrant
            or guarantee any product or service advertised on the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            7. Termination
          </h2>
          <p>
            We may terminate or suspend your access to the Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach these Terms. All
            provisions of the Terms which by their nature should survive
            termination shall survive termination, including ownership
            provisions, warranty disclaimers, indemnity and limitations of
            liability.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            In no event shall {SITE_CONFIG.name}, nor its directors,
            employees, partners, agents, suppliers or affiliates, be liable
            for any indirect, incidental, special, consequential or punitive
            damages, including without limitation loss of profits, data,
            use, goodwill or other intangible losses, resulting from (i) your
            access to or use of or inability to access or use the Service;
            (ii) any conduct or content of any third party on the Service;
            (iii) any content obtained from the Service; and (iv) unauthorized
            access, use or alteration of your transmissions or content.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            9. Disclaimer
          </h2>
          <p>
            Your use of the Service is at your sole risk. The Service is
            provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
            basis. The Service is provided without warranties of any kind,
            whether express or implied, including but not limited to implied
            warranties of merchantability, fitness for a particular purpose,
            non-infringement or course of performance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            10. Governing Law
          </h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of Brazil, without regard to its conflict of law provisions.
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            11. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will
            provide notice by updating the &quot;Last updated&quot; date at
            the top of this page. By continuing to access or use our Service
            after any revisions become effective, you agree to be bound by the
            revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold mt-8 mb-3">
            12. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at:
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