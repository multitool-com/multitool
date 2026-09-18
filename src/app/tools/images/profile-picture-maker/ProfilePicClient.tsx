"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Shape = "circle" | "square";

export default function ProfilePicClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [shape, setShape] = useState<Shape>("circle");
  const [zoom, setZoom] = useState(1);
  const [offX, setOffX] = useState(0.5);
  const [offY, setOffY] = useState(0.42);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  const SIZE = 512;

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !img) return;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // escala COVER: o menor lado deve cobrir o quadrado (base = menor lado)
    const base = Math.min(img.naturalWidth, img.naturalHeight);
    const scale = (SIZE / base) * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (SIZE - dw) * offX;
    const dy = (SIZE - dh) * offY;
    ctx.drawImage(img, dx, dy, dw, dh);

    if (shape === "circle") {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }, [img, shape, zoom, offX, offY]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("profile-picture-maker", "images");
    }
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setZoom(1);
      setOffX(0.5);
      setOffY(0.42);
    };
    image.src = url;
  };

  const download = () => {
    const canvas = previewRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `profile-512.${shape === "circle" ? "png" : "png"}`;
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("profile-picture-maker", "images");
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
            <div
              className="border border-ink/10 rounded-lg p-4 flex justify-center"
              style={{ background: "repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50%/16px 16px" }}
            >
              <canvas ref={previewRef} className="w-56 h-56 rounded-lg" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(
                  [
                    ["circle", "CIRCLE"],
                    ["square", "SQUARE"],
                  ] as const
                ).map(([s, label]) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      shape === s
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                ZOOM {zoom.toFixed(1)}×
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                H
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={offX}
                  onChange={(e) => setOffX(Number(e.target.value))}
                  className="accent-accent w-20"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                V
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={offY}
                  onChange={(e) => setOffY(Number(e.target.value))}
                  className="accent-accent w-20"
                />
              </label>
            </div>

            <button
              onClick={download}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors self-start"
            >
              DOWNLOAD 512×512 PNG
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your photo never leaves your device.
      </p>
    </div>
  );
}
