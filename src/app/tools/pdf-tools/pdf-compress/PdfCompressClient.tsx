"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

// pdf.js is loaded dynamically (client-only) — it uses browser-only APIs
// (DOMMatrix, canvas) that do not exist during the server-side prerender.
async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }
  return pdfjsLib;
}

interface PdfInfo {
  file: File;
  pages: number;
  size: number;
}

interface CompressResult {
  size: number;
  reduction: number; // negative = grew
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

const QUALITY_OPTIONS = [30, 50, 65, 80];
const SCALE_OPTIONS = [
  { id: 0.5, label: "0.5× SMALL" },
  { id: 0.75, label: "0.75× MEDIUM" },
  { id: 1, label: "1× ORIGINAL" },
];

export default function PdfCompressClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [quality, setQuality] = useState(65);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPdf({ file, pages: doc.getPageCount(), size: file.size });
    } catch {
      setError(
        "Can't read this file — it may be password-protected or corrupted. Remove the password first with PDF Unlock."
      );
    }
  };

  const compress = async () => {
    if (!pdf || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const pdfjsLib = await getPdfJs();
      const pdfDoc = await pdfjsLib.getDocument({
        data: new Uint8Array(bytes),
      }).promise;

      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= pdfDoc.numPages; i += 1) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
        const base64 = dataUrl.split(",")[1];
        const bin = atob(base64);
        const jpeg = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j += 1) jpeg[j] = bin.charCodeAt(j);
        const img = await outDoc.embedJpg(jpeg);
        const p = outDoc.addPage([viewport.width, viewport.height]);
        p.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      }
      const compressedBytes = await outDoc.save();
      const reduction = Math.round(
        (1 - compressedBytes.length / pdf.file.size) * 100
      );
      setResult({ size: compressedBytes.length, reduction });

      // Only auto-download when it actually got smaller.
      if (reduction > 0) {
        const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
        downloadBlob(
          new Blob([compressedBytes as unknown as BlobPart], {
            type: "application/pdf",
          }),
          `${baseName}-compressed.pdf`
        );
      }
    } catch {
      setError("Compression failed. Please try again.");
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
          id="pdf-compress-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-compress-file"
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
          Choose a PDF to compress. Works best on scanned documents and
          photo PDFs.
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

          {/* Quality */}
          <div>
            <label
              htmlFor="pdf-compress-quality"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              QUALITY — {quality}% (LOWER = SMALLER FILE)
            </label>
            <input
              id="pdf-compress-quality"
              type="range"
              min={10}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between gap-2 mt-1">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full transition-colors ${
                    quality === q
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {q}%
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              RESOLUTION
            </span>
            <div className="flex gap-2 flex-wrap">
              {SCALE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScale(s.id)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    scale === s.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={compress}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "COMPRESSING… (MAY TAKE A MOMENT)" : "COMPRESS & DOWNLOAD"}
          </button>

          {result && (
            <div
              className={`border rounded-lg px-4 py-3 font-mono text-xs ${
                result.reduction > 0
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-paper border-ink/10 text-ink/70"
              }`}
            >
              {result.reduction > 0 ? (
                <>
                  <strong>Done!</strong> {formatBytes(result.size)} —{" "}
                  <strong>{result.reduction}% smaller</strong>. The file was
                  downloaded — check your downloads folder.
                </>
              ) : (
                <>
                  <strong>No download:</strong> the result ({formatBytes(
                    result.size
                  )}) is not smaller than the original ({formatBytes(
                    pdf.file.size
                  )}). This often happens with text-only PDFs — try a
                  lower quality or resolution, or keep the original.
                </>
              )}
            </div>
          )}

          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            <strong className="text-ink">Trade-off:</strong> compressed
            pages become images, so text is no longer selectable or
            searchable. Best for scans and photo PDFs.
          </div>
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Compression runs in your
        browser with the pdf.js engine — the file never leaves your device.
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
