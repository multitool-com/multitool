"use client";

import { useState } from "react";

export function makeSlug(text: string, separator = "-"): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${escapeReg(separator)}+|${escapeReg(separator)}+$`, "g"), "");
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function SlugGeneratorClient() {
  const [text, setText] = useState("How to Create an Awesome Blog Post!");
  const [sep, setSep] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = makeSlug(text, sep);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="slug-in" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TITLE OR TEXT</label>
        <textarea id="slug-in" value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">SEPARATOR</div>
        <div className="flex gap-2 flex-wrap">
          {["-", "_", "."].map((s) => (
            <button key={s} type="button" onClick={() => setSep(s)} className={`font-mono text-sm w-10 h-10 rounded-lg border transition-colors ${sep === s ? "bg-deep text-paper border-deep" : "bg-paper text-ink/70 border-ink/15 hover:border-accent"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">SLUG</div>
        <div className="relative">
          <input readOnly value={slug} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm text-ink/80 bg-paper focus:outline-none pr-24" />
          <button type="button" onClick={copy} className="absolute top-1/2 -translate-y-1/2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">{copied ? "✓" : "📋 COPY"}</button>
        </div>
      </div>
      <p className="text-xs text-ink/50">Accents, emoji and special characters are removed automatically: "Café à vonté" → "cafe-a-vonte".</p>
    </div>
  );
}
