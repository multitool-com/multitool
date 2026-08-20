"use client";

import { useState } from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";

export function uuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // fallback manual v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUuids(n: number, uppercase: boolean): string[] {
  const count = Math.max(1, Math.min(100, Math.floor(n) || 1));
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const u = uuidV4();
    out.push(uppercase ? u.toUpperCase() : u);
  }
  return out;
}

export default function UuidGeneratorClient() {
  const [count, setCount] = useState("5");
  const [upper, setUpper] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => []);
  const [copied, setCopied] = useState(false);

  const generate = () => setUuids
    trackToolUsed("uuid-generator", "developer-tools");(generateUuids(parseInt(count, 10) || 5, upper));
  const copyAll = async () => {
    trackCopy("uuid-generator", "developer-tools");
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HOW MANY (1–100)</label>
          <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} className="w-24 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer select-none pb-2.5">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-accent w-4 h-4" />
          UPPERCASE
        </label>
        <button type="button" onClick={generate} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">⚡ GENERATE</button>
        {uuids.length > 0 && (
          <button type="button" onClick={copyAll} className="bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-3 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY ALL"}</button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="bg-paper border border-ink/10 rounded-lg p-4 flex flex-col gap-1.5">
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <code className="font-mono text-xs text-ink/80 break-all">{u}</code>
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(u); } catch { /* noop */ } }} className="font-mono text-[10px] text-ink/40 hover:text-accent shrink-0">COPY</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-ink/50">Uses the browser&apos;s cryptographically secure random generator (crypto.randomUUID).</p>
    </div>
  );
}
