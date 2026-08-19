"use client";

import { useRef, useState } from "react";

const SEG_COLORS = [
  "#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6",
  "#06B6D4", "#F97316", "#84CC16", "#EC4899", "#14B8A6",
  "#A855F7", "#EAB308", "#3B82F6", "#F43F5E", "#22C55E",
];

export function pickWinner(names: string[]): number {
  if (names.length === 0) return -1;
  return Math.floor(Math.random() * names.length);
}

export default function WheelSpinnerClient() {
  const [names, setNames] = useState("Pizza\nSushi\nBurger\nSalad\nTacos");
  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const list = names.split("\n").map((s) => s.trim()).filter(Boolean);

  const spin = () => {
    if (spinning || list.length === 0) return;
    setSpinning(true);
    setWinner(null);
    const idx = pickWinner(list);
    // each segment is 360/len deg; rotate so the winner sits under the pointer (top, -90deg)
    const seg = 360 / list.length;
    const target = 360 * 5 + (360 - idx * seg - seg / 2);
    setRotation((r) => r + target - (r % 360));
    setTimeout(() => {
      setWinner(list[idx]);
      setSpinning(false);
    }, 3200);
  };

  const segColors = list.map((_, i) => SEG_COLORS[i % SEG_COLORS.length]);
  const gradient = `conic-gradient(${segColors.map((c, i) => {
    const from = (i * 360) / list.length;
    const to = ((i + 1) * 360) / list.length;
    return `${c} ${from}deg ${to}deg`;
  }).join(", ")})`;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <label htmlFor="ws-names" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">OPTIONS (ONE PER LINE)</label>
          <textarea id="ws-names" value={names} onChange={(e) => setNames(e.target.value)} rows={8} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
          <button type="button" onClick={spin} disabled={spinning || list.length === 0} className="mt-3 w-full bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors">
            {spinning ? "SPINNING…" : `🎡 SPIN (${list.length} options)`}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            {/* pointer */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-accent" />
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-8 border-deep shadow-lg transition-transform duration-[3200ms] ease-[cubic-bezier(0.12,0.8,0.15,1)]"
              style={{ background: gradient, transform: `rotate(${rotation}deg)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-deep border-4 border-paper flex items-center justify-center font-display text-xl font-bold text-paper">
                🎯
              </div>
            </div>
          </div>
          {winner && (
            <div className="bg-deep rounded-xl px-6 py-3 text-center">
              <span className="font-mono text-[10px] tracking-widest text-paper/60 block">WINNER</span>
              <span className="font-display text-2xl font-bold text-accent">{winner}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
