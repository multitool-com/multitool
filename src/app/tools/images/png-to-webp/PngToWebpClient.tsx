"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

interface Item {
  file: File;
  status: "pending" | "done" | "error";
  url?: string;
  outName: string;
  size?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PngToWebpClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState("");

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list: Item[] = [];
    for (const f of Array.from(files)) {
      if (/\.png$/i.test(f.name) || f.type === "image/png") {
        list.push({ file: f, status: "pending", outName: f.name.replace(/\.[^.]+$/i, "") + ".webp" });
      }
    }
    setItems(list);
    setWarn("");
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setBusy(true);
    trackToolUsed("png-to-webp", "images");
    let failed = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      try {
        const bitmap = await createImageBitmap(it.file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, "image/webp", quality)
        );
        if (!blob || blob.type !== "image/webp") throw new Error("webp encode unsupported");
        setItems((prev) =>
          prev.map((p, j) =>
            j === i ? { ...p, status: "done", url: URL.createObjectURL(blob), size: blob.size } : p
          )
        );
      } catch {
        failed++;
        setItems((prev) => prev.map((p, j) => (j === i ? { ...p, status: "error" } : p)));
      }
    }
    if (failed > 0) {
      setWarn(
        "Your browser could not encode WebP for some files (older Safari does this). Try Chrome/Edge/Firefox or use the JPG/PNG/WebP Converter."
      );
    }
    setBusy(false);
  };

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === "done" && i.url);
    if (done.length === 0) return;
    if (done.length === 1) {
      const a = document.createElement("a");
      a.href = done[0].url!;
      a.download = done[0].outName;
      a.click();
      trackDownload("png-to-webp", "images");
      return;
    }
    const zip = new JSZip();
    for (const d of done) {
      const resp = await fetch(d.url!);
      zip.file(d.outName, await resp.blob());
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "png-to-webp.zip";
    a.click();
    URL.revokeObjectURL(a.href);
    trackDownload("png-to-webp", "images");
  };

  const doneCount = items.filter((i) => i.status === "done").length;
  const saved =
    doneCount > 0
      ? items.reduce((acc, i) => acc + (i.size !== undefined ? i.file.size - i.size : 0), 0)
      : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          ref={inputRef}
          type="file"
          accept=".png,image/png"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {items.length ? `${items.length} PNG FILE(S) SELECTED — CLICK TO CHANGE` : "SELECT PNG FILES (BATCH OK)"}
        </button>

        {items.length > 0 && (
          <div className="mt-5 flex flex-col gap-4">
            <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto text-sm">
              {items.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border border-ink/10 rounded-lg px-3 py-2">
                  <span className="font-mono text-xs truncate">
                    {it.file.name}
                    <span className="text-ink/40"> · {formatBytes(it.file.size)}</span>
                  </span>
                  {it.status === "done" && it.url ? (
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <a
                        href={it.url}
                        download={it.outName}
                        onClick={() => trackDownload("png-to-webp", "images")}
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        ↓ {it.size ? formatBytes(it.size) : "WEBP"}
                      </a>
                      {it.size !== undefined && it.size < it.file.size && (
                        <span className="font-mono text-[10px] bg-accent/10 text-accent rounded-full px-2 py-0.5">
                          −{Math.round((1 - it.size / it.file.size) * 100)}%
                        </span>
                      )}
                    </span>
                  ) : it.status === "error" ? (
                    <span className="font-mono text-xs text-red-600">FAILED</span>
                  ) : (
                    <span className="font-mono text-xs text-ink/30">READY</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                WEBP QUALITY {Math.round(quality * 100)}%
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
                onClick={convertAll}
                disabled={busy}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "CONVERTING…" : "CONVERT ALL"}
              </button>
              {doneCount > 0 && (
                <button
                  onClick={downloadAll}
                  className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest px-6 py-3 rounded-lg transition-colors"
                >
                  DOWNLOAD ALL {doneCount > 1 ? "(ZIP)" : ""}
                </button>
              )}
            </div>

            {saved > 0 && (
              <div className="bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
                {doneCount} file(s) converted · total saved {formatBytes(saved)}
              </div>
            )}
            {warn && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
                {warn}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your images never leave your device.
      </p>
    </div>
  );
}
