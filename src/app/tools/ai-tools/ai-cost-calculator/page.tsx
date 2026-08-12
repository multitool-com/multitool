import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AiCostCalculatorClient from "./AiCostCalculatorClient";

export const metadata: Metadata = {
  title: "AI API Cost Calculator - GPT, Claude & Gemini Pricing | MultiTool",
  description:
    "Free AI API cost calculator for GPT-4o, Claude and Gemini. Estimate monthly spend from tokens per request, request volume and input/output prices. USD, EUR, GBP and BRL.",
  keywords: [
    "ai cost calculator",
    "openai pricing",
    "claude pricing",
    "gpt cost",
    "ai api cost",
    "chatgpt api cost",
    "gemini pricing",
    "token cost calculator",
    "llm api pricing",
    "gpt-4o cost",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/ai-tools/ai-cost-calculator",
  },
  openGraph: {
    title: "AI API Cost Calculator - GPT, Claude & Gemini | MultiTool",
    description:
      "Estimate monthly AI API spend for GPT-4o, Claude and Gemini from tokens and request volume. Free and private.",
    url: "https://multitoolbox.online/tools/ai-tools/ai-cost-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI API Cost Calculator - Free & Instant",
    description:
      "Estimate monthly GPT, Claude and Gemini API costs from tokens and volume.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="AI API Cost Calculator"
      description="Estimate how much GPT-4o, Claude and Gemini will cost per day, month and year. Set input/output tokens per request and how many requests you send — all in your browser."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="ai-cost-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How AI API pricing works
          </h2>
          <p className="mb-4">
            OpenAI, Anthropic and Google charge by the{" "}
            <strong>token</strong>, not by the request. Every prompt you send
            (input) and every word the model writes back (output) is billed
            separately. Output is almost always more expensive than input —
            often 3–5× — because generating text costs more compute than
            reading it.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            The formula
          </h2>
          <p className="mb-3">
            Monthly cost is a straight multiplication:
          </p>
          <div className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 font-mono text-sm">
            input cost = (input tokens × requests / 1,000,000) × input
            price
            <br />
            output cost = (output tokens × requests / 1,000,000) × output
            price
            <br />
            total = input cost + output cost
          </div>
          <p className="mb-4">
            Example: 1,500 input tokens + 400 output tokens, 10,000
            requests/month on GPT-4o ($2.50 / $10.00 per 1M tokens) ≈{" "}
            <strong>$37.50 input + $40.00 output = $77.50 / month</strong>.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this calculator
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              <strong>Pick a model</strong> (or compare a few — prices are
              built in and you can override them).
            </li>
            <li>
              Enter <strong>input tokens</strong> and{" "}
              <strong>output tokens</strong> per request. Use the{" "}
              <em>AI Token Counter</em> if you are not sure.
            </li>
            <li>
              Set <strong>requests per day</strong>. The tool projects
              month (30 days) and year automatically.
            </li>
            <li>
              Switch currency: <strong>USD, EUR, GBP or BRL</strong>.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Ways to cut the bill
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Route by difficulty:</strong> greetings and formatting
              on a mini / Flash / Haiku model; hard reasoning on Sonnet,
              GPT-4o or Opus.
            </li>
            <li>
              <strong>Prompt caching:</strong> a stable system prompt can
              cost ~50–90% less on cache hits (OpenAI and Anthropic).
            </li>
            <li>
              <strong>Batch API:</strong> non-urgent jobs are often 50%
              cheaper.
            </li>
            <li>
              <strong>Shorter prompts:</strong> every unused sentence in the
              system prompt is paid on every single request.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Prices in this tool
          </h2>
          <p className="mb-4">
            Built-in rates are public list prices for{" "}
            <strong>standard (uncached) API input and output</strong>.
            Providers change them. Override the $/1M fields if your contract,
            region or cache discount is different. ChatGPT Plus / Claude Pro
            subscriptions are flat monthly fees and are <em>not</em> what
            this calculator models — this is for the developer APIs.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All calculations run instantly in your browser. Your usage
            numbers are <strong>never sent to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How is monthly AI API cost calculated?",
          answer:
            "Monthly cost = input tokens × requests × input price per million, plus output tokens × requests × output price per million. This tool assumes 30 days in a month. Output tokens (the model's reply) are usually several times more expensive than input tokens.",
        },
        {
          question: "What is the difference between input and output tokens?",
          answer:
            "Input tokens are everything you send: system prompt, user message and any attached context. Output tokens are the model's reply. You pay for both. A long system prompt is billed on every request, even if the user message is short.",
        },
        {
          question: "Do these prices include ChatGPT Plus or Claude Pro?",
          answer:
            "No. Those are flat consumer subscriptions. This calculator is for the developer APIs (OpenAI, Anthropic, Google), which bill per million tokens. If you only use the chat apps, you pay the subscription — not these per-token rates.",
        },
        {
          question: "Why can I edit the price per million tokens?",
          answer:
            "List prices change, and you may have batch, cached or committed-use discounts. The defaults are public standard rates. Type your real $/1M (or equivalent in another currency after converting) to match your invoice.",
        },
        {
          question: "Which model is cheapest?",
          answer:
            "For most high-volume work, GPT-4o mini, Gemini Flash and Claude Haiku are an order of magnitude cheaper than flagship models. Use a small model by default and reserve GPT-4o, Sonnet or Opus for tasks that actually need them.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes. Everything runs locally in your browser. Nothing is uploaded, logged or stored.",
        },
      ]}
      relatedTools={[
        { name: "AI Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator" },
        { name: "AI Coding Tools", href: "/tools/ai-tools/ai-coding-tools" },
        { name: "Free AI Directory", href: "/tools/ai-tools/free-ai-directory" },
      ]}
    >
      <AiCostCalculatorClient />
    </ToolLayout>
  );
}