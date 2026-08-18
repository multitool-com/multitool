"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROWS = 6;
const COLS = 7;
type Player = "R" | "Y";
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
  drop() { this.tone(200, 0.08, "triangle", 0.12, 90); }
  win() { const n = [523, 659, 784, 1047]; n.forEach((f, i) => this.tone(f, 0.15, "triangle", 0.12, undefined, i * 0.1)); }
  draw() { this.tone(300, 0.2, "sine", 0.08, 200); }
}
const sound = new Sound();

// ---- board helpers ----
function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

function dropIn(board: Cell[][], col: number, player: Player): Cell[][] | null {
  for (let r = ROWS - 1; r >= 0; r -= 1) {
    if (!board[r][col]) {
      const nb = board.map((row) => [...row]);
      nb[r][col] = player;
      return nb;
    }
  }
  return null;
}

function winnerOf(board: Cell[][]): Player | null {
  // horizontal
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const v = board[r][c];
      if (v && v === board[r][c+1] && v === board[r][c+2] && v === board[r][c+3]) return v;
    }
  }
  // vertical
  for (let c = 0; c < COLS; c += 1) {
    for (let r = 0; r <= ROWS - 4; r += 1) {
      const v = board[r][c];
      if (v && v === board[r+1][c] && v === board[r+2][c] && v === board[r+3][c]) return v;
    }
  }
  // diagonal \
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const v = board[r][c];
      if (v && v === board[r+1][c+1] && v === board[r+2][c+2] && v === board[r+3][c+3]) return v;
    }
  }
  // diagonal /
  for (let r = 3; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const v = board[r][c];
      if (v && v === board[r-1][c+1] && v === board[r-2][c+2] && v === board[r-3][c+3]) return v;
    }
  }
  return null;
}

function isFull(board: Cell[][]): boolean {
  return board[0].every((c) => c !== null);
}

// ---- AI: heuristic minimax (depth limited) ----
function evaluateWindow(window: Cell[], me: Player): number {
  const opp: Player = me === "R" ? "Y" : "R";
  let score = 0;
  const mine = window.filter((c) => c === me).length;
  const theirs = window.filter((c) => c === opp).length;
  const empty = window.filter((c) => c === null).length;
  if (mine === 4) score += 10000;
  else if (mine === 3 && empty === 1) score += 60;
  else if (mine === 2 && empty === 2) score += 10;
  if (theirs === 3 && empty === 1) score -= 80; // block opponent's 3
  else if (theirs === 2 && empty === 2) score -= 8;
  return score;
}

function scoreBoard(board: Cell[][], me: Player): number {
  let score = 0;
  // rows
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      score += evaluateWindow(board[r].slice(c, c + 4), me);
    }
  }
  // cols
  for (let c = 0; c < COLS; c += 1) {
    for (let r = 0; r <= ROWS - 4; r += 1) {
      const w = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
      score += evaluateWindow(w, me);
    }
  }
  // diag \
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const w = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
      score += evaluateWindow(w, me);
    }
  }
  // diag /
  for (let r = 3; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const w = [board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]];
      score += evaluateWindow(w, me);
    }
  }
  return score;
}

function validCols(board: Cell[][]): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c += 1) {
    if (!board[0][c]) cols.push(c);
  }
  return cols;
}

