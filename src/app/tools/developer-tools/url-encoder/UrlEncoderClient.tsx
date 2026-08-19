"use client";

import { useState } from "react";

export function encodeComponent(s: string): string {
  return encodeURIComponent(s);
}
export function decodeComponent(s: string): string {
  return decodeURIComponent(s.replace(/\+/g, "%20"));
}
export function encodeFull(s: string): string {
  return encodeURI(s);
}
export function decodeFull(s: string): string {
  return decodeURI(s);
}

export default function UrlEncoderClient() {
  const [mode, setMode] = useState<"component" | "full">("component");
  const [input, setInput] = useState("https://example.com/search?q=café & page=1");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = (direction: "encode" | "decode") => {
    setError("");
    try {
      const fn = mode === "component" ? (direction === "encode" ? encodeComponent : decodeComponent) : (direction === "encode" ? encodeFull : decodeFull);
      setOutput(fn(input));
    } catch {
      setError("Invalid URL encoding — check the input.");
      setOutput("");
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setMode("component")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "component" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🔗 COMPONENT (queries)</button>
        <button type="button" onClick={() => setMode("full")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "full" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🌐 FULL URL</button>
      </div>

      <div>
        <label htmlFor="url-in" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">INPUT</label>
        <textarea id="url-in" value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => run("encode")} className="bg-deep text-paper font-mono text-xs tracking-widest px-5 py-3 rounded-lg hover:bg-accent transition-colors">⬆ ENCODE</button>
        <button type="button" onClick={() => run("decode")} className="bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-3 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">⬇ DECODE</button>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      {output && (
        <div>
          <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">RESULT</div>
          <div className="relative">
            <textarea readOnly value={output} rows={3} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-y" />
            <button type="button" onClick={copy} className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
