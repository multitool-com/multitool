"use client";

import { useRef, useState } from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";
import { PDFDocument } from "pdf-lib";

type PageSize = "match" | "a4" | "letter" | "fit";

interface ImageItem {
  id: string;
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

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Reads dimensions, respecting EXIF orientation when supported. */
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

const A4 = { width: 595, height: 842 }; // points
const LETTER = { width: 612, height: 792 }; // points

export default function ImagesToPdfClient() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("match");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const idRef = useRef(0);
  const objectUrls = useRef<string[]>([]);

  const addFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const images = files.filter((f) => f.type.startsWith("image/"));
    const ignored = files.length - images.length;
    if (ignored > 0) {
      setError(`${ignored} file(s) were ignored — only image files are accepted.`);
    }
    const newItems: ImageItem[] = [];
    for (const f of images) {
      try {
        const dims = await decodeDimensions(f);
        const url = URL.createObjectURL(f);
        objectUrls.current.push(url);
        newItems.push({
          id: `i${idRef.current++}`,
          file: f,
          url,
          ...dims,
        });
      } catch {
        setError(`Could not read "${f.name}".`);
      }
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setResult(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setResult(null);
  };

  const clearAll = () => {
    setItems([]);
    setResult(null);
    setError(null);
  };

  const createPdf = async () => {
    trackToolUsed("images-to-pdf", "pdf-tools");
    if (items.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const doc = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const embedded = await doc.embedJpg(
          item.file.type === "image/jpeg"
            ? bytes
            : await convertToJpeg(bytes)
        );

        let pageW: number;
        let pageH: number;
        if (pageSize === "match") {
          pageW = embedded.width;
          pageH = embedded.height;
        } else if (pageSize === "a4") {
          pageW = A4.width;
          pageH = A4.height;
        } else if (pageSize === "letter") {
          pageW = LETTER.width;
          pageH = LETTER.height;
        } else {
          pageW = A4.width;
          pageH = A4.height;
        }

        const margin = pageSize === "fit" ? 24 : 0;
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(
          availW / embedded.width,
          availH / embedded.height,
          1
        );
        const drawW = embedded.width * scale;
        const drawH = embedded.height * scale;
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        const page = doc.addPage([pageW, pageH]);
        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }
      const pdfBytes = await doc.save();
      downloadBlob(
        new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" }),
        "images.pdf"
      );
      setResult(`Done — ${items.length} image${items.length === 1 ? "" : "s"} converted into ${items.length} page${items.length === 1 ? "" : "s"}. Check your downloads.`);
    } catch {
      setError("Conversion failed. Please try again with valid images.");
    } finally {
      setBusy(false);
    }
  };

  /** PNG/WebP → JPEG bytes via canvas (white background, quality 0.92). */
  const convertToJpeg = async (bytes: ArrayBuffer): Promise<ArrayBuffer> => {
    const url = URL.createObjectURL(new Blob([bytes]));
    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read image"));
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64 = dataUrl.split(",")[1];
      const bin = atob(base64);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
      return out.buffer as ArrayBuffer;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);

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
          addFiles(Array.from(e.dataTransfer.files ?? []));
        }}
        className={`border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-ink/15 bg-paper"
        }`}
      >
        <input
          id="img2pdf-files"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <label
          htmlFor="img2pdf-files"
          className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          {items.length > 0 ? "ADD MORE IMAGES" : "CHOOSE IMAGES"}
        </label>
        <p className="mt-3 font-mono text-xs text-ink/50">
          OR DRAG & DROP HERE — JPG · PNG · WEBP · MULTIPLE OK
        </p>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {error}
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Add at least one image. Each image becomes one page of the PDF.
        </div>
      )}

      {/* Image list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              IMAGES ({items.length}) — ORDER = PAGE ORDER
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
            >
              CLEAR ALL
            </button>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
            {items.map((item, index) => (
              <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                <span className="font-mono text-xs text-ink/30 w-6 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt=""
                  className="w-12 h-12 object-cover rounded bg-white border border-ink/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-ink truncate">
                    {item.file.name}
                  </p>
                  <p className="font-mono text-[10px] text-ink/50 mt-0.5">
                    {item.width}×{item.height} · {formatBytes(item.file.size)}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="font-mono text-[10px] w-7 h-7 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="font-mono text-[10px] w-7 h-7 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="font-mono text-[10px] w-7 h-7 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent transition-colors"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page size */}
      {items.length > 0 && (
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            PAGE SIZE
          </span>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { id: "match", label: "MATCH IMAGE" },
                { id: "a4", label: "A4" },
                { id: "letter", label: "LETTER" },
                { id: "fit", label: "FIT (A4 + MARGIN)" },
              ] as { id: PageSize; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPageSize(s.id)}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  pageSize === s.id
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="IMAGES" value={String(items.length)} highlight />
        <StatBlock label="PAGES" value={String(items.length)} highlight />
        <StatBlock label="TOTAL SIZE" value={formatBytes(totalSize)} />
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={createPdf}
        disabled={items.length === 0 || busy}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        {busy ? "CREATING PDF…" : "CREATE PDF & DOWNLOAD"}
      </button>

      {result && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
          {result}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Everything runs on your
        device — images are never uploaded. JPG/WebP images are embedded
        with transparency flattened onto white.
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
