"use client";

import { useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type OutFormat = "original" | "jpeg" | "png" | "webp";

interface Loaded {
  file: File;
  url: string;
  width: number;
  height: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function loadImage(file: File): Promise<Loaded> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const dims = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return { file, url: URL.createObjectURL(file), ...dims };
}

const PRESETS = [2048, 1920, 1600, 1280, 1024, 800, 512, 256];

export default function ImageResizerClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<Loaded | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<OutFormat>("original");
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ size: number; w: number; h: number } | null>(null);

  const ratio = img ? img.width / img.height : 1;

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setResult(null);
    try {
      const loaded = await loadImage(f);
      setImg(loaded);
      setWidth(String(loaded.width));
      setHeight(String(loaded.height));
    } catch {
      setError("Could not read this image. Try a JPG, PNG, WebP, GIF or BMP file.");
    }
  };

  const onWidth = (v: string) => {
    setWidth(v);
    if (lock && img && v !== "" && Number(v) > 0) {
      setHeight(String(Math.round(Number(v) / ratio)));
    }
  };

  const onHeight = (v: string) => {
    setHeight(v);
    if (lock && img && v !== "" && Number(v) > 0) {
      setWidth(String(Math.round(Number(v) * ratio)));
    }
  };

  const applyPercent = (p: number) => {
    if (!img) return;
    setWidth(String(Math.round((img.width * p) / 100)));
    setHeight(String(Math.round((img.height * p) / 100)));
  };

  const resize = async () => {
    if (!img) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w || !h || w < 1 || h < 1 || w > 10000 || h > 10000) {
      setError("Width and height must be between 1 and 10000 pixels.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      trackToolUsed("image-resizer", "images");
      const bitmap = await createImageBitmap(img.file, {
        imageOrientation: "from-image",
      });
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not available.");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const mime =
        format === "original"
          ? img.file.type === "image/png"
            ? "image/png"
            : img.file.type === "image/webp"
              ? "image/webp"
              : "image/jpeg"
          : format === "png"
            ? "image/png"
            : format === "webp"
              ? "image/webp"
              : "image/jpeg";
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, mime, mime === "image/png" ? undefined : quality)
      );
      if (!blob) throw new Error("Could not encode the image in this format.");
      const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `resized-${w}x${h}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      setResult({ size: blob.size, w, h });
      trackDownload("image-resizer", "images");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {img ? "CHOOSE ANOTHER IMAGE" : "SELECT IMAGE (JPG · PNG · WEBP · GIF)"}
        </button>

        {img && (
          <div className="mt-5 flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt="Original preview"
              className="w-24 h-24 object-cover rounded-lg border border-ink/10"
            />
            <div className="text-sm text-ink/70 font-mono">
              <p>
                {img.width} × {img.height} px
              </p>
              <p>{formatBytes(img.file.size)}</p>
              <p className="text-ink/40">{img.file.type || "image"}</p>
            </div>
          </div>
        )}

        {img && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-end gap-3 flex-wrap">
              <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
                WIDTH (px)
                <input
                  type="number"
                  value={width}
                  onChange={(e) => onWidth(e.target.value)}
                  className="w-28 border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
              <button
                onClick={() => setLock((l) => !l)}
                title={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                className="px-3 py-2.5 rounded-lg border font-mono text-xs tracking-widest transition-colors"
              >
                {lock ? "🔒" : "🔓"}
              </button>
              <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
                HEIGHT (px)
                <input
                  type="number"
                  value={height}
                  onChange={(e) => onHeight(e.target.value)}
                  className="w-28 border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => applyPercent(p)}
                  className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs rounded-full px-4 py-1.5 transition-colors"
                >
                  {p}%
                </button>
              ))}
              <span className="w-px bg-ink/10 mx-1" />
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setWidth(String(p));
                    if (lock) setHeight(String(Math.round(p / ratio)));
                  }}
                  className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs rounded-full px-4 py-1.5 transition-colors"
                >
                  {p}px
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {(["original", "jpeg", "png", "webp"] as OutFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                      format === f
                        ? "bg-deep text-paper"
                        : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {f === "original" ? "KEEP" : f.toUpperCase()}
                  </button>
                ))}
              </div>
              {format !== "png" && format !== "original" && (
                <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                  QUALITY {Math.round(quality * 100)}%
                  <input
                    type="range"
                    min={0.3}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="accent-accent"
                  />
                </label>
              )}
            </div>

            <button
              onClick={resize}
              disabled={busy}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 self-start"
            >
              {busy ? "RESIZING…" : "RESIZE & DOWNLOAD"}
            </button>

            {result && (
              <div className="bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
                DONE — {result.w} × {result.h} px · {formatBytes(result.size)}
                {img && result.size > 0 && (
                  <span className="text-ink/50">
                    {" "}
                    (original {formatBytes(img.file.size)})
                  </span>
                )}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your image never leaves your device.
      </p>
    </div>
  );
}
