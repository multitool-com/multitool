"use client";

import { useState } from "react";

const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "for", "in", "on", "at", "with", "by", "from", "is", "are", "was", "were", "be", "this", "that", "it", "how", "what", "why", "when", "where", "your", "you", "my", "our", "their", "his", "her", "its", "as", "but", "not", "so", "if", "then", "than", "too", "very", "can", "will", "just", "about", "into", "over", "after", "before", "do", "does", "did", "has", "have", "had"]);

export function buildHashtags(phrase: string, count: number): string[] {
  const words = phrase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .match(/[a-z0-9]+/g) ?? [];
  const meaningful = words.filter((w) => w.length > 2 && !STOP.has(w));
  if (meaningful.length === 0) return [];
  const out: string[] = [];
  // 1) phrase as one tag
  out.push("#" + meaningful.join(""));
  // 2) each word
  for (const w of meaningful) {
    if (!out.includes("#" + w)) out.push("#" + w);
    if (out.length >= count) break;
  }
  // 3) bigrams to fill
  for (let i = 0; i < meaningful.length - 1 && out.length < count; i++) {
    const bigram = "#" + meaningful[i] + meaningful[i + 1];
    if (!out.includes(bigram)) out.push(bigram);
  }
  // 4) pad with plurals/variants
  const pad = ["tips", "ideas", "guide", "tutorial", "hacks", "life", "daily", "inspo", "goals", "vibes"];
  for (const p of pad) {
    if (out.length >= count) break;
    const tag = "#" + meaningful[0] + p;
    if (!out.includes(tag)) out.push(tag);
  }
  return out.slice(0, count);
}

export default function HashtagGeneratorClient() {
  const [phrase, setPhrase] = useState("healthy breakfast ideas");
  const [count, setCount] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const c = Math.max(3, Math.min(30, count));
    setTags(buildHashtags(phrase, c));
  };

  const copyAll = async () => {
    try { await navigator.clipboard.writeText(tags.join(" ")); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="ht-in" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TOPIC OR PHRASE</label>
        <input id="ht-in" type="text" value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="e.g. healthy breakfast ideas" className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">NUMBER (3–30)</label>
          <input type="number" min="3" max="30" value={count} onChange={(e) => setCount(parseInt(e.target.value, 10) || 10)} className="w-24 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <button type="button" onClick={generate} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"># GENERATE</button>
        {tags.length > 0 && (
          <button type="button" onClick={copyAll} className="bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-3 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY ALL"}</button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <button key={i} type="button" onClick={async () => { try { await navigator.clipboard.writeText(t); } catch { /* noop */ } }} className="bg-paper border border-ink/15 font-mono text-xs px-3 py-1.5 rounded-full text-ink/70 hover:border-accent hover:text-accent transition-colors">{t}</button>
          ))}
        </div>
      )}
      <p className="text-xs text-ink/50">Stop words (the, and, of…) are removed automatically. Click any tag to copy it.</p>
    </div>
  );
}
