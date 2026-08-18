"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Grid = number[][];

const SIZE = 4;

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));
}

function cloneGrid(g: Grid): Grid {
  return g.map((row) => [...row]);
}

function addRandomTile(g: Grid): Grid {
  const grid = cloneGrid(g);
  const empty: [number, number][] = [];
  grid.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) empty.push([r, c]);
    })
  );
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return grid;
}

function slideRow(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i += 1;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}

type Dir = "up" | "down" | "left" | "right";

function moveGrid(g: Grid, dir: Dir): { grid: Grid; moved: boolean; gained: number } {
  let grid = cloneGrid(g);
  let gained = 0;
  let moved = false;

  const applyRows = (rows: number[][], reverse: boolean) => {
    const result = rows.map((row) => {
      const r = reverse ? [...row].reverse() : row;
      const { row: slid, gained: g2 } = slideRow(r);
      gained += g2;
      return reverse ? slid.reverse() : slid;
    });
    return result;
  };

  if (dir === "left" || dir === "right") {
    const rows = grid.map((row, r) => {
      const rr = dir === "right" ? [...row].reverse() : row;
      const { row: slid, gained: g2 } = slideRow(rr);
      gained += g2;
      return dir === "right" ? slid.reverse() : slid;
    });
    moved = JSON.stringify(rows) !== JSON.stringify(grid);
    grid = rows;
  } else {
    // transpose → slide rows → transpose back
    const transposed = grid[0].map((_, c) => grid.map((row) => row[c]));
    const rows = applyRows(transposed, dir === "down");
    const back = rows[0].map((_, c) => rows.map((row) => row[c]));
    moved = JSON.stringify(back) !== JSON.stringify(grid);
    grid = back;
  }

  return { grid, moved, gained };
}

function canMove(g: Grid): boolean {
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (g[r][c] === 0) return true;
      if (c + 1 < SIZE && g[r][c] === g[r][c + 1]) return true;
      if (r + 1 < SIZE && g[r][c] === g[r + 1][c]) return true;
    }
  }
  return false;
}

const TILE_COLORS: Record<number, string> = {
  2: "bg-[#eee4da] text-[#776e65]",
  4: "bg-[#ede0c8] text-[#776e65]",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white",
  256: "bg-[#edcc61] text-white",
  512: "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
  4096: "bg-[#3c3a32] text-white",
  8192: "bg-[#3c3a32] text-white",
};

function tileClass(v: number): string {
  if (v === 0) return "bg-ink/5";
  return TILE_COLORS[v] ?? "bg-deep text-white";
}

function tileSize(v: number): string {
  if (v >= 1000) return "text-lg sm:text-2xl";
  if (v >= 100) return "text-xl sm:text-3xl";
  return "text-2xl sm:text-4xl";
}

export default function Game2048Client() {
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const stateRef = useRef({ score: 0 });

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("multitool-2048-best") ?? 0);
      if (!Number.isNaN(saved)) setBest(saved);
    } catch {
      // ignore
    }
  }, []);

  const move = useCallback((dir: Dir) => {
    setGrid((prev) => {
      const { grid: next, moved, gained } = moveGrid(prev, dir);
      if (!moved) return prev;
      const withTile = addRandomTile(next);
      const newScore = stateRef.current.score + gained;
      stateRef.current.score = newScore;
      setScore(newScore);
      if (withTile.flat().includes(2048)) setWon(true);
      if (!canMove(withTile)) setOver(true);
      setBest((b) => {
        const nb = Math.max(b, newScore);
        try {
          localStorage.setItem("multitool-2048-best", String(nb));
        } catch {
          // ignore
        }
        return nb;
      });
      return withTile;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
        W: "up",
        S: "down",
        A: "left",
        D: "right",
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
    else move(dy > 0 ? "down" : "up");
    touchStart.current = null;
  };

  const newGame = () => {
    stateRef.current.score = 0;
    setScore(0);
    setOver(false);
    setWon(false);
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Header: score + best + new */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-3">
          <StatBlock label="SCORE" value={String(score)} highlight />
          <StatBlock label="BEST" value={String(best)} />
        </div>
        <button
          type="button"
          onClick={newGame}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-deep text-paper hover:bg-accent transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Board */}
      <div
        className="mx-auto w-full max-w-[420px] select-none touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid grid-cols-4 gap-2 bg-ink/5 rounded-xl p-2 aspect-square relative">
          {grid.flat().map((v, i) => (
            <div
              key={i}
              className={`${tileClass(v)} ${tileSize(v)} rounded-lg flex items-center justify-center font-bold transition-all duration-100`}
            >
              {v !== 0 ? v : ""}
            </div>
          ))}
          {over && (
            <div className="absolute inset-0 bg-deep/85 rounded-xl flex flex-col items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-paper">
                GAME OVER
              </span>
              <span className="font-mono text-sm text-accent">
                SCORE: {score} · BEST: {best}
              </span>
              <button
                type="button"
                onClick={newGame}
                className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
              >
                TRY AGAIN
              </button>
            </div>
          )}
          {won && !over && (
            <div className="absolute inset-0 bg-deep/85 rounded-xl flex flex-col items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-accent">
                YOU WIN!
              </span>
              <button
                type="button"
                onClick={newGame}
                className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
              >
                NEW GAME
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center font-mono text-[10px] text-ink/40">
        ARROW KEYS / WASD / SWIPE TO SLIDE
      </p>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Tip:</strong> keep your biggest tile in
        a corner and merge toward it. Join the tiles and reach 2048!
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
