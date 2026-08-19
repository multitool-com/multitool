"use client";

import { useMemo, useState } from "react";

interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  sorted: number[];
}

function computeStats(nums: number[]): Stats | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const mid = Math.floor(count / 2);
  const median = count % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const freq = new Map<number, number>();
  sorted.forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
  const maxFreq = Math.max(...freq.values());
  const mode = [...freq.entries()].filter(([, f]) => f === maxFreq).map(([n]) => n).sort((a, b) => a - b);
  const variance = sorted.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
  return {
    count, sum, mean, median, mode, min: sorted[0], max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0], variance, stdDev: Math.sqrt(variance), sorted,
  };
}

export default function StatisticsCalculatorClient() {
  const [input, setInput] = useState("12, 15, 15, 18, 20, 21, 24");

  const stats = useMemo(() => {
    const nums = input
      .split(/[\s,;]+/)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
    return computeStats(nums);
  }, [input]);

  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""));

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="stats-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          NUMBERS (SEPARATED BY COMMAS)
        </label>
        <textarea
          id="stats-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="1, 2, 3, 4, 5"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBlock label="COUNT" value={String(stats.count)} />
            <StatBlock label="SUM" value={fmt(stats.sum)} />
            <StatBlock label="MEAN" value={fmt(stats.mean)} highlight />
            <StatBlock label="MEDIAN" value={fmt(stats.median)} highlight />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBlock label="MODE" value={stats.mode.join(", ") || "—"} />
            <StatBlock label="MIN" value={fmt(stats.min)} />
            <StatBlock label="MAX" value={fmt(stats.max)} />
            <StatBlock label="RANGE" value={fmt(stats.range)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBlock label="VARIANCE" value={fmt(stats.variance)} />
            <StatBlock label="STD DEV" value={fmt(stats.stdDev)} highlight />
            <div className="col-span-2 bg-paper border border-ink/10 rounded-lg px-3 py-3">
              <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">SORTED</span>
              <span className="font-mono text-xs text-ink break-all">
                {stats.sorted.map(fmt).join(", ")}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Type at least one number to see the statistics.
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> variance and standard
        deviation use the population formula (divide by N).
      </div>
    </div>
  );
}

function StatBlock({
  label, value, highlight = false,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-3 ${highlight ? "bg-accent/10 border-accent/30" : "bg-paper border-ink/10"}`}>
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? "text-accent" : "text-ink"}`}>{value}</span>
    </div>
  );
}
