"use client";

import { useMemo, useState } from "react";

type Surface = "extension" | "ide" | "terminal";
type FilterId = "all" | "free" | "under15" | "agent" | "opensource" | Surface;

interface CodingTool {
  id: string;
  name: string;
  vendor: string;
  url: string;
  priceFrom: number;
  priceLabel: string;
  hasFreePlan: boolean;
  freeNote: string;
  surface: Surface;
  surfaceLabel: string;
  agent: boolean;
  openSource: boolean;
  models: string;
  bestFor: string;
  summary: string;
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "free", label: "HAS FREE PLAN" },
  { id: "under15", label: "FROM $15 OR LESS" },
  { id: "agent", label: "AGENT MODE" },
  { id: "opensource", label: "OPEN SOURCE" },
  { id: "extension", label: "EDITOR PLUGIN" },
  { id: "ide", label: "AI IDE" },
  { id: "terminal", label: "TERMINAL" },
];

const TOOLS: CodingTool[] = [
  {
    id: "copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    url: "https://github.com/features/copilot",
    priceFrom: 10,
    priceLabel: "$10 / mo Pro",
    hasFreePlan: true,
    freeNote: "Limited free tier (usage-capped completions)",
    surface: "extension",
    surfaceLabel: "VS Code, JetBrains, Vim, Visual Studio",
    agent: true,
    openSource: false,
    models: "OpenAI + Claude (routed by GitHub)",
    bestFor: "Teams already on GitHub who want to stay in their current IDE",
    summary:
      "The default autocomplete for millions of developers. Cheapest mainstream Pro plan, works in the editor you already use, and Copilot Chat / agent covers multi-file edits.",
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    url: "https://cursor.com",
    priceFrom: 20,
    priceLabel: "$20 / mo Pro",
    hasFreePlan: true,
    freeNote: "Limited free tier (~2k completions / month)",
    surface: "ide",
    surfaceLabel: "Standalone IDE (VS Code fork)",
    agent: true,
    openSource: false,
    models: "Claude, GPT, Gemini + others",
    bestFor: "Solo and small teams who want an AI-native editor",
    summary:
      "A VS Code fork built around Composer / agent workflows. Strong at multi-file refactors. You switch editors, but you keep your extensions.",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium / Windsurf",
    url: "https://windsurf.com",
    priceFrom: 15,
    priceLabel: "$15–20 / mo Pro",
    hasFreePlan: true,
    freeNote: "Free tier with daily / monthly credit cap",
    surface: "ide",
    surfaceLabel: "Standalone IDE (VS Code fork)",
    agent: true,
    openSource: false,
    models: "Claude, GPT, Gemini",
    bestFor: "Large repos and a lower-priced AI IDE",
    summary:
      "Cascade-style agent that indexes the project. Often picked as the cheaper Cursor alternative with a usable free tier.",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    vendor: "Anthropic",
    url: "https://claude.com/claude-code",
    priceFrom: 20,
    priceLabel: "$20 / mo (Claude Pro)",
    hasFreePlan: false,
    freeNote: "No standalone free coding plan — needs Claude Pro / Max or API",
    surface: "terminal",
    surfaceLabel: "Terminal + editor add-ons",
    agent: true,
    openSource: false,
    models: "Claude only (Sonnet / Opus)",
    bestFor: "Terminal-native work and long autonomous tasks",
    summary:
      "A CLI agent that can read the repo, edit files and run commands. Billed through Claude Pro / Max or the API, not a separate IDE subscription.",
  },
  {
    id: "cline",
    name: "Cline",
    vendor: "Cline (open source)",
    url: "https://github.com/cline/cline",
    priceFrom: 0,
    priceLabel: "Free (BYOK)",
    hasFreePlan: true,
    freeNote: "App is free. You pay the model API or run local models",
    surface: "extension",
    surfaceLabel: "VS Code and forks",
    agent: true,
    openSource: true,
    models: "Claude, GPT, Gemini, Ollama / local",
    bestFor: "Developers who want a visible, auditable agent",
    summary:
      "Open-source VS Code agent. You bring an API key (or a local model). Every tool call is visible, which is useful when you do not want a black box.",
  },
  {
    id: "continue",
    name: "Continue.dev",
    vendor: "Continue",
    url: "https://continue.dev",
    priceFrom: 0,
    priceLabel: "Free (BYOK)",
    hasFreePlan: true,
    freeNote: "Open source. Enterprise tier optional for teams",
    surface: "extension",
    surfaceLabel: "VS Code, JetBrains",
    agent: true,
    openSource: true,
    models: "Any provider or local (Ollama, LM Studio)",
    bestFor: "Privacy-first autocomplete + chat in your current IDE",
    summary:
      "The open-source Copilot stand-in. Autocomplete, chat and custom prompts, pointed at the model you choose — including fully local.",
  },
  {
    id: "aider",
    name: "Aider",
    vendor: "Aider (open source)",
    url: "https://aider.chat",
    priceFrom: 0,
    priceLabel: "Free (BYOK)",
    hasFreePlan: true,
    freeNote: "Free CLI. You pay the model API",
    surface: "terminal",
    surfaceLabel: "Terminal (works with any editor)",
    agent: true,
    openSource: true,
    models: "Claude, GPT, Gemini, local, OpenAI-compatible",
    bestFor: "Git-native pair programming from the terminal",
    summary:
      "A git-aware CLI pair programmer. It commits as it works, so you can review every change. Popular with people who already live in the shell.",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    vendor: "Google",
    url: "https://github.com/google-gemini/gemini-cli",
    priceFrom: 0,
    priceLabel: "Free tier (generous)",
    hasFreePlan: true,
    freeNote: "High free daily quota; paid Gemini API after that",
    surface: "terminal",
    surfaceLabel: "Terminal",
    agent: true,
    openSource: true,
    models: "Gemini Flash / Pro",
    bestFor: "A capable free terminal agent",
    summary:
      "Google's open CLI agent. The free quota is large enough for daily coding. Good first stop if you do not want another $20 subscription.",
  },
  {
    id: "tabnine",
    name: "Tabnine",
    vendor: "Tabnine",
    url: "https://www.tabnine.com",
    priceFrom: 9,
    priceLabel: "$9 / mo Pro",
    hasFreePlan: true,
    freeNote: "Basic free autocomplete",
    surface: "extension",
    surfaceLabel: "VS Code, JetBrains, Eclipse and more",
    agent: false,
    openSource: false,
    models: "Tabnine models + BYOM on higher plans",
    bestFor: "Enterprises that need on-prem / no-training guarantees",
    summary:
      "Older than Copilot, still the privacy-first option. Self-host and zero-retention plans matter more here than raw agent power.",
  },
  {
    id: "amazon-q",
    name: "Amazon Q Developer",
    vendor: "Amazon Web Services",
    url: "https://aws.amazon.com/q/developer/",
    priceFrom: 19,
    priceLabel: "$19 / mo Pro",
    hasFreePlan: true,
    freeNote: "Generous free tier for individuals",
    surface: "extension",
    surfaceLabel: "VS Code, JetBrains, CLI",
    agent: true,
    openSource: false,
    models: "Amazon Bedrock models",
    bestFor: "Teams deep in AWS (and Java upgrades)",
    summary:
      "Strongest when the repo already talks to AWS. Free tier is usable; Pro adds higher limits and extra agent features.",
  },
];

