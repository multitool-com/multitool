"use client";

import { useMemo, useState } from "react";

type Provider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "DeepSeek"
  | "Mistral"
  | "xAI";

interface Model {
  id: string;
  name: string;
  provider: Provider;
  context: number; // tokens
  maxOutput: number; // tokens
  inputPrice: number; // USD per 1M tokens
  outputPrice: number; // USD per 1M tokens
  bestFor: string;
}

// Reference prices in USD per 1M tokens (public provider pages, mid-2025).
// NOTE: prices change often — see FAQ. Kept as reference only.
const MODELS: Model[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", context: 128000, maxOutput: 16384, inputPrice: 2.5, outputPrice: 10, bestFor: "General assistant, vision, everyday tasks" },
  { id: "gpt-4o-mini", name: "GPT-4o mini", provider: "OpenAI", context: 128000, maxOutput: 16384, inputPrice: 0.15, outputPrice: 0.6, bestFor: "Cheap fast tasks, classification, chat" },
  { id: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI", context: 1048576, maxOutput: 32768, inputPrice: 2, outputPrice: 8, bestFor: "Long context, coding, agents" },
  { id: "gpt-4.1-mini", name: "GPT-4.1 mini", provider: "OpenAI", context: 1048576, maxOutput: 32768, inputPrice: 0.4, outputPrice: 1.6, bestFor: "Long context at low cost" },
  { id: "o3", name: "o3", provider: "OpenAI", context: 200000, maxOutput: 100000, inputPrice: 10, outputPrice: 40, bestFor: "Hard reasoning, math, code" },
  { id: "o3-mini", name: "o3-mini", provider: "OpenAI", context: 200000, maxOutput: 100000, inputPrice: 1.1, outputPrice: 4.4, bestFor: "Reasoning on a budget" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", context: 200000, maxOutput: 32768, inputPrice: 15, outputPrice: 75, bestFor: "Hardest tasks, deep analysis" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", context: 200000, maxOutput: 65536, inputPrice: 3, outputPrice: 15, bestFor: "Coding, agents, balanced quality" },
  { id: "claude-haiku-4", name: "Claude Haiku 4", provider: "Anthropic", context: 200000, maxOutput: 65536, inputPrice: 1, outputPrice: 5, bestFor: "Fast, cheap everyday tasks" },
  { id: "claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", context: 200000, maxOutput: 65536, inputPrice: 3, outputPrice: 15, bestFor: "Coding, long outputs (legacy)" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", context: 1048576, maxOutput: 65536, inputPrice: 1.25, outputPrice: 10, bestFor: "Long context, multimodal reasoning" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", context: 1048576, maxOutput: 65536, inputPrice: 0.3, outputPrice: 2.5, bestFor: "Fast, cheap, big context" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite", provider: "Google", context: 1048576, maxOutput: 65536, inputPrice: 0.1, outputPrice: 0.4, bestFor: "Cheapest high-volume tasks" },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", context: 1048576, maxOutput: 128000, inputPrice: 0.2, outputPrice: 0.6, bestFor: "Open weights, huge context" },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", provider: "Meta", context: 131072, maxOutput: 8192, inputPrice: 0.25, outputPrice: 0.7, bestFor: "Open weights, self-hosted" },
  { id: "deepseek-v3", name: "DeepSeek-V3", provider: "DeepSeek", context: 131072, maxOutput: 16384, inputPrice: 0.27, outputPrice: 1.1, bestFor: "Cheap general + coding" },
  { id: "deepseek-r1", name: "DeepSeek-R1", provider: "DeepSeek", context: 131072, maxOutput: 16384, inputPrice: 0.55, outputPrice: 2.19, bestFor: "Reasoning, open weights" },
  { id: "mistral-large-2", name: "Mistral Large 2", provider: "Mistral", context: 131072, maxOutput: 8192, inputPrice: 2, outputPrice: 6, bestFor: "Multilingual, enterprise" },
  { id: "mistral-small", name: "Mistral Small", provider: "Mistral", context: 131072, maxOutput: 8192, inputPrice: 0.2, outputPrice: 0.6, bestFor: "Fast lightweight tasks" },
  { id: "grok-4", name: "Grok 4", provider: "xAI", context: 262144, maxOutput: 32768, inputPrice: 3, outputPrice: 15, bestFor: "Real-time data, X integration" },
];

const PROVIDERS: Provider[] = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "DeepSeek",
  "Mistral",
  "xAI",
];

type SortKey = "input" | "output" | "context" | "name";

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
}

