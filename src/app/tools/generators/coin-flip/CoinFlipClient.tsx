"use client";

import { useRef, useState } from "react";

type Mode = "coin" | "yesno" | "ball";

const BALL_ANSWERS = [
  "It is certain.", "It is decidedly so.", "Without a doubt.",
  "Yes — definitely.", "You may rely on it.", "As I see it, yes.",
  "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
  "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
  "Cannot predict now.", "Concentrate and ask again.",
  "Don't count on it.", "My reply is no.", "My sources say no.",
  "Outlook not so good.", "Very doubtful.",
];

// ---- Sound ----
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
  flip() { this.tone(400, 0.08, "triangle", 0.08, 600); }
  reveal() { this.tone(600, 0.12, "triangle", 0.12, 900); }
}
const sound = new Sound();

export default function CoinFlipClient() {
  const [mode, setMode] = useState<Mode>("coin");
  const [result, setResult] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [flips, setFlips] = useState({ heads: 0, tails: 0 });
  const spinning = useRef(false);

  const flipCoin = () => {
    if (spinning.current) return;
    spinning.current = true;
    setBusy(true);
    setResult(null);
    sound.flip();
    setTimeout(() => {
      const heads = Math.random() < 0.5;
      const label = heads ? "HEADS" : "TAILS";
      setResult(heads ? "🪙 HEADS" : "🪙 TAILS");
      setFlips((f) => (heads ? { ...f, heads: f.heads + 1 } : { ...f, tails: f.tails + 1 }));
      setHistory((h) => [label, ...h].slice(0, 12));
      setBusy(false);
      spinning.current = false;
      sound.reveal();
    }, 600);
  };

  const answerYesNo = () => {
    if (spinning.current) return;
    spinning.current = true;
    setBusy(true);
    setResult(null);
    sound.flip();
    setTimeout(() => {
      const r = Math.random();
      const label = r < 0.5 ? "YES" : "NO";
      setResult(r < 0.5 ? "✅ YES" : "❌ NO");
      setHistory((h) => [label, ...h].slice(0, 12));
      setBusy(false);
      spinning.current = false;
      sound.reveal();
    }, 600);
  };

  const askBall = () => {
    if (spinning.current) return;
    if (!question.trim()) return;
    spinning.current = true;
    setBusy(true);
    setResult(null);
    sound.flip();
    setTimeout(() => {
      const ans = BALL_ANSWERS[Math.floor(Math.random() * BALL_ANSWERS.length)];
      setResult(`🔮 ${ans}`);
      setHistory((h) => [ans, ...h].slice(0, 12));
      setBusy(false);
      spinning.current = false;
      sound.reveal();
    }, 900);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Mode */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => { setMode("coin"); setResult(null); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "coin" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🪙 COIN FLIP
        </button>
        <button
          type="button"
          onClick={() => { setMode("yesno"); setResult(null); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "yesno" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          ✅ YES / NO
        </button>
        <button
          type="button"
          onClick={() => { setMode("ball"); setResult(null); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "ball" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🔮 MAGIC 8-BALL
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

      {/* Question (8-ball) */}
      {mode === "ball" && (
        <div>
          <label htmlFor="ball-question" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            YOUR QUESTION
          </label>
          <input
            id="ball-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") askBall(); }}
            placeholder="Ask anything…"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={() => { if (mode === "coin") flipCoin(); else if (mode === "yesno") answerYesNo(); else askBall(); }}
        disabled={busy || (mode === "ball" && !question.trim())}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        {busy
          ? mode === "coin"
            ? "FLIPPING…"
            : mode === "yesno"
            ? "THINKING…"
            : "SHAKING…"
          : mode === "coin"
          ? "FLIP COIN"
          : mode === "yesno"
          ? "ASK THE ORACLE"
          : "ASK"}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-deep rounded-xl px-6 py-8 flex items-center justify-center">
          <span className="font-display text-4xl sm:text-5xl font-bold text-accent text-center">
            {result}
          </span>
        </div>
      )}

      {/* Coin stats */}
      {mode === "coin" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-center">
            <span className="font-mono text-[10px] tracking-widest text-ink/50 block">HEADS</span>
            <span className="font-mono text-2xl font-bold text-ink">{flips.heads}</span>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-center">
            <span className="font-mono text-[10px] tracking-widest text-ink/50 block">TAILS</span>
            <span className="font-mono text-2xl font-bold text-ink">{flips.tails}</span>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest text-ink/60">RECENT</span>
          <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
            {history.slice(0, 6).map((h, i) => (
              <div key={i} className="px-4 py-2 font-mono text-xs text-ink/70">
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> For fun and quick
        decisions. Coin flips use a true random generator — the result is
        as fair as a real coin.
      </div>
    </div>
  );
}
