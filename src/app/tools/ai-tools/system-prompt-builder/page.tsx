import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SystemPromptBuilderClient from "./SystemPromptBuilderClient";

export const metadata: Metadata = {
  title: "System Prompt Builder - Create Perfect AI System Prompts | MultiTool",
  description:
    "Free system prompt builder. Assemble professional ChatGPT, Claude and Gemini system prompts from roles, tones, constraints and output formats. Copy with one click. 100% in your browser.",
  keywords: [
    "system prompt builder",
    "system prompt generator",
    "system prompt template",
    "prompt builder",
    "chatgpt system prompt",
    "claude system prompt",
    "ai prompt engineer",
    "prompt template generator",
    "custom instructions",
    "build system prompt",
    "llm system prompt",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/ai-tools/system-prompt-builder",
  },
  openGraph: {
    title: "System Prompt Builder - AI Prompt Templates | MultiTool",
    description:
      "Assemble professional system prompts for ChatGPT, Claude and Gemini. Free and private.",
    url: "https://multitoolbox.online/tools/ai-tools/system-prompt-builder",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "System Prompt Builder - Free & Instant",
    description: "Build better AI system prompts in your browser. No sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="System Prompt Builder"
      description="Assemble a professional system prompt from roles, tones, constraints and output formats. Copy the finished prompt and use it in ChatGPT, Claude, Gemini or any LLM."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="system-prompt-builder"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a system prompt?
          </h2>
          <p className="mb-4">
            A <strong>system prompt</strong> sets the rules the AI follows
            for the whole conversation: who it is, how it talks, what it may
            or may not do. A good one makes answers more consistent,
            accurate and on-format — a vague one leaves the model guessing.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Pick a role and a tone for the assistant.</li>
            <li>Describe the task and add context if needed.</li>
            <li>Toggle the constraints that apply (no invented facts,
              JSON output, ask before acting…).</li>
            <li>Choose the output format, then copy the finished prompt.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Tips for better prompts
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Be specific</strong> — “summarize into 5 bullet
              points” beats “summarize”.
            </li>
            <li>
              <strong>Give the format</strong> — JSON, table or headline
              style removes guesswork.
            </li>
            <li>
              <strong>Add constraints</strong> — “if unsure, ask” prevents
              confident wrong answers.
            </li>
            <li>
              <strong>Keep it short</strong> — every extra line costs tokens
              and attention.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The builder runs entirely in your browser. Your prompt and text
            are <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a system prompt?",
          answer:
            "It is the opening instruction that defines how an AI behaves for the whole conversation: its role, tone, rules and output format. It is supported by ChatGPT (Custom instructions), Claude, Gemini and most LLM APIs.",
        },
        {
          question: "Does this tool use AI?",
          answer:
            "No. It assembles the prompt from your choices — no API, no cost, no waiting. The finished text is designed to work well when you paste it into ChatGPT, Claude, Gemini or any other model.",
        },
        {
          question: "Where do I paste the system prompt?",
          answer:
            "In ChatGPT use Custom Instructions (or the Project instructions), in Claude use System Prompt in settings or the API, in Gemini use the system instruction field. For APIs, it goes in the system message.",
        },
        {
          question: "What makes a system prompt good?",
          answer:
            "Clarity and specificity: a clear role, a concrete task, the desired output format, and rules about what not to do (e.g. never invent facts, ask when unsure). Short, direct instructions work better than long vague ones.",
        },
        {
          question: "Can I reuse the same prompt for different models?",
          answer:
            "Yes, with small adjustments. Most models follow the same instruction style. Very large context models handle longer prompts, while smaller ones respond better to the shortest possible version.",
        },
        {
          question: "Is my prompt private?",
          answer:
            "Yes. Everything is built locally in your browser — nothing is uploaded, logged or stored.",
        },
      ]}
      relatedTools={[
        { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator" },
        { name: "Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI API Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "LLM Model Comparison", href: "/tools/ai-tools/llm-model-comparison" },
      ]}
    >
      <SystemPromptBuilderClient />
    </ToolLayout>
  );
}
