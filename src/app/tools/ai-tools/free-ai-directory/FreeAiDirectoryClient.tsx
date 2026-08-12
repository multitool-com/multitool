"use client";

import { useMemo, useState } from "react";

type Category =
  | "chat"
  | "research"
  | "image"
  | "video"
  | "writing"
  | "code"
  | "audio"
  | "local";

type FilterId = "all" | "nosignup" | "opensource" | Category;

interface DirectoryTool {
  id: string;
  name: string;
  vendor: string;
  url: string;
  category: Category;
  noSignup: boolean;
  openSource: boolean;
  freeNote: string;
  bestFor: string;
  summary: string;
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "nosignup", label: "NO SIGN-UP" },
  { id: "opensource", label: "OPEN SOURCE" },
  { id: "chat", label: "CHAT" },
  { id: "research", label: "RESEARCH" },
  { id: "image", label: "IMAGE" },
  { id: "video", label: "VIDEO" },
  { id: "writing", label: "WRITING" },
  { id: "code", label: "CODE" },
  { id: "audio", label: "AUDIO" },
  { id: "local", label: "LOCAL / PRIVATE" },
];

const CATEGORY_LABEL: Record<Category, string> = {
  chat: "CHAT",
  research: "RESEARCH",
  image: "IMAGE",
  video: "VIDEO",
  writing: "WRITING",
  code: "CODE",
  audio: "AUDIO",
  local: "LOCAL",
};

