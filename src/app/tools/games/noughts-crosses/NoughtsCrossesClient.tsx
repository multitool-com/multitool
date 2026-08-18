"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Mode = "ai" | "pvp";
type Difficulty = 1 | 2 | 3;

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
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.12, slideTo?: number, delay = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
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
  placeX() { this.tone(380, 0.09, "triangle", 0.12, 520); }
  placeO() { this.tone(300, 0.09, "triangle", 0.12, 420); }
  win() { const n = [523, 659, 784, 1047]; n.forEach((f, i) => this.tone(f, 0.15, "triangle", 0.12, undefined, i * 0.1)); }
  draw() { this.tone(300, 0.2, "sine", 0.08, 200); }
}
const sound = new Sound();

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b: Cell[]): Player | null {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

function minimax(board: Cell[], turn: Player, me: Player): number {
  const w = winnerOf(board);
  if (w === me) return 10;
  if (w && w !== me) return -10;
  if (board.every((c) => c !== null)) return 0;
  const moves: number[] = [];
  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue;
    const nb = [...board];
    nb[i] = turn;
    moves.push(minimax(nb, turn === "X" ? "O" : "X", me));
  }
  return turn === me ? Math.max(...moves) : Math.min(...moves);
}

function bestMove(board: Cell[], me: Player): number {
  const opp: Player = me === "X" ? "O" : "X";
  const scores: { idx: number; score: number }[] = [];
  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue;
    const nb = [...board];
    nb[i] = me;
    scores.push({ idx: i, score: minimax(nb, opp, me) });
  }
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0].score;
  const top = scores.filter((s) => s.score === best);
  return top[Math.floor(Math.random() * top.length)].idx;
}

function randomMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function NoughtsCrossesClient() {
  const [mode, setMode] = useState<Mode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [soundOn, setSoundOn] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef<Cell[]>(Array(9).fill(null));
  const modeRef = useRef<Mode>("ai");
  const diffRef = useRef<Difficulty>(1);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("multitool-nc-score");
      if (saved) setScore(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveScore = (s: typeof score) => {
    try { sessionStorage.setItem("multitool-nc-score", JSON.stringify(s)); } catch { /* ignore */ }
  };

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    aiTimer.current = null;
    boardRef.current = Array(9).fill(null);
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
    setAiThinking(false);
  }, []);

  // ---- play is a pure function of the CURRENT board snapshot ----
  const play = useCallback((idx: number, snapshot: Cell[]) => {
    if (winnerOf(snapshot) || snapshot[idx]) return;
    const nb = [...snapshot];
    const player = boardRef.current.filter((c) => c !== null).length % 2 === 0 ? "X" : "O";
    // simpler: derive from snapshot count
    const count = snapshot.filter((c) => c !== null).length;
    const current: Player = count % 2 === 0 ? "X" : "O";
    nb[idx] = current;
    boardRef.current = nb;
    setBoard(nb);
    if (current === "X") sound.placeX();
    else sound.placeO();

    const w = winnerOf(nb);
    if (w) {
      setWinner(w);
      sound.win();
      setScore((prev) => { const next = { ...prev, [w]: prev[w] + 1 }; saveScore(next); return next; });
      return;
    }
    if (nb.every((c) => c !== null)) {
      setWinner("draw");
      sound.draw();
      setScore((prev) => { const next = { ...prev, draw: prev.draw + 1 }; saveScore(next); return next; });
      return;
    }
    setTurn(current === "X" ? "O" : "X");
  }, []);

  // ---- AI turn: fire-and-forget with setTimeout (no effect loop) ----
  const scheduleAi = useCallback(
    (snapshot: Cell[], diff: Difficulty) => {
      if (aiTimer.current) clearTimeout(aiTimer.current);
      setAiThinking(true);
      aiTimer.current = setTimeout(() => {
        const w = winnerOf(snapshot);
        if (w || snapshot.every((c) => c !== null)) {
          setAiThinking(false);
          return;
        }
        let idx: number;
        if (diff === 1) idx = randomMove(snapshot);
        else if (diff === 2) idx = Math.random() < 0.6 ? bestMove(snapshot, "O") : randomMove(snapshot);
        else idx = bestMove(snapshot, "O");
        setAiThinking(false);
        play(idx, snapshot);
      }, 500);
    },
    [play]
  );

  // Trigger AI when it's O's turn in ai mode.
  useEffect(() => {
    if (mode !== "ai" || winner || turn !== "O") return;
    scheduleAi(boardRef.current, diffRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, winner, turn]);

  const cellClass = (v: Cell) => {
    const base =
      "aspect-square rounded-xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all duration-150 select-none cursor-pointer bg-white/5 border border-white/10 hover:border-accent hover:bg-white/10";
    if (v === "X") return `${base} text-[#22d3ee] bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_18px_rgba(34,211,238,0.25)]`;
    if (v === "O") return `${base} text-[#fb923c] bg-orange-500/10 border-orange-400/40 shadow-[0_0_18px_rgba(251,146,60,0.25)]`;
    return base;
  };

  const status =
    winner === "draw"
      ? "DRAW"
      : winner
      ? `${winner} WINS!`
      : turn === "X"
      ? "X TO PLAY"
      : mode === "ai"
      ? "COMPUTER THINKING…"
      : "O TO PLAY";

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => { modeRef.current = "ai"; setMode("ai"); reset(); }}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "ai" ? "bg-accent text-paper" : "bg-white/5 text-paper/70 border border-white/15 hover:text-accent"
            }`}
          >
            VS COMPUTER
          </button>
          <button
            type="button"
            onClick={() => { modeRef.current = "pvp"; setMode("pvp"); reset(); }}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "pvp" ? "bg-accent text-paper" : "bg-white/5 text-paper/70 border border-white/15 hover:text-accent"
            }`}
          >
            2 PLAYERS
          </button>
          <button
            type="button"
            onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              soundOn ? "bg-accent/20 border border-accent/40 text-accent" : "bg-white/5 text-paper/70 border border-white/15"
            }`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Difficulty */}
      {mode === "ai" && (
        <div className="flex gap-2 flex-wrap justify-center">
          {([1, 2, 3] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { diffRef.current = d; setDifficulty(d); reset(); }}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                difficulty === d ? "bg-accent text-paper" : "bg-white/5 text-paper/70 border border-white/15 hover:text-accent"
              }`}
            >
              {d === 1 ? "EASY" : d === 2 ? "MEDIUM" : "HARD"}
            </button>
          ))}
        </div>
      )}

      {/* Score */}
      <div className="grid grid-cols-3 gap-3 max-w-[420px] mx-auto w-full">
        <StatBlock label="X" value={String(score.X)} highlight />
        <StatBlock label="DRAW" value={String(score.draw)} />
        <StatBlock label="O" value={String(score.O)} />
      </div>

      {/* Status */}
      <p className="text-center font-display font-bold text-lg text-accent">
        {status}
      </p>

      {/* Board — neon grid */}
      <div className="grid grid-cols-3 gap-3 max-w-[380px] mx-auto w-full p-4 rounded-2xl"
        style={{ background: "rgba(0,0,0,0.3)", boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)" }}
      >
        {board.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (winner || (mode === "ai" && turn === "O")) return;
              play(i, boardRef.current);
            }}
            disabled={!!winner || (mode === "ai" && turn === "O")}
            className={cellClass(v)}
          >
            {v === "X" ? (
              <span className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">✕</span>
            ) : v === "O" ? (
              <span className="drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">◯</span>
            ) : (
              ""
            )}
          </button>
        ))}
      </div>

      {/* Result */}
      {winner && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-center">
          <p className="font-display font-bold text-accent">
            {winner === "draw" ? "🤝 DRAW" : `🎉 ${winner} WINS!`}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">How to play:</strong> take turns
        placing X and O. Three in a row — across, down or diagonal — wins.
        Hard computer never loses!
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
