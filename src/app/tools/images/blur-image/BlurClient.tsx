"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Mode = "blur" | "pixelate";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function BlurClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>("pixelate");
  const [intensity, setIntensity] = useState(14);
  const [rect, setRect] = useState<Rect | null>(null);
  const [appliedCount, setAppliedCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);

  // render: imagem + selecao atual
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
    }
    if (appliedCount === 0 && img) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
    }
    // overlay do retangulo selecionado
    const ctx = canvas.getContext("2d");
    if (ctx && rect) {
      ctx.save();
      ctx.strokeStyle = "#ff5f1f";
      ctx.lineWidth = Math.max(2, canvas.width * 0.004);
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }
  }, [img, rect, appliedCount]);

  const toImgCoords = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!img) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("blur-image", "images");
    }
    const p = toImgCoords(e);
    drawingRef.current = p;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !canvasRef.current) return;
    const start = drawingRef.current;
    const p = toImgCoords(e);
    setRect({
      x: Math.min(start.x, p.x),
      y: Math.min(start.y, p.y),
      w: Math.abs(p.x - start.x),
      h: Math.abs(p.y - start.y),
    });
  };

  const onPointerUp = () => {
    drawingRef.current = null;
  };

  const apply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !rect || rect.w < 4 || rect.h < 4) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y, w, h } = rect;

    if (mode === "pixelate") {
      const block = Math.max(4, Math.round(intensity));
      const tw = Math.max(1, Math.round(w / block));
      const th = Math.max(1, Math.round(h / block));
      const tmp = document.createElement("canvas");
      tmp.width = tw;
      tmp.height = th;
      const tctx = tmp.getContext("2d");
      if (!tctx) return;
      tctx.drawImage(canvas, x, y, w, h, 0, 0, tw, th);
      tctx.imageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
      ctx.imageSmoothingEnabled = true;
    } else {
      // blur em passos (canvas filter tem limite de raio)
      let remaining = intensity * 2;
      while (remaining > 0) {
        const step = Math.min(remaining, 40);
        ctx.filter = `blur(${step}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
        remaining -= 40;
      }
      // recorta o efeito: restaura fora do rect a partir da imagem original
      const restore = (rx: number, ry: number, rw: number, rh: number) => {
        ctx.drawImage(
          img!,
          rx,
          ry,
          rw,
          rh,
          rx,
          ry,
          rw,
          rh
        );
      };
      const W = canvas.width;
      const H = canvas.height;
      restore(0, 0, W, Math.max(0, y));
      restore(0, y + h, W, Math.max(0, H - y - h));
      restore(0, Math.max(0, y), Math.max(0, x), h);
      restore(x + w, Math.max(0, y), Math.max(0, W - x - w), h);
    }
    setRect(null);
    setAppliedCount((c) => c + 1);
  };

  const reset = () => {
    if (!canvasRef.current || !img) return;
    canvasRef.current.width = img.naturalWidth;
    canvasRef.current.height = img.naturalHeight;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    setRect(null);
    setAppliedCount(0);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setAppliedCount(0);
      setRect(null);
      requestAnimationFrame(() => {
        const c = canvasRef.current;
        if (c) {
          c.width = image.naturalWidth;
          c.height = image.naturalHeight;
          c.getContext("2d")?.drawImage(image, 0, 0);
        }
      });
    };
    image.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "censored.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("blur-image", "images");
    }, "image/png");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-ink/60
            file:mr-4 file:font-mono file:text-xs file:tracking-widest file:px-5 file:py-2.5
            file:rounded-lg file:border-0 file:bg-deep file:text-paper file:cursor-pointer"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        {img && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(
                  [
                    ["blur", "BLUR"],
                    ["pixelate", "PIXELATE"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      mode === m
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                {mode === "blur" ? "RADIUS" : "BLOCK"} {intensity}
                <input
                  type="range"
                  min={mode === "blur" ? 4 : 6}
                  max={mode === "blur" ? 30 : 40}
                  step={1}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <button
                onClick={apply}
                disabled={!rect || rect.w < 4}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-5 py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-40"
              >
                APPLY TO SELECTION
              </button>
              <button
                onClick={reset}
                className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest px-4 py-2 rounded-lg transition-colors"
              >
                RESET
              </button>
            </div>
            <p className="text-xs font-mono text-ink/40">
              DRAG A RECTANGLE OVER THE AREA TO HIDE → APPLY → REPEAT FOR MORE AREAS
            </p>

            <div className="border border-ink/10 rounded-lg p-3 bg-paper flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-h-96 max-w-full rounded cursor-crosshair touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </div>

            <button
              onClick={download}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors self-start"
            >
              DOWNLOAD PNG
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your image never leaves your device.
      </p>
    </div>
  );
}
