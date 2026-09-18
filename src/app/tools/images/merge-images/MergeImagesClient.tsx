"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Dir = "h" | "v";

export default function MergeImagesClient() {
  const [imgs, setImgs] = useState<HTMLImageElement[]>([]);
  const [dir, setDir] = useState<Dir>("h");
  const [gap, setGap] = useState(16);
  const [bg, setBg] = useState("#ffffff");
  const [matchHeight, setMatchHeight] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (imgs.length < 1 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let list = imgs;
    if (dir === "h" && matchHeight && imgs.length > 1) {
      const targetH = imgs[0].naturalHeight;
      list = imgs.map((im) => {
        if (im.naturalHeight === targetH) return im;
        const scaled = document.createElement("canvas");
        const w = Math.round((im.naturalWidth * targetH) / im.naturalHeight);
        scaled.width = w;
        scaled.height = targetH;
        const sctx = scaled.getContext("2d");
        sctx?.drawImage(im, 0, 0, w, targetH);
        return scaled as unknown as HTMLImageElement;
      });
    }

    let w: number;
    let h: number;
    if (dir === "h") {
      w = list.reduce((acc, im) => acc + (im.width || im.naturalWidth), 0) + gap * (list.length - 1);
      h = Math.max(...list.map((im) => im.height || im.naturalHeight));
    } else {
      w = Math.max(...list.map((im) => im.width || im.naturalWidth));
      h = list.reduce((acc, im) => acc + (im.height || im.naturalHeight), 0) + gap * (list.length - 1);
    }
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    let x = 0;
    let y = 0;
    for (const im of list) {
      const iw = im.width || im.naturalWidth;
      const ih = im.height || im.naturalHeight;
      ctx.drawImage(im as CanvasImageSource, x, y, iw, ih);
      if (dir === "h") x += iw + gap;
      else y += ih + gap;
    }
  }, [imgs, dir, gap, bg, matchHeight]);

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("merge-images", "images");
    }
    const list = Array.from(files).slice(0, 6);
    const loaded: HTMLImageElement[] = [];
    let pending = list.length;
    list.forEach((f) => {
      const url = URL.createObjectURL(f);
      const image = new Image();
      image.onload = () => {
        loaded.push(image);
        if (--pending === 0) setImgs(loaded);
      };
      image.onerror = () => {
        if (--pending === 0) setImgs(loaded);
      };
      image.src = url;
    });
  };

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "merged.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("merge-images", "images");
    }, "image/png");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-ink/60
            file:mr-4 file:font-mono file:text-xs file:tracking-widest file:px-5 file:py-2.5
            file:rounded-lg file:border-0 file:bg-deep file:text-paper file:cursor-pointer"
          onChange={(e) => onFiles(e.target.files)}
        />
        <p className="mt-2 text-xs font-mono text-ink/40">
          {imgs.length
            ? `${imgs.length} IMAGE(S) LOADED — IN SELECTION ORDER`
            : "SELECT 2–6 IMAGES (ORDER MATTERS)"}
        </p>

        {imgs.length > 1 && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(
                  [
                    ["h", "SIDE BY SIDE"],
                    ["v", "STACKED"],
                  ] as const
                ).map(([d, label]) => (
                  <button
                    key={d}
                    onClick={() => setDir(d)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      dir === d
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                GAP {gap}px
                <input
                  type="range"
                  min={0}
                  max={64}
                  step={2}
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              {dir === "h" && (
                <button
                  onClick={() => setMatchHeight((m) => !m)}
                  className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                    matchHeight
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  MATCH HEIGHT {matchHeight ? "ON" : "OFF"}
                </button>
              )}
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                BG
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-8 w-10 rounded border border-ink/15 cursor-pointer bg-white"
                />
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
        Everything runs in your browser — your images never leave your device.
      </p>
    </div>
  );
}
