"use client";

import { useState } from "react";

// ---- Sound engine ----
class Sound {
  private ctx: AudioContext | null = null;
  enabled = true;
  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.1, slideTo?: number) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  reveal() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => this.tone(f, 0.15, "triangle", 0.1, undefined));
  }
}
const sound = new Sound();

const MESSAGES = [
  "Destined to be together!",
  "A match made in heaven!",
  "Great chemistry — go for it!",
  "A strong connection, but keep talking.",
  "Promising! Give it time.",
  "It's complicated — but worth trying.",
  "A bumpy road ahead, but love wins.",
  "Compatible at heart.",
  "Opposites attract — and you two are proof.",
  "Meant to be friends... or more?",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

export default function LoveCalculatorClient() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<{ pct: number; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const calculate = () => {
    const a = name1.trim().toLowerCase();
    const b = name2.trim().toLowerCase();
    if (!a || !b) return;
    setBusy(true);
    setResult(null);
    // deterministic pseudo-random from the names + "love" factor
    const h = (hashName(a) ^ hashName(b) ^ hashName("love")) % 101;
    // slight variation so re-rolls differ
    const pct = Math.abs(h + Math.floor(Math.random() * 7) - 3) % 101;
    setTimeout(() => {
      setResult({ pct, msg: MESSAGES[Math.floor(pct / 10) % MESSAGES.length] });
      setBusy(false);
      sound.reveal();
    }, 900);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="love-name1" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            YOUR NAME
          </label>
          <input
            id="love-name1"
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="e.g. Ana"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="love-name2" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            THEIR NAME
          </label>
          <input
            id="love-name2"
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="e.g. Bruno"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <button
          type="button"
          onClick={calculate}
          disabled={busy || !name1.trim() || !name2.trim()}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
        >
          {busy ? "CALCULATING…" : "CALCULATE LOVE"}
        </button>
        <button
          type="button"
          onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
          className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
            soundOn ? "bg-accent/10 border border-accent/30 text-accent" : "bg-paper text-ink/60 border border-ink/15"
          }`}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      {result && (
        <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-3">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            {name1.trim().toUpperCase()} ❤ {name2.trim().toUpperCase()}
          </span>
          <span className="font-display text-6xl font-bold text-accent">
            {result.pct}%
          </span>
          <span className="font-mono text-sm text-paper/80 text-center">
            {result.msg}
          </span>
          <div className="w-full max-w-[300px] h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-accent rounded-full transition-all duration-700"
              style={{ width: `${result.pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> For fun only! The result
        is a playful calculation based on the names — not real matchmaking.
      </div>
    </div>
  );
}
