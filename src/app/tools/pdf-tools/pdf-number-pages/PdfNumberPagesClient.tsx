"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Position = "bottom-center" | "bottom-right" | "top-center" | "top-right";

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

const POSITIONS: { id: Position; label: string }[] = [
  { id: "bottom-center", label: "BOTTOM CENTER" },
  { id: "bottom-right", label: "BOTTOM RIGHT" },
  { id: "top-center", label: "TOP CENTER" },
  { id: "top-right", label: "TOP RIGHT" },
];

export default function PdfNumberPagesClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startAt, setStartAt] = useState("1");
  const [fontSize, setFontSize] = useState(12);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [includeTotal, setIncludeTotal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

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
        "Can't read this file — it may be password-protected or corrupted."
      );
    }
  };

  const addNumbers = async () => {
    if (!pdf || busy) return;
    const start = parseInt(startAt, 10);
    if (Number.isNaN(start) || start < 0) {
      setError("Start at must be a number of 0 or more.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const gray = rgb(0.25, 0.25, 0.3);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const number = start + i;
        const label =
          prefix +
          number +
          (includeTotal ? ` of ${pdf.pages}` : "") +
          suffix;
        const textW = font.widthOfTextAtSize(label, fontSize);
        const margin = 36;
        let x: number, y: number;
        switch (position) {
          case "bottom-center":
            x = (width - textW) / 2;
            y = margin;
            break;
          case "bottom-right":
            x = width - textW - margin;
            y = margin;
            break;
          case "top-center":
            x = (width - textW) / 2;
            y = height - margin - fontSize;
            break;
          case "top-right":
            x = width - textW - margin;
            y = height - margin - fontSize;
            break;
        }
        page.drawText(label, { x, y, size: fontSize, font, color: gray });
      });
      const outBytes = await doc.save();
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-numbered.pdf`
      );
      setResult(
        `Done — ${pdf.pages} page${pdf.pages === 1 ? "" : "s"} numbered. Check your downloads.`
      );
    } catch {
      setError("Numbering failed. Please try again.");
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
          id="pdf-num-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-num-file"
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
          Choose a PDF to add page numbers to it.
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

          {/* Position */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              POSITION
            </span>
            <div className="flex gap-2 flex-wrap">
              {POSITIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosition(p.id)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    position === p.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start at + size */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="pdf-num-start"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                START AT
              </label>
              <input
                id="pdf-num-start"
                type="number"
                min={0}
                inputMode="numeric"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="pdf-num-size"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                FONT SIZE — {fontSize}pt
              </label>
              <input
                id="pdf-num-size"
                type="range"
                min={8}
                max={28}
                step={1}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-accent mt-2"
              />
            </div>
          </div>

          {/* Prefix / Suffix */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="pdf-num-prefix"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PREFIX (OPTIONAL)
              </label>
              <input
                id="pdf-num-prefix"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Page "
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="pdf-num-suffix"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                SUFFIX (OPTIONAL)
              </label>
              <input
                id="pdf-num-suffix"
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder=""
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Include total */}
          <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
            <input
              type="checkbox"
              checked={includeTotal}
              onChange={(e) => setIncludeTotal(e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm">
              Include total (shows "3 of 10" style)
            </span>
          </label>

          {/* Preview of the label */}
          {(() => {
            const label =
              prefix + startAt + (includeTotal ? ` of ${pdf.pages}` : "") + suffix;
            return (
              <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
                <strong className="text-ink">Preview:</strong>{" "}
                <span className="font-mono text-accent">{label}</span>{" "}
                on page 1, then {prefix}
                {Number(startAt) + 1}
                {includeTotal ? ` of ${pdf.pages}` : ""}
                {suffix}…
              </div>
            );
          })()}

          <button
            type="button"
            onClick={addNumbers}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "NUMBERING…" : "ADD NUMBERS & DOWNLOAD"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Numbers are drawn as
        text over a copy — the original content stays intact and selectable.
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
