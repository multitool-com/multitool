"use client";

import { useState } from "react";

export function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) { const t = y; y = x % y; x = t; }
  return x || 1;
}

export function simplify(n: number, d: number): [number, number] {
  if (d === 0) return [n, 0];
  const g = gcd(n, d);
  const nn = n / g, dd = d / g;
  return dd < 0 ? [-nn, -dd] : [nn, dd];
}

export function operate(a: number, b: number, c: number, d: number, op: "+" | "-" | "*" | "/"): [number, number] {
  if (b === 0 || d === 0) return [0, 0];
  if (op === "+") return simplify(a * d + c * b, b * d);
  if (op === "-") return simplify(a * d - c * b, b * d);
  if (op === "*") return simplify(a * c, b * d);
  return simplify(a * d, b * c);
}

export function fmtFraction(n: number, d: number): string {
  if (d === 0) return "—";
  const [sn, sd] = simplify(n, d);
  if (sd === 1) return String(sn);
  if (Math.abs(sn) > sd) {
    const whole = Math.trunc(sn / sd);
    const rem = Math.abs(sn % sd);
    return rem === 0 ? String(whole) : `${whole} ${rem}/${sd}`;
  }
  return `${sn}/${sd}`;
}

export default function FractionCalculatorClient() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [c, setC] = useState("3");
  const [d, setD] = useState("4");
  const [op, setOp] = useState<"+" | "-" | "*" | "/">("+");

  const na = parseInt(a, 10), nb = parseInt(b, 10), nc = parseInt(c, 10), nd = parseInt(d, 10);
  const ok = [na, nb, nc, nd].every((v) => Number.isFinite(v)) && nb !== 0 && nd !== 0;
  const [rn, rd] = ok ? operate(na, nb, nc, nd, op) : [0, 0];

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  const OPS: { id: "+" | "-" | "*" | "/"; label: string }[] = [
    { id: "+", label: "+" }, { id: "-", label: "−" }, { id: "*", label: "×" }, { id: "/", label: "÷" },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div className="flex flex-col items-center gap-1.5">
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className={inputCls + " text-center"} />
          <div className="w-2/3 border-t-2 border-ink/20" />
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className={inputCls + " text-center"} />
        </div>
        <div className="flex flex-col gap-1.5">
          {OPS.map((o) => (
            <button key={o.id} type="button" onClick={() => setOp(o.id)} className={`font-mono text-base w-10 h-10 rounded-lg border transition-colors ${op === o.id ? "bg-deep text-paper border-deep" : "bg-paper text-ink/70 border-ink/15 hover:border-accent"}`}>{o.label}</button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} className={inputCls + " text-center"} />
          <div className="w-2/3 border-t-2 border-ink/20" />
          <input type="number" value={d} onChange={(e) => setD(e.target.value)} className={inputCls + " text-center"} />
        </div>
      </div>

      <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] tracking-widest text-paper/60">RESULT (SIMPLIFIED)</span>
        <span className="font-display text-4xl font-bold text-accent">{ok ? fmtFraction(rn, rd) : "—"}</span>
        {ok && rd !== 1 && <span className="font-mono text-xs text-paper/70">decimal: {(rn / rd).toFixed(4)}</span>}
      </div>
      <p className="text-xs text-ink/50">Denominators cannot be zero. Results are always reduced to the simplest form.</p>
    </div>
  );
}
