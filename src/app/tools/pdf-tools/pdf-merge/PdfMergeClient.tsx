"use client";

import { useRef, useState } from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";
import { PDFDocument } from "pdf-lib";

interface PdfFileItem {
  id: string;
  file: File;
  pages: number | null;
  error: string | null;
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

/** Password-protected PDFs contain an /Encrypt dictionary — scan the raw bytes for it. */
function isEncryptedPdf(bytes: ArrayBuffer): boolean {
  const u8 = new Uint8Array(bytes);
  const marker = [0x2f, 0x45, 0x6e, 0x63, 0x72, 0x79, 0x70, 0x74]; // "/Encrypt"
  for (let i = 0; i <= u8.length - marker.length; i += 1) {
    let hit = true;
    for (let j = 0; j < marker.length; j += 1) {
      if (u8[i + j] !== marker[j]) {
        hit = false;
        break;
      }
    }
    if (hit) return true;
  }
  return false;
}

export default function PdfMergeClient() {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(0);

  const addFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const pdfs = files.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    const ignored = files.length - pdfs.length;
    if (ignored > 0) {
      setError(`${ignored} file(s) were ignored — only PDF files are accepted.`);
    }
    const newItems: PdfFileItem[] = [];
    for (const f of pdfs) {
      const item: PdfFileItem = {
        id: `f${idRef.current++}`,
        file: f,
        pages: null,
        error: null,
      };
      try {
        const bytes = await f.arrayBuffer();
        if (isEncryptedPdf(bytes)) {
          item.error =
            "This PDF is password-protected — remove the password first and try again.";
        } else {
          const doc = await PDFDocument.load(bytes);
          item.pages = doc.getPageCount();
        }
      } catch {
        item.error = "Can't read this file — it may be corrupted or not a valid PDF.";
      }
      newItems.push(item);
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

  const merge = async () => {
    trackToolUsed("pdf-merge", "pdf-tools");
    const valid = items.filter((i) => !i.error);
    if (valid.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const merged = await PDFDocument.create();
      let totalPages = 0;
      const failed: string[] = [];
      for (const item of valid) {
        try {
          const bytes = await item.file.arrayBuffer();
          const src = await PDFDocument.load(bytes);
          const pages = await merged.copyPages(src, src.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
          totalPages += src.getPageCount();
        } catch {
          failed.push(item.file.name);
        }
      }
      if (totalPages > 0) {
        const pdfBytes = await merged.save();
        downloadBlob(
          new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" }),
          "merged.pdf"
        );
        setResult(
          `Done — ${valid.length - failed.length} file(s) merged into ${totalPages} page(s). Check your downloads.`
        );
      }
      if (failed.length > 0) {
        setError(
          `Skipped ${failed.length} file(s) — password-protected or corrupted: ${failed.join(
            ", "
          )}. Remove the password first and try again.`
        );
      }
    } catch {
      setError("Merging failed. Please try again with valid PDF files.");
    } finally {
      setBusy(false);
    }
  };

  const totalPages = items.reduce((sum, i) => sum + (i.pages ?? 0), 0);
  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);
  const validCount = items.filter((i) => !i.error).length;

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
          id="pdf-merge-files"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-merge-files"
          className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          {items.length > 0 ? "ADD MORE FILES" : "CHOOSE PDF FILES"}
        </label>
        <p className="mt-3 font-mono text-xs text-ink/50">
          OR DRAG & DROP HERE — MULTIPLE FILES OK
        </p>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {error}
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Add at least two PDF files. The list shows the merge order — use
          the arrows to rearrange.
        </div>
      )}

      {/* File list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              FILES ({items.length}) — ORDER = MERGE ORDER
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
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-ink truncate">
                    {item.file.name}
                  </p>
                  <p className="font-mono text-[10px] text-ink/50 mt-0.5">
                    {item.error ? (
                      <span className="text-accent">{item.error}</span>
                    ) : (
                      `${item.pages ?? "?"} page${item.pages === 1 ? "" : "s"} · ${formatBytes(
                        item.file.size
                      )}`
                    )}
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
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="FILES" value={String(validCount)} highlight />
        <StatBlock label="PAGES" value={String(totalPages)} highlight />
        <StatBlock label="TOTAL SIZE" value={formatBytes(totalSize)} />
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={merge}
        disabled={validCount === 0 || busy}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        {busy ? "MERGING…" : "MERGE & DOWNLOAD"}
      </button>

      {result && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
          {result}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Everything runs on your
        device — your PDFs are never uploaded. Password-protected or
        corrupted files are skipped with a warning.
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
