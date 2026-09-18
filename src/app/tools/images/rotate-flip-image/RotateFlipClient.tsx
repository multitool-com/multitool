"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

interface Loaded {
  img: HTMLImageElement;
  url: string;
}

type Tf = { rot: number; flipH: boolean; flipV: boolean };

export default function RotateFlipClient() {
  const [src, setSrc] = useState<Loaded | null>(null);
  const [tf, setTf] = useState<Tf>({ rot: 0, flipH: false, flipV: false });
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.92);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const { img } = src;
    const swap = tf.rot % 180 !== 0;
    const w = swap ? img.naturalHeight : img.naturalWidth;
    const h = swap ? img.naturalWidth : img.naturalHeight;
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((tf.rot * Math.PI) / 180);
    ctx.scale(tf.flipH ? -1 : 1, tf.flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  }, [src, tf]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("rotate-flip-image", "images");
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setSrc({ img, url });
      setTf({ rot: 0, flipH: false, flipV: false });
    };
    img.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const mime = format === "png" ? "image/png" : "image/jpeg";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `rotated.${format === "png" ? "png" : "jpg"}`;
        a.click();
        URL.revokeObjectURL(a.href);
        trackDownload("rotate-flip-image", "images");
      },
      mime,
      mime === "image/png" ? undefined : quality
    );
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

        {src && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "⟲ 90°", act: () => setTf((t) => ({ ...t, rot: (t.rot + 270) % 360 })) },
                { label: "⟳ 90°", act: () => setTf((t) => ({ ...t, rot: (t.rot + 90) % 360 })) },
                { label: "180°", act: () => setTf((t) => ({ ...t, rot: (t.rot + 180) % 360 })) },
                { label: "⇋ FLIP H", act: () => setTf((t) => ({ ...t, flipH: !t.flipH })) },
                { label: "⇅ FLIP V", act: () => setTf((t) => ({ ...t, flipV: !t.flipV })) },
                { label: "RESET", act: () => setTf({ rot: 0, flipH: false, flipV: false }) },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={b.act}
                  className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest rounded-full px-4 py-2 transition-colors"
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="border border-ink/10 rounded-lg p-3 bg-paper flex justify-center">
              <canvas ref={canvasRef} className="max-h-96 max-w-full rounded" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      format === f
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {f === "png" ? "PNG" : "JPG"}
                  </button>
                ))}
              </div>
              {format === "jpeg" && (
                <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                  QUALITY {Math.round(quality * 100)}%
                  <input
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.02}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="accent-accent"
                  />
                </label>
              )}
              <button
                onClick={download}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                DOWNLOAD
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your image never leaves your device.
      </p>
    </div>
  );
}
