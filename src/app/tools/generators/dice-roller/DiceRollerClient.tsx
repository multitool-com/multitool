"use client";

import { useRef, useState } from "react";

export function rollDice(count: number, sides: number): number[] {
  const c = Math.max(1, Math.min(10, Math.floor(count) || 1));
  const s = Math.max(2, Math.min(1000, Math.floor(sides) || 6));
  return Array.from({ length: c }, () => 1 + Math.floor(Math.random() * s));
}

const DICE = [
  { sides: 4, label: "d4" },
  { sides: 6, label: "d6" },
  { sides: 8, label: "d8" },
  { sides: 10, label: "d10" },
  { sides: 12, label: "d12" },
  { sides: 20, label: "d20" },
];

export default function DiceRollerClient() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState("2");
  const [faces, setFaces] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<{ label: string; faces: number[] }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    const c = parseInt(count, 10) || 1;
    const intermediate = 6;
    let step = 0;
    const tick = () => {
      step++;
      setFaces(rollDice(c, sides));
      if (step < intermediate) {
        timer.current = setTimeout(tick, 80 + step * 40);
      } else {
        const final = rollDice(c, sides);
        setFaces(final);
        setHistory((h) => [{ label: `${c}${DICE.find((d) => d.sides === sides)?.label ?? `d${sides}`}`, faces: final }, ...h].slice(0, 12));
        setRolling(false);
      }
    };
    timer.current = setTimeout(tick, 60);
  };

  const total = faces.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        {DICE.map((d) => (
          <button key={d.sides} type="button" onClick={() => setSides(d.sides)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${sides === d.sides ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{d.label}</button>
        ))}
      </div>

      <div className="flex items-end gap-3 justify-center">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HOW MANY (1–10)</label>
          <input type="number" min="1" max="10" value={count} onChange={(e) => setCount(e.target.value)} className="w-24 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <button type="button" onClick={roll} disabled={rolling} className="bg-deep text-paper font-mono text-xs tracking-widest px-8 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors">{rolling ? "ROLLING…" : "🎲 ROLL"}</button>
      </div>

      {faces.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 flex-wrap justify-center">
            {faces.map((f, i) => (
              <span key={i} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-display text-2xl font-bold ${rolling ? "bg-accent/20 text-accent" : "bg-deep text-paper"}`}>{f}</span>
            ))}
          </div>
          <span className="font-mono text-xs text-ink/50">TOTAL: <strong className="text-ink">{total}</strong></span>
        </div>
      )}

      {history.length > 0 && (
        <div className="border-t border-ink/10 pt-3">
          <div className="font-mono text-[10px] tracking-widest text-ink/50 mb-2">HISTORY</div>
          <div className="flex flex-col gap-1">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono text-ink/60">
                <span>{h.label}</span>
                <span>[{h.faces.join(", ")}] = <strong className="text-ink">{h.faces.reduce((a, b) => a + b, 0)}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
