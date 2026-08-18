"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Obstacle {
  x: number;
  type: "cactus-s" | "cactus-t" | "bird-low" | "bird-high";
  w: number;
  h: number;
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
  jump() { this.tone(300, 0.12, "triangle", 0.12, 520); }
  point() { this.tone(880, 0.05, "square", 0.04); }
  die() { this.tone(300, 0.4, "sawtooth", 0.14, 60); }
}
const sound = new Sound();

const GROUND_Y = 250;
const DINO_X = 70;

export default function DinoRunClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);

  const g = useRef({
    running: false,
    dinoY: GROUND_Y,
    vy: 0,
    ducking: false,
    onGround: true,
    speed: 6,
    dist: 0,
    obstacles: [] as Obstacle[],
    spawnTimer: 0,
    night: false,
    frame: 0,
  });
  const lastScore = useRef(0);

  useEffect(() => {
    try {
      const saved = Number(sessionStorage.getItem("multitool-dino-best") ?? 0);
      if (!Number.isNaN(saved)) setBest(saved);
    } catch { /* ignore */ }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    const s = g.current;
    s.running = true;
    s.dinoY = GROUND_Y;
    s.vy = 0;
    s.ducking = false;
    s.onGround = true;
    s.speed = 6;
    s.dist = 0;
    s.obstacles = [];
    s.spawnTimer = 0;
    s.night = false;
    lastScore.current = 0;
    setScore(0);
    setOver(false);
  }, []);

  const start = () => {
    sound.jump();
    reset();
  };

  const jump = useCallback(() => {
    const s = g.current;
    if (!s.running || over) return;
    if (s.onGround) {
      s.vy = -13;
      s.onGround = false;
      s.ducking = false;
      sound.jump();
    } else if (s.ducking) {
      s.vy = 8;
      s.ducking = false;
    }
  }, [over]);

  const duck = useCallback((active: boolean) => {
    const s = g.current;
    if (!s.running || over) return;
    if (active) {
      if (s.onGround) s.ducking = true;
      else s.vy = 10;
    } else {
      s.ducking = false;
    }
  }, [over]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ([" ", "ArrowUp", "w", "W"].includes(e.key)) { e.preventDefault(); jump(); }
      if (["ArrowDown", "s", "S"].includes(e.key)) { e.preventDefault(); duck(true); }
    };
    const up = (e: KeyboardEvent) => {
      if (["ArrowDown", "s", "S"].includes(e.key)) duck(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [jump, duck]);

  const spawnObstacle = () => {
    const s = g.current;
    const r = Math.random();
    let type: Obstacle["type"];
    if (r < 0.35) type = "cactus-s";
    else if (r < 0.6) type = "cactus-t";
    else if (r < 0.8) type = "bird-low";
    else type = "bird-high";
    const dims: Record<Obstacle["type"], { w: number; h: number }> = {
      "cactus-s": { w: 22, h: 44 },
      "cactus-t": { w: 30, h: 72 },
      "bird-low": { w: 40, h: 26 },
      "bird-high": { w: 40, h: 26 },
    };
    s.obstacles.push({ x: 820, type, ...dims[type] });
  };

  const collide = (ax: number, ay: number, aw: number, ah: number, o: Obstacle) => {
    const ox = o.x + 3;
    const oy = o.type.startsWith("bird")
      ? o.type === "bird-low" ? GROUND_Y - 34 - o.h : GROUND_Y - 82 - o.h
      : GROUND_Y - o.h;
    const ow = o.w - 6;
    const oh = o.h - 4;
    return ax + aw > ox && ax < ox + ow && ay + ah > oy && ay < oy + oh;
  };

  // ---- game loop ----
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const loop = () => {
      const s = g.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) draw(ctx, s, canvas.width, canvas.height);
      }
      if (s.running && !over) {
        s.frame += 1;
        s.dist += s.speed / 6;
        const sc = Math.floor(s.dist);
        // only setState when the score changes (avoids 60fps re-renders)
        if (sc !== lastScore.current) {
          lastScore.current = sc;
          setScore(sc);
          if (sc > 0 && sc % 100 === 0) sound.point();
        }
        s.speed = Math.min(6 + Math.floor(s.dist / 150) * 0.6, 18);
        s.night = Math.floor(s.dist / 500) % 2 === 1;

        if (!s.onGround) {
          s.vy += 0.6;
          s.dinoY += s.vy;
          if (s.dinoY >= GROUND_Y) {
            s.dinoY = GROUND_Y;
            s.vy = 0;
            s.onGround = true;
          }
        }
        const dinoH = s.ducking ? 28 : 46;
        const dinoY = s.ducking ? GROUND_Y - 28 : s.dinoY - 46;

        s.spawnTimer += 1;
        const gap = Math.max(46, 92 - Math.floor(s.dist / 200) * 4);
        if (s.spawnTimer > gap && s.obstacles.length < 3) {
          s.spawnTimer = 0;
          spawnObstacle();
        }

        s.obstacles.forEach((o) => { o.x -= s.speed; });
        s.obstacles = s.obstacles.filter((o) => o.x > -60);
        for (const o of s.obstacles) {
          if (collide(DINO_X, dinoY, 40, dinoH, o)) {
            s.running = false;
            setOver(true);
            sound.die();
            setBest((prev) => {
              const nb = Math.max(prev, Math.floor(s.dist));
              try { sessionStorage.setItem("multitool-dino-best", String(nb)); } catch { /* ignore */ }
              return nb;
            });
            break;
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, over]);

  // ---- drawing ----
  const draw = (ctx: CanvasRenderingContext2D, s: typeof g.current, W: number, H: number) => {
    const sky = s.night ? "#0f172a" : "#fde68a";
    const ground = s.night ? "#1e293b" : "#d6a35c";
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = s.night ? "#e2e8f0" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(W - 90, 60, 24, 0, Math.PI * 2);
    ctx.fill();

    if (s.night) {
      ctx.fillStyle = "#f8fafc";
      for (let i = 0; i < 12; i += 1) {
        const sx = (i * 97 + s.frame * 0.2) % W;
        const sy = (i * 53) % 140;
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(s.frame * 0.05 + i);
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (let i = 0; i < 4; i += 1) {
        const cx = (i * 210 + s.frame * 0.5) % (W + 80) - 40;
        const cy = 50 + i * 22;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 22, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = ground;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = s.night ? "#334155" : "#8a5a2b";
    for (let i = 0; i < 14; i += 1) {
      const gx = i * 70 - (s.frame * s.speed * 0.6) % 70;
      ctx.fillRect(gx, GROUND_Y + 14, 26, 4);
    }

    s.obstacles.forEach((o) => {
      if (o.type === "cactus-s" || o.type === "cactus-t") {
        ctx.fillStyle = s.night ? "#4ade80" : "#15803d";
        ctx.fillRect(o.x + 8, GROUND_Y - o.h, 8, o.h);
        ctx.fillRect(o.x, GROUND_Y - o.h + 6, 22, 8);
        ctx.fillRect(o.x + 6, GROUND_Y - o.h - 6, 6, 10);
      } else {
        const oy = o.type === "bird-low" ? GROUND_Y - 34 - o.h : GROUND_Y - 82 - o.h;
        ctx.fillStyle = s.night ? "#f87171" : "#b91c1c";
        ctx.fillRect(o.x + 6, oy + 10, 28, 8);
        ctx.fillRect(o.x + 30, oy + 4, 10, 6);
        ctx.fillRect(o.x + 30, oy + 16, 10, 6);
      }
    });

    const duck = s.ducking;
    const dy = duck ? GROUND_Y - 26 : s.dinoY - 46;
    ctx.fillStyle = s.night ? "#4ade80" : "#16a34a";
    ctx.fillRect(DINO_X + 8, dy + 12, 26, 18);
    ctx.fillRect(DINO_X + 22, dy + 2, 16, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(DINO_X + 32, dy + 5, 4, 4);
    ctx.fillStyle = "#000";
    ctx.fillRect(DINO_X + 34, dy + 6, 2, 2);
    ctx.fillStyle = s.night ? "#4ade80" : "#16a34a";
    const leg = Math.floor(s.frame / 6) % 2 === 0 ? 0 : -5;
    ctx.fillRect(DINO_X + 12, dy + 30, 6, 16 + leg);
    ctx.fillRect(DINO_X + 24, dy + 30, 6, 16 - leg);
    ctx.fillRect(DINO_X + 2, dy + 14, 10, 6);
  };

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5 shadow-lg"
      style={{ background: "linear-gradient(180deg, #2a1f17 0%, #171210 100%)" }}
    >
      {/* Header */}
      <div className="grid grid-cols-3 gap-3 max-w-[560px] mx-auto w-full">
        <StatBlock label="DISTANCE" value={String(score)} highlight />
        <StatBlock label="BEST" value={String(best)} />
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

      {/* Canvas */}
      <div
        className="relative mx-auto w-full max-w-[560px] touch-none select-none"
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
        onTouchEnd={() => duck(false)}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="rounded-2xl border border-white/10 w-full h-auto shadow-lg shadow-black/40"
        />
        {!g.current.running && !over && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-paper">DINO RUN</span>
            <span className="font-mono text-xs text-paper/70">SPACE / ↑ / TAP TO JUMP · ↓ TO DUCK</span>
            <button
              type="button"
              onClick={start}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              START
            </button>
          </div>
        )}
        {over && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-paper">CRASH!</span>
            <span className="font-mono text-sm text-accent">
              {score} pts · best: {best}
            </span>
            <button
              type="button"
              onClick={start}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              RUN AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">Controls:</strong> space / ↑ / W (or
        tap) to jump — hold for higher. ↓ / S to duck under birds. Speed
        rises forever — day and night alternate every 500 points.
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
