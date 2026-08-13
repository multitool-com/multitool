"use client";

import { useMemo, useState } from "react";

function formatPercent(n: number): string {
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 2 : 2;
  const body = n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: 4,
  });
  if (n > 0) return `+${body}%`;
  if (n < 0) return `${body}%`;
  return "0%";
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}

export default function PercentageChangeClient() {
  const [original, setOriginal] = useState("80");
  const [next, setNext] = useState("100");

  const result = useMemo(() => {
    const from = parseFloat(original);
    const to = parseFloat(next);
    if (isNaN(from) || isNaN(to)) return null;
    if (from === 0) return { undefinedChange: true as const, from, to };

    const diff = to - from;
    const percent = (diff / from) * 100;
    const multiplier = to / from;

    return {
      undefinedChange: false as const,
      from,
      to,
      diff,
      percent,
      multiplier,
      kind: diff > 0 ? "increase" : diff < 0 ? "decrease" : "unchanged",
    };
  }, [original, next]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="original-value"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            ORIGINAL VALUE
          </label>
          <input
            id="original-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="80"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label
            htmlFor="new-value"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            NEW VALUE
          </label>
          <input
            id="new-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="100"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          PERCENTAGE CHANGE
        </span>
        {result && !result.undefinedChange ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatPercent(result.percent)}
            </span>
            <span className="font-mono text-sm text-paper/70">
              {result.kind}
            </span>
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {result && !result.undefinedChange && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBlock
            label="ABSOLUTE CHANGE"
            value={formatNumber(result.diff)}
            highlight
          />
          <StatBlock
            label="DIRECTION"
            value={result.kind.toUpperCase()}
            highlight
          />
          <StatBlock
            label="MULTIPLIER"
            value={`${result.multiplier.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}×`}
          />
          <StatBlock label="ORIGINAL" value={formatNumber(result.from)} />
          <StatBlock label="NEW" value={formatNumber(result.to)} />
          <StatBlock
            label="FORMULA"
            value="(new − old) / old"
          />
        </div>
      )}

      {result?.undefinedChange && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Percentage change is <strong>undefined</strong> when the original
          value is 0 (cannot divide by zero).
        </div>
      )}

      {!result?.undefinedChange && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <strong className="text-ink">Formula:</strong> ((new − original)
          ÷ original) × 100. From 80 to 100 is +25%. From 100 to 80 is
          −20%.
        </div>
      )}
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