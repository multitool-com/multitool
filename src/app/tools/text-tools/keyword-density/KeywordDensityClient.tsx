"use client";

import { useState } from "react";

export function analyze(text: string, keyword: string) {
  const words = text.toLowerCase().match(/[a-zà-ÿ0-9']+/g) ?? [];
  const total = words.length;
  const kw = keyword.trim().toLowerCase();
  let count = 0;
  if (kw) {
    const parts = kw.split(/\s+/);
    count = parts.length > 1
      ? text.toLowerCase().split(parts[0]).length - 1 // phrase as single-word first match
      : words.filter((w) => w === kw).length;
    if (parts.length > 1) {
      // count occurrences of the full phrase
      const lower = text.toLowerCase();
      let idx = 0, c = 0;
      while ((idx = lower.indexOf(kw, idx)) !== -1) { c++; idx += kw.length; }
      count = c;
    }
  }
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  const top = Object.entries(freq)
    .filter(([w]) => w.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w, c]) => ({ word: w, count: c, density: total ? (c / total) * 100 : 0 }));
  return {
    total,
    keywordCount: count,
    keywordDensity: total ? (count / total) * 100 : 0,
    top,
  };
}

export default function KeywordDensityClient() {
  const [text, setText] = useState("SEO means search engine optimization. SEO helps your site rank. Learn SEO basics and apply SEO every day.");
  const [keyword, setKeyword] = useState("seo");

  const r = analyze(text, keyword);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid md:grid-cols-[1fr_240px] gap-4">
        <div>
          <label htmlFor="kd-text" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TEXT</label>
          <textarea id="kd-text" value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
        </div>
        <div>
          <label htmlFor="kd-kw" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">KEYWORD</label>
          <input id="kd-kw" type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="seo" className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-paper border border-ink/10 rounded-lg px-3 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">TOTAL WORDS</span>
          <span className="font-display text-3xl font-bold text-deep">{r.total.toLocaleString()}</span>
        </div>
        <div className="bg-paper border border-ink/10 rounded-lg px-3 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">KEYWORD COUNT</span>
          <span className="font-display text-3xl font-bold text-deep">{r.keywordCount}</span>
        </div>
        <div className="bg-deep rounded-lg px-3 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">DENSITY</span>
          <span className="font-display text-3xl font-bold text-accent">{r.keywordDensity.toFixed(2)}%</span>
          <span className="font-mono text-[9px] text-paper/60">{r.keywordDensity >= 0.5 && r.keywordDensity <= 3 ? "✓ ideal (0.5–3%)" : "outside 0.5–3%"}</span>
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TOP WORDS</div>
        <div className="border border-ink/10 rounded-lg overflow-hidden">
          {r.top.map((w, i) => (
            <div key={w.word} className="flex items-center gap-3 px-3 py-1.5 border-b border-ink/5 text-sm">
              <span className="font-mono text-[10px] text-ink/40 w-5">{i + 1}</span>
              <span className="font-mono text-xs text-ink/80 flex-1 break-all">{w.word}</span>
              <span className="font-mono text-xs text-ink/50">{w.count}×</span>
              <div className="w-24 bg-ink/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: `${Math.min(100, w.density * 6)}%` }} />
              </div>
              <span className="font-mono text-[10px] text-ink/50 w-12 text-right">{w.density.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
