"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const W = 600;
const H = 460;
const PADDLE_W = 90;
const PADDLE_H = 14;
const BALL_R = 7;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const BRICK_W = (W - 40) / BRICK_COLS - 4;
const BRICK_H = 20;

const LEVELS = [
  // level 1..10: [row] = hits needed (1 or 2), 0 = empty
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1, 2,1,1,1,1,1,1,1,1,2, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 2,1,1,1,1,1,1,1,1,2, 1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0, 1,2,1,1,1,1,1,1,2,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,2,2,1,1,1,1,1, 1,2,1,1,1,1,1,1,2,1, 0,1,1,1,1,1,1,1,1,0],
  [2,2,2,2,2,2,2,2,2,2, 2,1,1,1,1,1,1,1,1,2, 1,1,2,1,1,1,1,2,1,1, 1,1,2,1,1,1,1,2,1,1, 2,1,1,1,1,1,1,1,1,2, 2,2,2,2,2,2,2,2,2,2],
  [0,0,1,1,1,1,1,1,0,0, 0,1,2,2,1,1,2,2,1,0, 1,2,1,1,2,2,1,1,2,1, 1,2,1,1,2,2,1,1,2,1, 0,1,2,2,1,1,2,2,1,0, 0,0,1,1,1,1,1,1,0,0],
  [1,2,1,2,1,2,1,2,1,2, 2,1,2,1,2,1,2,1,2,1, 1,2,1,2,1,2,1,2,1,2, 2,1,2,1,2,1,2,1,2,1, 1,2,1,2,1,2,1,2,1,2, 2,1,2,1,2,1,2,1,2,1],
  [2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2],
  [0,0,2,2,2,2,2,2,0,0, 0,2,1,2,2,2,2,1,2,0, 2,1,1,2,2,2,2,1,1,2, 2,1,1,2,2,2,2,1,1,2, 0,2,1,2,2,2,2,1,2,0, 0,0,2,2,2,2,2,2,0,0],
  [2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 1,1,1,1,1,1,1,1,1,1, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2],
];

const BRICK_COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#facc15", "#fb923c", "#f87171"];

interface Brick {
  x: number;
  y: number;
  hits: number; // remaining hits
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: "wide" | "multi" | "slow";
  vy: number;
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
  brick() { this.tone(380 + Math.random() * 200, 0.06, "square", 0.08); }
  paddle() { this.tone(280, 0.05, "triangle", 0.1, 360); }
  wall() { this.tone(200, 0.04, "triangle", 0.06); }
  power() { this.tone(600, 0.12, "triangle", 0.12, 900); }
  loseBall() { this.tone(220, 0.3, "sawtooth", 0.12, 90); }
  levelUp() { const n = [523, 659, 784, 1047]; n.forEach((f, i) => this.tone(f, 0.14, "triangle", 0.12, undefined, i * 0.1)); }
  gameOver() { this.tone(300, 0.5, "sawtooth", 0.14, 70); }
}
const sound = new Sound();

