"use client";

import { useState } from "react";
import JSZip from "jszip";

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

type Format = "jpeg" | "png";
type Scale = 1 | 1.5 | 2;

interface PdfInfo {
  file: File;
  pages: number;
  size: number;
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

const SCALES: { id: Scale; label: string }[] = [
  { id: 1, label: "1× NORMAL" },
  { id: 1.5, label: "1.5× HIGH" },
  { id: 2, label: "2× MAX" },
];

export default function PdfToImagesClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(85);
  const [scale, setScale] = useState<Scale>(1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const pdfjsLib = await getPdfJs();
      const bytes = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({
        data: new Uint8Array(bytes),
      }).promise;
      setPdf({ file, pages: doc.numPages, size: file.size });
    } catch {
      setError(
        "Can't read this file — it may be password-protected or corrupted."
      );
    }
  };

  const convert = async () => {
    if (!pdf || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const pdfjsLib = await getPdfJs();
      const bytes = await pdf.file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({
        data: new Uint8Array(bytes),
      }).promise;

      const zip = new JSZip();
      const folder = zip.folder("pages");
      if (!folder) throw new Error("ZIP error");

      for (let i = 1; i <= pdfDoc.numPages; i += 1) {
        setProgress(`Rendering page ${i} of ${pdfDoc.numPages}…`);
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const mime = format === "jpeg" ? "image/jpeg" : "image/png";
        const dataUrl = canvas.toDataURL(mime, format === "jpeg" ? quality / 100 : undefined);
        const base64 = dataUrl.split(",")[1];
        const bin = atob(base64);
        const bytesArr = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j += 1) bytesArr[j] = bin.charCodeAt(j);

        const ext = format === "jpeg" ? "jpg" : "png";
        folder.file(`page-${String(i).padStart(3, "0")}.${ext}`, bytesArr);
      }

      setProgress("Packaging ZIP…");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(zipBlob, `${baseName}-pages.zip`);
      setProgress("");
      setResult(
        `Done — ${pdfDoc.numPages} page${pdfDoc.numPages === 1 ? "" : "s"} converted to ${format === "jpeg" ? "JPG" : "PNG"} in a ZIP. Check your downloads.`
      );
    } catch {
      setError("Conversion failed. Please try again.");
    } finally {
      setBusy(false);
      setProgress("");
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
          id="pdf2img-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf2img-file"
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
          Choose a PDF to convert its pages to images.
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

          {/* Format */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              IMAGE FORMAT
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setFormat("jpeg")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  format === "jpeg"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                JPG
              </button>
              <button
                type="button"
                onClick={() => setFormat("png")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  format === "png"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          {/* Quality (JPG only) */}
          {format === "jpeg" && (
            <div>
              <label
                htmlFor="pdf2img-quality"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                QUALITY — {quality}%
              </label>
              <input
                id="pdf2img-quality"
                type="range"
                min={30}
                max={100}
                step={1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          )}

          {/* Resolution */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              RESOLUTION
            </span>
            <div className="flex gap-2 flex-wrap">
              {SCALES.map((s) => (
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
            onClick={convert}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "CONVERTING…" : "CONVERT & DOWNLOAD ZIP"}
          </button>

          {progress && (
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 font-mono text-xs text-ink/70">
              {progress}
            </div>
          )}

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Each page becomes an
        image — text is no longer selectable in the result. Everything runs
        on your device.
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
