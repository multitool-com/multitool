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

export default function WebpToJpgClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list: Item[] = [];
    for (const f of Array.from(files)) {
      if (/\.webp$/i.test(f.name) || f.type === "image/webp") {
        list.push({ file: f, status: "pending", outName: f.name.replace(/\.[^.]+$/i, "") + ".jpg" });
      }
    }
    setItems(list);
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setBusy(true);
    trackToolUsed("webp-to-jpg", "images");
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      try {
        const bitmap = await createImageBitmap(it.file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, "image/jpeg", quality)
        );
        if (!blob) throw new Error("encode failed");
        setItems((prev) =>
          prev.map((p, j) =>
            j === i ? { ...p, status: "done", url: URL.createObjectURL(blob), size: blob.size } : p
          )
        );
      } catch {
        setItems((prev) => prev.map((p, j) => (j === i ? { ...p, status: "error" } : p)));
      }
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
      trackDownload("webp-to-jpg", "images");
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
    a.download = "webp-to-jpg.zip";
    a.click();
    URL.revokeObjectURL(a.href);
    trackDownload("webp-to-jpg", "images");
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          ref={inputRef}
          type="file"
          accept=".webp,image/webp"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {items.length ? `${items.length} WEBP FILE(S) SELECTED — CLICK TO CHANGE` : "SELECT WEBP FILES (BATCH OK)"}
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
                    <a
                      href={it.url}
                      download={it.outName}
                      onClick={() => trackDownload("webp-to-jpg", "images")}
                      className="font-mono text-xs text-accent hover:underline whitespace-nowrap"
                    >
                      ↓ {it.size ? formatBytes(it.size) : "JPG"}
                    </a>
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
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your images never leave your device.
      </p>
    </div>
  );
}
