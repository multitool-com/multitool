"use client";

import { useState } from "react";

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a)), y = Math.abs(Math.round(b));
  while (y) { const t = y; y = x % y; x = t; }
  return x || 1;
}

export function simplifyRatio(a: number, b: number): string | null {
  if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0) return null;
  const g = gcd(a, b);
  return `${Math.round(a / g)}:${Math.round(b / g)}`;
}

export function solveRatio(a: number, b: number, c: number): number | null {
  if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a <= 0 || b <= 0 || c <= 0) return null;
  return (b * c) / a;
}

export default function RatioCalculatorClient() {
  const [mode, setMode] = useState<"simplify" | "solve">("simplify");
  const [a, setA] = useState("12");
  const [b, setB] = useState("8");
  const [c, setC] = useState("9");

  const na = parseFloat(a), nb = parseFloat(b), nc = parseFloat(c);
  const simplified = simplifyRatio(na, nb);
  const x = solveRatio(na, nb, nc);

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setMode("simplify")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "simplify" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>📐 SIMPLIFY</button>
        <button type="button" onClick={() => setMode("solve")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "solve" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>❓ SOLVE FOR X</button>
      </div>

      {mode === "simplify" ? (
        <>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <input type="number" min="0" value={a} onChange={(e) => setA(e.target.value)} className={inputCls} />
            <span className="font-display text-2xl font-bold text-ink/40">:</span>
            <input type="number" min="0" value={b} onChange={(e) => setB(e.target.value)} className={inputCls} />
          </div>
          <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-widest text-paper/60">SIMPLIFIED RATIO</span>
            <span className="font-display text-4xl font-bold text-accent">{simplified ?? "—"}</span>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-center">
            <input type="number" min="0" value={a} onChange={(e) => setA(e.target.value)} className={inputCls} />
            <span className="font-display text-xl font-bold text-ink/40">:</span>
            <input type="number" min="0" value={b} onChange={(e) => setB(e.target.value)} className={inputCls} />
            <span className="font-mono text-sm text-ink/50">= {c} :</span>
            <div className="bg-paper border-2 border-accent rounded-lg px-3 py-2 text-center font-display text-xl font-bold text-accent">{x !== null ? x.toFixed(2) : "—"}</div>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            {x !== null ? (
              <>If <strong className="text-ink">{na} : {nb} = {nc} : x</strong>, then x = ({nb} × {nc}) ÷ {na} = <strong className="text-accent">{x.toFixed(2)}</strong></>
            ) : "Enter positive values for all three terms."}
          </div>
        </>
      )}
    </div>
  );
}
