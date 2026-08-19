"use client";

import { useState } from "react";

// Simple line-level LCS diff. Returns rows: {type: "same"|"add"|"del", a?: string, b?: string}
export function diffLines(aText: string, bText: string): { type: "same" | "add" | "del"; a: string; b: string }[] {
  const a = aText.replace(/\r\n/g, "\n").split("\n");
  const b = bText.replace(/\r\n/g, "\n").split("\n");
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: { type: "same" | "add" | "del"; a: string; b: string }[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ type: "same", a: a[i], b: b[j] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: "del", a: a[i], b: "" }); i++; }
    else { out.push({ type: "add", a: "", b: b[j] }); j++; }
  }
  while (i < n) { out.push({ type: "del", a: a[i], b: "" }); i++; }
  while (j < m) { out.push({ type: "add", a: "", b: b[j] }); j++; }
  return out;
}

export function diffStats(rows: { type: "same" | "add" | "del"; a: string; b: string }[]) {
  return {
    same: rows.filter((r) => r.type === "same").length,
    add: rows.filter((r) => r.type === "add").length,
    del: rows.filter((r) => r.type === "del").length,
  };
}

export default function TextDiffClient() {
  const [a, setA] = useState("Hello world\nThis is line two\nSame line here\nRemoved line");
  const [b, setB] = useState("Hello world\nThis is line two changed\nSame line here\nBrand new line");
  const [mode, setMode] = useState<"side" | "unified">("side");

  const rows = diffLines(a, b);
  const stats = diffStats(rows);

  const rowCls = (type: string) =>
    type === "same" ? "bg-transparent text-ink/70" : type === "add" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-600";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ORIGINAL</label>
          <textarea value={a} onChange={(e) => setA(e.target.value)} rows={8} spellCheck={false} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">COMPARED</label>
          <textarea value={b} onChange={(e) => setB(e.target.value)} rows={8} spellCheck={false} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <button type="button" onClick={() => setMode("side")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "side" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>SIDE BY SIDE</button>
        <button type="button" onClick={() => setMode("unified")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "unified" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>UNIFIED</button>
        <span className="font-mono text-xs text-ink/50 ml-auto">+{stats.add} added · −{stats.del} removed · {stats.same} same</span>
      </div>

      {mode === "side" ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-ink/10 rounded-lg overflow-hidden">
            {rows.map((r, i) => (
              <div key={`a-${i}`} className={`px-3 py-1.5 font-mono text-xs border-b border-ink/5 ${r.type === "add" ? "opacity-30" : rowCls(r.type)}`}>{r.type === "add" ? "·" : r.a || " "}</div>
            ))}
          </div>
          <div className="border border-ink/10 rounded-lg overflow-hidden">
            {rows.map((r, i) => (
              <div key={`b-${i}`} className={`px-3 py-1.5 font-mono text-xs border-b border-ink/5 ${r.type === "del" ? "opacity-30" : rowCls(r.type)}`}>{r.type === "del" ? "·" : r.b || " "}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-ink/10 rounded-lg overflow-hidden">
          {rows.map((r, i) => (
            <div key={`u-${i}`} className={`px-3 py-1.5 font-mono text-xs border-b border-ink/5 flex gap-2 ${rowCls(r.type)}`}>
              <span className="select-none w-4 text-center shrink-0">{r.type === "add" ? "+" : r.type === "del" ? "−" : " "}</span>
              <span className="break-all">{r.type === "add" ? r.b : r.a}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
