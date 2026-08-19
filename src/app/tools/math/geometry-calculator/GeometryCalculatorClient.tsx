"use client";

import { useState } from "react";

export type Shape = "square" | "rectangle" | "triangle" | "circle" | "trapezoid";

export function shapeArea(shape: Shape, v: number[]): number | null {
  if (v.some((x) => !isFinite(x) || x <= 0)) return null;
  switch (shape) {
    case "square": return v[0] ** 2;
    case "rectangle": return v[0] * v[1];
    case "triangle": return (v[0] * v[1]) / 2;
    case "circle": return Math.PI * v[0] ** 2;
    case "trapezoid": return ((v[0] + v[1]) / 2) * v[2];
    default: return null;
  }
}

export function shapePerimeter(shape: Shape, v: number[]): number | null {
  if (v.some((x) => !isFinite(x) || x <= 0)) return null;
  switch (shape) {
    case "square": return 4 * v[0];
    case "rectangle": return 2 * (v[0] + v[1]);
    case "triangle": return v[0] + v[1] + v[2];
    case "circle": return 2 * Math.PI * v[0];
    case "trapezoid": return v[0] + v[1] + v[3] + v[4];
    default: return null;
  }
}

const SHAPES: { id: Shape; label: string; icon: string; fields: { key: string; label: string }[] }[] = [
  { id: "square", label: "Square", icon: "⬛", fields: [{ key: "s", label: "Side" }] },
  { id: "rectangle", label: "Rectangle", icon: "▭", fields: [{ key: "w", label: "Width" }, { key: "h", label: "Height" }] },
  { id: "triangle", label: "Triangle", icon: "△", fields: [{ key: "b", label: "Base" }, { key: "h", label: "Height" }, { key: "s1", label: "Side 1" }, { key: "s2", label: "Side 2" }] },
  { id: "circle", label: "Circle", icon: "○", fields: [{ key: "r", label: "Radius" }] },
  { id: "trapezoid", label: "Trapezoid", icon: "⏢", fields: [{ key: "b1", label: "Base 1" }, { key: "b2", label: "Base 2" }, { key: "h", label: "Height" }, { key: "s1", label: "Side 1" }, { key: "s2", label: "Side 2" }] },
];

export default function GeometryCalculatorClient() {
  const [shape, setShape] = useState<Shape>("square");
  const [vals, setVals] = useState<Record<string, string>>({ s: "5", w: "6", h: "4", b: "8", r: "3", b1: "8", b2: "5", s1: "4", s2: "4" });

  const info = SHAPES.find((s) => s.id === shape)!;
  const v = info.fields.map((f) => parseFloat(vals[f.key] ?? ""));
  const area = shapeArea(shape, v);
  const per = shapePerimeter(shape, v);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        {SHAPES.map((s) => (
          <button key={s.id} type="button" onClick={() => setShape(s.id)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${shape === s.id ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
            {s.icon} {s.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {info.fields.map((f) => (
          <div key={f.key}>
            <label className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">{f.label.toUpperCase()}</label>
            <input type="number" min="0" value={vals[f.key] ?? ""} onChange={(e) => setVals((m) => ({ ...m, [f.key]: e.target.value }))} className="w-full border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-deep rounded-xl px-4 py-5 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">AREA</span>
          <span className="font-display text-3xl font-bold text-accent">{area !== null ? area.toFixed(2) : "—"}</span>
          <span className="font-mono text-[10px] text-paper/60">units²</span>
        </div>
        <div className="bg-paper border border-ink/10 rounded-xl px-4 py-5 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">PERIMETER</span>
          <span className="font-display text-3xl font-bold text-deep">{per !== null ? per.toFixed(2) : "—"}</span>
          <span className="font-mono text-[10px] text-ink/50">units</span>
        </div>
      </div>
    </div>
  );
}
