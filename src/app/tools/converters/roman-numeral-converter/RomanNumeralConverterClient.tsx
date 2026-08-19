"use client";

import { useState } from "react";

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let v = n, out = "";
  for (const [val, sym] of ROMAN) {
    while (v >= val) { out += sym; v -= val; }
  }
  return out;
}

export function fromRoman(s: string): number | null {
  const str = s.trim().toUpperCase();
  if (!str) return null;
  if (!/^[IVXLCDM]+$/.test(str)) return null;
  let total = 0, prev = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    const v = ROMAN.find(([, sym]) => sym === str[i])?.[0];
    if (v === undefined) return null;
    if (v < prev) total -= v; else total += v;
    prev = v;
  }
  if (total > 3999 || toRoman(total) !== str) return null; // must be canonical
  return total;
}

export default function RomanNumeralConverterClient() {
  const [arabic, setArabic] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const [lastEdit, setLastEdit] = useState<"arabic" | "roman">("arabic");

  const syncFromArabic = (v: string) => {
    setArabic(v);
    setLastEdit("arabic");
    const n = parseInt(v, 10);
    setRoman(toRoman(n) ?? "");
  };
  const syncFromRoman = (v: string) => {
    setRoman(v);
    setLastEdit("roman");
    const n = fromRoman(v);
    setArabic(n !== null ? String(n) : "");
  };

  const invalidArabic = lastEdit === "arabic" && !/^\d+$/.test(arabic);
  const invalidRoman = lastEdit === "roman" && roman !== "" && fromRoman(roman) === null;
  const currentNum = lastEdit === "arabic" ? parseInt(arabic, 10) : fromRoman(roman);

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="rm-ar" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ARABIC (1–3999)</label>
        <input id="rm-ar" type="text" inputMode="numeric" value={arabic} onChange={(e) => syncFromArabic(e.target.value)} className={inputCls + (invalidArabic ? " border-red-400" : "")} />
      </div>
      <div>
        <label htmlFor="rm-ro" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ROMAN</label>
        <input id="rm-ro" type="text" value={roman} onChange={(e) => syncFromRoman(e.target.value)} placeholder="MMXXVI" className={inputCls + (invalidRoman ? " border-red-400" : "")} />
      </div>

      {invalidArabic && <p className="text-xs text-red-500">Enter a whole number between 1 and 3999.</p>}
      {invalidRoman && <p className="text-xs text-red-500">Not a valid roman numeral (canonical form required).</p>}

      <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] tracking-widest text-paper/60">CONVERTED</span>
        <span className="font-display text-4xl font-bold text-accent break-all">
          {lastEdit === "arabic" ? (toRoman(currentNum ?? NaN) ?? "—") : (currentNum ?? "—")}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[1, 4, 9, 14, 40, 99, 399, 2026, 3999].map((n) => (
          <button key={n} type="button" onClick={() => syncFromArabic(String(n))} className="font-mono text-xs px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">{n}</button>
        ))}
      </div>
    </div>
  );
}