function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function LlmModelComparisonClient() {
  const [provider, setProvider] = useState<Provider | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [pinned, setPinned] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = MODELS.filter(
      (m) => provider === "ALL" || m.provider === provider
    );
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.bestFor.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sort === "input") return a.inputPrice - b.inputPrice;
      if (sort === "output") return a.outputPrice - b.outputPrice;
      if (sort === "context") return b.context - a.context;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [provider, search, sort]);

  const pinnedModels = useMemo(
    () =>
      MODELS.filter((m) => pinned.includes(m.id)).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [pinned]
  );

  const cheapestInput = filtered.length
    ? Math.min(...filtered.map((m) => m.inputPrice))
    : -1;
  const cheapestOutput = filtered.length
    ? Math.min(...filtered.map((m) => m.outputPrice))
    : -1;

  const togglePin = (id: string) => {
    setPinned((current) => {
      if (current.includes(id)) return current.filter((p) => p !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  };

  const sortOptions: { id: SortKey; label: string }[] = [
    { id: "name", label: "NAME" },
    { id: "input", label: "CHEAPEST INPUT" },
    { id: "output", label: "CHEAPEST OUTPUT" },
    { id: "context", label: "BIGGEST CONTEXT" },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Provider filter */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          PROVIDER
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setProvider("ALL")}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              provider === "ALL"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            ALL ({MODELS.length})
          </button>
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                provider === p
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search + sort */}
      <div className="grid sm:grid-cols-2 gap-3 items-end">
        <div>
          <label
            htmlFor="llm-search"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            SEARCH
          </label>
          <input
            id="llm-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. gemini, claude, cheap…"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            SORT BY
          </span>
          <div className="flex gap-2 flex-wrap">
            {sortOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                  sort === s.id
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison strip */}
      {pinnedModels.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            PINNED FOR COMPARISON ({pinnedModels.length}/4)
          </span>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pinnedModels.map((m) => (
              <div
                key={m.id}
                className="bg-accent/10 border border-accent/30 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-semibold text-sm">
                    {m.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePin(m.id)}
                    className="font-mono text-[10px] text-accent hover:opacity-70"
                    aria-label={`Remove ${m.name}`}
                  >
                    ✕
                  </button>
                </div>
                <p className="font-mono text-[10px] text-ink/50 mb-2">
                  {m.provider.toUpperCase()}
                </p>
                <p className="font-mono text-[11px] text-ink/80">
                  CTX {formatTokens(m.context)} · OUT {formatTokens(m.maxOutput)}
                </p>
                <p className="font-mono text-[11px] text-ink/80">
                  {formatPrice(m.inputPrice)} / {formatPrice(m.outputPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="MODELS" value={String(filtered.length)} highlight />
        <StatBlock label="PROVIDERS" value={String(PROVIDERS.length)} />
        <StatBlock label="PINNED" value={`${pinnedModels.length}/4`} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="font-mono text-[10px] tracking-widest text-ink/50 border-b border-ink/10">
              <th className="py-2 pr-2">MODEL</th>
              <th className="py-2 pr-2">PROVIDER</th>
              <th className="py-2 pr-2 text-right">CONTEXT</th>
              <th className="py-2 pr-2 text-right">MAX OUT</th>
              <th className="py-2 pr-2 text-right">INPUT $/1M</th>
              <th className="py-2 pr-2 text-right">OUTPUT $/1M</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isPinned = pinned.includes(m.id);
              return (
                <tr
                  key={m.id}
                  className={`border-b border-ink/5 align-top ${
                    isPinned ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="py-3 pr-2">
                    <span className="font-display font-semibold text-sm">
                      {m.name}
                    </span>
                    <p className="font-mono text-[10px] text-ink/50 mt-0.5">
                      {m.bestFor}
                    </p>
                  </td>
                  <td className="py-3 pr-2">
                    <span className="font-mono text-[11px] text-ink/70">
                      {m.provider}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <span className="font-mono text-xs text-ink/80">
                      {formatTokens(m.context)}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <span className="font-mono text-xs text-ink/80">
                      {formatTokens(m.maxOutput)}
                    </span>
                  </td>
                  <td
                    className={`py-3 pr-2 text-right font-mono text-xs ${
                      m.inputPrice === cheapestInput
                        ? "text-accent font-semibold"
                        : "text-ink/80"
                    }`}
                  >
                    {formatPrice(m.inputPrice)}
                  </td>
                  <td
                    className={`py-3 pr-2 text-right font-mono text-xs ${
                      m.outputPrice === cheapestOutput
                        ? "text-accent font-semibold"
                        : "text-ink/80"
                    }`}
                  >
                    {formatPrice(m.outputPrice)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => togglePin(m.id)}
                      disabled={!isPinned && pinned.length >= 4}
                      className={`font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full transition-colors disabled:opacity-30 ${
                        isPinned
                          ? "bg-deep text-paper"
                          : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {isPinned ? "PINNED" : "PIN"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center font-mono text-xs text-ink/50">
                  No models match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Reference prices in USD
        per 1M tokens — they change frequently and some providers offer
        batch or cached-input discounts. Highlighted values are the cheapest
        among the currently filtered models. Always confirm on the official
        pricing page.
      </div>
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
