"use client";

import { useEffect, useRef, useState } from "react";

type Format = "jpeg" | "png" | "webp";

const FORMATS: { id: Format; label: string; ext: string; mime: string }[] = [
  { id: "jpeg", label: "JPG", ext: "jpg", mime: "image/jpeg" },
  { id: "png", label: "PNG", ext: "png", mime: "image/png" },
  { id: "webp", label: "WEBP", ext: "webp", mime: "image/webp" },
];

interface SourceImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

interface ConvertedImage {
  url: string;
  width: number;
  height: number;
  size: number;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Reads dimensions, respecting EXIF orientation when the browser supports it. */
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

export default function JpgPngWebpConverterClient() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(90);
  const [converted, setConverted] = useState<ConvertedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const convert = async (src: SourceImage | null = source) => {
    if (!src || busy) return;
    setBusy(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(src.file, {
        imageOrientation: "from-image",
      });
      const w = bitmap.width;
      const h = bitmap.height;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bitmap.close();
        throw new Error("Your browser does not support canvas.");
      }
      if (format === "jpeg") {
        // JPG has no transparency: flatten onto white.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();

      const meta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
      const blob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob(resolve, meta.mime, format === "png" ? undefined : quality / 100);
      });
      if (!blob) throw new Error("Conversion failed. Try another format.");

      const url = URL.createObjectURL(blob);
      objectUrls.current.push(url);
      setConverted((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, width: w, height: h, size: blob.size };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this image.");
    } finally {
      setBusy(false);
    }
  };

  // Re-convert automatically when the output format or quality changes.
  useEffect(() => {
    if (source && !busy) convert(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, quality]);

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
      setConverted(null);
      convert({ file, url, ...dims });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this image.");
    }
  };

  const download = () => {
    if (!converted) return;
    const meta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
    const a = document.createElement("a");
    a.href = converted.url;
    a.download = `converted.${meta.ext}`;
    a.click();
  };

  const pctChange =
    source && converted
      ? Math.round((converted.size / source.file.size - 1) * 100)
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
          id="img-convert-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="img-convert-file"
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
          Pick an image and the tool converts it automatically with the
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
              label="SOURCE FORMAT"
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
                htmlFor="img-convert-quality"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                QUALITY — {quality}%
              </label>
              <input
                id="img-convert-quality"
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

          {format === "jpeg" && (
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
              <strong className="text-ink">Transparency:</strong> JPG has no
              alpha channel — transparent areas are filled with white. Use
              PNG or WebP to keep transparency.
            </div>
          )}

          <button
            type="button"
            onClick={() => convert()}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "CONVERTING…" : "CONVERT"}
          </button>

          <div className="bg-deep rounded-lg px-5 py-4">
            <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
              SIZE CHANGE
            </span>
            {pctChange !== null ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-5xl font-semibold text-accent">
                  {pctChange === 0
                    ? "0%"
                    : `${Math.abs(pctChange)}%`}
                </span>
                <span className="font-mono text-sm text-paper/70">
                  {pctChange === 0
                    ? "same size"
                    : pctChange < 0
                    ? "smaller than the original"
                    : "larger than the original (normal when converting to PNG)"}
                </span>
              </div>
            ) : (
              <span className="font-mono text-5xl font-semibold text-accent">—</span>
            )}
          </div>

          {converted && (
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
                    CONVERTED ({currentMeta.label})
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={converted.url}
                    alt="Converted"
                    className="w-full h-40 object-contain rounded bg-white"
                  />
                  <p className="font-mono text-xs text-ink/70 mt-2">
                    {formatBytes(converted.size)} · {converted.width}×
                    {converted.height}
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
        device — the image is never uploaded. PNG is lossless (quality does
        not apply). Animated GIFs become a single still frame.
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
