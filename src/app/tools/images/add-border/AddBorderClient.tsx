"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Style = "solid" | "double" | "polaroid";

export default function AddBorderClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [style, setStyle] = useState<Style>("solid");
  const [widthPct, setWidthPct] = useState(3);
  const [color, setColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const base = Math.round((iw * widthPct) / 100);

    let top: number, bottom: number, left: number, right: number;
    if (style === "polaroid") {
      const b = Math.max(8, base);
      top = Math.round(b * 0.9);
      left = right = b;
      bottom = Math.round(b * 2.6);
    } else {
      top = bottom = left = right = base;
    }
    const w = iw + left + right;
    const h = ih + top + bottom;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (color === "transparent") {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, left, top);

    if (style === "double") {
      const inner = Math.max(2, Math.round(base * 0.22));
      ctx.strokeStyle = color === "#ffffff" ? "#1c1f1d" : "#ffffff";
      ctx.lineWidth = inner;
      ctx.strokeRect(
        left - inner * 1.5,
        top - inner * 1.5,
        iw + inner * 3,
        ih + inner * 3
      );
    }
  }, [img, style, widthPct, color]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("add-border", "images");
    }
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const mime = color === "transparent" ? "image/png" : "image/png";
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "framed.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("add-border", "images");
    }, mime);
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
                    ["solid", "SOLID"],
                    ["double", "DOUBLE"],
                    ["polaroid", "POLAROID"],
                  ] as const
                ).map(([s, label]) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      style === s
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                WIDTH {widthPct}%
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={0.5}
                  value={widthPct}
                  onChange={(e) => setWidthPct(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                COLOR
                <input
                  type="color"
                  value={color === "transparent" ? "#ffffff" : color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-10 rounded border border-ink/15 cursor-pointer bg-white"
                />
                <button
                  onClick={() => setColor("transparent")}
                  className="font-mono text-[10px] text-ink/50 hover:text-accent underline underline-offset-2"
                >
                  transparent
                </button>
              </label>
            </div>

            <div
              className="border border-ink/10 rounded-lg p-3 flex justify-center"
              style={{ background: "repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50%/16px 16px" }}
            >
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