function matchesFilter(tool: CodingTool, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "free") return tool.hasFreePlan;
  if (filter === "under15") return tool.priceFrom <= 15;
  if (filter === "agent") return tool.agent;
  if (filter === "opensource") return tool.openSource;
  return tool.surface === filter;
}

export default function AiCodingToolsClient() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string>(TOOLS[0].id);

  const visible = useMemo(
    () => TOOLS.filter((tool) => matchesFilter(tool, filter)),
    [filter]
  );

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
        {visible.length} TOOL{visible.length === 1 ? "" : "S"} · PRICES ARE
        PUBLIC LIST RATES AND CAN CHANGE
      </p>

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
                  {tool.priceLabel}
                </span>
              </div>
              <p className="text-xs text-ink/60 mb-2">{tool.bestFor}</p>
              <div className="flex flex-wrap gap-1">
                {tool.hasFreePlan && <Tag>FREE TIER</Tag>}
                {tool.agent && <Tag>AGENT</Tag>}
                {tool.openSource && <Tag>OSS</Tag>}
                <Tag>{tool.surface.toUpperCase()}</Tag>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="bg-deep rounded-lg px-5 py-4">
          <div className="flex justify-between items-start gap-3 mb-3">
            <div>
              <span className="font-mono text-xs text-paper/50 tracking-widest block mb-1">
                {selected.vendor.toUpperCase()}
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
          <div className="grid grid-cols-2 gap-3">
            <DeepStat label="FROM" value={selected.priceLabel} />
            <DeepStat label="FREE PLAN" value={selected.freeNote} />
            <DeepStat label="WHERE IT RUNS" value={selected.surfaceLabel} />
            <DeepStat label="MODELS" value={selected.models} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock label="IN THIS LIST" value={String(TOOLS.length)} />
        <StatBlock
          label="WITH A FREE PLAN"
          value={String(TOOLS.filter((t) => t.hasFreePlan).length)}
          highlight
        />
        <StatBlock
          label="OPEN SOURCE"
          value={String(TOOLS.filter((t) => t.openSource).length)}
        />
        <StatBlock
          label="FROM $0 (BYOK)"
          value={String(TOOLS.filter((t) => t.priceFrom === 0).length)}
          highlight
        />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Independent overview,
        not a vendor ranking. Confirm current pricing and data-use policy
        on the official site before you subscribe or paste private code.
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