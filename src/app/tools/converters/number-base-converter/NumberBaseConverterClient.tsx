"use client";

import { useState } from "react";

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function toBase(num: number, base: number): string {
  if (!Number.isFinite(num) || base < 2 || base > 36) return "";
  if (num === 0) return "0";
  let n = Math.abs(Math.trunc(num));
  let out = "";
  while (n > 0) {
    out = DIGITS[n % base] + out;
    n = Math.floor(n / base);
  }
  return (num < 0 ? "-" : "") + out;
}

export function fromBase(str: string, base: number): number | null {
  const s = str.trim().toUpperCase();
  if (!s) return null;
  if (!/^[+-]?[0-9A-Z]+$/.test(s)) return null;
  const neg = s.startsWith("-");
  const body = s.replace(/^[+-]/, "");
  let val = 0;
  for (const ch of body) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) return null;
    val = val * base + d;
  }
  return neg ? -val : val;
}

export default function NumberBaseConverterClient() {
  const [input, setInput] = useState("255");
  const [fromBaseN, setFromBaseN] = useState(10);

  const value = fromBase(input, fromBaseN);
  const bases = [
    { b: 2, label: "BINARY (base 2)" },
    { b: 8, label: "OCTAL (base 8)" },
    { b: 10, label: "DECIMAL (base 10)" },
    { b: 16, label: "HEXADECIMAL (base 16)" },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <div>
          <label htmlFor="nb-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">VALUE</label>
          <input id="nb-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. FF or 255" className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">FROM BASE</label>
          <select value={fromBaseN} onChange={(e) => setFromBaseN(parseInt(e.target.value, 10))} className="border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm bg-white">
            {[2, 8, 10, 16].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {bases.map((x) => (
          <div key={x.b} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 ${x.b === fromBaseN ? "bg-deep" : "bg-paper border border-ink/10"}`}>
            <span className={`font-mono text-[10px] tracking-widest ${x.b === fromBaseN ? "text-paper/60" : "text-ink/50"}`}>{x.label}</span>
            <span className={`font-mono text-lg font-bold break-all text-right ${x.b === fromBaseN ? "text-accent" : "text-deep"}`}>
              {value !== null ? toBase(value, x.b) : "—"}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink/50">Supports bases 2–36. Invalid digits for the selected base are rejected automatically.</p>
    </div>
  );
}