const TOOLS: DirectoryTool[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    vendor: "Google",
    url: "https://gemini.google.com",
    category: "chat",
    noSignup: false,
    openSource: false,
    freeNote: "Generous free tier (Google account). Chat, images, research.",
    bestFor: "The strongest free all-rounder",
    summary:
      "Usually the most complete $0 package: chat, voice, Deep Research and image generation, tied into Docs and Gmail.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    url: "https://chatgpt.com",
    category: "chat",
    noSignup: false,
    openSource: false,
    freeNote: "Free tier with a cap on the flagship model, then a smaller one.",
    bestFor: "The default chatbot most people already know",
    summary:
      "Still the most familiar free chat app. Good at general Q&A, drafts and images. Expect hourly limits on the best model.",
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    url: "https://claude.ai",
    category: "chat",
    noSignup: false,
    openSource: false,
    freeNote: "Free plan with a daily message cap. Strong on long documents.",
    bestFor: "Natural long-form writing and careful reasoning",
    summary:
      "Often the nicest free writer. Large context for PDFs and reports. Limits tighten when demand is high.",
  },
  {
    id: "copilot-web",
    name: "Microsoft Copilot",
    vendor: "Microsoft",
    url: "https://copilot.microsoft.com",
    category: "chat",
    noSignup: true,
    openSource: false,
    freeNote: "Web chat works without an account; signing in unlocks more.",
    bestFor: "A quick GPT-class chat in the browser or Edge",
    summary:
      "Free web Copilot with search and image generation. Handy when you do not want another login yet.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    url: "https://chat.deepseek.com",
    category: "chat",
    noSignup: false,
    openSource: true,
    freeNote: "Very generous free chat. Open-weight models you can also self-host.",
    bestFor: "Hard reasoning and code at $0",
    summary:
      "Close to unlimited free chat (it throttles at peak times). Weights are open if you later want to run it yourself.",
  },
  {
    id: "mistral",
    name: "Mistral Le Chat",
    vendor: "Mistral AI",
    url: "https://chat.mistral.ai",
    category: "chat",
    noSignup: false,
    openSource: true,
    freeNote: "Solid European free tier. Several models are open weight.",
    bestFor: "A GDPR-friendlier free chatbot",
    summary:
      "Le Chat is free with daily caps. Good if you want a capable model from an EU company, plus open weights for local use.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    url: "https://www.perplexity.ai",
    category: "research",
    noSignup: true,
    openSource: false,
    freeNote: "Cited search works in the browser. Pro searches are capped.",
    bestFor: "Answers with sources, not just a paragraph",
    summary:
      "AI search that shows links. Use it when you need to check a claim. A few Pro/Deep searches per day on the free plan.",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    vendor: "Google",
    url: "https://notebooklm.google.com",
    category: "research",
    noSignup: false,
    openSource: false,
    freeNote: "Free with a Google account. Upload sources and ask questions.",
    bestFor: "Q&A over your own PDFs and notes",
    summary:
      "Grounds answers in files you add. Also builds audio overviews. Excellent for studying a packet of documents.",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    vendor: "Ideogram",
    url: "https://ideogram.ai",
    category: "image",
    noSignup: false,
    openSource: false,
    freeNote: "Daily free prompts. Best-in-class text inside images.",
    bestFor: "Posters, logos and readable lettering",
    summary:
      "When the image must contain real words (a poster, a mock logo), Ideogram's free tier is one of the safest bets.",
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    vendor: "Leonardo",
    url: "https://leonardo.ai",
    category: "image",
    noSignup: false,
    openSource: false,
    freeNote: "Daily token allowance for image generation.",
    bestFor: "Higher-control free image generation",
    summary:
      "More knobs than a simple chat image button: models, styles and variations, with a refresh of free tokens each day.",
  },
  {
    id: "designer",
    name: "Microsoft Designer",
    vendor: "Microsoft",
    url: "https://designer.microsoft.com",
    category: "image",
    noSignup: false,
    openSource: false,
    freeNote: "Free with a Microsoft account. Templates + image generation.",
    bestFor: "Social posts and simple designs, not just raw images",
    summary:
      "Turns a prompt into a laid-out graphic. Faster than opening a full editor when you need a story-sized card.",
  },
  {
    id: "capcut",
    name: "CapCut",
    vendor: "ByteDance",
    url: "https://www.capcut.com",
    category: "video",
    noSignup: false,
    openSource: false,
    freeNote: "Most editing and many AI features are free (watermarks vary).",
    bestFor: "Free AI-assisted video editing",
    summary:
      "The default free editor for short video: captions, cleanup, effects. Heavier generative video still sits on other apps.",
  },
  {
    id: "luma",
    name: "Luma Dream Machine",
    vendor: "Luma AI",
    url: "https://lumalabs.ai/dream-machine",
    category: "video",
    noSignup: false,
    openSource: false,
    freeNote: "A few free video generations per day.",
    bestFor: "Text- or image-to-video on a free quota",
    summary:
      "One of the easier free ways to try AI video. Clips are short; the daily cap goes fast if you iterate a lot.",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    vendor: "Grammarly",
    url: "https://www.grammarly.com",
    category: "writing",
    noSignup: false,
    openSource: false,
    freeNote: "Core grammar and spelling are free. Tone/rewrite is limited.",
    bestFor: "Everyday proofreading in the browser",
    summary:
      "The free extension still catches the boring mistakes. Full tone and full-sentence rewrites sit behind Pro.",
  },
  {
    id: "quillbot",
    name: "QuillBot",
    vendor: "QuillBot",
    url: "https://quillbot.com",
    category: "writing",
    noSignup: false,
    openSource: false,
    freeNote: "Free paraphraser with a short character cap.",
    bestFor: "Quick rewrites and a second wording",
    summary:
      "Paste a paragraph, get another version. Free mode is short; useful for emails and study notes, not a whole chapter.",
  },
  {
    id: "continue",
    name: "Continue.dev",
    vendor: "Continue",
    url: "https://continue.dev",
    category: "code",
    noSignup: true,
    openSource: true,
    freeNote: "Free open-source IDE extension. BYOK or local model.",
    bestFor: "Copilot-style chat in VS Code / JetBrains at $0",
    summary:
      "Install the extension, point it at Gemini, Claude, or Ollama. No product subscription. You only pay the model (or nothing, if local).",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    vendor: "Google",
    url: "https://github.com/google-gemini/gemini-cli",
    category: "code",
    noSignup: true,
    openSource: true,
    freeNote: "Open CLI with a large free daily quota.",
    bestFor: "A free terminal coding agent",
    summary:
      "Agentic coding from the shell. The free Gemini quota is enough for real daily work before you ever pay.",
  },
  {
    id: "copilot-free",
    name: "GitHub Copilot Free",
    vendor: "GitHub",
    url: "https://github.com/features/copilot",
    category: "code",
    noSignup: false,
    openSource: false,
    freeNote: "Limited free completions and chats each month.",
    bestFor: "Trying Copilot inside VS Code without paying",
    summary:
      "Enough to feel the autocomplete. Heavy users hit the cap in a couple of weeks and then look at Pro or a BYOK tool.",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "audio",
    noSignup: false,
    openSource: false,
    freeNote: "Free character quota for text-to-speech each month.",
    bestFor: "Natural AI voices on a free allowance",
    summary:
      "Still the usual pick for realistic speech. The free character count is fine for demos and short narrations.",
  },
  {
    id: "otter",
    name: "Otter.ai",
    vendor: "Otter",
    url: "https://otter.ai",
    category: "audio",
    noSignup: false,
    openSource: false,
    freeNote: "A few hundred transcription minutes per month.",
    bestFor: "Free meeting notes and transcripts",
    summary:
      "Records and transcribes calls. The free minutes cover a light meeting week; daily stand-ups will burn the quota.",
  },
  {
    id: "ollama",
    name: "Ollama",
    vendor: "Ollama",
    url: "https://ollama.com",
    category: "local",
    noSignup: true,
    openSource: true,
    freeNote: "100% free local runtime. No account required.",
    bestFor: "Private, offline models on your own machine",
    summary:
      "Download a model, run it on your laptop. Nothing leaves the device. Quality depends on your RAM and GPU.",
  },
  {
    id: "huggingchat",
    name: "HuggingChat",
    vendor: "Hugging Face",
    url: "https://huggingface.co/chat",
    category: "local",
    noSignup: true,
    openSource: true,
    freeNote: "Free open-model chat in the browser. Account optional for more.",
    bestFor: "Trying open models without installing anything",
    summary:
      "A public playground for open-weight chat models. Good for a no-install taste of Llama, Qwen and friends.",
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    vendor: "LM Studio",
    url: "https://lmstudio.ai",
    category: "local",
    noSignup: true,
    openSource: false,
    freeNote: "Free desktop app to run local models (app is not OSS).",
    bestFor: "A friendly GUI for local LLMs",
    summary:
      "Point-and-click Ollama alternative: browse models, chat, expose a local API. Free to download, no signup.",
  },
];

