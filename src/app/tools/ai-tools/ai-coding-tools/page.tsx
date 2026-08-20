import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AiCodingToolsClient from "./AiCodingToolsClient";

export const metadata: Metadata = {
  title: "AI Coding Tools Comparison - Copilot, Cursor, Windsurf | MultiTool",
  description:
    "Compare the best AI coding assistants: GitHub Copilot, Cursor, Windsurf, Claude Code, Cline, Continue.dev and more. Filter by price, free plan, IDE and agent mode.",
  keywords: [
    "ai coding tools",
    "github copilot alternative",
    "cursor vs copilot",
    "best ai for coding",
    "ai code assistant",
    "windsurf vs cursor",
    "claude code",
    "free ai coding assistant",
    "copilot vs cursor 2026",
    "best ai ide",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/ai-tools/ai-coding-tools",
  },
  openGraph: {
    title: "AI Coding Tools Comparison - Copilot, Cursor, Windsurf | MultiTool",
    description:
      "Side-by-side comparison of Copilot, Cursor, Windsurf, Claude Code and free open-source coding agents.",
    url: "https://www.multitoolbox.online/tools/ai-tools/ai-coding-tools",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Coding Tools Comparison - Free & Instant",
    description:
      "Compare Copilot, Cursor, Windsurf and free AI coding assistants by price and features.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="AI Coding Tools Comparison"
      description="Compare GitHub Copilot, Cursor, Windsurf, Claude Code, Cline and Continue.dev. Filter by free plan, price, IDE and whether the tool can run multi-step agents."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="ai-coding-tools"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is an AI coding assistant?
          </h2>
          <p className="mb-4">
            An <strong>AI coding assistant</strong> sits in your editor or
            terminal and helps you write, explain, refactor and debug code.
            Some only autocomplete the next line. Others can open files, run
            tests and finish a whole task (that is{" "}
            <strong>agent mode</strong>).
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this comparison
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Use the <strong>filters</strong> (free plan, under $15, agent
              mode, open source, IDE type).
            </li>
            <li>
              Click a <strong>card</strong> to see pricing, models and the
              best-fit user.
            </li>
            <li>
              Open the vendor site from the card when you are ready to try
              it. This page does not sign you up for anything.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Three ways these tools charge
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Subscription:</strong> Copilot, Cursor, Windsurf —
              a monthly fee includes a quota of model calls.
            </li>
            <li>
              <strong>Bundled chat plan:</strong> Claude Code rides on
              Claude Pro / Max; Codex rides on ChatGPT Plus / Pro.
            </li>
            <li>
              <strong>BYOK (bring your own key):</strong> Cline, Aider and
              Continue.dev are free apps. You pay the model API directly
              (or run a local model).
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to choose
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Stay in VS Code / JetBrains:</strong> GitHub Copilot
              or Continue.dev.
            </li>
            <li>
              <strong>Want an AI-native IDE:</strong> Cursor or Windsurf
              (both are VS Code forks).
            </li>
            <li>
              <strong>Live in the terminal:</strong> Claude Code, Aider or
              Gemini CLI.
            </li>
            <li>
              <strong>Privacy / local models:</strong> Continue.dev, Cline
              or Tabnine.
            </li>
            <li>
              <strong>Lowest cash outlay:</strong> Gemini CLI, Continue.dev
              + a cheap API, or Copilot&apos;s limited free tier.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Prices on this page
          </h2>
          <p className="mb-4">
            Figures are public list prices for individual plans and can
            change. Free tiers are usually usage-capped. Always confirm on
            the vendor site before you pay. This is an independent
            comparison — we are not affiliated with these products.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Filtering happens instantly in your browser. Nothing you click
            is <strong>sent to any server</strong> or stored. Opening a
            vendor link leaves this site, as a normal link would.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the best free AI coding assistant?",
          answer:
            "It depends on the surface. Gemini CLI and Continue.dev (with your own key or a local model) cost $0 for the app. GitHub Copilot, Cursor and Windsurf offer limited free tiers. Cline and Aider are open source — you only pay the model API, or nothing if you run Ollama locally.",
        },
        {
          question: "Cursor vs GitHub Copilot: which should I pick?",
          answer:
            "Copilot is cheaper ($10/mo Pro), works inside the editor you already use and is the safest default for teams on GitHub. Cursor is a full AI IDE (~$20/mo) with a stronger agent/composer workflow for multi-file refactors. Try Copilot first if you do not want to switch editors.",
        },
        {
          question: "What does BYOK mean?",
          answer:
            "Bring Your Own Key. The coding tool is free; you paste an API key from OpenAI, Anthropic, Google or a local server. You pay per token to that provider. Use the AI Cost Calculator on this site to estimate that bill.",
        },
        {
          question: "What is agent mode?",
          answer:
            "Autocomplete suggests the next line. Agent mode can plan a change, edit several files, run commands and loop on errors. Cursor, Windsurf, Claude Code, Cline and Copilot all offer some form of agent. Quality and how much you can steer them still differ.",
        },
        {
          question: "Do these tools train on my private code?",
          answer:
            "Policies differ. Business/enterprise plans usually offer no-training and data-retention controls. Open-source BYOK tools only send code to the model provider you chose (or nowhere, if the model is local). Read the vendor privacy page before pasting secrets or proprietary repos.",
        },
        {
          question: "Is this comparison affiliated with any vendor?",
          answer:
            "No. It is an independent, client-side overview. Prices and features change — confirm on the official site. We do not collect emails or take a cut if you subscribe.",
        },
      ]}
      relatedTools={[
        { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator" },
        { name: "AI Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "Free AI Directory", href: "/tools/ai-tools/free-ai-directory" },
      ]}
    >
      <AiCodingToolsClient />
    </ToolLayout>
  );
}