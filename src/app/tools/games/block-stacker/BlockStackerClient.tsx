"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 20;
const CELL = 28;

// ---- Tetromino shapes ----
const SHAPES: { name: string; color: string; matrix: number[][] }[] = [
  { name: "I", color: "#22d3ee", matrix: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] },
  { name: "O", color: "#facc15", matrix: [[1,1],[1,1]] },
  { name: "T", color: "#a78bfa", matrix: [[0,1,0],[1,1,1],[0,0,0]] },
  { name: "S", color: "#34d399", matrix: [[0,1,1],[1,1,0],[0,0,0]] },
  { name: "Z", color: "#f87171", matrix: [[1,1,0],[0,1,1],[0,0,0]] },
  { name: "J", color: "#3b82f6", matrix: [[1,0,0],[1,1,1],[0,0,0]] },
  { name: "L", color: "#fb923c", matrix: [[0,0,1],[1,1,1],[0,0,0]] },
];

interface ActivePiece {
  shape: number;
  matrix: number[][];
  x: number;
  y: number;
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
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.1, slideTo?: number, delay = 0) {
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
  move() { this.tone(200, 0.04, "square", 0.03, 260); }
  rotate() { this.tone(300, 0.05, "triangle", 0.06, 380); }
  drop() { this.tone(150, 0.06, "square", 0.05, 90); }
  lock() { this.tone(180, 0.08, "triangle", 0.08, 120); }
  line(n: number) { for (let i = 0; i < n; i += 1) this.tone(500 + i * 120, 0.1, "triangle", 0.1); }
  levelUp() { const n = [523, 659, 784, 1047]; n.forEach((f, i) => this.tone(f, 0.14, "triangle", 0.1, undefined, i * 0.08)); }
  gameOver() { this.tone(300, 0.5, "sawtooth", 0.14, 70); this.tone(150, 0.7, "sawtooth", 0.1, 50, 0.15); }
}
const sound = new Sound();

// ---- Mini preview (module-level, so it doesn't remount every render) ----
function MiniPreview({ shapeIdx, label }: { shapeIdx: number | null; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 80, 80);
    if (shapeIdx === null) return;
    const shape = SHAPES[shapeIdx];
    const m = shape.matrix;
    const cs = 14;
    const ox = (80 - m[0].length * cs) / 2;
    const oy = (80 - m.length * cs) / 2;
    ctx.fillStyle = shape.color;
    ctx.shadowColor = shape.color;
    ctx.shadowBlur = 8;
    for (let r = 0; r < m.length; r += 1) {
      for (let c = 0; c < m[r].length; c += 1) {
        if (m[r][c]) ctx.fillRect(ox + c * cs, oy + r * cs, cs - 2, cs - 2);
      }
    }
  }, [shapeIdx]);
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col items-center">
      <span className="font-mono text-[10px] tracking-widest text-paper/50 mb-1">{label}</span>
      <canvas ref={ref} width={80} height={80} />
    </div>
  );
}

