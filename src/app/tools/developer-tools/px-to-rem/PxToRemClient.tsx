"use client";

import { useState } from "react";

export function pxToRem(px: number, base: number): number | null {
  if (!isFinite(px) || !isFinite(base) || base <= 0) return null;
  return px / base;
}
export function remToPx(rem: number, base: number): number | null {
  if (!isFinite(rem) || !isFinite(base) || base <= 0) return null;
  return rem * base;
}

export default function PxToRemClient() {
  const [base, setBase] = useState("16");
  const [px, setPx] = useState("24");
  const [rem, setRem] = useState("1.5");
  const [mode, setMode] = useState<"px" | "rem">("px");

  const b = parseFloat(base);
  const pxRes = mode === "px" ? pxToRem(parseFloat(px), b) : remToPx(parseFloat(rem), b);
  const unit = mode === "px" ? "rem" : "px";

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setMode("px")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "px" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>PX → REM</button>
        <button type="button" onClick={() => setMode("rem")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "rem" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>REM → PX</button>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ROOT FONT SIZE (base, px)</label>
        <input type="number" min="1" value={base} onChange={(e) => setBase(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">{mode === "px" ? "VALUE IN PX" : "VALUE IN REM"}</label>
        <input type="number" step="any" value={mode === "px" ? px : rem} onChange={(e) => (mode === "px" ? setPx(e.target.value) : setRem(e.target.value))} className={inputCls} />
      </div>

      <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] tracking-widest text-paper/60">RESULT</span>
        <span className="font-display text-4xl font-bold text-accent">{pxRes !== null ? pxRes.toFixed(4) : "—"}</span>
        <span className="font-mono text-xs text-paper/70">{unit} (base {b || "?"}px)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[8, 12, 16, 24, 32, 40, 48, 64].map((v) => (
          <button key={v} type="button" onClick={() => { setMode("px"); setPx(String(v)); }} className="font-mono text-xs px-3 py-2 rounded-lg bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">
            {v}px = {pxToRem(v, b || 16)?.toFixed(2)}rem
          </button>
        ))}
      </div>
    </div>
  );
}
