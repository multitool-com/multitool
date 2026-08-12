"use client";

import { useMemo, useState } from "react";

type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-sonnet"
  | "claude-opus"
  | "gemini-flash";

interface ModelInfo {
  id: ModelId;
  label: string;
  family: "gpt" | "claude" | "gemini";
  contextWindow: number;
  inputPricePerMillion: number;
}

const MODELS: ModelInfo[] = [
  {
    id: "gpt-4o",
    label: "GPT-4O",
    family: "gpt",
    contextWindow: 128000,
    inputPricePerMillion: 2.5,
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4O MINI",
    family: "gpt",
    contextWindow: 128000,
    inputPricePerMillion: 0.15,
  },
  {
    id: "claude-sonnet",
    label: "CLAUDE SONNET",
    family: "claude",
    contextWindow: 200000,
    inputPricePerMillion: 3,
  },
  {
    id: "claude-opus",
    label: "CLAUDE OPUS",
    family: "claude",
    contextWindow: 200000,
    inputPricePerMillion: 15,
  },
  {
    id: "gemini-flash",
    label: "GEMINI FLASH",
    family: "gemini",
    contextWindow: 1000000,
    inputPricePerMillion: 0.075,
  },
];

const FAMILY_FACTOR: Record<ModelInfo["family"], number> = {
  gpt: 1,
  claude: 0.96,
  gemini: 1.02,
};

function estimateBaseTokens(text: string): number {
  if (!text) return 0;
  const pieces = text.match(/\w+|[^\s\w]/g);
  if (!pieces) return 0;

  let tokens = 0;
  for (const piece of pieces) {
    if (/^\w+$/.test(piece)) {
      tokens += Math.max(1, Math.ceil(piece.length / 4));
    } else {
      tokens += 1;
    }
  }
  return tokens;
}

function formatUsd(value: number): string {
  if (value === 0) return "$0.00";
  if (value < 0.0001) return "< $0.0001";
  if (value < 0.01) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })}`;
  }
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;
}

function formatPercent(value: number): string {
  if (value === 0) return "0%";
  if (value > 0 && value < 0.01) return "< 0.01%";
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export default function TokenCounterClient() {
  const [text, setText] = useState("");
  const [modelId, setModelId] = useState<ModelId>("gpt-4o");
  const [copied, setCopied] = useState(false);

  const model = useMemo(
    () => MODELS.find((item) => item.id === modelId) ?? MODELS[0],
    [modelId]
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = trimmed
      ? trimmed.split(/\s+/).filter((word) => word.length > 0).length
      : 0;

    const tokens = trimmed
      ? Math.max(
          1,
          Math.round(estimateBaseTokens(text) * FAMILY_FACTOR[model.family])
        )
      : 0;

    const contextPercent = (tokens / model.contextWindow) * 100;
    const estimatedCost = (tokens / 1_000_000) * model.inputPricePerMillion;

    return {
      tokens,
      words,
      characters,
      charactersNoSpaces,
      contextPercent,
      estimatedCost,
    };
  }, [text, model]);

  const copyCount = async () => {
    try {
      await navigator.clipboard.writeText(String(stats.tokens));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          MODEL
        </span>
        <div className="flex gap-2 flex-wrap">
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setModelId(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                modelId === item.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="token-input"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          PASTE YOUR PROMPT
        </label>
        <textarea
          id="token-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the prompt or text you plan to send to the AI..."
          rows={10}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            ESTIMATED TOKENS
          </span>
          <button
            type="button"
            onClick={copyCount}
            className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-5xl font-semibold text-accent">
            {stats.tokens.toLocaleString("en-US")}
          </span>
          <span className="font-mono text-sm text-paper/70">tokens</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBlock
          label="WORDS"
          value={stats.words.toLocaleString("en-US")}
        />
        <StatBlock
          label="CHARACTERS"
          value={stats.characters.toLocaleString("en-US")}
          sublabel={`(without spaces: ${stats.charactersNoSpaces.toLocaleString("en-US")})`}
        />
        <StatBlock
          label="CONTEXT USED"
          value={formatPercent(stats.contextPercent)}
          sublabel={`${model.contextWindow.toLocaleString("en-US")} window`}
          highlight
        />
        <StatBlock
          label="EST. INPUT COST"
          value={formatUsd(stats.estimatedCost)}
          sublabel={`$${model.inputPricePerMillion.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
          })} / 1M tokens`}
          highlight
        />
        <StatBlock label="MODEL" value={model.label} />
        <StatBlock
          label="CHARS / TOKEN"
          value={
            stats.tokens > 0
              ? (stats.characters / stats.tokens).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "—"
          }
        />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Token counts are an
        in-browser estimate (typically within ~10% of the official tokenizer).
        Cost is <strong>input only</strong> at listed API prices and can change.
        The model reply (output tokens) is billed separately.
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  sublabel,
  highlight = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
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
      {sublabel && (
        <span className="font-mono text-[9px] text-ink/40 block mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}