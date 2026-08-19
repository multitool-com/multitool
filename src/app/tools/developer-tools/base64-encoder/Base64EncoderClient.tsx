"use client";

import { useState } from "react";

export function encodeBase64(str: string): string {
  if (typeof window === "undefined" || typeof btoa === "undefined") return Buffer.from(str, "utf8").toString("base64");
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export function decodeBase64(str: string): string {
  const clean = str.trim();
  if (typeof window === "undefined" || typeof atob === "undefined") return Buffer.from(clean, "base64").toString("utf8");
  const bin = atob(clean);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64EncoderClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello MultiTool!");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    setError("");
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
    } catch {
      setError("Invalid Base64 input — check for missing characters.");
      setOutput("");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => { setMode("encode"); setOutput(""); setError(""); }} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "encode" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🔒 ENCODE</button>
        <button type="button" onClick={() => { setMode("decode"); setOutput(""); setError(""); }} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "decode" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🔓 DECODE</button>
      </div>

      <div>
        <label htmlFor="b64-in" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">{mode === "encode" ? "TEXT" : "BASE64"}</label>
        <textarea id="b64-in" value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <button type="button" onClick={run} className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">⚡ CONVERT</button>

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      {output && (
        <div>
          <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">RESULT</div>
          <div className="relative">
            <textarea readOnly value={output} rows={4} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-y" />
            <button type="button" onClick={copy} className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
