"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type VPos = "top" | "mid" | "bottom";
type HPos = "left" | "center" | "right";

export default function AddTextClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("");
  const [vpos, setVpos] = useState<VPos>("bottom");
  const [hpos, setHpos] = useState<VPos extends never ? never : "center" | "left" | "right">("center");
  const [size, setSize] = useState(7);
  const [color, setColor] = useState("#ffffff");
  const [outline, setOutline] = useState(true);
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

    const fontSize = Math.max(14, Math.round((canvas.width * size) / 100));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = vpos === "top" ? "top" : vpos === "bottom" ? "bottom" : "middle";
    ctx.textAlign = hpos === "left" ? "left" : hpos === "right" ? "right" : "center";

    const margin = Math.round(canvas.width * 0.06);
    const lines = text.split("\n");
    const x =
      hpos === "left" ? margin : hpos === "right" ? canvas.width - margin : canvas.width / 2;
    const y =
      vpos === "top"
        ? margin + fontSize / 2
        : vpos === "bottom"
          ? canvas.height - margin - fontSize * (lines.length - 1) / 2 - fontSize / 2
          : canvas.height / 2 - fontSize * (lines.length - 1) / 2;

    lines.forEach((line, i) => {
      const ly = y + i * fontSize * 1.15;
      if (outline) {
        ctx.lineWidth = Math.max(2, fontSize * 0.08);
        ctx.strokeStyle = "#000000";
        ctx.lineJoin = "round";
        ctx.strokeText(line, x, ly);
      }
      ctx.fillStyle = color;
      ctx.fillText(line, x, ly);
    });
  }, [img, text, vpos, hpos, size, color, outline]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!firedRef.current) {
      firedRef.current = true;
      trackToolUsed("add-text-to-image", "images");
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
      a.download = "with-text.png";
      a.click();
      URL.revokeObjectURL(a.href);
      trackDownload("add-text-to-image", "images");
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
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text… (line breaks are respected)"
              rows={2}
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            />

            <div className="flex flex-wrap items-center gap-4">
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    ["top", "left"], ["top", "center"], ["top", "right"],
                    ["mid", "left"], ["mid", "center"], ["mid", "right"],
                    ["bottom", "left"], ["bottom", "center"], ["bottom", "right"],
                  ] as const
                ).map(([v, h]) => (
                  <button
                    key={`${v}-${h}`}
                    onClick={() => {
                      setVpos(v);
                      setHpos(h);
                    }}
                    className={`w-7 h-7 rounded transition-colors ${
                      vpos === v && hpos === h
                        ? "bg-accent"
                        : "bg-paper border border-ink/15 hover:border-accent"
                    }`}
                    aria-label={`Position ${v} ${h}`}
                  />
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                SIZE {size}%
                <input
                  type="range"
                  min={2}
                  max={16}
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
              <button
                onClick={() => setOutline((o) => !o)}
                className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                  outline
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                OUTLINE {outline ? "ON" : "OFF"}
              </button>
            </div>

            <div className="border border-ink/10 rounded-lg p-3 bg-paper flex justify-center">
              <canvas ref={canvasRef} className="max-h-96 max-w-full rounded" />
            </div>

            <button
              onClick={download}
              disabled={!text.trim()}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors self-start disabled:opacity-50"
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