export default function BrickBreakerClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<"idle" | "playing" | "over" | "won">("idle");
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);

  const g = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    paddleW: PADDLE_W,
    balls: [] as Ball[],
    bricks: [] as Brick[],
    powerups: [] as PowerUp[],
    score: 0,
    lives: 3,
    level: 1,
    running: false,
    slowTimer: 0,
    serving: true,
  });
  const mouseX = useRef(W / 2);

  useEffect(() => {
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildBricks = (lv: number) => {
    const pattern = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
    const bricks: Brick[] = [];
    for (let r = 0; r < BRICK_ROWS; r += 1) {
      for (let c = 0; c < BRICK_COLS; c += 1) {
        const hits = pattern[r * BRICK_COLS + c] ?? 0;
        if (hits === 0) continue;
        bricks.push({
          x: 20 + c * (BRICK_W + 4),
          y: 40 + r * (BRICK_H + 4),
          hits,
          alive: true,
        });
      }
    }
    return bricks;
  };

  const serveBall = () => {
    const s = g.current;
    s.balls = [{ x: s.paddleX + s.paddleW / 2, y: H - 60, vx: 3.5 * (Math.random() < 0.5 ? 1 : -1), vy: -4 }];
    s.serving = false;
  };

  const start = () => {
    const s = g.current;
    s.score = 0;
    s.lives = 3;
    s.level = 1;
    s.paddleX = W / 2 - PADDLE_W / 2;
    s.paddleW = PADDLE_W;
    s.bricks = buildBricks(1);
    s.powerups = [];
    s.running = true;
    s.slowTimer = 0;
    setScore(0);
    setLives(3);
    setLevel(1);
    setStatus("playing");
    serveBall();
  };

  const nextLevel = () => {
    const s = g.current;
    const nlv = s.level + 1;
    if (nlv > LEVELS.length) {
      s.running = false;
      setStatus("won");
      sound.levelUp();
      return;
    }
    s.level = nlv;
    s.bricks = buildBricks(nlv);
    s.powerups = [];
    s.paddleW = PADDLE_W;
    setLevel(nlv);
    sound.levelUp();
    serveBall();
  };

  const onMove = (clientX: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = W / rect.width;
    mouseX.current = (clientX - rect.left) * scale;
  };

  useEffect(() => {
    const onMouse = (e: MouseEvent) => onMove(e.clientX);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX);
    };
    const onKey = (e: KeyboardEvent) => {
      const s = g.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") s.paddleX = Math.max(0, s.paddleX - 26);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") s.paddleX = Math.min(W - s.paddleW, s.paddleX + 26);
      if (e.key === " " && s.serving) { e.preventDefault(); serveBall(); }
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ---- game loop ----
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const loop = () => {
      const s = g.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) draw(ctx, s);
      }
      if (s.running && status === "playing") {
        // paddle follows mouse
        const target = mouseX.current - s.paddleW / 2;
        s.paddleX += (target - s.paddleX) * 0.35;
        s.paddleX = Math.max(0, Math.min(W - s.paddleW, s.paddleX));

        if (s.slowTimer > 0) s.slowTimer -= 1;

        // balls
        const newBalls: Ball[] = [];
        s.balls.forEach((b) => {
          const speedMul = s.slowTimer > 0 ? 0.55 : 1;
          b.x += b.vx * speedMul;
          b.y += b.vy * speedMul;

          if (b.x - BALL_R < 0) { b.x = BALL_R; b.vx = Math.abs(b.vx); sound.wall(); }
          if (b.x + BALL_R > W) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); sound.wall(); }
          if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy = Math.abs(b.vy); sound.wall(); }

          // paddle
          if (
            b.vy > 0 &&
            b.y + BALL_R > H - 30 - PADDLE_H &&
            b.y + BALL_R < H - 28 &&
            b.x > s.paddleX - 4 &&
            b.x < s.paddleX + s.paddleW + 4
          ) {
            const hitPos = (b.x - s.paddleX) / s.paddleW;
            b.vy = -Math.abs(b.vy);
            b.vx = (hitPos - 0.5) * 7;
            sound.paddle();
          }

          // bricks
          for (const br of s.bricks) {
            if (!br.alive) continue;
            if (
              b.x + BALL_R > br.x &&
              b.x - BALL_R < br.x + BRICK_W &&
              b.y + BALL_R > br.y &&
              b.y - BALL_R < br.y + BRICK_H
            ) {
              br.hits -= 1;
              sound.brick();
              // bounce
              const overlapL = b.x + BALL_R - br.x;
              const overlapR = br.x + BRICK_W - (b.x - BALL_R);
              const overlapT = b.y + BALL_R - br.y;
              const overlapB = br.y + BRICK_H - (b.y - BALL_R);
              const minX = Math.min(overlapL, overlapR);
              const minY = Math.min(overlapT, overlapB);
              if (minX < minY) b.vx = b.vx > 0 ? -Math.abs(b.vx) : Math.abs(b.vx);
              else b.vy = b.vy > 0 ? -Math.abs(b.vy) : Math.abs(b.vy);

              if (br.hits <= 0) {
                br.alive = false;
                s.score += 10;
                setScore(s.score);
                // power-up drop (15% chance)
                if (Math.random() < 0.15) {
                  const types: PowerUp["type"][] = ["wide", "multi", "slow"];
                  s.powerups.push({
                    x: br.x + BRICK_W / 2,
                    y: br.y + BRICK_H,
                    type: types[Math.floor(Math.random() * types.length)],
                    vy: 2,
                  });
                }
                // extra life every 3000 pts
                if (s.score > 0 && s.score % 3000 < 10 && s.lives < 5) {
                  s.lives += 1;
                  setLives(s.lives);
                }
              }
              break;
            }
          }

          // lost ball
          if (b.y - BALL_R > H) {
            sound.loseBall();
            return; // skip rest
          }
          newBalls.push(b);
        });

        // if ball lost
        if (s.balls.length > 0 && newBalls.length < s.balls.length) {
          s.balls = [];
          s.lives -= 1;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.running = false;
            setStatus("over");
            sound.gameOver();
          } else {
            s.serving = true;
            s.balls = [{ x: s.paddleX + s.paddleW / 2, y: H - 60, vx: 3.5, vy: -4 }];
            s.serving = false;
          }
        } else {
          s.balls = newBalls;
        }

        // powerups
        s.powerups.forEach((p) => { p.y += p.vy; });
        s.powerups = s.powerups.filter((p) => p.y < H);
        for (const p of s.powerups) {
          if (
            p.y > H - 30 - PADDLE_H &&
            p.y < H - 28 &&
            p.x > s.paddleX &&
            p.x < s.paddleX + s.paddleW
          ) {
            sound.power();
            if (p.type === "wide") s.paddleW = Math.min(160, s.paddleW + 40);
            if (p.type === "multi") {
              s.balls.forEach((b) => {
                s.balls.push({ x: b.x, y: b.y, vx: -b.vx, vy: b.vy - 2 });
              });
            }
            if (p.type === "slow") s.slowTimer = 600;
            s.powerups = s.powerups.filter((pp) => pp !== p);
          }
        }

        // level clear
        if (s.bricks.every((br) => !br.alive)) {
          nextLevel();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, status]);

  // ---- drawing ----
  const draw = (ctx: CanvasRenderingContext2D, s: typeof g.current) => {
    ctx.fillStyle = "#0a1420";
    ctx.fillRect(0, 0, W, H);

    // bricks
    s.bricks.forEach((br) => {
      if (!br.alive) return;
      const color = BRICK_COLORS[br.hits - 1] ?? "#f87171";
      ctx.shadowColor = color;
      ctx.shadowBlur = br.hits >= 2 ? 8 : 4;
      ctx.fillStyle = color;
      ctx.fillRect(br.x, br.y, BRICK_W, BRICK_H);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(br.x, br.y, BRICK_W, 4);
    });

    // powerups
    s.powerups.forEach((p) => {
      ctx.fillStyle = p.type === "wide" ? "#fb923c" : p.type === "multi" ? "#38bdf8" : "#4ade80";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // paddle
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(s.paddleX, H - 30, s.paddleW, PADDLE_H);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(s.paddleX, H - 30, s.paddleW, 3);

    // balls
    s.balls.forEach((b) => {
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[560px] mx-auto w-full">
        <StatBlock label="SCORE" value={String(score)} highlight />
        <StatBlock label="LIVES" value={String(lives)} />
        <StatBlock label="LEVEL" value={String(level)} />
        <button
          type="button"
          onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
          className={`border rounded-lg px-3 py-3 font-mono text-xs font-semibold transition-colors ${
            soundOn ? "bg-accent/20 border-accent/40 text-accent" : "bg-white/5 border-white/15 text-paper/60"
          }`}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Board */}
      <div className="relative mx-auto w-full max-w-[600px] touch-none select-none">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onMouseMove={(e) => onMove(e.clientX)}
          onTouchMove={(e) => {
            const t = e.touches[0];
            if (t) onMove(t.clientX);
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (t) onMove(t.clientX);
          }}
          className="rounded-2xl border border-white/10 w-full h-auto shadow-lg shadow-black/40"
        />
        {(status === "idle" || status === "over" || status === "won") && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-accent">
              {status === "over" ? "GAME OVER" : status === "won" ? "🏆 YOU WON!" : "BRICK BREAKER"}
            </span>
            {status === "over" && (
              <span className="font-mono text-sm text-paper/70">SCORE: {score}</span>
            )}
            <button
              type="button"
              onClick={start}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              {status === "idle" ? "START" : "PLAY AGAIN"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">Controls:</strong> mouse, ←/→ or
        A/D to move · drag on touch. Catch power-ups (wider paddle, extra
        ball, slow ball). Clear all 10 levels to win!
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
