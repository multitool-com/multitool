"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SYMBOLS = [
  "🍎", "🍌", "🍇", "🍒", "🍓", "🍉",
  "⭐", "🌙", "☀️", "🌈", "🌵", "🌸",
  "🐶", "🐱", "🐸", "🦊", "🐼", "🐧",
];

type Level = "easy" | "normal" | "hard";

const LEVELS: Record<Level, { pairs: number; cols: number }> = {
  easy: { pairs: 6, cols: 4 },
  normal: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 },
};

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(pairs: number): Card[] {
  const symbols = SYMBOLS.slice(0, pairs);
  const deck = [...symbols, ...symbols]
    .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---- Sound engine (Web Audio API, generated in-browser) ----
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

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.12,
    slideTo?: number,
    delay = 0
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    }
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  flip() {
    this.tone(300, 0.06, "triangle", 0.06, 420);
  }
  match() {
    this.tone(523, 0.1, "triangle", 0.12);
    this.tone(784, 0.16, "triangle", 0.12, undefined, 0.08);
  }
  miss() {
    this.tone(220, 0.12, "sawtooth", 0.05, 160);
  }
  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) =>
      this.tone(n, 0.18, "triangle", 0.12, undefined, i * 0.12)
    );
  }
}

const sound = new Sound();

