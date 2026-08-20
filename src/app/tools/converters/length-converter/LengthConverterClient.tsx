"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed } from "@/lib/analytics";

const UNITS: { id: string; label: string; factor: number }[] = [
  { id: "mm", label: "Millimeters (mm)", factor: 0.001 },
  { id: "cm", label: "Centimeters (cm)", factor: 0.01 },
  { id: "m", label: "Meters (m)", factor: 1 },
  { id: "km", label: "Kilometers (km)", factor: 1000 },
  { id: "in", label: "Inches (in)", factor: 0.0254 },
  { id: "ft", label: "Feet (ft)", factor: 0.3048 },
  { id: "yd", label: "Yards (yd)", factor: 0.9144 },
  { id: "mi", label: "Miles (mi)", factor: 1609.344 },
  { id: "nmi", label: "Nautical miles (nmi)", factor: 1852 },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n !== 0 && (Math.abs(n) < 0.001 || Math.abs(n) >= 1e9)) {
    return n.toExponential(4);
  }
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function LengthConverterClient() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("cm");
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (value !== "" && !isNaN(Number(value))) {
      firedRef.current = true;
      trackToolUsed("length-converter", "converters");
    }
  }, [value]);

  const num = value !== "" && !isNaN(Number(value)) ? Number(value) : null;
  const meters = num !== null ? num * (UNITS.find((u) => u.id === from)?.factor ?? 1) : null;

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
              placeholder="100"
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
          ALL UNITS {meters === null ? "— TYPE A VALUE ABOVE" : ""}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((u, i) => (
            <div
              key={u.id}
              className={`px-6 py-4 border-t border-white/10 ${i % 2 ? "" : ""} ${
                u.id === from ? "bg-accent/10" : ""
              }`}
            >
              <p className="font-mono text-[10px] tracking-widest text-paper/40 mb-1">
                {u.label.toUpperCase()}
                {u.id === from ? " · SOURCE" : ""}
              </p>
              <p className={`font-mono text-2xl ${u.id === from ? "text-accent" : "text-paper"}`}>
                {meters === null ? "—" : fmt(meters / u.factor)}
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
