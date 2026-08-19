"use client";

import { useState } from "react";

type Row = { us: number; uk: number; eu: number; cm: number };

export const MEN: Row[] = [
  { us: 6, uk: 5.5, eu: 39, cm: 24.5 },
  { us: 6.5, uk: 6, eu: 39.5, cm: 24.8 },
  { us: 7, uk: 6.5, eu: 40, cm: 25.1 },
  { us: 7.5, uk: 7, eu: 40.5, cm: 25.4 },
  { us: 8, uk: 7.5, eu: 41, cm: 25.7 },
  { us: 8.5, uk: 8, eu: 42, cm: 26 },
  { us: 9, uk: 8.5, eu: 42.5, cm: 26.3 },
  { us: 9.5, uk: 9, eu: 43, cm: 26.7 },
  { us: 10, uk: 9.5, eu: 44, cm: 27 },
  { us: 10.5, uk: 10, eu: 44.5, cm: 27.3 },
  { us: 11, uk: 10.5, eu: 45, cm: 27.6 },
  { us: 11.5, uk: 11, eu: 45.5, cm: 28 },
  { us: 12, uk: 11.5, eu: 46, cm: 28.3 },
  { us: 13, uk: 12.5, eu: 47, cm: 28.9 },
  { us: 14, uk: 13.5, eu: 48, cm: 29.6 },
];

export const WOMEN: Row[] = [
  { us: 4, uk: 2, eu: 35, cm: 21.3 },
  { us: 4.5, uk: 2.5, eu: 35.5, cm: 21.6 },
  { us: 5, uk: 3, eu: 36, cm: 22 },
  { us: 5.5, uk: 3.5, eu: 36.5, cm: 22.4 },
  { us: 6, uk: 4, eu: 37, cm: 22.9 },
  { us: 6.5, uk: 4.5, eu: 37.5, cm: 23.3 },
  { us: 7, uk: 5, eu: 38, cm: 23.7 },
  { us: 7.5, uk: 5.5, eu: 38.5, cm: 24.1 },
  { us: 8, uk: 6, eu: 39, cm: 24.6 },
  { us: 8.5, uk: 6.5, eu: 39.5, cm: 25 },
  { us: 9, uk: 7, eu: 40, cm: 25.4 },
  { us: 9.5, uk: 7.5, eu: 40.5, cm: 25.8 },
  { us: 10, uk: 8, eu: 41, cm: 26.2 },
  { us: 10.5, uk: 8.5, eu: 41.5, cm: 26.7 },
  { us: 11, uk: 9, eu: 42, cm: 27.1 },
];

type System = "us" | "uk" | "eu" | "cm";

/** Find the closest table row for a size value. Returns null if out of range. */
export function findRow(rows: Row[], system: System, value: number): Row | null {
  if (!isFinite(value) || value <= 0) return null;
  const exact = rows.find((r) => Math.abs(r[system] - value) < 0.01);
  if (exact) return exact;
  let best: Row | null = null;
  let bestDist = Infinity;
  for (const r of rows) {
    const d = Math.abs(r[system] - value);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }
  // too far away from the table (more than 1.5 sizes): treat as out of range
  return bestDist <= 1.5 ? best : null;
}

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export default function ShoeSizeConverterClient() {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [system, setSystem] = useState<System>("us");
  const [value, setValue] = useState("9");

  const rows = gender === "men" ? MEN : WOMEN;
  const match = findRow(rows, system, parseFloat(value));

  const systems: { id: System; label: string }[] = [
    { id: "us", label: "🇺🇸 US" },
    { id: "uk", label: "🇬🇧 UK" },
    { id: "eu", label: "🇪🇺 EU" },
    { id: "cm", label: "📏 CM" },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setGender("men")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            gender === "men" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          👟 MEN
        </button>
        <button
          type="button"
          onClick={() => setGender("women")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            gender === "women" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          👠 WOMEN
        </button>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">I KNOW MY SIZE IN…</div>
        <div className="flex gap-2 flex-wrap">
          {systems.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSystem(s.id)}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                system === s.id ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ss-value" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          SIZE {system.toUpperCase()}
        </label>
        <input
          id="ss-value"
          type="number"
          min="0"
          step="0.5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={system === "cm" ? "e.g. 25.4" : "e.g. 9"}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {systems.map((s) => (
          <div
            key={s.id}
            className={`bg-paper border rounded-lg px-3 py-4 flex flex-col items-center gap-1 ${
              s.id === system ? "border-accent" : "border-ink/10"
            }`}
          >
            <span className="font-mono text-[10px] tracking-widest text-ink/50">{s.label}</span>
            <span className="font-display text-2xl font-bold text-deep">
              {match ? fmt(match[s.id]) : "—"}
            </span>
          </div>
        ))}
      </div>

      {!match && (
        <p className="text-sm text-ink/60 bg-paper border border-ink/10 rounded-lg px-4 py-3">
          No matching size found — check the table below or try a value closer to the range.
        </p>
      )}

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          REFERENCE TABLE — {gender === "men" ? "MEN" : "WOMEN"}
        </div>
        <div className="overflow-x-auto border border-ink/10 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper font-mono text-[10px] tracking-widest text-ink/50">
                <th className="px-3 py-2 text-left">US</th>
                <th className="px-3 py-2 text-left">UK</th>
                <th className="px-3 py-2 text-left">EU</th>
                <th className="px-3 py-2 text-left">CM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.us}
                  className={`border-t border-ink/5 font-mono text-xs ${
                    match === r ? "bg-accent/10 text-accent font-bold" : "text-ink/70"
                  }`}
                >
                  <td className="px-3 py-1.5">{fmt(r.us)}</td>
                  <td className="px-3 py-1.5">{fmt(r.uk)}</td>
                  <td className="px-3 py-1.5">{fmt(r.eu)}</td>
                  <td className="px-3 py-1.5">{fmt(r.cm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink/50 mt-2">
          Sizes vary slightly by brand — always try shoes on or measure your foot in centimeters (heel to longest toe).
        </p>
      </div>
    </div>
  );
}