// ---- Beautiful card back: radial gradient + gem ----
function CardBackGem() {
  return (
    <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 drop-shadow-lg" aria-hidden>
      <defs>
        <linearGradient id="gemg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* gem shape */}
      <polygon
        points="12,2 20,9 12,22 4,9"
        fill="url(#gemg)"
        stroke="#fff7ed"
        strokeWidth="0.8"
      />
      {/* facet lines */}
      <line x1="4" y1="9" x2="12" y2="9" stroke="#fff7ed" strokeWidth="0.5" opacity="0.7" />
      <line x1="20" y1="9" x2="12" y2="9" stroke="#fff7ed" strokeWidth="0.5" opacity="0.7" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="#fff7ed" strokeWidth="0.4" opacity="0.5" />
      <line x1="8" y1="9" x2="12" y2="15" stroke="#fff7ed" strokeWidth="0.4" opacity="0.5" />
      <line x1="16" y1="9" x2="12" y2="15" stroke="#fff7ed" strokeWidth="0.4" opacity="0.5" />
      {/* sparkle */}
      <circle cx="14.5" cy="5.5" r="0.8" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export default function MemoryMatchClient() {
  const [level, setLevel] = useState<Level>("normal");
  // Deck starts empty; built client-side after mount (avoids SSR hydration
  // mismatch from Math.random() in buildDeck).
  const [deck, setDeck] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [won, setWon] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [best, setBest] = useState<Record<Level, string>>({
    easy: "",
    normal: "",
    hard: "",
  });
  const firstPick = useRef<number | null>(null);
  const lock = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build the initial deck only in the browser (client-only).
  useEffect(() => {
    setDeck(buildDeck(LEVELS.normal.pairs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("multitool-memory-best");
      if (saved) setBest(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = useCallback(
    (lvl: Level = level) => {
      stopTimer();
      setDeck(buildDeck(LEVELS[lvl].pairs));
      setMoves(0);
      setTime(0);
      setWon(false);
      firstPick.current = null;
      lock.current = false;
    },
    [level]
  );

  const flip = (id: number) => {
    if (lock.current || won) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    startTimer();
    sound.flip();
    setDeck((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );

    if (firstPick.current === null) {
      firstPick.current = id;
      return;
    }

    const firstId = firstPick.current;
    firstPick.current = null;
    setMoves((m) => m + 1);

    const first = deck.find((c) => c.id === firstId);
    if (first && first.symbol === card.symbol) {
      sound.match();
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === id ? { ...c, matched: true } : c
          )
        );
      }, 380);
    } else {
      sound.miss();
      lock.current = true;
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === id ? { ...c, flipped: false } : c
          )
        );
        lock.current = false;
      }, 850);
    }
  };

  useEffect(() => {
    if (deck.length > 0 && deck.every((c) => c.matched)) {
      stopTimer();
      setWon(true);
      sound.win();
      setBest((prev) => {
        const current = prev[level];
        const candidate = formatTime(time);
        if (!current || time < parseTime(current)) {
          const next = { ...prev, [level]: candidate };
          try {
            localStorage.setItem("multitool-memory-best", JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        }
        return prev;
      });
    }
  }, [deck, level, time]);

  const parseTime = (s: string) => {
    const [m, sec] = s.split(":").map(Number);
    return m * 60 + sec;
  };

  const cols = LEVELS[level].cols;

  const faceStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    position: "absolute",
    inset: 0,
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <StatBlock label="MOVES" value={String(moves)} highlight />
          <StatBlock label="TIME" value={formatTime(time)} highlight />
          <StatBlock label="BEST" value={best[level] || "—"} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSoundOn((prev) => {
                sound.enabled = !prev;
                return !prev;
              });
            }}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              soundOn
                ? "bg-accent/10 border border-accent/30 text-accent"
                : "bg-paper text-ink/60 border border-ink/15"
            }`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-deep text-paper hover:bg-accent transition-colors"
          >
            NEW GAME
          </button>
        </div>
      </div>

      {/* Levels */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(Object.keys(LEVELS) as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLevel(l);
              reset(l);
            }}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              level === l
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="mx-auto w-full max-w-[480px] rounded-2xl p-3 sm:p-4"
        style={{
          background:
            "linear-gradient(180deg, #8b5e34 0%, #6b4423 45%, #4e3118 100%)",
          boxShadow:
            "inset 0 2px 6px rgba(0,0,0,.45), inset 0 -2px 6px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.28)",
        }}
      >
        <div
          className="rounded-xl p-3 sm:p-4"
          style={{
            background:
              "radial-gradient(circle at 50% 28%, #41308a 0%, #2b1f63 55%, #1c1447 100%)",
            boxShadow:
              "inset 0 4px 22px rgba(0,0,0,.6), inset 0 -2px 12px rgba(0,0,0,.35)",
          }}
        >
          <div
            className="grid gap-2 sm:gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {deck.map((card) => {
              const revealed = card.flipped || card.matched;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => flip(card.id)}
                  className="relative aspect-square rounded-xl focus:outline-none"
                  style={{ perspective: "600px" }}
                  aria-label={revealed ? card.symbol : "Card"}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.45s cubic-bezier(.4,.2,.2,1)",
                      transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Back — premium: deep indigo gradient + gold gem */}
                    <div
                      style={faceStyle}
                      className="rounded-xl overflow-hidden border-2 border-indigo-300/40 shadow-lg"
                    >
                      <div className="w-full h-full relative bg-gradient-to-br from-indigo-800 via-indigo-900 to-[#1e1b4b] flex items-center justify-center">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(129,140,248,0.5),transparent_60%)]" />
                        <CardBackGem />
                        <div className="absolute inset-1.5 rounded-lg border border-indigo-200/15 pointer-events-none" />
                      </div>
                    </div>
                    {/* Front — clean cream with big emoji */}
                    <div
                      style={{ ...faceStyle, transform: "rotateY(180deg)" }}
                      className={`rounded-xl overflow-hidden border-2 shadow-lg transition-all duration-200 ${
                        card.matched
                          ? "border-teal-400/80 shadow-teal-500/30"
                          : "border-amber-900/30"
                      }`}
                    >
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          card.matched
                            ? "bg-gradient-to-b from-teal-50 to-emerald-100"
                            : "bg-gradient-to-b from-amber-50 to-amber-100"
                        }`}
                      >
                        <span
                          className={`leading-none ${
                            card.matched ? "animate-pulse" : ""
                          }`}
                          style={{
                            fontSize: "clamp(1.6rem, 9vw, 3.2rem)",
                            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
                          }}
                        >
                          {card.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {won && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-center">
          <p className="font-display font-bold text-accent">🎉 YOU WON!</p>
          <p className="font-mono text-xs text-ink/70 mt-1">
            {moves} moves · {formatTime(time)} · best: {best[level] || formatTime(time)}
          </p>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">How to play:</strong> flip two cards at
        a time and find all the matching pairs. Fewer moves and faster time
        = better score.
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg px-3 py-3 ${
        highlight
          ? "bg-accent/10 border-accent/30"
          : "bg-paper border-ink/10"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
        {label}
      </span>
      <span
        className={`font-mono text-sm font-semibold ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
