"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const W = 600;
const H = 400;
const PADDLE_W = 10;
const PADDLE_H = 70;
const BALL_R = 7;
const WIN_SCORE = 7;

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
  hit() { this.tone(440, 0.06, "square", 0.1, 620); }
  wall() { this.tone(300, 0.04, "triangle", 0.07, 360); }
  score() { this.tone(200, 0.25, "sawtooth", 0.12, 120); }
  win() { const n = [523, 659, 784, 1047]; n.forEach((f, i) => this.tone(f, 0.15, "triangle", 0.12, undefined, i * 0.1)); }
}
const sound = new Sound();

export default function PixelPongClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);

  const g = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ballX: W / 2,
    ballY: H / 2,
    ballVx: 4,
    ballVy: 3,
    playerScore: 0,
    aiScore: 0,
    running: false,
    diff: 2 as Difficulty,
  });
  const mouseY = useRef(H / 2);

  useEffect(() => {
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetBall = (dir: 1 | -1) => {
    const s = g.current;
    s.ballX = W / 2;
    s.ballY = H / 2;
    s.ballVx = 4 * dir;
    s.ballVy = (Math.random() - 0.5) * 4;
  };

  const start = () => {
    const s = g.current;
    s.playerScore = 0;
    s.aiScore = 0;
    s.playerY = H / 2 - PADDLE_H / 2;
    s.aiY = H / 2 - PADDLE_H / 2;
    s.running = true;
    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    resetBall(1);
    sound.hit();
  };

  const scorePoint = (who: "player" | "ai") => {
    const s = g.current;
    sound.score();
    if (who === "player") {
      s.playerScore += 1;
      setPlayerScore(s.playerScore);
      if (s.playerScore >= WIN_SCORE) {
        s.running = false;
        setWinner("player");
        sound.win();
        return;
      }
      resetBall(1);
    } else {
      s.aiScore += 1;
      setAiScore(s.aiScore);
      if (s.aiScore >= WIN_SCORE) {
        s.running = false;
        setWinner("ai");
        sound.win();
        return;
      }
      resetBall(-1);
    }
  };

  // ---- input: mouse + touch + keyboard ----
  const onMove = (clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = H / rect.height;
    mouseY.current = (clientY - rect.top) * scale;
  };

  useEffect(() => {
    const onMouse = (e: MouseEvent) => onMove(e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientY);
    };
    const onKey = (e: KeyboardEvent) => {
      const s = g.current;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        s.playerY = Math.max(0, s.playerY - 24);
        mouseY.current = s.playerY + PADDLE_H / 2;
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        s.playerY = Math.min(H - PADDLE_H, s.playerY + 24);
        mouseY.current = s.playerY + PADDLE_H / 2;
      }
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
      if (s.running) {
        // player follows mouse (smooth)
        const target = mouseY.current - PADDLE_H / 2;
        s.playerY += (target - s.playerY) * 0.4;

        // AI moves toward ball (speed depends on difficulty)
        const aiSpeed = s.diff === 1 ? 2.2 : s.diff === 2 ? 3.4 : 4.6;
        const aiCenter = s.aiY + PADDLE_H / 2;
        const targetAi = s.ballY - PADDLE_H / 2 + (Math.sin(s.ballY * 0.1) * (s.diff === 1 ? 30 : 8));
        if (s.aiY < targetAi) s.aiY = Math.min(H - PADDLE_H, s.aiY + aiSpeed);
        else if (s.aiY > targetAi) s.aiY = Math.max(0, s.aiY - aiSpeed);

        // ball
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // top/bottom walls
        if (s.ballY - BALL_R < 0) { s.ballY = BALL_R; s.ballVy = Math.abs(s.ballVy); sound.wall(); }
        if (s.ballY + BALL_R > H) { s.ballY = H - BALL_R; s.ballVy = -Math.abs(s.ballVy); sound.wall(); }

        // player paddle
        if (
          s.ballVx < 0 &&
          s.ballX - BALL_R < 20 &&
          s.ballX - BALL_R > 10 &&
          s.ballY > s.playerY - 4 &&
          s.ballY < s.playerY + PADDLE_H + 4
        ) {
          const hitPos = (s.ballY - s.playerY) / PADDLE_H; // 0..1
          s.ballVx = Math.abs(s.ballVx) + 0.4;
          s.ballVy = (hitPos - 0.5) * 8;
          sound.hit();
        }

        // AI paddle
        if (
          s.ballVx > 0 &&
          s.ballX + BALL_R > W - 20 &&
          s.ballX + BALL_R < W - 10 &&
          s.ballY > s.aiY - 4 &&
          s.ballY < s.aiY + PADDLE_H + 4
        ) {
          const hitPos = (s.ballY - s.aiY) / PADDLE_H;
          s.ballVx = -(Math.abs(s.ballVx) + 0.4);
          s.ballVy = (hitPos - 0.5) * 8;
          sound.hit();
        }

        // score
        if (s.ballX < -20) scorePoint("ai");
        if (s.ballX > W + 20) scorePoint("player");
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ---- drawing (neon retro) ----
  const draw = (ctx: CanvasRenderingContext2D, s: typeof g.current) => {
    ctx.fillStyle = "#0a1420";
    ctx.fillRect(0, 0, W, H);

    // center line
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // paddles with glow
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(14, s.playerY, PADDLE_W, PADDLE_H);
    ctx.shadowColor = "#f472b6";
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(W - 24, s.aiY, PADDLE_W, PADDLE_H);
    ctx.shadowBlur = 0;

    // ball with trail
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {([1, 2, 3] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { g.current.diff = d; setDifficulty(d); }}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                difficulty === d ? "bg-accent text-paper" : "bg-white/5 text-paper/70 border border-white/15 hover:text-accent"
              }`}
            >
              {d === 1 ? "EASY" : d === 2 ? "NORMAL" : "HARD"}
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
          onClick={start}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto w-full">
        <StatBlock label="YOU" value={String(playerScore)} highlight />
        <StatBlock label="CPU" value={String(aiScore)} />
      </div>

      {/* Board */}
      <div className="relative mx-auto w-full max-w-[600px] touch-none select-none">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onMouseMove={(e) => onMove(e.clientY)}
          onTouchMove={(e) => {
            const t = e.touches[0];
            if (t) onMove(t.clientY);
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (t) onMove(t.clientY);
          }}
          className="rounded-2xl border border-white/10 w-full h-auto shadow-lg shadow-black/40"
        />
        {winner && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-accent">
              {winner === "player" ? "🏆 YOU WIN!" : "CPU WINS"}
            </span>
            <span className="font-mono text-sm text-paper/70">
              {playerScore} – {aiScore}
            </span>
            <button
              type="button"
              onClick={start}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
        {!g.current.running && !winner && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-paper">PIXEL PONG</span>
            <span className="font-mono text-xs text-paper/70">
              MOUSE / W S / DRAG TO MOVE · FIRST TO {WIN_SCORE}
            </span>
            <button
              type="button"
              onClick={start}
              className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90"
            >
              START
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">Controls:</strong> move with the
        mouse, W/S or ↑/↓, or drag on touch screens. First to 7 points
        wins — the ball speeds up with every rally!
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