function minimax(board: Cell[][], depth: number, alpha: number, beta: number, maximizing: boolean, me: Player): number {
  const w = winnerOf(board);
  if (w === me) return 100000 - depth;
  if (w && w !== me) return -100000 + depth;
  if (isFull(board)) return 0;
  if (depth === 0) return scoreBoard(board, me);

  const cols = validCols(board);
  if (maximizing) {
    let best = -Infinity;
    for (const c of cols) {
      const nb = dropIn(board, c, me)!;
      best = Math.max(best, minimax(nb, depth - 1, alpha, beta, false, me));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    const opp: Player = me === "R" ? "Y" : "R";
    let best = Infinity;
    for (const c of cols) {
      const nb = dropIn(board, c, opp)!;
      best = Math.min(best, minimax(nb, depth - 1, alpha, beta, true, me));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function bestMove(board: Cell[][], me: Player, depth: number): number {
  const cols = validCols(board);
  // win immediately if possible
  for (const c of cols) {
    const nb = dropIn(board, c, me)!;
    if (winnerOf(nb) === me) return c;
  }
  // block opponent's immediate win
  const opp: Player = me === "R" ? "Y" : "R";
  for (const c of cols) {
    const nb = dropIn(board, c, opp)!;
    if (winnerOf(nb) === opp) return c;
  }
  // minimax
  let bestScore = -Infinity;
  let best = cols[0];
  for (const c of cols) {
    const nb = dropIn(board, c, me)!;
    const s = minimax(nb, depth - 1, -Infinity, Infinity, false, me);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best;
}

export default function FourInARowClient() {
  const [mode, setMode] = useState<Mode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [turn, setTurn] = useState<Player>("R");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [score, setScore] = useState({ R: 0, Y: 0, draw: 0 });
  const [soundOn, setSoundOn] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);

  const boardRef = useRef<Cell[][]>(emptyBoard());
  const turnRef = useRef<Player>("R");
  const modeRef = useRef<Mode>("ai");
  const diffRef = useRef<Difficulty>(2);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("multitool-4ir-score");
      if (saved) setScore(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveScore = (s: typeof score) => {
    try { sessionStorage.setItem("multitool-4ir-score", JSON.stringify(s)); } catch { /* ignore */ }
  };

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    aiTimer.current = null;
    const eb = emptyBoard();
    boardRef.current = eb;
    turnRef.current = "R";
    setBoard(eb);
    setTurn("R");
    setWinner(null);
    setAiThinking(false);
  }, []);

  const play = useCallback((col: number, snapshot: Cell[][], player: Player) => {
    const nb = dropIn(snapshot, col, player);
    if (!nb) return;
    boardRef.current = nb;
    setBoard(nb);
    sound.drop();
    const w = winnerOf(nb);
    if (w) {
      setWinner(w);
      sound.win();
      setScore((prev) => { const next = { ...prev, [w]: prev[w] + 1 }; saveScore(next); return next; });
      return;
    }
    if (isFull(nb)) {
      setWinner("draw");
      sound.draw();
      setScore((prev) => { const next = { ...prev, draw: prev.draw + 1 }; saveScore(next); return next; });
      return;
    }
    const nt: Player = player === "R" ? "Y" : "R";
    turnRef.current = nt;
    setTurn(nt);
  }, []);

  const scheduleAi = useCallback((snapshot: Cell[][], player: Player, diff: Difficulty) => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    setAiThinking(true);
    aiTimer.current = setTimeout(() => {
      const w = winnerOf(snapshot);
      if (w || isFull(snapshot)) { setAiThinking(false); return; }
      let col: number;
      if (diff === 1) {
        const cols = validCols(snapshot);
        // easy: mostly random, sometimes blocks
        col = Math.random() < 0.6 ? cols[Math.floor(Math.random() * cols.length)] : bestMove(snapshot, player, 2);
      } else if (diff === 2) {
        col = bestMove(snapshot, player, 4);
      } else {
        col = bestMove(snapshot, player, 7);
      }
      setAiThinking(false);
      play(col, snapshot, player);
    }, 450);
  }, [play]);

  useEffect(() => {
    if (mode !== "ai" || winner || turn !== "Y") return;
    scheduleAi(boardRef.current, "Y", diffRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, winner, turn]);

  const cellClass = (v: Cell) => {
    const base = "aspect-square rounded-full flex items-center justify-center transition-all";
    if (v === "R") return `${base} bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_14px_rgba(239,68,68,0.5)]`;
    if (v === "Y") return `${base} bg-gradient-to-br from-yellow-300 to-amber-600 shadow-[0_0_14px_rgba(250,204,21,0.5)]`;
    return `${base} bg-white/10 border border-white/15`;
  };

  const status =
    winner === "draw"
      ? "DRAW"
      : winner
      ? `${winner === "R" ? "RED" : "YELLOW"} WINS!`
      : turn === "R"
      ? "RED TO PLAY"
      : mode === "ai"
      ? "COMPUTER THINKING…"
      : "YELLOW TO PLAY";

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
              {d === 1 ? "EASY" : d === 2 ? "NORMAL" : "HARD"}
            </button>
          ))}
        </div>
      )}

      {/* Score */}
      <div className="grid grid-cols-3 gap-3 max-w-[420px] mx-auto w-full">
        <StatBlock label="RED" value={String(score.R)} highlight />
        <StatBlock label="DRAW" value={String(score.draw)} />
        <StatBlock label="YELLOW" value={String(score.Y)} />
      </div>

      {/* Status */}
      <p className="text-center font-display font-bold text-lg text-accent">{status}</p>

      {/* Board */}
      <div className="mx-auto w-full max-w-[460px] p-4 rounded-2xl"
        style={{ background: "rgba(0,0,0,0.35)", boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)" }}
      >
        <div className="grid grid-cols-7 gap-2">
          {board.map((row, r) =>
            row.map((v, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => {
                  if (winner || (mode === "ai" && turn === "Y")) return;
                  play(c, boardRef.current, turnRef.current);
                }}
                disabled={!!winner || (mode === "ai" && turn === "Y")}
                className={cellClass(v)}
                aria-label={`Column ${c + 1}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Result */}
      {winner && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-center">
          <p className="font-display font-bold text-accent">
            {winner === "draw" ? "🤝 DRAW" : `🎉 ${winner === "R" ? "RED" : "YELLOW"} WINS!`}
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
        <strong className="text-paper">How to play:</strong> click a column
        to drop your disc. Connect four in a row — across, down or diagonal
        — to win. Hard computer thinks several moves ahead!
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
