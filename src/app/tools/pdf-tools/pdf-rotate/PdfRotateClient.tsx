"use client";

import { useRef, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

type Scope = "all" | "selected";
type Angle = 90 | 180 | 270;

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

/** Parses "1,3,5-8" into 1-based page numbers, validated against maxPage. */
function parseRanges(input: string, maxPage: number): { pages: number[]; error: string | null } {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length === 0) {
    return { pages: [], error: "Type at least one page, e.g. 1,3,5-8." };
  }
  const pages: number[] = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = Number(m[1]);
      const b = Number(m[2]);
      if (a < 1 || b > maxPage || a > b) {
        return { pages: [], error: `Invalid range "${part}" — pages go from 1 to ${maxPage}.` };
      }
      for (let i = a; i <= b; i += 1) pages.push(i);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n < 1 || n > maxPage) {
        return { pages: [], error: `Page ${n} does not exist — this PDF has ${maxPage} page${maxPage === 1 ? "" : "s"}.` };
      }
      pages.push(n);
    } else {
      return { pages: [], error: `Could not understand "${part}". Use e.g. 1,3,5-8.` };
    }
  }
  return { pages, error: null };
}

export default function PdfRotateClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [scope, setScope] = useState<Scope>("all");
  const [angle, setAngle] = useState<Angle>(90);
  const [rangeInput, setRangeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setRangeInput("");
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

  const rotate = async () => {
    if (!pdf || busy) return;
    let targets: number[] = [];
    if (scope === "all") {
      targets = Array.from({ length: pdf.pages }, (_, i) => i + 1);
    } else {
      const parsed = parseRanges(rangeInput, pdf.pages);
      if (parsed.error) {
        setError(parsed.error);
        return;
      }
      targets = parsed.pages;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const seen = new Set<number>();
      targets.forEach((pageNum) => {
        const idx = pageNum - 1;
        if (!seen.has(idx)) {
          doc.getPage(idx).setRotation(degrees(angle));
          seen.add(idx);
        }
      });
      const rotatedBytes = await doc.save();
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([rotatedBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-rotated.pdf`
      );
      setResult(
        `Done — ${seen.size} page${seen.size === 1 ? "" : "s"} rotated ${angle}°. Check your downloads.`
      );
    } catch {
      setError("Rotation failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const { pages: selectedPages, error: rangeError } =
    pdf && scope === "selected" ? parseRanges(rangeInput, pdf.pages) : { pages: [], error: null };

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
          id="pdf-rotate-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-rotate-file"
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
          Choose a PDF, then pick the angle and pages to rotate.
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

          {/* Scope */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              ROTATE
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  scope === "all"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                ALL PAGES
              </button>
              <button
                type="button"
                onClick={() => setScope("selected")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  scope === "selected"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                SELECTED PAGES
              </button>
            </div>
          </div>

          {/* Angle */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              ANGLE
            </span>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as Angle[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAngle(a)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    angle === a
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          {/* Selected pages input */}
          {scope === "selected" && (
            <div>
              <label
                htmlFor="pdf-rotate-ranges"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PAGES TO ROTATE (E.G. 1,3,5-8) — PDF HAS {pdf.pages} PAGE{pdf.pages === 1 ? "" : "S"}
              </label>
              <input
                id="pdf-rotate-ranges"
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1,3,5-8"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {rangeError ? (
                <p className="font-mono text-[10px] text-accent mt-1">{rangeError}</p>
              ) : (
                rangeInput.trim() &&
                selectedPages.length > 0 && (
                  <p className="font-mono text-[10px] text-ink/50 mt-1">
                    {selectedPages.length} page{selectedPages.length === 1 ? "" : "s"} will rotate {angle}°.
                  </p>
                )
              )}
            </div>
          )}

          <button
            type="button"
            onClick={rotate}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "ROTATING…" : "ROTATE & DOWNLOAD"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Rotation is stored as
        page metadata, so text stays selectable and quality is preserved.
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
