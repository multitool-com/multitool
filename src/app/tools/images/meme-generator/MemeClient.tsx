"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

export default function MemeClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [size, setSize] = useState(9);
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

    const drawCaption = (text: string, fromTop: boolean) => {
      if (!text.trim()) return;
      let fontSize = Math.round((canvas.width * size) / 100);
      const margin = Math.round(canvas.width * 0.04);
      const maxWidth = canvas.width - margin * 2;
      ctx.font = `bold ${fontSize}px Impact, 'Arial Black', sans-serif`;

      const wrap = (t: string): string[] => {
        const words = t.toUpperCase().split(/\s+/);
        const lines: string[] = [];
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = w;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        return lines;
      };

      let lines = wrap(text);
      // encolhe ate caber em altura razoavel
      while (lines.length > 3 && fontSize > 12) {
        fontSize = Math.round(fontSize * 0.9);
        ctx.font = `bold ${fontSize}px Impact, 'Arial Black', sans-serif`;
        lines = wrap(text);
      }

      const lineHeight = fontSize * 1.08;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const startY = fromTop
        ? margin
        : canvas.height - margin - lines.length * lineHeight;

      lines.forEach((line, i) => {
        const y = startY + i * lineHeight;
        ctx.lineWidth = Math.max(2, fontSize * 0.1);
        ctx.strokeStyle = "#000000";
        ctx.lineJoin = "round";
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(line, canvas.width / 2, y);
      });
    };

    drawCaption(top, true);
    drawCaption(bottom, false);
  }, [img, top, bottom, size]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("meme-generator", "images");
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
      a.download = "meme.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("meme-generator", "images");
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
              value={top}
              onChange={(e) => setTop(e.target.value)}
              placeholder="TOP TEXT — THE SETUP"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              value={bottom}
              onChange={(e) => setBottom(e.target.value)}
              placeholder="BOTTOM TEXT — THE PUNCHLINE"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
              TEXT SIZE {size}%
              <input
                type="range"
                min={5}
                max={14}
                step={0.5}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="accent-accent"
              />
            </label>

            <div className="border border-ink/10 rounded-lg p-3 bg-paper flex justify-center">
              <canvas ref={canvasRef} className="max-h-96 max-w-full rounded" />
            </div>

            <button
              onClick={download}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors self-start"
            >
              DOWNLOAD MEME (PNG)
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
