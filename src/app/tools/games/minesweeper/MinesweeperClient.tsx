"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Level = "easy" | "normal" | "hard";

const LEVELS: Record<Level, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  normal: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

interface CellData {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

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
  reveal() { this.tone(220, 0.05, "triangle", 0.05, 300); }
  flag() { this.tone(500, 0.07, "square", 0.05, 400); }
  boom() { this.tone(220, 0.5, "sawtooth", 0.16, 60); this.tone(90, 0.7, "sawtooth", 0.14, 40, 0.1); }
  win() { const n = [523, 659, 784, 1047, 1319]; n.forEach((f, i) => this.tone(f, 0.16, "triangle", 0.12, undefined, i * 0.1)); }
}
const sound = new Sound();

function buildBoard(rows: number, cols: number, mines: number, safeR: number, safeC: number): CellData[][] {
  const board: CellData[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  let placed = 0;
  let guard = 0;
  while (placed < mines && guard < 5000) {
    guard += 1;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    if (board[r][c].mine) continue;
    board[r][c].mine = true;
    placed += 1;
  }
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) n += 1;
        }
      }
      board[r][c].adjacent = n;
    }
  }
  return board;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MinesweeperClient() {
  const [level, setLevel] = useState<Level>("easy");
  const [board, setBoard] = useState<CellData[][]>(() => buildBoard(9, 9, 10, 4, 4));
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [best, setBest] = useState<Record<Level, string>>({ easy: "", normal: "", hard: "" });
  const [soundOn, setSoundOn] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firstClick = useRef(true);
  const boardRef = useRef(board);
  const timeRef = useRef(0);

  const cfg = LEVELS[level];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("multitool-mines-best");
      if (saved) setBest(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const reset = useCallback((lvl: Level = level) => {
    stopTimer();
    const nb = buildBoard(LEVELS[lvl].rows, LEVELS[lvl].cols, LEVELS[lvl].mines, 4, 4);
    boardRef.current = nb;
    setBoard(nb);
    setFlags(0);
    setTime(0);
    timeRef.current = 0;
    setStatus("idle");
    firstClick.current = true;
  }, [level]);

  const floodReveal = (b: CellData[][], r: number, c: number): CellData[][] => {
    const nb = b.map((row) => row.map((cell) => ({ ...cell })));
    const rows = nb.length;
    const cols = nb[0].length;
    const stack: [number, number][] = [[r, c]];
    while (stack.length > 0) {
      const [cr, cc] = stack.pop()!;
      const cell = nb[cr][cc];
      if (cell.revealed || cell.flagged || cell.mine) continue;
      cell.revealed = true;
      if (cell.adjacent === 0) {
        for (let dr = -1; dr <= 1; dr += 1) {
          for (let dc = -1; dc <= 1; dc += 1) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) stack.push([nr, nc]);
          }
        }
      }
    }
    return nb;
  };

  const checkWin = (b: CellData[][]) => {
    const safeTotal = cfg.rows * cfg.cols - cfg.mines;
    let revealed = 0;
    for (const row of b) for (const cell of row) if (cell.revealed) revealed += 1;
    return revealed === safeTotal;
  };

  const reveal = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    const cell = boardRef.current[r][c];
    if (cell.revealed || cell.flagged) return;

    if (firstClick.current) {
      firstClick.current = false;
      setStatus("playing");
      timerRef.current = setInterval(() => {
        timeRef.current += 1;
        setTime(timeRef.current);
      }, 1000);
    }

    if (cell.mine) {
      sound.boom();
      stopTimer();
      const nb = boardRef.current.map((row) => row.map((cc) => ({ ...cc, revealed: cc.mine ? true : cc.revealed })));
      boardRef.current = nb;
      setBoard(nb);
      setStatus("lost");
      return;
    }

    sound.reveal();
    const nb = floodReveal(boardRef.current, r, c);
    boardRef.current = nb;
    setBoard(nb);
    if (checkWin(nb)) {
      sound.win();
      stopTimer();
      setStatus("won");
      setBest((prev) => {
        const current = prev[level];
        if (!current || timeRef.current < parseTime(current)) {
          const next = { ...prev, [level]: formatTime(timeRef.current) };
          try { localStorage.setItem("multitool-mines-best", JSON.stringify(next)); } catch { /* ignore */ }
          return next;
        }
        return prev;
      });
    }
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost") return;
    const cell = boardRef.current[r][c];
    if (cell.revealed) return;
    sound.flag();
    const nb = boardRef.current.map((row) => row.map((cc) => ({ ...cc })));
    nb[r][c].flagged = !nb[r][c].flagged;
    boardRef.current = nb;
    setBoard(nb);
    setFlags(nb.flat().filter((cc) => cc.flagged).length);
  };

  const parseTime = (s: string) => {
    const [m, sec] = s.split(":").map(Number);
    return m * 60 + sec;
  };

  const cellClass = (cell: CellData) => {
    const base = "flex items-center justify-center rounded-[3px] text-xs sm:text-sm font-bold select-none transition-colors";
    if (cell.revealed) {
      if (cell.mine) return `${base} bg-red-500/80 text-white`;
      if (cell.adjacent === 0) return `${base} bg-emerald-950/60 text-emerald-900`;
      const colors = ["", "text-cyan-400", "text-green-400", "text-red-400", "text-purple-400", "text-amber-400", "text-teal-400", "text-pink-400", "text-paper"];
      return `${base} bg-emerald-950/60 ${colors[cell.adjacent] ?? "text-paper"}`;
    }
    if (cell.flagged) return `${base} bg-emerald-900/70 text-accent cursor-pointer hover:bg-emerald-800/70`;
    return `${base} bg-emerald-800/50 hover:bg-emerald-700/60 cursor-pointer border border-emerald-500/20 shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)]`;
  };

  const cellSize =
    level === "easy" ? "h-8 w-8 sm:h-10 sm:w-10" : level === "normal" ? "h-7 w-7 sm:h-8 sm:w-8" : "h-6 w-6 sm:h-7 sm:w-7";

  const statusEmoji = status === "won" ? "😎" : status === "lost" ? "💥" : "🙂";

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(LEVELS) as Level[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLevel(l); reset(l); }}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                level === l ? "bg-accent text-paper" : "bg-white/5 text-paper/70 border border-white/15 hover:text-accent"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
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
          onClick={() => reset()}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 max-w-[420px] mx-auto w-full">
        <StatBlock label="MINES" value={`${cfg.mines - flags}`} highlight />
        <StatBlock label="TIME" value={formatTime(time)} />
        <StatBlock label="BEST" value={best[level] || "—"} />
      </div>

      {/* Board — bigger, fills more screen */}
      <div className="mx-auto w-full max-w-[760px]">
        <div
          className="inline-grid gap-[2px] bg-emerald-950/80 p-2 rounded-xl border border-emerald-500/20 w-full"
          style={{
            gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => flag(e, r, c)}
                onTouchEnd={(e) => {
                  // long-press to flag on mobile
                  const t = e.target as HTMLElement;
                  if (t.dataset.pressStart && Date.now() - Number(t.dataset.pressStart) > 400) {
                    e.preventDefault();
                    flag(e as unknown as React.MouseEvent, r, c);
                  }
                }}
                onTouchStart={(e) => {
                  const t = e.target as HTMLElement;
                  t.dataset.pressStart = String(Date.now());
                }}
                className={`${cellClass(cell)} ${cellSize} w-full`}
              >
                {cell.revealed && cell.mine
                  ? "💣"
                  : cell.revealed && cell.adjacent > 0
                  ? cell.adjacent
                  : cell.flagged
                  ? "🚩"
                  : ""}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Status */}
      <p className="text-center font-mono text-sm text-paper/70">
        {statusEmoji}{" "}
        {status === "won"
          ? `YOU WON in ${formatTime(time)}!`
          : status === "lost"
          ? "BOOM! Try again."
          : "Left-click to reveal · right-click to flag"}
      </p>

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">How to play:</strong> reveal cells
        and use the numbers to find the mines. Right-click (or long-press
        on mobile) to flag. First click is always safe.
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
