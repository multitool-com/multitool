"use client";

import { useEffect, useRef, useState } from "react";

type Format = "jpeg" | "png" | "webp";

const FORMATS: { id: Format; label: string; ext: string; mime: string }[] = [
  { id: "png", label: "PNG", ext: "png", mime: "image/png" },
  { id: "jpeg", label: "JPG", ext: "jpg", mime: "image/jpeg" },
  { id: "webp", label: "WEBP", ext: "webp", mime: "image/webp" },
];

interface SourceImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatChars(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1000) return `${n} chars`;
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K chars`;
  return `${(n / 1000000).toFixed(2)}M chars`;
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

export default function ImageToBase64Client() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [format, setFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(90);
  const [maxWidth, setMaxWidth] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [chars, setChars] = useState(0);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const objectUrls = useRef<string[]>([]);
  const encodedUri = useRef<string>("");

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const encode = async (src: SourceImage | null = source) => {
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
      if (format === "jpeg") {
        // JPG has no transparency: flatten onto white.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();

      const meta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
      const uri = canvas.toDataURL(
        meta.mime,
        format === "png" ? undefined : quality / 100
      );
      if (!uri || uri.length < 30) {
        throw new Error("Encoding failed. Try another format.");
      }
      encodedUri.current = uri;
      setDataUri(uri.slice(0, 240));
      setChars(uri.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not encode this image.");
    } finally {
      setBusy(false);
    }
  };

  // Re-encode automatically when the format, quality or max width changes.
  useEffect(() => {
    if (source && !busy) encode(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, quality, maxWidth]);

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
      encode({ file, url, ...dims });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this image.");
    }
  };

  const copy = async () => {
    if (!encodedUri.current) return;
    try {
      await navigator.clipboard.writeText(encodedUri.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable: ignore
    }
  };

  const downloadPreview = () => {
    if (!dataUri) return;
    const a = document.createElement("a");
    a.href = dataUri;
    a.download = "base64-preview.txt";
    a.click();
  };

  const currentMeta = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
  const base64Bytes = Math.round((chars / 4) * 3); // ~size of the decoded image

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
          id="img-b64-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="img-b64-file"
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
          Pick an image and the tool generates its Base64 data URI
          automatically.
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
                htmlFor="img-b64-quality"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                QUALITY — {quality}%
              </label>
              <input
                id="img-b64-quality"
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
              htmlFor="img-b64-width"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              MAX WIDTH (PX) — SMALLER IMAGE = SMALLER STRING
            </label>
            <input
              id="img-b64-width"
              type="number"
              min={1}
              inputMode="numeric"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              placeholder="e.g. 128 (icons)"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="bg-deep rounded-lg px-5 py-4">
            <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
              DATA URI LENGTH
            </span>
            {chars > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-5xl font-semibold text-accent">
                  {formatChars(chars)}
                </span>
                <span className="font-mono text-sm text-paper/70">
                  ≈ {formatBytes(base64Bytes)} decoded
                </span>
              </div>
            ) : (
              <span className="font-mono text-5xl font-semibold text-accent">—</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                DATA URI (PREVIEW — {currentMeta.label})
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={downloadPreview}
                  disabled={!dataUri}
                  className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
                >
                  SAVE PREVIEW
                </button>
                <button
                  type="button"
                  onClick={copy}
                  disabled={!dataUri}
                  className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
                >
                  {copied ? "✓ COPIED" : "COPY FULL STRING"}
                </button>
              </div>
            </div>
            <textarea
              id="img-b64-output"
              readOnly
              value={dataUri}
              rows={4}
              spellCheck={false}
              className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y bg-paper break-all"
            />
            <p className="font-mono text-[10px] text-ink/40">
              Preview shows the first 240 characters. COPY FULL STRING copies
              the complete data URI to your clipboard.
            </p>
          </div>

          {dataUri && (
            <div className="grid sm:grid-cols-2 gap-3 items-start">
              <div className="bg-paper border border-ink/10 rounded-lg p-3">
                <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-2">
                  PREVIEW
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dataUri}
                  alt="Encoded preview"
                  className="w-full h-40 object-contain rounded bg-white"
                />
              </div>
              <div className="bg-paper border border-ink/10 rounded-lg p-3">
                <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-2">
                  HTML SNIPPET
                </span>
                <pre className="font-mono text-[11px] text-ink/80 overflow-x-auto whitespace-pre-wrap break-all bg-white rounded p-3">
                  {"<img src=\""}
                  <span className="text-accent">data:…</span>
                  {`" alt="image" />`}
                </pre>
                <pre className="font-mono text-[11px] text-ink/80 overflow-x-auto whitespace-pre-wrap break-all bg-white rounded p-3 mt-2">
                  {`background-image: url("`}
                  <span className="text-accent">data:…</span>
                  {`");`}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Base64 adds ~33% to the
        image size. Keep data URIs for small icons and logos; use normal
        files for large photos. PNG is lossless, so the quality slider
        applies only to JPG and WebP.
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
