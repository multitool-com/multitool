"use client";

import { useState } from "react";

export function daysBetween(a: Date, b: Date): number {
  const ms = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime() -
    new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  return Math.round(ms / (24 * 3600 * 1000));
}

export function addDaysTo(d: Date, days: number): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() + days);
  return r;
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", weekday: "short" });
}

export default function DateCalculatorClient() {
  const now = new Date();
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const [mode, setMode] = useState<"between" | "add">("between");
  const [d1, setD1] = useState(iso(now));
  const [d2, setD2] = useState(iso(new Date(now.getTime() + 45 * 24 * 3600 * 1000)));
  const [base, setBase] = useState(iso(now));
  const [days, setDays] = useState("90");

  const a = new Date(d1 + "T00:00:00"), b = new Date(d2 + "T00:00:00");
  const diff = d1 && d2 && !isNaN(a.getTime()) && !isNaN(b.getTime()) ? daysBetween(a, b) : null;
  const baseD = new Date(base + "T00:00:00");
  const n = parseInt(days, 10);
  const result = base && !isNaN(baseD.getTime()) && Number.isFinite(n) ? addDaysTo(baseD, n) : null;

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setMode("between")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "between" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>📅 DAYS BETWEEN</button>
        <button type="button" onClick={() => setMode("add")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "add" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>➕ ADD / SUBTRACT DAYS</button>
      </div>

      {mode === "between" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">START DATE</label>
              <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">END DATE</label>
              <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-widest text-paper/60">DAYS BETWEEN</span>
            <span className="font-display text-5xl font-bold text-accent">{diff !== null ? Math.abs(diff) : "—"}</span>
            <span className="font-mono text-xs text-paper/70">{diff !== null ? (diff < 0 ? "end is before start" : `${fmtDate(a)} → ${fmtDate(b)}`) : ""}</span>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">BASE DATE</label>
              <input type="date" value={base} onChange={(e) => setBase(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">DAYS (+ ADD / − SUBTRACT)</label>
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-widest text-paper/60">RESULT</span>
            <span className="font-display text-3xl font-bold text-accent">{result ? fmtDate(result) : "—"}</span>
            <span className="font-mono text-xs text-paper/70">{result ? `${fmtDate(baseD)} ${n >= 0 ? "+" : ""}${n} days` : ""}</span>
          </div>
        </>
      )}
    </div>
  );
}
