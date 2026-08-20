"use client";

import { useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HeicToJpgClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ size: number } | null>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    setDone(null);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      trackToolUsed("heic-to-jpg", "images");
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality,
      });
      const out = Array.isArray(blob) ? blob[0] : blob;
      if (!out) throw new Error("Conversion returned no image.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(out);
      a.download = file.name.replace(/\.[^.]+$/i, "") + ".jpg";
      a.click();
      URL.revokeObjectURL(a.href);
      setDone({ size: out.size });
      trackDownload("heic-to-jpg", "images");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        /corrupt|invalid|no image/i.test(msg)
          ? "This file doesn't look like a valid HEIC/HEIF image."
          : `Conversion failed: ${msg}`
      );
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
          accept=".heic,.heif,image/heic,image/heif"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {file ? file.name.toUpperCase() : "SELECT HEIC / HEIF PHOTO"}
        </button>

        {file && (
          <p className="mt-3 text-sm font-mono text-ink/50">
            {formatBytes(file.size)} · {file.type || "HEIC"}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
            JPG QUALITY {Math.round(quality * 100)}%
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-accent"
            />
          </label>
          <button
            onClick={convert}
            disabled={busy || !file}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            {busy ? "CONVERTING…" : "CONVERT TO JPG"}
          </button>
        </div>

        {done && file && (
          <div className="mt-4 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            DONE — JPG ({formatBytes(done.size)}) downloaded. Original was{" "}
            {formatBytes(file.size)}.
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        The HEIC decoder loads on first use — and runs 100% in your browser.
      </p>
    </div>
  );
}
