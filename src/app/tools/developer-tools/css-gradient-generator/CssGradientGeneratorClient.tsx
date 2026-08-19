"use client";

import { useState } from "react";

type GType = "linear" | "radial";

export function buildGradientCss(
  type: GType,
  angle: number,
  c1: string,
  c2: string
): string {
  if (type === "radial") {
    return `background: radial-gradient(circle at center, ${c1} 0%, ${c2} 100%);`;
  }
  return `background: linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%);`;
}

const PRESETS: { name: string; c1: string; c2: string }[] = [
  { name: "Sunset", c1: "#ff9966", c2: "#ff5e62" },
  { name: "Ocean", c1: "#2193b0", c2: "#6dd5ed" },
  { name: "Mint", c1: "#c2e9fb", c2: "#a1c4fd" },
  { name: "Night", c1: "#0f0c29", c2: "#302b63" },
  { name: "Fire", c1: "#f12711", c2: "#f5af19" },
  { name: "Aurora", c1: "#00c6ff", c2: "#0072ff" },
  { name: "Candy", c1: "#ff9a9e", c2: "#fad0c4" },
  { name: "Lime", c1: "#a8ff78", c2: "#78ffd6" },
];

export default function CssGradientGeneratorClient() {
  const [type, setType] = useState<GType>("linear");
  const [angle, setAngle] = useState(45);
  const [c1, setC1] = useState("#ff9966");
  const [c2, setC2] = useState("#ff5e62");
  const [copied, setCopied] = useState(false);

  const css = buildGradientCss(type, angle, c1, c2);
  const previewStyle = type === "radial"
    ? { background: `radial-gradient(circle at center, ${c1} 0%, ${c2} 100%)` }
    : { background: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)` };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const randomize = () => {
    const hue = () =>
      `hsl(${Math.floor(Math.random() * 360)}, ${70 + Math.floor(Math.random() * 25)}%, ${45 + Math.floor(Math.random() * 30)}%)`;
    const toHex = (hsl: string) => {
      const c = document.createElement("canvas").getContext("2d");
      if (!c) return "#888888";
      c.fillStyle = hsl;
      return c.fillStyle;
    };
    setC1(toHex(hue()));
    setC2(toHex(hue()));
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Preview */}
      <div
        className="h-44 rounded-xl border border-ink/10 transition-all"
        style={previewStyle}
      />

      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setType("linear")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            type === "linear" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          ↘ LINEAR
        </button>
        <button
          type="button"
          onClick={() => setType("radial")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            type === "radial" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          ◎ RADIAL
        </button>
        <button
          type="button"
          onClick={randomize}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
        >
          🎲 RANDOM
        </button>
      </div>

      {type === "linear" && (
        <div>
          <label htmlFor="grad-angle" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            ANGLE: {angle}°
          </label>
          <input
            id="grad-angle"
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value, 10))}
            className="w-full accent-accent"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="grad-c1" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            COLOR 1
          </label>
          <div className="flex items-center gap-2">
            <input
              id="grad-c1"
              type="color"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              className="w-12 h-10 rounded-lg border border-ink/15 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
        <div>
          <label htmlFor="grad-c2" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            COLOR 2
          </label>
          <div className="flex items-center gap-2">
            <input
              id="grad-c2"
              type="color"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              className="w-12 h-10 rounded-lg border border-ink/15 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => { setC1(p.c1); setC2(p.c2); }}
            className="font-mono text-xs px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">CSS CODE</div>
        <div className="relative">
          <textarea
            readOnly
            value={css}
            rows={2}
            className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-none"
          />
          <button
            type="button"
            onClick={() => copy(css)}
            className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "📋 COPY"}
          </button>
        </div>
      </div>
    </div>
  );
}
