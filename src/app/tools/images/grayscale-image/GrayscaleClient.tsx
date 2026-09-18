"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

export default function GrayscaleClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [intensity, setIntensity] = useState(1);
  const [sepia, setSepia] = useState(false);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    const k = intensity;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      let target: number;
      if (sepia) {
        // Sepia (classic GIMP formula), interpolated by intensity
        const sr = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        const sg = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        const sb = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
        px[i] = r + (sr - r) * k;
        px[i + 1] = g + (sg - g) * k;
        px[i + 2] = b + (sb - b) * k;
        continue;
      }
      target = 0.299 * r + 0.587 * g + 0.114 * b;
      px[i] = r + (target - r) * k;
      px[i + 1] = g + (target - g) * k;
      px[i + 2] = b + (target - b) * k;
    }
    ctx.putImageData(data, 0, 0);
  }, [img, intensity, sepia]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("grayscale-image", "images");
    }
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const mime = format === "png" ? "image/png" : "image/jpeg";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `grayscale.${format === "png" ? "png" : "jpg"}`;
        a.click();
        URL.revokeObjectURL(a.href);
        trackDownload("grayscale-image", "images");
      },
      mime,
      mime === "image/png" ? undefined : 0.92
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

        {img && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                INTENSITY {Math.round(intensity * 100)}%
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <button
                onClick={() => setSepia((s) => !s)}
                className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                  sepia
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                SEPIA {sepia ? "ON" : "OFF"}
              </button>
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
