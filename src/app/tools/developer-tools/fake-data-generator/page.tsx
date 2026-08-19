import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FakeDataGeneratorClient from "./FakeDataGeneratorClient";

export const metadata: Metadata = {
  title: "Fake Data Generator - Test Data for Developers | MultiTool",
  description: "Generate realistic fake data: names, emails, phones, addresses, companies, dates, UUIDs and SSNs. Export as CSV or copy.",
  keywords: ["fake data generator", "test data generator", "mock data", "dummy data", "fake name generator"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/developer-tools/fake-data-generator",
  },
  openGraph: {
    title: "Fake Data Generator - Test Data for Developers | MultiTool",
    description: "Generate realistic fake data: names, emails, phones, addresses, companies, dates, UUIDs and SSNs. Export as CSV or copy.",
    url: "https://multitoolbox.online/tools/developer-tools/fake-data-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fake Data Generator - Test Data for Developers | MultiTool",
    description: "Generate realistic fake data: names, emails, phones, addresses, companies, dates, UUIDs and SSNs. Export as CSV or copy.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Fake Data Generator - Test Data for Developers | MultiTool"
      description="Generate realistic fake data: names, emails, phones, addresses, companies, dates, UUIDs and SSNs. Export as CSV or copy."
      categoryName="developer-tools_NAME"
      categorySlug="developer-tools"
      toolSlug="fake-data-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Select the fields you need (name, email, phone, address, city, country, company, job, date, UUID, SSN), choose 1-50 rows and generate realistic test data — exportable as CSV.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs entirely in your browser. Nothing you type is
            ever sent to any server or stored.
          </p>
        </>
      }
      faqs={[
        { question: "What is fake data for?", answer: "Testing forms, filling databases, building mockups and demos without using real personal data." },
        { question: "Is the data realistic?", answer: "It combines real-sounding first and last names from many countries, valid email patterns and realistic phone/address formats." },
        { question: "Can I export to CSV?", answer: "Yes — copy the CSV to the clipboard or download it as a file for spreadsheets and databases." },
        { question: "Is the data real people's data?", answer: "No — every value is randomly generated and fictional." },
        { question: "Which fields are available?", answer: "11 fields: full name, email, phone, address, city, country, company, job title, date, UUID and SSN." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "UUID Generator", href: "/tools/developer-tools/uuid-generator" },
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "CSV to JSON Converter", href: "/tools/developer-tools/csv-json-converter" },
        { name: "Hash Generator", href: "/tools/developer-tools/hash-generator" },
      ]}
    >
      <FakeDataGeneratorClient />
    </ToolLayout>
  );
}
