"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 22;
const ROWS = 22;
const CELL = 22;
const BASE_SPEED = 130; // ms per tick

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

// ---- Tiny sound engine (Web Audio API, no files needed) ----
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

  private beep(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.15,
    slideTo?: number
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(
        slideTo,
        ctx.currentTime + duration
      );
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  eat() {
    this.beep(420, 0.12, "triangle", 0.18, 880);
  }
  turn() {
    this.beep(220, 0.05, "square", 0.05);
  }
  over() {
    this.beep(300, 0.5, "sawtooth", 0.15, 80);
    setTimeout(() => this.beep(150, 0.6, "sawtooth", 0.12, 60), 200);
  }
  start() {
    this.beep(330, 0.1, "triangle", 0.12, 660);
  }
}

const sound = new Sound();

export default function SnakeClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const stateRef = useRef({
    snake: [] as Point[],
    dir: "right" as Dir,
    nextDir: "right" as Dir,
    food: { x: 14, y: 11 } as Point,
    tick: 0,
    score: 0,
    over: false,
    paused: false,
    particles: [] as { x: number; y: number; life: number }[],
    trail: [] as { x: number; y: number; life: number }[],
    stars: Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.4,
      speed: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
    })),
    gridOffset: 0,
  });

  // Load best score
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("multitool-snake-best") ?? 0);
      if (!Number.isNaN(saved)) setBest(saved);
    } catch {
      // ignore
    }
  }, []);

  const randomFood = useCallback((): Point => {
    const s = stateRef.current;
    let p: Point;
    do {
      p = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (s.snake.some((seg) => seg.x === p.x && seg.y === p.y));
    return p;
  }, []);

  const reset = useCallback(() => {
    const s = stateRef.current;
    s.snake = [
      { x: 10, y: 11 },
      { x: 9, y: 11 },
      { x: 8, y: 11 },
    ];
    s.dir = "right";
    s.nextDir = "right";
    s.tick = 0;
    s.score = 0;
    s.over = false;
    s.paused = false;
    s.particles = [];
    s.trail = [];
    s.food = randomFood();
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    sound.start();
  }, [randomFood]);

  const turn = useCallback((dir: Dir) => {
    const s = stateRef.current;
    if (dir === OPPOSITE[s.dir] || dir === s.dir) return;
    s.nextDir = dir;
    sound.turn();
  }, []);

  // Keyboard
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
        turn(map[e.key]);
      }
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => {
          stateRef.current.paused = !p;
          return !p;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  // Touch swipe
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
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? "right" : "left");
    else turn(dy > 0 ? "down" : "up");
    touchStart.current = null;
  };

  const step = useCallback(() => {
    const s = stateRef.current;
    s.dir = s.nextDir;
    const head = s.snake[0];
    let nh: Point;
    switch (s.dir) {
      case "up": nh = { x: head.x, y: head.y - 1 }; break;
      case "down": nh = { x: head.x, y: head.y + 1 }; break;
      case "left": nh = { x: head.x - 1, y: head.y }; break;
      default: nh = { x: head.x + 1, y: head.y }; break;
    }
    if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) {
      endGame();
      return;
    }
    const willGrow = nh.x === s.food.x && nh.y === s.food.y;
    const bodyToCheck = willGrow ? s.snake : s.snake.slice(0, -1);
    if (bodyToCheck.some((seg) => seg.x === nh.x && seg.y === nh.y)) {
      endGame();
      return;
    }
    s.snake.unshift(nh);
    if (willGrow) {
      s.score += 10;
      setScore(s.score);
      setFlash((f) => f + 1);
      sound.eat();
      for (let i = 0; i < 10; i += 1) {
        s.particles.push({
          x: s.food.x * CELL + CELL / 2,
          y: s.food.y * CELL + CELL / 2,
          life: 1,
        });
      }
      s.food = randomFood();
    } else {
      s.snake.pop();
    }
    // trail glow behind tail
    const tail = s.snake[s.snake.length - 1];
    if (tail) {
      s.trail.push({ x: tail.x, y: tail.y, life: 1 });
    }
    s.trail = s.trail
      .map((p) => ({ ...p, life: p.life - 0.08 }))
      .filter((p) => p.life > 0);
    s.particles = s.particles
      .map((p) => ({ ...p, life: p.life - 0.1 }))
      .filter((p) => p.life > 0);
    s.gridOffset = (s.gridOffset + 1) % CELL;
  }, [randomFood]);

  const endGame = useCallback(() => {
    const s = stateRef.current;
    s.over = true;
    setGameOver(true);
    setRunning(false);
    sound.over();
    setBest((prev) => {
      const nb = Math.max(prev, s.score);
      try {
        localStorage.setItem("multitool-snake-best", String(nb));
      } catch {
        // ignore
      }
      return nb;
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    // ---- animated background: drifting grid + stars ----
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0d2230");
    grad.addColorStop(0.5, "#0b1c28");
    grad.addColorStop(1, "#081620");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // stars (twinkle)
    s.stars.forEach((st) => {
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(s.tick * 0.05 + st.phase));
      ctx.globalAlpha = tw * 0.5;
      ctx.fillStyle = "#a5f3fc";
      ctx.beginPath();
      ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // moving grid (offset drifts down-left slowly)
    const off = s.gridOffset;
    ctx.strokeStyle = "rgba(34,211,238,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, H);
      ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j += 1) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL + 0.5);
      ctx.lineTo(W, j * CELL + 0.5);
      ctx.stroke();
    }
    // drift highlight lines
    ctx.strokeStyle = "rgba(34,211,238,0.10)";
    for (let i = 0; i <= COLS; i += 1) {
      const x = ((i * CELL + off) % (W + CELL)) - CELL;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
      ctx.stroke();
    }

    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // ---- trail glow ----
    s.trail.forEach((p) => {
      ctx.globalAlpha = p.life * 0.18;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(p.x * CELL + CELL / 2, p.y * CELL + CELL / 2, CELL * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // ---- food: pulsing glow ----
    const f = s.food;
    const pulse = 0.5 + 0.5 * Math.sin(s.tick * 0.35);
    const fx = f.x * CELL + CELL / 2;
    const fy = f.y * CELL + CELL / 2;
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 14 + pulse * 8;
    const ring = ctx.createRadialGradient(fx, fy, 1, fx, fy, CELL * 0.8);
    ring.addColorStop(0, "#ffd9a8");
    ring.addColorStop(0.4, "#fb923c");
    ring.addColorStop(1, "#ea580c");
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 2 + pulse * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // ---- snake body: rounded segments with gradient ----
    const len = s.snake.length;
    s.snake.forEach((seg, i) => {
      const t = i / Math.max(1, len - 1);
      const pad = i === 0 ? 1 : 1.5 + t * 1.2;
      const x = seg.x * CELL + pad;
      const y = seg.y * CELL + pad;
      const size = CELL - pad * 2;
      const r = Math.round(103 + t * -60);
      const g = Math.round(232 + t * -90);
      const b = Math.round(249 + t * -80);
      ctx.shadowColor = "rgba(34,211,238,0.55)";
      ctx.shadowBlur = i === 0 ? 14 : 6;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      const rad = i === 0 ? CELL * 0.32 : CELL * 0.26;
      roundRect(ctx, x, y, size, size, rad);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // ---- head details: eyes ----
    const head = s.snake[0];
    if (head) {
      const hx = head.x * CELL;
      const hy = head.y * CELL;
      const eyeR = CELL * 0.11;
      const pupilR = CELL * 0.055;
      const eyeOffset = CELL * 0.18;
      const fwdOffset = CELL * 0.24;
      let e1x = hx, e1y = hy, e2x = hx, e2y = hy;
      let px = 0, py = 0;
      switch (s.dir) {
        case "right":
          e1x = hx + fwdOffset; e1y = hy + eyeOffset;
          e2x = hx + fwdOffset; e2y = hy + CELL - eyeOffset;
          px = 1; py = 0;
          break;
        case "left":
          e1x = hx + CELL - fwdOffset; e1y = hy + eyeOffset;
          e2x = hx + CELL - fwdOffset; e2y = hy + CELL - eyeOffset;
          px = -1; py = 0;
          break;
        case "up":
          e1x = hx + eyeOffset; e1y = hy + fwdOffset;
          e2x = hx + CELL - eyeOffset; e2y = hy + fwdOffset;
          px = 0; py = -1;
          break;
        case "down":
          e1x = hx + eyeOffset; e1y = hy + CELL - fwdOffset;
          e2x = hx + CELL - eyeOffset; e2y = hy + CELL - fwdOffset;
          px = 0; py = 1;
          break;
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2);
      ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b1c28";
      ctx.beginPath();
      ctx.arc(e1x + px * 2, e1y + py * 2, pupilR, 0, Math.PI * 2);
      ctx.arc(e2x + px * 2, e2y + py * 2, pupilR, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- particles ----
    s.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5 * p.life + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // ---- border glow ----
    ctx.strokeStyle = "rgba(34,211,238,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }, []);

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Game loop
  useEffect(() => {
    if (!running || paused || gameOver) return;
    const interval = setInterval(() => {
      stateRef.current.tick += 1;
      step();
      draw();
    }, BASE_SPEED);
    return () => clearInterval(interval);
  }, [running, paused, gameOver, step, draw]);

  // draw on mount + flash effect
  useEffect(() => {
    draw();
  }, [draw, running, paused, gameOver, score, flash]);

  const toggleSound = () => {
    setSoundOn((prev) => {
      sound.enabled = !prev;
      return !prev;
    });
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Score bar */}
      <div className="grid grid-cols-3 gap-3 max-w-[560px] mx-auto w-full">
        <StatBlock label="SCORE" value={String(score)} highlight />
        <StatBlock label="BEST" value={String(best)} />
        <button
          type="button"
          onClick={toggleSound}
          className={`border rounded-lg px-3 py-3 font-mono text-xs font-semibold transition-colors ${
            soundOn
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-paper border-ink/10 text-ink/60"
          }`}
        >
          {soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF"}
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative mx-auto touch-none select-none w-full max-w-[560px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="rounded-2xl border border-ink/10 w-full h-auto shadow-lg shadow-deep/30"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-deep/85 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-4xl font-bold text-paper">
              GAME OVER
            </span>
            <span className="font-mono text-sm text-accent">
              SCORE: {score} · BEST: {best}
            </span>
            <button
              type="button"
              onClick={reset}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
        {!running && !gameOver && (
          <div className="absolute inset-0 bg-deep/85 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-4xl font-bold text-paper">
              SNAKE
            </span>
            <span className="font-mono text-xs text-paper/70">
              ARROWS / WASD / SWIPE TO MOVE
            </span>
            <button
              type="button"
              onClick={reset}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              START
            </button>
          </div>
        )}
        {paused && running && !gameOver && (
          <div className="absolute inset-0 bg-deep/85 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-4xl font-bold text-paper">
              PAUSED
            </span>
            <button
              type="button"
              onClick={() => {
                stateRef.current.paused = false;
                setPaused(false);
              }}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              RESUME
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        {running && !gameOver && (
          <button
            type="button"
            onClick={() => {
              stateRef.current.paused = !paused;
              setPaused(!paused);
            }}
            className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
          >
            {paused ? "RESUME" : "PAUSE"}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto sm:hidden">
        <div />
        <button
          type="button"
          onClick={() => turn("up")}
          className="bg-deep text-paper rounded-lg py-3 font-mono text-lg hover:bg-accent"
          aria-label="Up"
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          onClick={() => turn("left")}
          className="bg-deep text-paper rounded-lg py-3 font-mono text-lg hover:bg-accent"
          aria-label="Left"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => turn("down")}
          className="bg-deep text-paper rounded-lg py-3 font-mono text-lg hover:bg-accent"
          aria-label="Down"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={() => turn("right")}
          className="bg-deep text-paper rounded-lg py-3 font-mono text-lg hover:bg-accent"
          aria-label="Right"
        >
          ▶
        </button>
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Controls:</strong> arrow keys or WASD
        to turn · spacebar to pause · swipe on mobile. Sound effects are
        generated in your browser — toggle with the sound button.
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
