"use client";

import { useState } from "react";

export async function sha(data: string, algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const subtle = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle;
  if (!subtle) return "";
  const buf = await subtle.digest(algo, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashGeneratorClient() {
  const [text, setText] = useState("Hello MultiTool");
  const [algos, setAlgos] = useState<Set<string>>(new Set(["SHA-256"]));
  const [results, setResults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleAlgo = (a: string) =>
    setAlgos((s) => {
      const n = new Set(s);
      if (n.has(a)) n.delete(a); else n.add(a);
      return n;
    });

  const run = async () => {
    if (!text.trim() || algos.size === 0) return;
    setBusy(true);
    const out: Record<string, string> = {};
    for (const a of ALGOS) {
      if (algos.has(a)) out[a] = await sha(text, a);
    }
    setResults(out);
    setBusy(false);
  };

  const copyAll = async () => {
    try {
      const joined = Object.entries(results).map(([k, v]) => `${k}: ${v}`).join("\n");
      await navigator.clipboard.writeText(joined);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="hash-in" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TEXT</label>
        <textarea id="hash-in" value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {ALGOS.map((a) => (
          <button key={a} type="button" onClick={() => toggleAlgo(a)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${algos.has(a) ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{a}</button>
        ))}
        <button type="button" onClick={run} disabled={busy || algos.size === 0} className="ml-auto bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors">{busy ? "HASHING…" : "🔐 HASH"}</button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="flex flex-col gap-3">
          {Object.entries(results).map(([algo, hex]) => (
            <div key={algo} className="bg-paper border border-ink/10 rounded-lg px-4 py-3 flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-widest text-ink/50">{algo} · {hex.length * 4} bits</span>
              <code className="font-mono text-xs text-deep break-all">{hex}</code>
            </div>
          ))}
          <button type="button" onClick={copyAll} className="self-start bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-2.5 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY ALL"}</button>
        </div>
      )}
    </div>
  );
}
