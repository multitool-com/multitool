"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PADS = [
  { id: 0, color: "#ef4444", glow: "#f87171", freq: 330 },
  { id: 1, color: "#22c55e", glow: "#4ade80", freq: 392 },
  { id: 2, color: "#3b82f6", glow: "#60a5fa", freq: 494 },
  { id: 3, color: "#eab308", glow: "#facc15", freq: 587 },
] as const;

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
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.16) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  pad(freq: number) { this.tone(freq, 0.22, "triangle", 0.18); }
  wrong() { this.tone(180, 0.3, "sawtooth", 0.14); this.tone(120, 0.4, "sawtooth", 0.1, ); }
  levelUp() { const n = [523, 659, 784]; n.forEach((f, i) => this.tone(f, 0.13, "triangle", 0.12)); }
}
const sound = new Sound();

export default function SequenceMemoryClient() {
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(0);
  const [seq, setSeq] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "watch" | "input" | "over">("idle");
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);

  const inputIdx = useRef(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seqRef = useRef<number[]>([]);

  useEffect(() => {
    let lv = 1;
    try {
      const saved = Number(sessionStorage.getItem("multitool-seq-level") ?? 1);
      if (!Number.isNaN(saved) && saved >= 1) lv = saved;
      const savedBest = Number(sessionStorage.getItem("multitool-seq-best") ?? 0);
      if (!Number.isNaN(savedBest)) setBest(savedBest);
    } catch { /* ignore */ }
    setReady(true);
    setLevel(lv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const flash = (pad: number, dur = 400) => {
    setLit(pad);
    sound.pad(PADS[pad].freq);
    timeouts.current.push(setTimeout(() => setLit(null), dur));
  };

  // ---- play the ACCUMULATED sequence (like the original game) ----
  const playSequence = useCallback((sequence: number[]) => {
    setPhase("watch");
    clearTimeouts();
    sequence.forEach((pad, i) => {
      timeouts.current.push(
        setTimeout(() => {
          flash(pad);
          if (i === sequence.length - 1) {
            timeouts.current.push(
              setTimeout(() => {
                setPhase("input");
                inputIdx.current = 0;
              }, 550)
            );
          }
        }, 750 * i + 450)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- advance: append ONE new random pad to the existing sequence ----
  const advance = useCallback(
    (lv: number) => {
      const current = seqRef.current;
      // the sequence grows by one each level — keep the same prefix
      const newSeq = [...current, Math.floor(Math.random() * 4)];
      seqRef.current = newSeq;
      setSeq(newSeq);
      try { sessionStorage.setItem("multitool-seq-level", String(lv)); } catch { /* ignore */ }
      playSequence(newSeq);
    },
    [playSequence]
  );

  // start fresh
  const startGame = useCallback(() => {
    seqRef.current = [];
    setLevel(1);
    try { sessionStorage.setItem("multitool-seq-level", "1"); } catch { /* ignore */ }
    const t = setTimeout(() => advance(1), 500);
    timeouts.current.push(t);
  }, [advance]);

  // auto-start
  useEffect(() => {
    if (ready && phase === "idle") {
      // resume at saved level? we rebuild the sequence from scratch but
      // keep the saved level number (simpler + fair)
      const t = setTimeout(() => {
        if (level > 1) {
          // rebuild a sequence of `level` random pads (session continuation)
          const rebuilt = Array.from({ length: level }, () => Math.floor(Math.random() * 4));
          seqRef.current = rebuilt;
          setSeq(rebuilt);
          playSequence(rebuilt);
        } else {
          advance(1);
        }
      }, 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, phase]);

  const tap = (pad: number) => {
    if (phase !== "input") return;
    flash(pad, 220);
    const s = seqRef.current;
    if (pad !== s[inputIdx.current]) {
      sound.wrong();
      clearTimeouts();
      setPhase("over");
      setBest((prev) => {
        const nb = Math.max(prev, level - 1);
        try { sessionStorage.setItem("multitool-seq-best", String(nb)); } catch { /* ignore */ }
        return nb;
      });
      return;
    }
    inputIdx.current += 1;
    if (inputIdx.current === s.length) {
      sound.levelUp();
      clearTimeouts();
      const nextLv = level + 1;
      setLevel(nextLv);
      timeouts.current.push(setTimeout(() => advance(nextLv), 750));
    }
  };

  const phaseLabel =
    phase === "watch"
      ? "WATCH…"
      : phase === "input"
      ? "YOUR TURN"
      : phase === "over"
      ? "GAME OVER"
      : "GET READY…";

  // pad style: arcade round neon buttons
  const padStyle = (id: number): React.CSSProperties => {
    const p = PADS[id];
    const isLit = lit === id;
    return {
      background: isLit
        ? `radial-gradient(circle at 35% 30%, #ffffff, ${p.glow} 60%, ${p.color})`
        : `radial-gradient(circle at 35% 30%, ${p.color}, ${p.color} 70%, rgba(0,0,0,0.4))`,
      boxShadow: isLit
        ? `0 0 40px ${p.glow}, inset 0 -6px 12px rgba(0,0,0,0.35)`
        : `0 10px 24px rgba(0,0,0,0.5), inset 0 -8px 14px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.25)`,
      transform: isLit ? "scale(0.95)" : "scale(1)",
      transition: "all 0.12s ease",
      borderRadius: "50%",
    };
  };

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5 shadow-lg relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0b1c28 0%, #081620 100%)" }}
    >
      {/* animated background: drifting stars + glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)", top: "-60px", left: "-60px", animation: "pulse 4s infinite" }}
        />
        <div
          className="absolute w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)", bottom: "-80px", right: "-40px", animation: "pulse 5s infinite" }}
        />
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
      </div>

      {/* Header */}
      <div className="relative grid grid-cols-3 gap-3 max-w-[420px] mx-auto w-full">
        <StatBlock label="LEVEL" value={String(level)} highlight />
        <StatBlock label="BEST" value={String(best)} />
        <button
          type="button"
          onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
          className={`border rounded-lg px-3 py-3 font-mono text-xs font-semibold transition-colors ${
            soundOn ? "bg-accent/10 border-accent/30 text-accent" : "bg-white/5 border-white/15 text-paper/60"
          }`}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Status */}
      <p className="relative text-center font-display font-bold text-lg text-accent">
        {phaseLabel}
      </p>

      {/* Arcade pads */}
      <div className="relative mx-auto w-full max-w-[400px] p-6 rounded-full"
        style={{ background: "rgba(0,0,0,0.35)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)" }}
      >
        <div className="grid grid-cols-2 gap-5">
          {PADS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => tap(p.id)}
              disabled={phase !== "input"}
              className="aspect-square w-full cursor-pointer disabled:cursor-default"
              style={padStyle(p.id)}
              aria-label={`Pad ${p.id + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Over */}
      {phase === "over" && (
        <div className="relative bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-center">
          <p className="font-display font-bold text-accent">
            🎯 You reached level {level - 1}!
          </p>
          <p className="font-mono text-xs text-paper/70 mt-1">best: {best}</p>
          <button
            type="button"
            onClick={() => {
              clearTimeouts();
              setPhase("idle");
              startGame();
            }}
            className="mt-2 font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div className="relative bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">How to play:</strong> watch the
        sequence light up — each color has its own tone — then repeat it.
        Every round adds ONE more step to the same sequence. How far can
        your memory go?
      </div>
    </div>
  );
}

function StatBlock({
  label, value, highlight = false,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-3 ${highlight ? "bg-accent/10 border-accent/30" : "bg-white/5 border-white/10"}`}>
      <span className={`font-mono text-[10px] tracking-widest block mb-1 ${highlight ? "text-accent" : "text-paper/50"}`}>{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? "text-accent" : "text-paper"}`}>{value}</span>
    </div>
  );
}
