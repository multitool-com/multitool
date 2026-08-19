"use client";

import { useEffect, useRef, useState } from "react";

const SIZES = [16, 32, 48, 180, 192, 512];

export default function FaviconGeneratorClient() {
  const [tab, setTab] = useState<"text" | "image">("text");
  const [label, setLabel] = useState("M");
  const [bg, setBg] = useState("#0f172a");
  const [fg, setFg] = useState("#ffffff");
  const [shape, setShape] = useState<"square" | "rounded" | "circle">("rounded");
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = () => {
    if (typeof document === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const S = 512;
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    ctx.fillStyle = bg;
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      const r = S * 0.22;
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, S, S, r);
      } else {
        // fallback para navegadores sem roundRect
        ctx.moveTo(r, 0);
        ctx.lineTo(S - r, 0);
        ctx.quadraticCurveTo(S, 0, S, r);
        ctx.lineTo(S, S - r);
        ctx.quadraticCurveTo(S, S, S - r, S);
        ctx.lineTo(r, S);
        ctx.quadraticCurveTo(0, S, 0, S - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
      }
    } else {
      ctx.rect(0, 0, S, S);
    }
    ctx.fill();

    // label (letter or emoji)
    if (label.trim()) {
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const isEmoji = /(\p{Extended_Pictographic}|\p{Emoji})/u.test(label.trim());
      const fontSize = isEmoji ? S * 0.62 : S * 0.52;
      ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.fillText(label.trim().slice(0, 2), S / 2, S / 2 + S * 0.02);
    }

    // generate previews
    const urls = SIZES.map((size) => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const cx = c.getContext("2d");
      if (!cx) return { size, url: "" };
      cx.drawImage(canvas, 0, 0, size, size);
      return { size, url: c.toDataURL("image/png") };
    });
    setPreviews(urls);
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, label, bg, fg, shape, fileName]);

  const onFile = (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const S = 512;
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, S, S);
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, S, S);
        const urls = SIZES.map((size) => {
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          const cx = c.getContext("2d");
          if (!cx) return { size, url: "" };
          cx.drawImage(canvas, 0, 0, size, size);
          return { size, url: c.toDataURL("image/png") };
        });
        setPreviews(urls);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const download = (size: number, url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const inputCls =
    "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setTab("text")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            tab === "text" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🔤 TEXT / EMOJI
        </button>
        <button
          type="button"
          onClick={() => setTab("image")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            tab === "image" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🖼️ IMAGE
        </button>
      </div>

      {tab === "text" ? (
        <>
          <div>
            <label htmlFor="fav-label" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              LETTER OR EMOJI
            </label>
            <input
              id="fav-label"
              type="text"
              maxLength={2}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="M or 🚀"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fav-bg" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                BACKGROUND
              </label>
              <div className="flex items-center gap-2">
                <input id="fav-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-10 rounded-lg border border-ink/15 cursor-pointer bg-transparent" />
                <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label htmlFor="fav-fg" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                TEXT COLOR
              </label>
              <div className="flex items-center gap-2">
                <input id="fav-fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-12 h-10 rounded-lg border border-ink/15 cursor-pointer bg-transparent" />
                <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">SHAPE</div>
            <div className="flex gap-2 flex-wrap">
              {(["square", "rounded", "circle"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    shape === s ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="fav-file" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            UPLOAD IMAGE (PNG, JPG, WEBP, SVG)
          </label>
          <input
            id="fav-file"
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-ink/60 file:mr-3 file:bg-deep file:text-paper file:font-mono file:text-xs file:tracking-widest file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:cursor-pointer hover:file:bg-accent transition-colors"
          />
          {fileName && (
            <p className="text-xs text-ink/50 mt-2">✓ Loaded {fileName} — centered and cropped to a square.</p>
          )}
        </div>
      )}

      {/* Previews + downloads */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {previews.map((p) => (
            <div key={p.size} className="flex flex-col items-center gap-2">
              <div
                className="border border-ink/10 rounded-lg bg-white p-1"
                style={{ width: Math.min(72, p.size * 3 + 8), height: Math.min(72, p.size * 3 + 8) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={`${p.size}px`}
                  className="w-full h-full rounded"
                  style={{ imageRendering: p.size <= 32 ? "pixelated" : "auto" }}
                />
              </div>
              <button
                type="button"
                onClick={() => download(p.size, p.url)}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
              >
                {p.size}px ↓
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink/50">
        Tip: add <code className="bg-accent/10 px-1 rounded">&lt;link rel="icon" href="/favicon-32x32.png"&gt;</code> to your
        site's <code className="bg-accent/10 px-1 rounded">&lt;head&gt;</code>. Everything is generated in your browser — no uploads.
      </p>
    </div>
  );
}
