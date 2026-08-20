import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import LlmModelComparisonClient from "./LlmModelComparisonClient";

export const metadata: Metadata = {
  title: "LLM Model Comparison - GPT vs Claude vs Gemini | MultiTool",
  description:
    "Compare the top LLMs side by side: GPT-4o, Claude, Gemini, Llama, DeepSeek and more. Context windows, max output and reference API prices per 1M tokens. Free, no sign-up.",
  keywords: [
    "llm comparison",
    "llm model comparison",
    "gpt vs claude",
    "claude vs gemini",
    "ai model comparison",
    "compare llm models",
    "llm pricing",
    "context window comparison",
    "gpt 4o vs claude sonnet",
    "best llm",
    "ai model prices",
    "token pricing",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/ai-tools/llm-model-comparison",
  },
  openGraph: {
    title: "LLM Model Comparison - GPT vs Claude vs Gemini | MultiTool",
    description:
      "Side-by-side comparison of the top LLMs: context, output limits and reference API prices.",
    url: "https://www.multitoolbox.online/tools/ai-tools/llm-model-comparison",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Model Comparison - Free & Instant",
    description: "Compare GPT, Claude, Gemini and more side by side.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="LLM Model Comparison"
      description="Compare the most popular language models side by side: context window, max output tokens and reference API pricing per 1M tokens. Filter by provider and pin models to compare."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="llm-model-comparison"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What to look for in an LLM
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Context window</strong> — how much text the model can
              see at once (a book is ~100K tokens). Bigger context helps
              with long documents and codebases.
            </li>
            <li>
              <strong>Max output</strong> — how long a single answer can be.
              Important for code generation and long-form writing.
            </li>
            <li>
              <strong>Price per 1M tokens</strong> — input is what you send,
              output is what the model writes. Output usually costs more.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Filter by provider or type to search for a model.</li>
            <li>Sort by input price, output price or context window.</li>
            <li>Click a row to pin it to the comparison strip on top.</li>
            <li>Up to 4 models side by side — read and compare.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Are these prices official?
          </h2>
          <p className="mb-4">
            No. Prices are <strong>reference values in USD per 1M tokens</strong>{" "}
            collected from public provider pages and change often — some
            providers also offer batch discounts and cached-input pricing.
            Always confirm on the official pricing page before budgeting. The
            cheapest visible input and output prices are highlighted in the
            table.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            This comparison is a static table — it runs entirely in your
            browser with <strong>no tracking and no data sent anywhere</strong>
            . No model names or prices are transmitted.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which model is the best?",
          answer:
            "There is no single winner — it depends on the task. For everyday assistant work, mid-size models like GPT-4o, Claude Sonnet and Gemini 2.5 Flash are a great balance of quality, speed and price. For complex reasoning, frontier models like o3, Claude Opus and Gemini 2.5 Pro lead the benchmarks.",
        },
        {
          question: "What does context window mean?",
          answer:
            "It is the maximum amount of text the model can consider in one request, measured in tokens (roughly 4 characters each). 128K ≈ a 300-page book; 1M ≈ multiple books. Bigger is not always better — cost and latency grow with the context you send.",
        },
        {
          question: "What is the difference between input and output price?",
          answer:
            "Input tokens are everything you send (system prompt, messages, documents). Output tokens are the model's answer. Output is usually priced higher because generating tokens is more expensive for providers.",
        },
        {
          question: "Are the prices in this tool official?",
          answer:
            "No. They are reference values in USD per 1M tokens collected from public pricing pages. Models, prices and limits change frequently, so always check the provider's official page before estimating costs.",
        },
        {
          question: "Can I compare models from different providers?",
          answer:
            "Yes — that is the point. Pin up to 4 models (any mix of OpenAI, Anthropic, Google, Meta, DeepSeek, Mistral and xAI) and they appear side by side in the strip above the table.",
        },
        {
          question: "Is this tool private?",
          answer:
            "Yes. It is a static table in your browser — no tracking, no requests, no data sent anywhere.",
        },
      ]}
      relatedTools={[
        { name: "Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI API Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "AI Coding Tools", href: "/tools/ai-tools/ai-coding-tools" },
        { name: "Free AI Directory", href: "/tools/ai-tools/free-ai-directory" },
      ]}
    >
      <LlmModelComparisonClient />
    </ToolLayout>
  );
}
