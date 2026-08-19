import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TextCaseConverterClient from "./TextCaseConverterClient";

export const metadata: Metadata = {
  title: "Text Case Converter - Upper, Lower, Title, camelCase & More | MultiTool",
  description: "Convert text between 10 cases: UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more.",
  keywords: ["text case converter", "uppercase converter", "title case converter", "camel case converter", "snake case", "kebab case", "conversor de caixa"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/text-tools/text-case-converter",
  },
  openGraph: {
    title: "Text Case Converter - Upper, Lower, Title, camelCase & More | MultiTool",
    description: "Convert text between 10 cases: UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more.",
    url: "https://multitoolbox.online/tools/text-tools/text-case-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter - Upper, Lower, Title, camelCase & More | MultiTool",
    description: "Convert text between 10 cases: UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Text Case Converter - Upper, Lower, Title, camelCase & More | MultiTool"
      description="Convert text between 10 cases: UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="text-case-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Paste or type any text and switch between 10 case styles with one click — from simple UPPERCASE to developer formats like camelCase, PascalCase, snake_case and kebab-case.
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
        { question: "What is camelCase?", answer: "Words are joined without spaces, first word lowercase, others capitalized: thisIsAnExample. Common in JavaScript and Java." },
        { question: "What is PascalCase?", answer: "Like camelCase but the first word is also capitalized: ThisIsAnExample. Common in C# and TypeScript class names." },
        { question: "What is snake_case?", answer: "Words joined by underscores, all lowercase: this_is_an_example. Standard in Python and databases." },
        { question: "What is kebab-case?", answer: "Words joined by hyphens, all lowercase: this-is-an-example. Used in URLs and CSS class names." },
        { question: "Does it keep punctuation?", answer: "Developer cases strip punctuation and spaces automatically; display cases keep them." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Word & Character Counter", href: "/tools/text-tools/word-counter" },
        { name: "Slug Generator", href: "/tools/text-tools/slug-generator" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
        { name: "Number to Words Converter", href: "/tools/text-tools/number-to-words" },
      ]}
    >
      <TextCaseConverterClient />
    </ToolLayout>
  );
}
