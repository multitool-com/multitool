"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Mode = "diagonal" | "tiled" | "corner";
type Pos = "tl" | "tr" | "bl" | "br";

export default function WatermarkClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("© Your Name");
  const [mode, setMode] = useState<Mode>("diagonal");
  const [pos, setPos] = useState<Pos>("br");
  const [opacity, setOpacity] = useState(0.35);
  const [size, setSize] = useState(5);
  const [color, setColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!img || !canvasRef.current || !text.trim()) return;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.max(12, Math.round((canvas.width * size) / 100));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.textBaseline = "middle";
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    if (mode === "diagonal") {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else if (mode === "tiled") {
      const stepX = fontSize * (text.length * 0.7 + 2.5);
      const stepY = fontSize * 3.2;
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      for (let y = -h; y < h * 2; y += stepY) {
        for (let x = -w; x < w * 2; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    } else {
      const m = fontSize * 0.8;
      const x = pos.includes("l") ? m : w - m;
      const y = pos.startsWith("t") ? m : h - m;
      ctx.textAlign = pos.includes("l") ? "left" : "right";
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
  }, [img, text, mode, pos, opacity, size, color]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("watermark-image", "images");
    }
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "watermarked.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("watermark-image", "images");
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
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="© Your Name 2026"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(
                  [
                    ["diagonal", "DIAGONAL"],
                    ["tiled", "TILED"],
                    ["corner", "CORNER"],
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
              {mode === "corner" && (
                <div className="flex gap-1">
                  {(
                    [
                      ["tl", "↖"],
                      ["tr", "↗"],
                      ["bl", "↙"],
                      ["br", "↘"],
                    ] as const
                  ).map(([p, arrow]) => (
                    <button
                      key={p}
                      onClick={() => setPos(p)}
                      className={`font-mono text-xs rounded-full w-8 h-8 transition-colors ${
                        pos === p
                          ? "bg-deep text-paper"
                          : "bg-paper text-ink/60 border border-ink/15 hover:border-accent"
                      }`}
                    >
                      {arrow}
                    </button>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                OPACITY {Math.round(opacity * 100)}%
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                SIZE {size}%
                <input
                  type="range"
                  min={2}
                  max={14}
                  step={0.5}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                COLOR
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-10 rounded border border-ink/15 cursor-pointer bg-white"
                />
              </label>
            </div>

            <div className="border border-ink/10 rounded-lg p-3 bg-paper flex justify-center">
              <canvas ref={canvasRef} className="max-h-96 max-w-full rounded" />
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
