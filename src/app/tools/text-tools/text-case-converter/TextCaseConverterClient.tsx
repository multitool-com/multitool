"use client";

import { useState } from "react";

export function toCase(text: string, style: string): string {
  const s = text.trim();
  switch (style) {
    case "upper": return s.toUpperCase();
    case "lower": return s.toLowerCase();
    case "title":
      return s.toLowerCase().replace(/(^|\s)(\S)/g, (m, p, c) => p + c.toUpperCase());
    case "sentence":
      return s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case "camel":
      return s
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    case "pascal":
      return s
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase());
    case "snake": return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    case "kebab": return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    case "constant": return s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    case "alternating": {
      let out = "", i = 0;
      for (const ch of s) {
        out += /[a-zA-Z]/.test(ch) ? (i++ % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()) : ch;
      }
      return out;
    }
    default: return s;
  }
}

const STYLES: { id: string; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
  { id: "alternating", label: "aLtErNaTiNg" },
];

export default function TextCaseConverterClient() {
  const [text, setText] = useState("the quick brown fox jumps over the lazy dog");
  const [style, setStyle] = useState("title");
  const [copied, setCopied] = useState(false);

  const result = toCase(text, style);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="tc-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TEXT</label>
        <textarea id="tc-input" value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {STYLES.map((s) => (
          <button key={s.id} type="button" onClick={() => setStyle(s.id)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${style === s.id ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{s.label}</button>
        ))}
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">RESULT</div>
        <div className="relative">
          <textarea readOnly value={result} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm text-ink/80 bg-paper focus:outline-none resize-y" />
          <button type="button" onClick={copy} className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY"}</button>
        </div>
      </div>
    </div>
  );
}