function matchesFilter(tool: DirectoryTool, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "nosignup") return tool.noSignup;
  if (filter === "opensource") return tool.openSource;
  return tool.category === filter;
}

export default function FreeAiDirectoryClient() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(TOOLS[0].id);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (!matchesFilter(tool, filter)) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.vendor.toLowerCase().includes(q) ||
        tool.bestFor.toLowerCase().includes(q) ||
        tool.summary.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const selected =
    visible.find((tool) => tool.id === selectedId) ?? visible[0] ?? null;

  const handleFilter = (id: FilterId) => {
    setFilter(id);
    const first = TOOLS.find((tool) => matchesFilter(tool, id));
    if (first) setSelectedId(first.id);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="directory-search"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          SEARCH
        </label>
        <input
          id="directory-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, vendor or use case..."
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          FILTER
        </span>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilter(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                filter === item.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono text-[10px] tracking-widest text-ink/40">
        {visible.length} TOOL{visible.length === 1 ? "" : "S"} · FREE TIERS
        CHANGE — CONFIRM ON THE OFFICIAL SITE
      </p>

      {visible.length === 0 ? (
        <p className="text-sm text-ink/50 text-center italic">
          No tools match that search and filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visible.map((tool) => {
            const active = selected?.id === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedId(tool.id)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  active
                    ? "bg-accent/10 border-accent"
                    : "bg-paper border-ink/10 hover:border-accent"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`font-display font-semibold text-sm ${
                      active ? "text-accent" : "text-ink"
                    }`}
                  >
                    {tool.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-ink/50 shrink-0">
                    {CATEGORY_LABEL[tool.category]}
                  </span>
                </div>
                <p className="text-xs text-ink/60 mb-2">{tool.bestFor}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.noSignup && <Tag>NO SIGN-UP</Tag>}
                  {tool.openSource && <Tag>OSS</Tag>}
                  <Tag>FREE TIER</Tag>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="bg-deep rounded-lg px-5 py-4">
          <div className="flex justify-between items-start gap-3 mb-3">
            <div>
              <span className="font-mono text-xs text-paper/50 tracking-widest block mb-1">
                {selected.vendor.toUpperCase()} ·{" "}
                {CATEGORY_LABEL[selected.category]}
              </span>
              <h3 className="font-display text-2xl font-semibold text-accent">
                {selected.name}
              </h3>
            </div>
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent transition-colors shrink-0"
            >
              OFFICIAL SITE ↗
            </a>
          </div>
          <p className="text-sm text-paper/80 mb-4">{selected.summary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DeepStat label="WHAT'S FREE" value={selected.freeNote} />
            <DeepStat label="BEST FOR" value={selected.bestFor} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock label="IN THIS LIST" value={String(TOOLS.length)} />
        <StatBlock
          label="NO SIGN-UP"
          value={String(TOOLS.filter((t) => t.noSignup).length)}
          highlight
        />
        <StatBlock
          label="OPEN SOURCE"
          value={String(TOOLS.filter((t) => t.openSource).length)}
        />
        <StatBlock
          label="CATEGORIES"
          value="8"
          highlight
        />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Independent directory,
        no affiliate links. Free tiers and training policies change.
        Confirm on the official site. Do not paste secrets into a free
        web chatbot.
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] tracking-widest text-ink/50 bg-white border border-ink/10 rounded-full px-2 py-0.5">
      {children}
    </span>
  );
}

function DeepStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[10px] tracking-widest text-paper/40 block mb-1">
        {label}
      </span>
      <span className="font-mono text-xs text-paper">{value}</span>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg px-3 py-3 ${
        highlight
          ? "bg-accent/10 border-accent/30"
          : "bg-paper border-ink/10"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
        {label}
      </span>
      <span
        className={`font-mono text-sm font-semibold ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}