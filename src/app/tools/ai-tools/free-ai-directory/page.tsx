import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FreeAiDirectoryClient from "./FreeAiDirectoryClient";

export const metadata: Metadata = {
  title: "Free AI Tools Directory - No Signup & Open Source | MultiTool",
  description:
    "Curated directory of the best free AI tools in 2026. Filter by chat, image, video, coding, writing and research. See no-signup and open-source options.",
  keywords: [
    "free ai tools",
    "ai directory",
    "best ai tools",
    "free chatgpt alternatives",
    "ai tools list",
    "free ai no signup",
    "open source ai tools",
    "free image generator",
    "free ai chatbot",
    "best free ai 2026",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/ai-tools/free-ai-directory",
  },
  openGraph: {
    title: "Free AI Tools Directory - No Signup & Open Source | MultiTool",
    description:
      "A curated list of free AI chat, image, video, coding and research tools. Filter by no-signup and open source.",
    url: "https://www.multitoolbox.online/tools/ai-tools/free-ai-directory",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Tools Directory - 2026",
    description:
      "Curated free AI tools. Filter by category, no signup and open source.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Free AI Tools Directory"
      description="A curated directory of free AI tools for chat, writing, images, video, coding and research. Filter by category, no-signup and open source."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="free-ai-directory"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is this directory?
          </h2>
          <p className="mb-4">
            A short, opinionated list of <strong>AI products you can
            actually use for free</strong> — not a dump of 500 affiliate
            pages. Every entry has a real free tier (or is fully free /
            open source). Limits change; the official site always wins.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use it
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Pick a <strong>category</strong> (Chat, Image, Video, Code,
              Writing, Research, Audio, Local).
            </li>
            <li>
              Narrow with <strong>NO SIGN-UP</strong> or{" "}
              <strong>OPEN SOURCE</strong> if that matters to you.
            </li>
            <li>
              Click a card for the free-tier note, then open the{" "}
              <strong>official site</strong>.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to read a &quot;free&quot; plan
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Truly free:</strong> the product itself costs $0
              (Ollama, HuggingChat, many CLIs).
            </li>
            <li>
              <strong>Freemium:</strong> a daily or monthly cap, then a
              paywall (ChatGPT, Claude, Midjourney-class image tools).
            </li>
            <li>
              <strong>No sign-up:</strong> you can try it in the browser
              without creating an account. Often stricter limits.
            </li>
            <li>
              <strong>Open source:</strong> you can run it yourself. You
              still pay for electricity or a cloud GPU.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            A solid $0 stack
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Chat / everyday:</strong> Gemini or ChatGPT free
            </li>
            <li>
              <strong>Long writing:</strong> Claude free
            </li>
            <li>
              <strong>Cited research:</strong> Perplexity + NotebookLM
            </li>
            <li>
              <strong>Images:</strong> Gemini / Ideogram / Leonardo free
              tiers
            </li>
            <li>
              <strong>Code:</strong> Continue.dev, Gemini CLI or Copilot
              Free
            </li>
            <li>
              <strong>Private / offline:</strong> Ollama + a local model
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Privacy warning
          </h2>
          <p className="mb-4">
            Free consumer chat apps often use conversations to train
            models unless you turn that off (or use a business plan). Do
            not paste secrets, medical data or client source code into a
            free web chatbot. For confidential work, use a local model or
            a plan with a no-training guarantee.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Filtering happens instantly in your browser. Nothing is{" "}
            <strong>sent to any server</strong> or stored. Official-site
            links leave this page, like any normal link.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the best free AI tool overall?",
          answer:
            "For most people in 2026, Google Gemini's free tier is the most generous all-rounder (chat, images, research). ChatGPT Free is the most familiar. Claude Free is usually the nicest writer. None of them is unlimited — expect daily or hourly caps.",
        },
        {
          question: "Which free AI does not need an account?",
          answer:
            "A few web tools let you try a prompt before signing in (Microsoft Copilot, some Perplexity searches, HuggingChat). Most serious tools ask for an email after a few messages. Use the NO SIGN-UP filter to see the ones that start without an account.",
        },
        {
          question: "Is there a completely unlimited free AI?",
          answer:
            "Not from the big labs. DeepSeek and some open models come close (throttle instead of a hard cap). Truly unlimited means running a local model with Ollama or LM Studio — free software, but your hardware does the work.",
        },
        {
          question: "Are free AI image and video generators safe to use?",
          answer:
            "The tools listed here are well-known products with public terms. Free tiers still apply their content filters and usually claim a license to use your prompts. Do not upload photos of other people without permission. Check each site's terms before commercial use.",
        },
        {
          question: "Do you get a commission if I sign up?",
          answer:
            "No. This is an independent, client-side directory. There are no affiliate links and no accounts on our side. We do not rank tools because someone paid us.",
        },
        {
          question: "Is my browsing on this page private?",
          answer:
            "Yes. Filters and search run in your browser. We do not log which tools you click. Following an official-site link is a normal navigation to that vendor.",
        },
      ]}
      relatedTools={[
        { name: "AI Prompt Generator", href: "/tools/ai-tools/prompt-generator" },
        { name: "AI Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "AI Coding Tools", href: "/tools/ai-tools/ai-coding-tools" },
      ]}
    >
      <FreeAiDirectoryClient />
    </ToolLayout>
  );
}