"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Cell = { x: number; y: number };

interface Snake {
  id: number;
  cells: Cell[]; // head first
  dir: { x: number; y: number };
  color: string;
  colorDark: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Snapshot {
  snakes: Snake[];
  snakesLeft: number;
}

interface GameState {
  size: number;
  snakes: Snake[];
  particles: Particle[];
  tick: number;
  sliding: boolean;
}

const PALETTE: { color: string; dark: string }[] = [
  { color: "#22d3ee", dark: "#0e7490" }, // cyan
  { color: "#f472b6", dark: "#be185d" }, // pink
  { color: "#a3e635", dark: "#4d7c0f" }, // lime
  { color: "#fb923c", dark: "#c2410c" }, // orange
  { color: "#a78bfa", dark: "#6d28d9" }, // violet
  { color: "#facc15", dark: "#a16207" }, // yellow
  { color: "#34d399", dark: "#047857" }, // emerald
  { color: "#f87171", dark: "#b91c1c" }, // red
];

const CELL = 36;
const SLIDE_MS = 70;

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

  slide() {
    this.tone(340, 0.045, "triangle", 0.045, 400);
  }
  bump() {
    this.tone(150, 0.18, "sawtooth", 0.14, 90);
    this.tone(110, 0.22, "sawtooth", 0.1, 70, 0.06);
  }
  exit() {
    this.tone(420, 0.12, "triangle", 0.12, 880);
    this.tone(620, 0.16, "triangle", 0.1, 1200, 0.06);
  }
  levelClear() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) =>
      this.tone(n, 0.16, "triangle", 0.12, undefined, i * 0.1)
    );
  }
  start() {
    this.tone(330, 0.12, "triangle", 0.12, 660);
  }
  undo() {
    this.tone(500, 0.06, "triangle", 0.07, 320);
  }
}

const sound = new Sound();

// ============================================================================
// MODULE-LEVEL HELPERS — defined outside the component so there is NO
// declaration-order hazard at all (the previous "Cannot access 'draw' before
// initialization" error becomes impossible).
// ============================================================================

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8) & 255) + 255 * amt));
  const b = Math.min(255, Math.round((n & 255) + 255 * amt));
  return `rgb(${r},${g},${b})`;
}

