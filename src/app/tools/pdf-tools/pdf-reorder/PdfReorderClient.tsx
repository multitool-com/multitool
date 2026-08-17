"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

interface PdfInfo {
  file: File;
  pages: number;
  size: number;
}

interface PageItem {
  id: number;
  originalIndex: number; // 0-based index in the source PDF
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

export default function PdfReorderClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const idRef = useRef(0);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setPdf({ file, pages: count, size: file.size });
      setPages(
        Array.from({ length: count }, (_, i) => ({
          id: idRef.current++,
          originalIndex: i,
        }))
      );
    } catch {
      setError(
        "Can't read this file — it may be password-protected or corrupted."
      );
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setPages((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setResult(null);
  };

  const remove = (id: number) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setResult(null);
  };

  const reset = () => {
    if (!pdf) return;
    setPages(
      Array.from({ length: pdf.pages }, (_, i) => ({
        id: idRef.current++,
        originalIndex: i,
      }))
    );
    setResult(null);
  };

  const reorder = async () => {
    if (!pdf || busy) return;
    if (pages.length === 0) {
      setError("All pages were removed — add at least one page to download.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(
        src,
        pages.map((p) => p.originalIndex)
      );
      copied.forEach((page) => out.addPage(page));
      const outBytes = await out.save();
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-reordered.pdf`
      );
      setResult(
        `Done — ${pages.length} page${pages.length === 1 ? "" : "s"} in the new order. Check your downloads.`
      );
    } catch {
      setError("Reordering failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

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
          const f = e.dataTransfer.files?.[0] ?? null;
          if (f && (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
            loadFile(f);
          } else {
            setError("Please drop a PDF file.");
          }
        }}
        className={`border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-ink/15 bg-paper"
        }`}
      >
        <input
          id="pdf-reorder-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-reorder-file"
          className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          {pdf ? "CHOOSE ANOTHER PDF" : "CHOOSE A PDF"}
        </label>
        <p className="mt-3 font-mono text-xs text-ink/50">
          OR DRAG & DROP HERE — ONE FILE AT A TIME
        </p>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {error}
        </div>
      )}

      {!pdf && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Choose a PDF to reorder its pages.
        </div>
      )}

      {pdf && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatBlock
              label="FILE"
              value={pdf.file.name.length > 24 ? pdf.file.name.slice(0, 21) + "…" : pdf.file.name}
              highlight
            />
            <StatBlock label="PAGES" value={String(pdf.pages)} highlight />
            <StatBlock label="SIZE" value={formatBytes(pdf.size)} />
          </div>

          {/* Page list */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                PAGE ORDER ({pages.length}/{pdf.pages})
              </span>
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
              >
                RESET ORDER
              </button>
            </div>
            <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
              {pages.map((item, index) => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="font-mono text-xs text-ink/30 w-6 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs font-semibold text-ink flex-1">
                    Page {item.originalIndex + 1}
                  </span>
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
                      disabled={index === pages.length - 1}
                      className="font-mono text-[10px] w-7 h-7 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="font-mono text-[10px] w-7 h-7 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent transition-colors"
                      aria-label="Remove page"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <div className="px-4 py-6 text-center font-mono text-xs text-ink/50">
                  All pages removed — use RESET ORDER to bring them back.
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={reorder}
            disabled={busy || pages.length === 0}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "REORDERING…" : "REORDER & DOWNLOAD"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Pages are copied in the
        new order without modification — quality and content are preserved.
        Everything runs on your device.
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
