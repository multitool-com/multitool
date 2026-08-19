"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "stopwatch" | "timer" | "pomodoro";

function fmt(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

class Sound {
  private ctx: AudioContext | null = null;
  enabled = true;
  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  beep(count = 3) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    for (let i = 0; i < count; i += 1) {
      const t0 = ctx.currentTime + i * 0.35;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(880, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.3);
    }
  }
}
const sound = new Sound();

export default function StopwatchClient() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [timerInput, setTimerInput] = useState("5");
  const [timerLeft, setTimerLeft] = useState(5 * 60 * 1000);
  const [pomoType, setPomoType] = useState<"work" | "break">("work");
  const [pomoLeft, setPomoLeft] = useState(25 * 60 * 1000);
  const [soundOn, setSoundOn] = useState(true);
  const [completed, setCompleted] = useState(0);

  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef(0);

  // tick loop
  useEffect(() => {
    const tick = () => {
      if (running) {
        const now = performance.now();
        const dt = now - lastRef.current;
        lastRef.current = now;
        if (mode === "stopwatch") {
          setElapsed((e) => e + dt);
        } else if (mode === "timer") {
          setTimerLeft((t) => {
            if (t - dt <= 0) {
              setRunning(false);
              sound.beep();
              return 0;
            }
            return t - dt;
          });
        } else {
          setPomoLeft((t) => {
            if (t - dt <= 0) {
              setRunning(false);
              sound.beep(5);
              if (pomoType === "work") {
                setPomoType("break");
                setCompleted((c) => c + 1);
                return 5 * 60 * 1000;
              }
              setPomoType("work");
              return 25 * 60 * 1000;
            }
            return t - dt;
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, mode, pomoType]);

  const start = () => {
    lastRef.current = performance.now();
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const lap = () => {
    if (running) setLaps((l) => [elapsed, ...l].slice(0, 10));
  };

  const startTimer = () => {
    const mins = parseFloat(timerInput);
    if (isNaN(mins) || mins <= 0) return;
    setTimerLeft(mins * 60 * 1000);
    lastRef.current = performance.now();
    setRunning(true);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Mode */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => { setMode("stopwatch"); setRunning(false); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "stopwatch" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
          ⏱ STOPWATCH
        </button>
        <button type="button" onClick={() => { setMode("timer"); setRunning(false); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "timer" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
          ⏳ TIMER
        </button>
        <button type="button" onClick={() => { setMode("pomodoro"); setRunning(false); }}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "pomodoro" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
          🍅 POMODORO
        </button>
        <button type="button" onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
          className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${soundOn ? "bg-accent/10 border border-accent/30 text-accent" : "bg-paper text-ink/60 border border-ink/15"}`}>
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Display */}
      <div className="bg-deep rounded-xl px-6 py-8 text-center">
        <span className="font-mono text-5xl sm:text-6xl font-semibold text-accent tabular-nums">
          {mode === "stopwatch" ? fmt(elapsed) : mode === "timer" ? fmt(timerLeft) : fmt(pomoLeft)}
        </span>
        {mode === "pomodoro" && (
          <p className="font-mono text-xs text-paper/60 mt-2">
            {pomoType === "work" ? "FOCUS SESSION" : "BREAK"} · completed: {completed}
          </p>
        )}
      </div>

      {/* Controls */}
      {mode === "stopwatch" && (
        <div className="flex gap-2 flex-wrap justify-center">
          {!running ? (
            <button type="button" onClick={start} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">START</button>
          ) : (
            <button type="button" onClick={pause} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">PAUSE</button>
          )}
          <button type="button" onClick={lap} disabled={!running} className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent disabled:opacity-40">LAP</button>
          <button type="button" onClick={reset} className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent">RESET</button>
        </div>
      )}

      {mode === "timer" && (
        <div className="flex gap-2 flex-wrap items-center justify-center">
          <input
            type="number" min={0.1} step={0.5} value={timerInput} onChange={(e) => setTimerInput(e.target.value)}
            className="w-28 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <span className="font-mono text-xs text-ink/60">MINUTES</span>
          {!running ? (
            <button type="button" onClick={startTimer} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">START</button>
          ) : (
            <button type="button" onClick={pause} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">PAUSE</button>
          )}
          <button type="button" onClick={() => { setRunning(false); setTimerLeft(parseFloat(timerInput) * 60 * 1000); }} className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent">RESET</button>
        </div>
      )}

      {mode === "pomodoro" && (
        <div className="flex gap-2 flex-wrap justify-center">
          {!running ? (
            <button type="button" onClick={() => { lastRef.current = performance.now(); setRunning(true); }} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">START</button>
          ) : (
            <button type="button" onClick={pause} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent">PAUSE</button>
          )}
          <button type="button" onClick={() => { setRunning(false); setPomoLeft(pomoType === "work" ? 25 * 60 * 1000 : 5 * 60 * 1000); }} className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent">RESET</button>
        </div>
      )}

      {/* Laps */}
      {mode === "stopwatch" && laps.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs tracking-widest text-ink/60">LAPS</span>
          <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
            {laps.map((l, i) => (
              <div key={i} className="px-4 py-1.5 flex justify-between font-mono text-xs text-ink/70">
                <span>Lap {laps.length - i}</span>
                <span>{fmt(l)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Pomodoro:</strong> 25 min focus + 5 min
        break, automatically alternating. The timer beeps when finished.
      </div>
    </div>
  );
}