export default function BlockStackerClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [nextShape, setNextShape] = useState(0);
  const [holdShape, setHoldShape] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);

  const g = useRef({
    board: Array.from({ length: ROWS }, () => Array<number>(COLS).fill(-1)),
    active: null as ActivePiece | null,
    bag: [] as number[],
    holdUsed: false,
    running: false,
    tick: 0,
  });
  const undoStack = useRef<{ board: number[][]; active: ActivePiece | null }[]>([]);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const holdRef = useRef<number | null>(null);

  // ---- piece bag ----
  const refillBag = () => {
    const bag = SHAPES.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
  };

  const collides = (board: number[][], m: number[][], x: number, y: number) => {
    for (let r = 0; r < m.length; r += 1) {
      for (let c = 0; c < m[r].length; c += 1) {
        if (!m[r][c]) continue;
        const bx = x + c;
        const by = y + r;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by >= 0 && board[by][bx] !== -1) return true;
      }
    }
    return false;
  };

  const spawn = useCallback((shapeIdx: number | null = null) => {
    const st = g.current;
    let idx = shapeIdx;
    if (idx === null) {
      if (st.bag.length === 0) st.bag = refillBag();
      idx = st.bag.shift()!;
    }
    const shape = SHAPES[idx];
    const matrix = shape.matrix.map((row) => [...row]);
    const piece: ActivePiece = {
      shape: idx,
      matrix,
      x: Math.floor((COLS - matrix[0].length) / 2),
      y: 0,
    };
    if (collides(st.board, piece.matrix, piece.x, piece.y)) {
      st.running = false;
      setOver(true);
      sound.gameOver();
      setBest((prev) => {
        const nb = Math.max(prev, scoreRef.current);
        try { sessionStorage.setItem("multitool-bs-best", String(nb)); } catch { /* ignore */ }
        return nb;
      });
      return;
    }
    st.active = piece;
    st.holdUsed = false;
    const nextIdx = st.bag.length > 0 ? st.bag[0] : refillBag()[0];
    setNextShape(nextIdx);
  }, []);

  const start = useCallback(() => {
    const st = g.current;
    st.board = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(-1));
    st.bag = refillBag();
    st.holdUsed = false;
    st.running = true;
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    holdRef.current = null;
    setScore(0);
    setLevel(1);
    setLines(0);
    setHoldShape(null);
    setOver(false);
    setPaused(false);
    spawn();
  }, [spawn]);

  useEffect(() => {
    try {
      const saved = Number(sessionStorage.getItem("multitool-bs-best") ?? 0);
      if (!Number.isNaN(saved)) setBest(saved);
    } catch { /* ignore */ }
    setReady(true);
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateMatrix = (m: number[][], dir: 1 | -1) => {
    const n = m.length;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < n; c += 1) {
        if (dir === 1) res[c][n - 1 - r] = m[r][c];
        else res[n - 1 - c][r] = m[r][c];
      }
    }
    return res;
  };

  const lockPiece = useCallback(() => {
    const st = g.current;
    const a = st.active!;
    for (let r = 0; r < a.matrix.length; r += 1) {
      for (let c = 0; c < a.matrix[r].length; c += 1) {
        if (!a.matrix[r][c]) continue;
        const by = a.y + r;
        const bx = a.x + c;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          st.board[by][bx] = a.shape;
        }
      }
    }
    let cleared = 0;
    const remaining = st.board.filter((row) => {
      const full = row.every((v) => v !== -1);
      if (full) cleared += 1;
      return !full;
    });
    while (remaining.length < ROWS) remaining.unshift(Array(COLS).fill(-1));
    st.board = remaining;

    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][cleared] * levelRef.current;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      sound.line(cleared);
      linesRef.current += cleared;
      setLines(linesRef.current);
      const newLevel = Math.floor(linesRef.current / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
        sound.levelUp();
      }
    } else {
      sound.lock();
    }
    spawn();
  }, [spawn]);

  // silent flag: no sound on auto-fall (fixes the constant ticking)
  const tryMove = (dx: number, dy: number, silent = false) => {
    const st = g.current;
    const a = st.active;
    if (!a || !st.running) return false;
    if (!collides(st.board, a.matrix, a.x + dx, a.y + dy)) {
      a.x += dx;
      a.y += dy;
      if (!silent) sound.move();
      return true;
    }
    return false;
  };

  const tryRotate = () => {
    const st = g.current;
    const a = st.active;
    if (!a || !st.running) return;
    if (a.shape === 1) return;
    const rotated = rotateMatrix(a.matrix, 1);
    const kicks = [0, -1, 1, -2, 2];
    for (const k of kicks) {
      if (!collides(st.board, rotated, a.x + k, a.y)) {
        a.matrix = rotated;
        a.x += k;
        sound.rotate();
        return;
      }
    }
  };

  const hardDrop = () => {
    const st = g.current;
    const a = st.active;
    if (!a || !st.running) return;
    let d = 0;
    while (!collides(st.board, a.matrix, a.x, a.y + d + 1)) d += 1;
    a.y += d;
    sound.drop();
    lockPiece();
  };

  const hold = () => {
    const st = g.current;
    const a = st.active;
    if (!a || !st.running || st.holdUsed) return;
    st.holdUsed = true;
    const current = a.shape;
    if (holdRef.current === null) {
      holdRef.current = current;
      setHoldShape(current);
      spawn();
    } else {
      const held = holdRef.current;
      holdRef.current = current;
      setHoldShape(current);
      spawn(held);
    }
    sound.rotate();
  };

  const ghostY = () => {
    const st = g.current;
    const a = st.active;
    if (!a) return -1;
    let d = 0;
    while (!collides(st.board, a.matrix, a.x, a.y + d + 1)) d += 1;
    return a.y + d;
  };

  // ---- touch swipe on the board (mobile) ----
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onBoardTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onBoardTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal swipe = move
      tryMove(dx > 0 ? 1 : -1, 0);
    } else if (dy > 0) {
      // swipe down = hard drop
      hardDrop();
    } else {
      // swipe up = rotate
      tryRotate();
    }
    touchStart.current = null;
  };

  // ---- keyboard ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = g.current;
      if (!st.running || over) return;
      switch (e.key) {
        case "ArrowLeft": case "a": case "A": e.preventDefault(); tryMove(-1, 0); break;
        case "ArrowRight": case "d": case "D": e.preventDefault(); tryMove(1, 0); break;
        case "ArrowDown": case "s": case "S": e.preventDefault(); tryMove(0, 1); break;
        case "ArrowUp": case "x": case "X": e.preventDefault(); tryRotate(); break;
        case " ": e.preventDefault(); hardDrop(); break;
        case "c": case "C": case "Shift": e.preventDefault(); hold(); break;
        case "p": case "P": setPaused((p) => { st.running = !p; return !p; }); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  // ---- game loop (silent auto-fall) ----
  useEffect(() => {
    if (!ready || !g.current.running || paused || over) return;
    const speed = Math.max(80, 800 - (level - 1) * 60);
    const interval = setInterval(() => {
      if (!g.current.running || paused) return;
      g.current.tick += 1;
      if (!tryMove(0, 1, true)) {
        lockPiece();
      }
      draw();
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, paused, over, level]);

  // ---- drawing ----
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = g.current;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0d2230");
    grad.addColorStop(1, "#081620");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i += 1) {
      ctx.beginPath(); ctx.moveTo(i * CELL + 0.5, 0); ctx.lineTo(i * CELL + 0.5, H); ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j += 1) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL + 0.5); ctx.lineTo(W, j * CELL + 0.5); ctx.stroke();
    }

    const drawCell = (bx: number, by: number, shapeIdx: number, alpha = 1) => {
      if (bx < 0 || bx >= COLS || by < 0 || by >= ROWS || shapeIdx < 0) return;
      const shape = SHAPES[shapeIdx];
      const x = bx * CELL;
      const y = by * CELL;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = shape.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = shape.color;
      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(x + 2, y + 2, CELL - 4, 4);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(x + 2, y + CELL - 6, CELL - 4, 4);
      ctx.globalAlpha = 1;
    };

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (st.board[r][c] !== -1) drawCell(c, r, st.board[r][c]);
      }
    }

    const a = st.active;
    if (a) {
      const gy = ghostY();
      for (let r = 0; r < a.matrix.length; r += 1) {
        for (let c = 0; c < a.matrix[r].length; c += 1) {
          if (a.matrix[r][c]) drawCell(a.x + c, gy + r, a.shape, 0.22);
        }
      }
      for (let r = 0; r < a.matrix.length; r += 1) {
        for (let c = 0; c < a.matrix[r].length; c += 1) {
          if (a.matrix[r][c]) drawCell(a.x + c, a.y + r, a.shape);
        }
      }
    }

    ctx.strokeStyle = "rgba(34,211,238,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }, []);

  useEffect(() => {
    if (ready) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, over, paused, level]);

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[560px] mx-auto w-full">
        <StatBlock label="SCORE" value={String(score)} highlight />
        <StatBlock label="BEST" value={String(best)} />
        <StatBlock label="LEVEL" value={String(level)} />
        <StatBlock label="LINES" value={String(lines)} />
      </div>

      <div className="flex gap-3 mx-auto w-full max-w-[560px]">
        {/* Side */}
        <div className="flex flex-col gap-3">
          <MiniPreview shapeIdx={holdShape} label="HOLD (C)" />
          <MiniPreview shapeIdx={nextShape} label="NEXT" />
          <button
            type="button"
            onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
            className={`border rounded-lg px-3 py-2 font-mono text-xs font-semibold transition-colors ${
              soundOn ? "bg-accent/20 border-accent/40 text-accent" : "bg-white/5 border-white/15 text-paper/60"
            }`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
        </div>

        {/* Board */}
        <div className="relative mx-auto touch-none select-none">
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            onTouchStart={onBoardTouchStart}
            onTouchEnd={onBoardTouchEnd}
            className="rounded-xl border border-white/10 shadow-lg shadow-black/40 max-w-[280px] w-full h-auto"
          />
          {over && (
            <div className="absolute inset-0 bg-deep/85 rounded-xl flex flex-col items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-paper">GAME OVER</span>
              <span className="font-mono text-sm text-accent">SCORE: {score}</span>
              <button
                type="button"
                onClick={start}
                className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
          {paused && !over && (
            <div className="absolute inset-0 bg-deep/85 rounded-xl flex flex-col items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-paper">PAUSED</span>
              <button
                type="button"
                onClick={() => { g.current.running = true; setPaused(false); }}
                className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
              >
                RESUME
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Touch controls (mobile only) */}
      <div className="sm:hidden flex flex-col gap-3 mx-auto w-full max-w-[360px]">
        <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
          <div />
          <button
            type="button"
            onClick={() => tryRotate()}
            className="bg-white/10 border border-white/15 rounded-xl py-4 font-mono text-lg text-paper active:bg-accent active:border-accent"
            aria-label="Rotate"
          >
            ⟳
          </button>
          <div />
          <button
            type="button"
            onClick={() => tryMove(-1, 0)}
            className="bg-white/10 border border-white/15 rounded-xl py-4 font-mono text-lg text-paper active:bg-accent active:border-accent"
            aria-label="Left"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => tryMove(0, 1)}
            className="bg-white/10 border border-white/15 rounded-xl py-4 font-mono text-lg text-paper active:bg-accent active:border-accent"
            aria-label="Soft drop"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={() => tryMove(1, 0)}
            className="bg-white/10 border border-white/15 rounded-xl py-4 font-mono text-lg text-paper active:bg-accent active:border-accent"
            aria-label="Right"
          >
            ▶
          </button>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={hardDrop}
            className="flex-1 bg-accent text-paper font-mono text-xs tracking-widest px-4 py-3 rounded-xl active:opacity-80"
          >
            ⤓ DROP
          </button>
          <button
            type="button"
            onClick={hold}
            className="flex-1 bg-white/10 border border-white/15 text-paper font-mono text-xs tracking-widest px-4 py-3 rounded-xl active:bg-accent active:border-accent"
          >
            ⇄ HOLD
          </button>
        </div>
        <p className="text-center font-mono text-[10px] text-paper/50">
          OR SWIPE: ← → move · ↑ rotate · ↓ drop
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">Controls:</strong> ← → move · ↑/X
        rotate · ↓ soft drop · SPACE hard drop · C hold · P pause. On
        mobile use the buttons or swipe. Clear 10 lines to level up — speed
        keeps rising!
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
