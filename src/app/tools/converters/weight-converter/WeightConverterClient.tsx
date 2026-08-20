"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed } from "@/lib/analytics";

const UNITS: { id: string; label: string; factor: number }[] = [
  { id: "mg", label: "Milligrams (mg)", factor: 0.000001 },
  { id: "g", label: "Grams (g)", factor: 0.001 },
  { id: "kg", label: "Kilograms (kg)", factor: 1 },
  { id: "t", label: "Metric tonnes (t)", factor: 1000 },
  { id: "oz", label: "Ounces (oz)", factor: 0.028349523125 },
  { id: "lb", label: "Pounds (lb)", factor: 0.45359237 },
  { id: "st", label: "Stones (st)", factor: 6.35029318 },
  { id: "uston", label: "US tons (short)", factor: 907.18474 },
  { id: "ukton", label: "UK tons (long)", factor: 1016.0469088 },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n !== 0 && (Math.abs(n) < 0.001 || Math.abs(n) >= 1e9)) {
    return n.toExponential(4);
  }
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function WeightConverterClient() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("kg");
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (value !== "" && !isNaN(Number(value))) {
      firedRef.current = true;
      trackToolUsed("weight-converter", "converters");
    }
  }, [value]);

  const num = value !== "" && !isNaN(Number(value)) ? Number(value) : null;
  const kg = num !== null ? num * (UNITS.find((u) => u.id === from)?.factor ?? 1) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <div className="flex items-end gap-3 flex-wrap">
          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            VALUE
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="70"
              className="w-32 border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            FROM UNIT
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
          {num !== null && (
            <span className="font-mono text-xs text-ink/40 pb-3">
              = {fmt(num)} {from} converted to every unit:
            </span>
          )}
        </div>
      </div>

      <div className="bg-deep rounded-xl overflow-hidden">
        <div className="px-6 pt-5 pb-2 font-mono text-xs text-paper/50 tracking-widest">
          ALL UNITS {kg === null ? "— TYPE A VALUE ABOVE" : ""}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((u) => (
            <div
              key={u.id}
              className={`px-6 py-4 border-t border-white/10 ${u.id === from ? "bg-accent/10" : ""}`}
            >
              <p className="font-mono text-[10px] tracking-widest text-paper/40 mb-1">
                {u.label.toUpperCase()}
                {u.id === from ? " · SOURCE" : ""}
              </p>
              <p className={`font-mono text-2xl ${u.id === from ? "text-accent" : "text-paper"}`}>
                {kg === null ? "—" : fmt(kg / u.factor)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Instant, exact conversions — everything runs in your browser.
      </p>
    </div>
  );
}
