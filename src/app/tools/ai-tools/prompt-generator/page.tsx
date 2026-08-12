import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PromptGeneratorClient from "./PromptGeneratorClient";

export const metadata: Metadata = {
  title: "AI Prompt Generator - Free ChatGPT & Claude Prompts | MultiTool",
  description:
    "Free AI prompt generator with 100+ ready-to-use templates for marketing, coding, writing, design and education. Customize variables and copy instantly.",
  keywords: [
    "prompt generator",
    "ai prompt generator",
    "chatgpt prompt generator",
    "claude prompt generator",
    "prompt templates",
    "free ai prompts",
    "ai prompt maker",
    "chatgpt prompts",
    "prompt engineering",
    "best ai prompts",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/ai-tools/prompt-generator",
  },
  openGraph: {
    title: "AI Prompt Generator - Free ChatGPT & Claude Prompts | MultiTool",
    description:
      "100+ ready-to-use AI prompt templates for marketing, coding, writing, design and education. Free and instant.",
    url: "https://multitoolbox.online/tools/ai-tools/prompt-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Generator - Free & Instant",
    description:
      "100+ ready-to-use AI prompt templates for ChatGPT, Claude and Gemini.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="AI Prompt Generator"
      description="Generate professional AI prompts for marketing, coding, writing, design and education. Choose a template, customize the variables and copy your perfect prompt in seconds."
      categoryName="AI Tools"
      categorySlug="ai-tools"
      toolSlug="prompt-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a prompt generator?
          </h2>
          <p className="mb-4">
            A <strong>prompt generator</strong> is a tool that helps you write
            better instructions for AI models like ChatGPT, Claude, Gemini and
            others. The quality of your <em>output</em> depends almost entirely
            on the quality of your <em>input</em> — a well-crafted prompt is
            the difference between a mediocre response and a brilliant one.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              <strong>Choose a category</strong> — Marketing, Coding, Writing,
              Design, Education or Business.
            </li>
            <li>
              <strong>Pick a template</strong> from the list of proven prompts.
            </li>
            <li>
              <strong>Fill in the variables</strong> (like topic, tone, target
              audience, etc.) with your specific details.
            </li>
            <li>
              <strong>Copy the generated prompt</strong> and paste it into
              ChatGPT, Claude, Gemini or any other AI.
            </li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            What makes a great AI prompt?
          </h2>
          <p className="mb-3">
            Studies from OpenAI and Anthropic show that great prompts share 5
            key elements:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Clear role:</strong> tell the AI who it should act as
              (&quot;You are an expert copywriter...&quot;)
            </li>
            <li>
              <strong>Specific task:</strong> describe exactly what you want it
              to do
            </li>
            <li>
              <strong>Context:</strong> provide background information the AI
              needs
            </li>
            <li>
              <strong>Format:</strong> specify how the answer should be
              structured (list, table, paragraph, etc.)
            </li>
            <li>
              <strong>Constraints:</strong> word count, tone, style,
              things to avoid
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Best practices for prompt engineering
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Be specific:</strong> &quot;Write a professional LinkedIn
              post about remote work productivity&quot; is much better than
              &quot;write about work&quot;
            </li>
            <li>
              <strong>Give examples:</strong> if you want a specific style,
              show 1-2 examples of what good looks like
            </li>
            <li>
              <strong>Use step-by-step:</strong> ask the AI to think out loud
              or break the task into steps
            </li>
            <li>
              <strong>Iterate:</strong> if the first output isn&apos;t perfect,
              refine your prompt with feedback
            </li>
            <li>
              <strong>Set the tone:</strong> formal, casual, humorous,
              technical — always specify
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Which AI works best with these prompts?
          </h2>
          <p className="mb-4">
            All templates in this generator are <strong>model-agnostic</strong>{" "}
            — they work with any modern AI model:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>ChatGPT (GPT-4, GPT-4o):</strong> excellent for
              creative and structured tasks
            </li>
            <li>
              <strong>Claude (Sonnet, Opus):</strong> best for long-form
              writing and nuanced reasoning
            </li>
            <li>
              <strong>Gemini (Pro, Advanced):</strong> strong on research and
              multimodal tasks
            </li>
            <li>
              <strong>Grok, Llama, Mistral</strong> and other open models:
              all templates work well
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            All prompt generation happens instantly in your browser. Your
            inputs are <strong>never sent to any server</strong> and never
            stored. Safe for confidential ideas and business info.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is this prompt generator really free?",
          answer:
            "Yes, 100% free with no sign-up required. All templates run locally in your browser. There are no usage limits and no premium plans.",
        },
        {
          question: "Which AI models work with these prompts?",
          answer:
            "All prompts are model-agnostic and work with any modern AI: ChatGPT (GPT-4, GPT-4o), Claude (Sonnet, Opus), Gemini, Grok, Llama, Mistral and others. Just copy the generated prompt and paste it into your favorite AI.",
        },
        {
          question: "How do I get better results from ChatGPT or Claude?",
          answer:
            "The 3 golden rules: (1) Be specific — tell the AI exactly what you want. (2) Give context — explain the background, target audience and purpose. (3) Specify format — ask for a list, table, essay or specific length. Our templates already include all of these best practices.",
        },
        {
          question: "Can I customize the templates?",
          answer:
            "Absolutely! After you pick a template, you'll see input fields for each variable (like topic, tone, audience). Fill them with your specific details and the prompt updates in real time.",
        },
        {
          question: "Are these prompts safe for business use?",
          answer:
            "Yes. All prompts follow ethical AI guidelines and are designed for legitimate business, creative and educational purposes. No jailbreaks, no manipulative tactics — just well-structured instructions.",
        },
        {
          question: "Is my data private?",
          answer:
            "Yes! Everything happens locally in your browser using JavaScript. Nothing is uploaded, logged or stored anywhere. Safe for confidential ideas.",
        },
      ]}
      relatedTools={[
        { name: "AI Token Counter", href: "/tools/ai-tools/token-counter" },
        { name: "AI Cost Calculator", href: "/tools/ai-tools/ai-cost-calculator" },
        { name: "AI Coding Tools", href: "/tools/ai-tools/ai-coding-tools" },
        { name: "Free AI Directory", href: "/tools/ai-tools/free-ai-directory" },
      ]}
    >
      <PromptGeneratorClient />
    </ToolLayout>
  );
}