/** Draws the whole game onto the canvas. Pure module function. */
function drawGame(canvas: HTMLCanvasElement, g: GameState) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = g.size * CELL;
  const H = g.size * CELL;

  // soft light background (lavender)
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#eef0ff");
  grad.addColorStop(1, "#e0e1f8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // fine grid
  ctx.strokeStyle = "rgba(120,120,180,0.14)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= g.size; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * CELL + 0.5, 0);
    ctx.lineTo(i * CELL + 0.5, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL + 0.5);
    ctx.lineTo(W, i * CELL + 0.5);
    ctx.stroke();
  }

  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
  vg.addColorStop(0, "rgba(255,255,255,0)");
  vg.addColorStop(1, "rgba(99,102,160,0.14)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // snakes
  g.snakes.forEach((snake) => {
    const len = snake.cells.length;
    snake.cells.forEach((cell, i) => {
      if (cell.x < 0 || cell.x >= g.size || cell.y < 0 || cell.y >= g.size) {
        return;
      }
      const t = i / Math.max(1, len - 1);
      const x = cell.x * CELL;
      const y = cell.y * CELL;
      const pad = i === 0 ? 1.5 : 3 + t * 2;
      const segSize = CELL - pad * 2;
      const rad = i === 0 ? CELL * 0.3 : CELL * 0.22;

      const sg = ctx.createLinearGradient(x, y, x + segSize, y + segSize);
      sg.addColorStop(0, lighten(snake.color, 0.35));
      sg.addColorStop(0.5, snake.color);
      sg.addColorStop(1, snake.colorDark);

      ctx.shadowColor = snake.colorDark;
      ctx.shadowBlur = i === 0 ? 10 : 5;
      ctx.fillStyle = sg;
      roundRect(ctx, x + pad, y + pad, segSize, segSize, rad);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.ellipse(
        x + pad + segSize * 0.3,
        y + pad + segSize * 0.25,
        segSize * 0.2,
        segSize * 0.13,
        -0.6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      roundRect(ctx, x + pad, y + pad, segSize, segSize, rad);
      ctx.stroke();
    });

    const head = snake.cells[0];
    if (head && head.x >= 0 && head.x < g.size && head.y >= 0 && head.y < g.size) {
      const hx = head.x * CELL;
      const hy = head.y * CELL;
      const d = snake.dir;
      const cx = hx + CELL / 2;
      const cy = hy + CELL / 2;
      const fwd = CELL * 0.26;
      const perp = { x: -d.y, y: d.x };
      const eyeOff = CELL * 0.18;
      const e1 = {
        x: cx + d.x * fwd + perp.x * eyeOff,
        y: cy + d.y * fwd + perp.y * eyeOff,
      };
      const e2 = {
        x: cx + d.x * fwd - perp.x * eyeOff,
        y: cy + d.y * fwd - perp.y * eyeOff,
      };
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e1.x, e1.y, CELL * 0.13, 0, Math.PI * 2);
      ctx.arc(e2.x, e2.y, CELL * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e1b4b";
      ctx.beginPath();
      ctx.arc(e1.x + d.x * 2, e1.y + d.y * 2, CELL * 0.07, 0, Math.PI * 2);
      ctx.arc(e2.x + d.x * 2, e2.y + d.y * 2, CELL * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e1.x + d.x * 2 - 1, e1.y + d.y * 2 - 1, CELL * 0.025, 0, Math.PI * 2);
      ctx.arc(e2.x + d.x * 2 - 1, e2.y + d.y * 2 - 1, CELL * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  g.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * p.life + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = "rgba(99,102,160,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
}

// ============================================================================
// SOLVABILITY CHECK — exhaustive search; rejects unwinnable levels.
// ============================================================================
function isSolvable(snakesIn: Snake[], size: number): boolean {
  const memo = new Set<string>();
  let visited = 0;
  const MAX_VISITED = 80000;
  const MAX_DEPTH = 50;

  const keyOf = (list: Snake[]): string =>
    list
      .map((s) => {
        const cells = s.cells.map((c) => `${c.x},${c.y}`).join("|");
        return `${cells}@${s.dir.x},${s.dir.y}`;
      })
      .sort()
      .join(";");

  const slideSteps = (s: Snake, list: Snake[], sz: number): Cell[] | null => {
    const steps: Cell[] = [];
    const occupied = new Set<string>();
    list.forEach((o) => o.cells.forEach((c) => occupied.add(`${c.x},${c.y}`)));
    let head = s.cells[0];
    for (let i = 0; i < sz; i += 1) {
      const nx = head.x + s.dir.x;
      const ny = head.y + s.dir.y;
      if (nx < 0 || nx >= sz || ny < 0 || ny >= sz) {
        steps.push({ x: nx, y: ny });
        return steps;
      }
      if (occupied.has(`${nx},${ny}`)) return steps.length > 0 ? steps : null;
      steps.push({ x: nx, y: ny });
      head = { x: nx, y: ny };
    }
    return steps.length > 0 ? steps : null;
  };

  const dfs = (list: Snake[], depth: number): boolean => {
    if (list.length === 0) return true;
    if (depth > MAX_DEPTH) return false;
    visited += 1;
    if (visited > MAX_VISITED) return false;
    const k = keyOf(list);
    if (memo.has(k)) return false;
    memo.add(k);

    for (const s of list) {
      const steps = slideSteps(s, list, size);
      if (!steps) continue;
      const n = steps.length;
      const finalHead = steps[n - 1];
      const exited =
        finalHead.x < 0 ||
        finalHead.x >= size ||
        finalHead.y < 0 ||
        finalHead.y >= size;
      let nextList: Snake[];
      if (exited) {
        nextList = list.filter((o) => o.id !== s.id);
      } else {
        const body = s.cells
          .slice(0, s.cells.length - n)
          .map((c) => ({ x: c.x + s.dir.x * n, y: c.y + s.dir.y * n }));
        const moved: Snake = { ...s, cells: [finalHead, ...body] };
        nextList = list.map((o) => (o.id === s.id ? moved : o));
      }
      if (dfs(nextList, depth + 1)) return true;
    }
    return false;
  };

  return dfs(snakesIn, 0);
}

export default function SnakePuzzleClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(0);
  const [snakesLeft, setSnakesLeft] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);
  const [bumpMsg, setBumpMsg] = useState<string | null>(null);
  const [size, setSize] = useState(12);

  const gameRef = useRef<GameState>({
    size: 12,
    snakes: [],
    particles: [],
    tick: 0,
    sliding: false,
  });
  const undoStack = useRef<Snapshot[]>([]);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- draw: module-level function, safe from the very first render ----
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGame(canvas, gameRef.current);
  }, []);

  // ---- helpers ----
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const turn90 = (
    dir: { x: number; y: number },
    sign: 1 | -1
  ): { x: number; y: number } => ({ x: -dir.y * sign, y: dir.x * sign });

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  // ---- level generation with FULL solvability guarantee ----
  const generateLevel = useCallback((lv: number) => {
    const size = Math.min(12 + Math.floor((lv - 1) / 2), 18);
    const numSnakes = Math.min(3 + Math.floor((lv - 1) / 2), 10);
    const minLen = Math.min(4 + Math.floor((lv - 1) / 4), 6);
    const maxLen = Math.min(6 + Math.floor((lv - 1) / 3), 9);

    // trivial fallback: snakes on separate rows, head at right end facing
    // right with body behind — every snake can exit immediately.
    const fallback = (): Snake[] => {
      const snakes: Snake[] = [];
      for (let i = 0; i < numSnakes; i += 1) {
        const len = minLen;
        const row = i * 2;
        if (row >= size) break;
        const p = PALETTE[i % PALETTE.length];
        const cells = Array.from({ length: len }, (_, k) => ({
          x: len - 1 - k,
          y: row,
        }));
        snakes.push({
          id: i,
          cells,
          dir: { x: 1, y: 0 },
          color: p.color,
          colorDark: p.dark,
        });
      }
      return snakes;
    };

    for (let attemptLevel = 0; attemptLevel < 40; attemptLevel += 1) {
      const snakes: Snake[] = [];
      const occupied = new Set<string>();

      let guard = 0;
      while (snakes.length < numSnakes && guard < 900) {
        guard += 1;
        let placed: { cells: Cell[]; dir: { x: number; y: number } } | null =
          null;

        for (let attempt = 0; attempt < 60 && !placed; attempt += 1) {
          const len = rand(minLen, maxLen);
          const start = { x: rand(1, size - 2), y: rand(1, size - 2) };
          let dir = dirs[rand(0, 3)];
          const path: Cell[] = [{ ...start }];
          let cur = { ...start };
          let turns = 0;
          let ok = true;

          while (path.length < len) {
            if (turns < 3 && Math.random() < 0.32) {
              dir = turn90(dir, Math.random() < 0.5 ? 1 : -1);
              turns += 1;
            }
            const nx = cur.x + dir.x;
            const ny = cur.y + dir.y;
            if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
              ok = false;
              break;
            }
            if (path.some((c) => c.x === nx && c.y === ny)) {
              ok = false;
              break;
            }
            path.push({ x: nx, y: ny });
            cur = { x: nx, y: ny };
          }

          if (!ok || path.length < 4) continue;
          if (path.some((c) => occupied.has(`${c.x},${c.y}`))) continue;

          const head = path[0];
          const neck = path[1];
          const hdir = {
            x: Math.sign(head.x - neck.x),
            y: Math.sign(head.y - neck.y),
          };

          let selfBlocked = false;
          for (let k = 1; k < size; k += 1) {
            const rx = head.x + hdir.x * k;
            const ry = head.y + hdir.y * k;
            if (rx < 0 || rx >= size || ry < 0 || ry >= size) break;
            if (path.some((c, idx) => idx > 0 && c.x === rx && c.y === ry)) {
              selfBlocked = true;
              break;
            }
          }
          if (selfBlocked) continue;

          placed = { cells: path, dir: hdir };
        }

        if (!placed) continue;
        placed.cells.forEach((c) => occupied.add(`${c.x},${c.y}`));
        const p = PALETTE[snakes.length % PALETTE.length];
        snakes.push({
          id: snakes.length,
          cells: placed.cells,
          dir: placed.dir,
          color: p.color,
          colorDark: p.dark,
        });
      }

      if (snakes.length === 0) continue;

      if (isSolvable(snakes, size)) {
        return { size, snakes };
      }
    }

    return { size, snakes: fallback() };
  }, []);

  const clearTimers = () => {
    if (slideTimer.current) {
      clearTimeout(slideTimer.current);
      slideTimer.current = null;
    }
    if (bumpTimer.current) {
      clearTimeout(bumpTimer.current);
      bumpTimer.current = null;
    }
  };

  const startLevel = useCallback(
    (lv: number) => {
      clearTimers();
      const { size: sz, snakes } = generateLevel(lv);
      const g = gameRef.current;
      g.size = sz;
      g.snakes = snakes;
      g.particles = [];
      g.sliding = false;
      undoStack.current = [];
      setSize(sz);
      setLevel(lv);
      setSnakesLeft(snakes.length);
      setCleared(false);
      setBumpMsg(null);
      try {
        sessionStorage.setItem("multitool-snake-puzzle-level", String(lv));
      } catch {
        // ignore
      }
      sound.start();
      draw();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generateLevel]
  );

  // mount
  useEffect(() => {
    let lv = 1;
    try {
      const saved = Number(
        sessionStorage.getItem("multitool-snake-puzzle-level") ?? 1
      );
      if (!Number.isNaN(saved) && saved >= 1) lv = saved;
      const savedBest = Number(
        sessionStorage.getItem("multitool-snake-puzzle-best") ?? 0
      );
      if (!Number.isNaN(savedBest)) setBest(savedBest);
    } catch {
      // ignore
    }
    setReady(true);
    startLevel(lv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- click: slide the snake all the way ----
  const clickAt = useCallback(
    (px: number, py: number) => {
      const g = gameRef.current;
      if (cleared || g.sliding) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = rect.width / (g.size * CELL);
      const cx = Math.floor((px - rect.left) / (CELL * scale));
      const cy = Math.floor((py - rect.top) / (CELL * scale));
      if (cx < 0 || cx >= g.size || cy < 0 || cy >= g.size) return;

      const snake = g.snakes.find((s) =>
        s.cells.some((c) => c.x === cx && c.y === cy)
      );
      if (!snake) return;

      const steps: Cell[] = [];
      let head = { ...snake.cells[0] };
      let blocked = false;
      for (let i = 0; i < 60; i += 1) {
        const nx = head.x + snake.dir.x;
        const ny = head.y + snake.dir.y;
        if (nx < 0 || nx >= g.size || ny < 0 || ny >= g.size) {
          steps.push({ x: nx, y: ny });
          steps.push({ x: nx + snake.dir.x, y: ny + snake.dir.y });
          steps.push({ x: nx + snake.dir.x * 2, y: ny + snake.dir.y * 2 });
          blocked = false;
          break;
        }
        const occupied = new Set<string>();
        g.snakes.forEach((s) =>
          s.cells.forEach((c) => occupied.add(`${c.x},${c.y}`))
        );
        if (occupied.has(`${nx},${ny}`)) {
          blocked = true;
          break;
        }
        steps.push({ x: nx, y: ny });
        head = { x: nx, y: ny };
      }

      if (steps.length === 0) {
        sound.bump();
        setBumpMsg("Blocked!");
        setTimeout(() => setBumpMsg(null), 600);
        return;
      }

      undoStack.current.push({
        snakes: g.snakes.map((s) => ({
          ...s,
          cells: s.cells.map((c) => ({ ...c })),
        })),
        snakesLeft: g.snakes.length,
      });
      if (undoStack.current.length > 30) undoStack.current.shift();

      g.sliding = true;
      const total = steps.length;
      let i = 0;
      const stepFn = () => {
        if (i < total) {
          const next = steps[i];
          i += 1;
          snake.cells.pop();
          snake.cells.unshift(next);
          sound.slide();
          draw();
          slideTimer.current = setTimeout(stepFn, SLIDE_MS);
        } else {
          g.sliding = false;
          const headCell = snake.cells[0];
          const exited =
            headCell.x < 0 ||
            headCell.x >= g.size ||
            headCell.y < 0 ||
            headCell.y >= g.size;
          if (exited) {
            sound.exit();
            const last = snake.cells[snake.cells.length - 1];
            for (let k = 0; k < 16; k += 1) {
              g.particles.push({
                x: last.x * CELL + CELL / 2,
                y: last.y * CELL + CELL / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: snake.color,
              });
            }
            g.snakes = g.snakes.filter((s) => s.id !== snake.id);
            setSnakesLeft(g.snakes.length);
            if (g.snakes.length === 0) {
              setCleared(true);
              sound.levelClear();
              setBest((prev) => {
                const nb = Math.max(prev, level);
                try {
                  sessionStorage.setItem(
                    "multitool-snake-puzzle-best",
                    String(nb)
                  );
                } catch {
                  // ignore
                }
                return nb;
              });
            }
          } else if (blocked) {
            sound.bump();
            setBumpMsg("Bumped!");
            bumpTimer.current = setTimeout(() => setBumpMsg(null), 700);
          }
          draw();
        }
      };
      stepFn();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cleared, level, draw]
  );

  // ---- undo ----
  const undo = useCallback(() => {
    const g = gameRef.current;
    if (g.sliding || cleared) return;
    const snap = undoStack.current.pop();
    if (!snap) return;
    g.snakes = snap.snakes;
    g.particles = [];
    setSnakesLeft(snap.snakesLeft);
    sound.undo();
    draw();
  }, [cleared, draw]);

  // ---- particles loop ----
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      const g = gameRef.current;
      if (g.particles.length > 0) {
        g.particles = g.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.05,
          }))
          .filter((p) => p.life > 0);
        draw();
      }
      g.tick += 1;
    }, 30);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  // draw on mount / state changes
  useEffect(() => {
    if (ready) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, level, snakesLeft, cleared, size]);

  const canvasSize = (gameRef.current.size || 12) * CELL;
  const canUndo = undoStack.current.length > 0;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-3 gap-3 max-w-[520px] mx-auto w-full">
        <StatBlock label="LEVEL" value={String(level)} highlight />
        <StatBlock label="SNAKES LEFT" value={String(snakesLeft)} />
        <button
          type="button"
          onClick={() => {
            setSoundOn((prev) => {
              sound.enabled = !prev;
              return !prev;
            });
          }}
          className={`border rounded-lg px-3 py-3 font-mono text-xs font-semibold transition-colors ${
            soundOn
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-paper border-ink/10 text-ink/60"
          }`}
        >
          {soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF"}
        </button>
      </div>

      {/* Board */}
      <div className="relative mx-auto touch-none select-none w-full max-w-[560px]">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onClick={(e) => clickAt(e.clientX, e.clientY)}
          onTouchEnd={(e) => {
            const t = e.changedTouches[0];
            clickAt(t.clientX, t.clientY);
          }}
          className="rounded-2xl border border-ink/10 w-full h-auto shadow-lg shadow-deep/10 cursor-pointer"
        />
        {bumpMsg && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-accent text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-full shadow-lg animate-pulse">
            {bumpMsg}
          </div>
        )}
        {cleared && (
          <div className="absolute inset-0 bg-deep/85 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-4xl font-bold text-accent">
              LEVEL {level} CLEAR!
            </span>
            <span className="font-mono text-sm text-paper/70">
              {level} {level === 1 ? "level" : "levels"} completed · best: {best}
            </span>
            <button
              type="button"
              onClick={() => startLevel(level + 1)}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              NEXT LEVEL →
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo || cleared}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-30"
        >
          ↶ UNDO
        </button>
        <button
          type="button"
          onClick={() => startLevel(level)}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          RESTART LEVEL
        </button>
        <button
          type="button"
          onClick={() => startLevel(1)}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          NEW RUN
        </button>
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">How to play:</strong> click a snake and
        it slides all the way forward — out of the board if the path is
        clear. If it bumps another snake, it stops. Slide every snake off to
        clear the level. Every level is guaranteed solvable — and UNDO is
        there if you make a wrong move.
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
