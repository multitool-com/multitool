"use client";

import { useState } from "react";

export function hexToHsl(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to2 = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

export type PaletteType = "mono" | "complementary" | "analogous" | "triadic" | "tetradic";

export function buildPalette(baseHex: string, type: PaletteType): string[] {
  const [h, s, l] = hexToHsl(baseHex);
  const keep = [h, s, l];
  const shifts: Record<PaletteType, number[]> = {
    mono: [0, 0, 0], // varied lightness
    complementary: [180],
    analogous: [-30, 30],
    triadic: [120, 240],
    tetradic: [90, 180, 270],
  };
  if (type === "mono") {
    const ls = [0.35, 0.5, 0.62, 0.75, 0.85];
    return ls.map((ll) => hslToHex(h, Math.min(1, s + 0.1), ll));
  }
  const angles = shifts[type];
  const base = hslToHex(h, s, l);
  const others = angles.map((a) => hslToHex(h + a, s, l));
  return [base, ...others].slice(0, 5);
}

export default function ColorPaletteClient() {
  const [base, setBase] = useState("#6366F1");
  const [type, setType] = useState<PaletteType>("analogous");
  const [copied, setCopied] = useState<string | null>(null);

  const colors = buildPalette(base, type);
  const copy = async (c: string) => {
    try { await navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(null), 1200); } catch { /* noop */ }
  };

  const pill = (t: PaletteType) => `font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${type === t ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">BASE COLOR</label>
          <div className="flex items-center gap-2">
            <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-10 rounded-lg border border-ink/15 cursor-pointer bg-transparent" />
            <input type="text" value={base} onChange={(e) => setBase(e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm w-28 focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-auto">
          <div className="font-mono text-xs tracking-widest text-ink/60">PALETTE TYPE</div>
          <div className="flex gap-2 flex-wrap">
            {(["mono", "complementary", "analogous", "triadic", "tetradic"] as PaletteType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={pill(t)}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {colors.map((c, i) => (
          <button key={i} type="button" onClick={() => copy(c)} className="group rounded-xl overflow-hidden border border-ink/10 focus:outline-none focus:ring-2 focus:ring-accent">
            <div className="h-24 sm:h-28 transition-transform group-hover:scale-105" style={{ background: c }} />
            <div className="bg-paper px-3 py-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-ink/70">{c}</span>
              <span className="font-mono text-[9px] text-ink/40">{copied === c ? "✓" : "COPY"}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-ink/50">
        {type === "mono" ? "Five shades of the same hue." : type === "complementary" ? "Base + its exact opposite on the wheel." : type === "analogous" ? "Neighbors on the color wheel — harmonious." : type === "triadic" ? "Three evenly spaced colors." : "Four evenly spaced colors."} Click any swatch to copy its hex.
      </p>
    </div>
  );
}
