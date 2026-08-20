import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TokenCounterClient from "./TokenCounterClient";

export const metadata: Metadata = {
  title: "AI Token Counter - GPT-4, Claude & Gemini | MultiTool",
  description:
    "Free AI token counter for GPT-4, GPT-4o, Claude and Gemini. Count tokens, estimate API cost and see how much of the context window your prompt uses. 100% private, runs in your browser.",
  keywords: [
    "token counter",
    "gpt token counter",
    "claude token counter",
    "openai tokenizer",
    "ai tokens",
    "chatgpt token counter",
    "gemini token counter",
    "token calculator",
    "llm token counter",
    "gpt-4 tokens",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/ai-tools/token-counter",
  },
  openGraph: {
    title: "AI Token Counter - GPT-4, Claude & Gemini | MultiTool",
    description:
      "Count tokens for GPT-4, Claude and Gemini. Estimate API cost and context-window usage instantly. Free and private.",
    url: "https://www.multitoolbox.online/tools/ai-tools/token-counter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Token Counter - Free GPT, Claude & Gemini",
    description:
      "Count tokens and estimate API cost for GPT-4, Claude and Gemini. Instant and private.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="AI Token Counter"
      description="Count tokens for GPT-4, GPT-4o, Claude and Gemini. See character and word counts, estimated API cost and how much of the model's context window your text uses."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="token-counter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is an AI token?
          </h2>
          <p className="mb-4">
            Large language models like <strong>ChatGPT (GPT-4 / GPT-4o)</strong>,{" "}
            <strong>Claude</strong> and <strong>Gemini</strong> do not read text
            as whole words. They split your input into small pieces called{" "}
            <strong>tokens</strong>. A token can be a short word, part of a
            longer word, a number, a punctuation mark or even a space. Models
            charge you and enforce context limits in tokens — not in words or
            characters.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How tokens are estimated
          </h2>
          <p className="mb-4">
            Exact tokenizers (OpenAI&apos;s <em>tiktoken</em>, Anthropic&apos;s
            tokenizer, Google&apos;s SentencePiece) are model-specific. For a
            fast, private, in-browser estimate this tool uses a proven
            character-based heuristic, then applies a small multiplier per
            model family:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>English prose:</strong> about 1 token per 4 characters
              (≈ 100 tokens per 75 words).
            </li>
            <li>
              <strong>Code:</strong> usually more tokens than prose — symbols
              and short identifiers split more often.
            </li>
            <li>
              <strong>CJK text</strong> (Chinese, Japanese, Korean): often
              closer to 1 token per 1–2 characters.
            </li>
          </ul>
          <p className="mb-4">
            Counts are typically within about <strong>10%</strong> of the
            official tokenizer — accurate enough to plan prompts and budget API
            spend before you hit send.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              <strong>Paste your prompt</strong> (or any text you plan to send
              to an AI) into the box.
            </li>
            <li>
              <strong>Pick a model</strong> — GPT-4o, GPT-4, Claude Sonnet,
              Claude Opus or Gemini.
            </li>
            <li>
              Read the <strong>token count</strong>,{" "}
              <strong>context-window usage</strong> and{" "}
              <strong>estimated input cost</strong> instantly.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Why token count matters
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Cost:</strong> APIs bill per 1 million tokens. A long
              system prompt you send on every request adds up fast.
            </li>
            <li>
              <strong>Context limits:</strong> if input + output exceed the
              model&apos;s window, the request fails or older messages are
              dropped.
            </li>
            <li>
              <strong>Quality:</strong> stuffing the window with unused context
              can dilute the answer. Shorter, cleaner prompts usually win.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Typical context windows
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>GPT-4o / GPT-4o mini:</strong> 128,000 tokens
            </li>
            <li>
              <strong>GPT-4 Turbo:</strong> 128,000 tokens
            </li>
            <li>
              <strong>Claude Sonnet / Opus:</strong> 200,000 tokens
            </li>
            <li>
              <strong>Gemini 1.5 / 2.0 Flash:</strong> 1,000,000 tokens
            </li>
          </ul>
          <p className="mb-4">
            These windows change as providers ship new models. Always leave
            room for the <em>reply</em> — a 10,000-token answer needs 10,000
            free tokens on top of your prompt.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All counting happens instantly in your browser. Your text is{" "}
            <strong>never sent to any server</strong> and never stored. Safe
            for confidential prompts, source code and business documents.
          </p>
        </>
      }
      faqs={[
        {
          question: "How accurate is this token counter?",
          answer:
            "It uses a character-based estimate with a small per-model multiplier. For English text the result is typically within about 10% of the official tokenizer (tiktoken for GPT, Anthropic's tokenizer for Claude). That is accurate enough to plan prompts and estimate cost. For billing-critical work, confirm with the provider's official tokenizer.",
        },
        {
          question: "What is the difference between tokens, words and characters?",
          answer:
            "Characters are individual letters and symbols. Words are groups of characters separated by spaces. Tokens are the chunks the model actually reads — often a short word, part of a longer word, or a punctuation mark. As a rule of thumb, 75 English words ≈ 100 tokens ≈ 400 characters.",
        },
        {
          question: "Does the token count include the AI's reply?",
          answer:
            "No. This tool counts the text you paste — your prompt / input. The model's reply (output tokens) is billed separately and is unknown until the model finishes. Leave spare room in the context window for the answer you expect.",
        },
        {
          question: "Why do GPT, Claude and Gemini show different token counts?",
          answer:
            "Each lab uses its own tokenizer. The same sentence can become a slightly different number of tokens on GPT-4o, Claude or Gemini. This tool applies a small family-specific factor so you can compare models before you pick one.",
        },
        {
          question: "How is the estimated cost calculated?",
          answer:
            "Estimated cost = (tokens / 1,000,000) × the model's published input price per million tokens. Prices are indicative list prices for API input and can change. Output tokens (the reply) are not included. Use the AI Cost Calculator for monthly projections.",
        },
        {
          question: "Is my text private?",
          answer:
            "Yes. Everything runs locally in your browser with JavaScript. Nothing is uploaded, logged or stored. Safe for confidential prompts and source code.",
        },
      ]}
      relatedTools={[
        { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator" },
        { name: "AI Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "AI Coding Tools", href: "/tools/ai-tools/ai-coding-tools" },
        { name: "Free AI Directory", href: "/tools/ai-tools/free-ai-directory" },
      ]}
    >
      <TokenCounterClient />
    </ToolLayout>
  );
}