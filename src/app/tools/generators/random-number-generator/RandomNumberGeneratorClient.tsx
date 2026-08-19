"use client";

import { useState } from "react";

export function randomInts(min: number, max: number, count: number, unique: boolean): number[] | null {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max || count < 1 || count > 1000) return null;
  const lo = Math.ceil(min), hi = Math.floor(max);
  if (unique && hi - lo + 1 < count) return null;
  if (!unique) {
    return Array.from({ length: count }, () => lo + Math.floor(Math.random() * (hi - lo + 1)));
  }
  const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [unique, setUnique] = useState(true);
  const [sort, setSort] = useState(false);
  const [nums, setNums] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setError("");
    const res = randomInts(parseFloat(min), parseFloat(max), parseInt(count, 10) || 1, unique);
    if (res === null) {
      setError("Check the range: min must be ≤ max and the range must fit the requested unique count (max 1000 numbers).");
      setNums([]);
      return;
    }
    setNums(sort ? [...res].sort((a, b) => a - b) : res);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(nums.join(", ")); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">MIN</label>
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">MAX</label>
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">COUNT (≤1000)</label>
          <input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer select-none">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-accent w-4 h-4" /> No repeats
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer select-none">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="accent-accent w-4 h-4" /> Sort ascending
        </label>
      </div>

      <button type="button" onClick={generate} className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">🎲 GENERATE</button>

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      {nums.length > 0 && (
        <div>
          <div className="relative">
            <div className="bg-deep rounded-xl px-4 py-4 flex flex-wrap gap-2 justify-center">
              {nums.map((n, i) => (
                <span key={i} className="bg-white/10 text-paper font-mono text-sm font-bold px-3 py-1.5 rounded-lg">{n}</span>
              ))}
            </div>
            <button type="button" onClick={copy} className="absolute top-2 right-2 bg-accent text-paper font-mono text-xs tracking-widest px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">{copied ? "✓" : "📋"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
