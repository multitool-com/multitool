"use client";

import { useEffect, useRef, useState } from "react";

type Format = "jpeg" | "png" | "webp";

interface SourceImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

interface CompressedImage {
  url: string;
  width: number;
  height: number;
  size: number;
}

const FORMATS: { id: Format; label: string; ext: string; mime: string }[] = [
  { id: "jpeg", label: "JPEG", ext: "jpg", mime: "image/jpeg" },
  { id: "webp", label: "WEBP", ext: "webp", mime: "image/webp" },
  { id: "png", label: "PNG", ext: "png", mime: "image/png" },
];

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Reads the dimensions, respecting EXIF orientation when the browser supports it. */
async function decodeDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dims;
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read this image."));
      });
      return { width: img.naturalWidth, height: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

export default function ImageCompressorClient() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [compressed, setCompressed] = useState<CompressedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const objectUrls = useRef<string[]>([]);

  // Revoke all object URLs when the component unmounts.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const compress = async (src: SourceImage | null = source) => {
    if (!src || busy) return;
    setBusy(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(src.file, {
        imageOrientation: "from-image",
      });
      let w = bitmap.width;
      let h = bitmap.height;
      const maxW = parseInt(maxWidth, 10);
      if (!Number.isNaN(maxW) && maxW > 0 && w > maxW) {
        h = Math.max(1, Math.round((h * maxW) / w));
        w = maxW;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bitmap.close();
        throw new Error("Your browser does not support canvas.");
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();

      const meta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
      const blob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob(resolve, meta.mime, format === "png" ? undefined : quality / 100);
      });
      if (!blob) throw new Error("Compression failed. Try another format.");

      const url = URL.createObjectURL(blob);
      objectUrls.current.push(url);
      setCompressed((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, width: w, height: h, size: blob.size };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not compress this image.");
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    try {
      const dims = await decodeDimensions(file);
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      setSource((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { file, url, ...dims };
      });
      setCompressed(null);
      compress({ file, url, ...dims });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this image.");
    }
  };

  const download = () => {
    if (!compressed) return;
    const meta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
    const a = document.createElement("a");
    a.href = compressed.url;
    a.download = `compressed-${compressed.width}x${compressed.height}.${meta.ext}`;
    a.click();
  };

  const savedPercent =
    source && compressed
      ? Math.round((1 - compressed.size / source.file.size) * 100)
      : null;

  const currentMeta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0] ?? null;
          if (file && file.type.startsWith("image/")) {
            handleFile(file);
          } else {
            setError("Please drop an image file (JPG, PNG, WebP…).");
          }
        }}
        className={`border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-ink/15 bg-paper"
        }`}
      >
        <input
          id="img-compress-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="img-compress-file"
          className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          {source ? "CHOOSE ANOTHER IMAGE" : "CHOOSE AN IMAGE"}
        </label>
        <p className="mt-3 font-mono text-xs text-ink/50">
          OR DRAG & DROP HERE — JPG · PNG · WEBP · GIF
        </p>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {error}
        </div>
      )}

      {!source && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Pick an image and the tool compresses it automatically with the
          current settings.
        </div>
      )}

      {source && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatBlock
              label="ORIGINAL SIZE"
              value={formatBytes(source.file.size)}
            />
            <StatBlock
              label="DIMENSIONS"
              value={`${source.width} × ${source.height}`}
              highlight
            />
            <StatBlock
              label="FORMAT"
              value={(source.file.type || "image").split("/")[1].toUpperCase()}
            />
          </div>

          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              OUTPUT FORMAT
            </span>
            <div className="flex gap-2 flex-wrap">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    format === f.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {format !== "png" && (
            <div>
              <label
                htmlFor="img-quality"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                QUALITY — {quality}%
              </label>
              <input
                id="img-quality"
                type="range"
                min={10}
                max={100}
                step={1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="img-max-width"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              MAX WIDTH (PX) — LEAVE EMPTY TO KEEP SIZE
            </label>
            <input
              id="img-max-width"
              type="number"
              min={1}
              inputMode="numeric"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              placeholder="e.g. 1920"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="button"
            onClick={() => compress()}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "COMPRESSING…" : "COMPRESS"}
          </button>

          <div className="bg-deep rounded-lg px-5 py-4">
            <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
              SIZE REDUCED
            </span>
            {savedPercent !== null && savedPercent > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-5xl font-semibold text-accent">
                  {savedPercent}%
                </span>
                <span className="font-mono text-sm text-paper/70">
                  smaller than the original
                </span>
              </div>
            ) : (
              <span className="font-mono text-5xl font-semibold text-accent">—</span>
            )}
            {savedPercent !== null && savedPercent <= 0 && (
              <p className="font-mono text-xs text-paper/70 mt-2">
                The result is not smaller — try a lower quality, resize, or a
                different format.
              </p>
            )}
          </div>

          {compressed && (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-paper border border-ink/10 rounded-lg p-3">
                  <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-2">
                    ORIGINAL
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={source.url}
                    alt="Original"
                    className="w-full h-40 object-contain rounded bg-white"
                  />
                  <p className="font-mono text-xs text-ink/70 mt-2">
                    {formatBytes(source.file.size)} · {source.width}×
                    {source.height}
                  </p>
                </div>
                <div className="bg-paper border border-ink/10 rounded-lg p-3">
                  <span className="font-mono text-[10px] tracking-widest text-accent block mb-2">
                    COMPRESSED ({currentMeta.label})
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={compressed.url}
                    alt="Compressed"
                    className="w-full h-40 object-contain rounded bg-white"
                  />
                  <p className="font-mono text-xs text-ink/70 mt-2">
                    {formatBytes(compressed.size)} · {compressed.width}×
                    {compressed.height}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={download}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent"
              >
                DOWNLOAD {currentMeta.label}
              </button>
            </>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Everything runs on your
        device — the image is never uploaded. PNG is lossless, so the quality
        slider applies only to JPEG and WebP. Animated GIFs become a single
        still frame.
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg px-3 py-3 ${
        highlight
          ? "bg-accent/10 border-accent/30"
          : "bg-paper border-ink/10"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
        {label}
      </span>
      <span
        className={`font-mono text-sm font-semibold ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
