"use client";

import { useState } from "react";

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** Simplify a WxH pair to "16:9" (or "1:1"). Returns null if invalid. */
export function simplifyRatio(w: number, h: number): string | null {
  if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return null;
  const g = gcd(w, h);
  return `${Math.round(w / g)}:${Math.round(h / g)}`;
}

/** Find the missing dimension. Returns null if invalid. */
export function missingDimension(
  rw: number,
  rh: number,
  known: number,
  knownIs: "w" | "h"
): number | null {
  if (!isFinite(rw) || !isFinite(rh) || rw <= 0 || rh <= 0) return null;
  if (!isFinite(known) || known <= 0) return null;
  if (knownIs === "w") return (known * rh) / rw;
  return (known * rw) / rh;
}

const PRESETS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "16:10", w: 16, h: 10 },
  { label: "4:3", w: 4, h: 3 },
  { label: "3:2", w: 3, h: 2 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
];

export default function AspectRatioCalculatorClient() {
  const [mode, setMode] = useState<"simplify" | "missing">("simplify");
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [rw, setRw] = useState("16");
  const [rh, setRh] = useState("9");
  const [known, setKnown] = useState("1280");
  const [knownIs, setKnownIs] = useState<"w" | "h">("w");

  const ratio = simplifyRatio(parseFloat(w), parseFloat(h));
  const decimal = ratio && isFinite(parseFloat(w)) && isFinite(parseFloat(h))
    ? (parseFloat(w) / parseFloat(h)).toFixed(2) + ":1"
    : null;
  const missing = missingDimension(
    parseFloat(rw),
    parseFloat(rh),
    parseFloat(known),
    knownIs
  );
  const missingDisplay = missing
    ? knownIs === "w"
      ? `${Math.round(missing)} × ${known}px (${rw}:${rh})`
      : `${known} × ${Math.round(missing)}px (${rw}:${rh})`
    : null;

  const inputCls =
    "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Mode */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setMode("simplify")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "simplify" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          📐 SIMPLIFY RATIO
        </button>
        <button
          type="button"
          onClick={() => setMode("missing")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "missing" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🔍 FIND MISSING SIDE
        </button>
      </div>

      {mode === "simplify" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ar-w" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                WIDTH (px)
              </label>
              <input
                id="ar-w"
                type="number"
                min="1"
                value={w}
                onChange={(e) => setW(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ar-h" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                HEIGHT (px)
              </label>
              <input
                id="ar-h"
                type="number"
                min="1"
                value={h}
                onChange={(e) => setH(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setW(String(p.w * 120));
                  setH(String(p.h * 120));
                }}
                className="font-mono text-xs px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col items-center gap-1">
            <span className="font-mono text-xs tracking-widest text-ink/60">ASPECT RATIO</span>
            <span className="font-display text-4xl font-bold text-deep">
              {ratio ?? "—"}
            </span>
            <span className="font-mono text-sm text-accent">{decimal ?? "—"}</span>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="ar-rw" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                RATIO W
              </label>
              <input
                id="ar-rw"
                type="number"
                min="1"
                value={rw}
                onChange={(e) => setRw(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ar-rh" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                RATIO H
              </label>
              <input
                id="ar-rh"
                type="number"
                min="1"
                value={rh}
                onChange={(e) => setRh(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ar-known" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                {knownIs === "w" ? "WIDTH (px)" : "HEIGHT (px)"}
              </label>
              <input
                id="ar-known"
                type="number"
                min="1"
                value={known}
                onChange={(e) => setKnown(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setKnownIs("w")}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                knownIs === "w" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              I KNOW WIDTH
            </button>
            <button
              type="button"
              onClick={() => setKnownIs("h")}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                knownIs === "h" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              I KNOW HEIGHT
            </button>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setRw(String(p.w)); setRh(String(p.h)); }}
                className="font-mono text-xs px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col items-center gap-1">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              MISSING {knownIs === "w" ? "HEIGHT" : "WIDTH"}
            </span>
            <span className="font-display text-3xl font-bold text-deep">
              {missing ? (knownIs === "w" ? Math.round(missing) : Math.round(missing)) : "—"}
            </span>
            <span className="font-mono text-sm text-accent">{missingDisplay ?? ""}</span>
          </div>
        </>
      )}
    </div>
  );
}
