"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

type Mode = "extract" | "single" | "ranges";

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

/** Parses "1,3,5-8" into a list of page numbers (1-based), validated against maxPage. */
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
        return {
          pages: [],
          error: `Invalid range "${part}" — pages go from 1 to ${maxPage}.`,
        };
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

export default function PdfSplitClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [mode, setMode] = useState<Mode>("extract");
  const [rangeInput, setRangeInput] = useState("");
  const [chunkSize, setChunkSize] = useState("5");
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
      setPdf({ file, pages: doc.getPageCount(), size: file.size });
      setRangeInput("");
    } catch {
      setError(
        "Can't read this file — it may be password-protected or corrupted."
      );
    }
  };

  const extractPdf = async (pages: number[]): Promise<Uint8Array> => {
    if (!pdf) throw new Error("No file");
    const bytes = await pdf.file.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const out = await PDFDocument.create();
    const copied = await out.copyPages(
      src,
      pages.map((p) => p - 1)
    );
    copied.forEach((page) => out.addPage(page));
    return out.save();
  };

  const runExtract = async () => {
    if (!pdf || busy) return;
    const { pages, error: rangeError } = parseRanges(rangeInput, pdf.pages);
    if (rangeError) {
      setError(rangeError);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await extractPdf(pages);
      downloadBlob(
        new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }),
        "extracted-pages.pdf"
      );
      setResult(
        `Done — ${pages.length} page${pages.length === 1 ? "" : "s"} extracted. Check your downloads.`
      );
    } catch {
      setError("Extraction failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const buildZip = async (entries: { name: string; bytes: Uint8Array }[]): Promise<Blob> => {
    const zip = new JSZip();
    entries.forEach((e) => zip.file(e.name, e.bytes));
    const out = await zip.generateAsync({ type: "uint8array" });
    return new Blob([out as unknown as BlobPart], { type: "application/zip" });
  };

  const runSingle = async () => {
    if (!pdf || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const entries: { name: string; bytes: Uint8Array }[] = [];
      for (let i = 0; i < src.getPageCount(); i += 1) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        entries.push({
          name: `page-${String(i + 1).padStart(3, "0")}.pdf`,
          bytes: await out.save(),
        });
      }
      const zipBlob = await buildZip(entries);
      downloadBlob(zipBlob, "split-single-pages.zip");
      setResult(`Done — ${entries.length} PDFs (one per page) in a ZIP. Check your downloads.`);
    } catch {
      setError("Splitting failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const runRanges = async () => {
    if (!pdf || busy) return;
    const n = parseInt(chunkSize, 10);
    if (Number.isNaN(n) || n < 1) {
      setError("Chunk size must be at least 1 page.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const total = src.getPageCount();
      const entries: { name: string; bytes: Uint8Array }[] = [];
      for (let start = 1; start <= total; start += n) {
        const end = Math.min(start + n - 1, total);
        const out = await PDFDocument.create();
        const pageIndices: number[] = [];
        for (let p = start; p <= end; p += 1) pageIndices.push(p - 1);
        const copied = await out.copyPages(src, pageIndices);
        copied.forEach((page) => out.addPage(page));
        entries.push({
          name: `part-${String(start).padStart(3, "0")}-${String(end).padStart(3, "0")}.pdf`,
          bytes: await out.save(),
        });
      }
      const zipBlob = await buildZip(entries);
      downloadBlob(zipBlob, "split-ranges.zip");
      setResult(`Done — ${entries.length} PDF${entries.length === 1 ? "" : "s"} of up to ${n} pages each, in a ZIP.`);
    } catch {
      setError("Splitting failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const { pages, error: rangeError } =
    pdf && mode === "extract" ? parseRanges(rangeInput, pdf.pages) : { pages: [], error: null };

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
          id="pdf-split-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-split-file"
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
          Choose a PDF to see its page count and the split options.
        </div>
      )}

      {pdf && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="FILE" value={pdf.file.name.length > 24 ? pdf.file.name.slice(0, 21) + "…" : pdf.file.name} highlight />
            <StatBlock label="PAGES" value={String(pdf.pages)} highlight />
            <StatBlock label="SIZE" value={formatBytes(pdf.size)} />
          </div>

          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              SPLIT MODE
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setMode("extract")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  mode === "extract"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                EXTRACT PAGES
              </button>
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  mode === "single"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                SINGLE PAGES (ZIP)
              </button>
              <button
                type="button"
                onClick={() => setMode("ranges")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  mode === "ranges"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                RANGES OF N (ZIP)
              </button>
            </div>
          </div>

          {mode === "extract" && (
            <div>
              <label
                htmlFor="pdf-split-ranges"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PAGES TO KEEP (E.G. 1,3,5-8) — PDF HAS {pdf.pages} PAGE{pdf.pages === 1 ? "" : "S"}
              </label>
              <input
                id="pdf-split-ranges"
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
                pages.length > 0 && (
                  <p className="font-mono text-[10px] text-ink/50 mt-1">
                    {pages.length} page{pages.length === 1 ? "" : "s"} selected.
                  </p>
                )
              )}
            </div>
          )}

          {mode === "ranges" && (
            <div>
              <label
                htmlFor="pdf-split-chunk"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PAGES PER FILE
              </label>
              <input
                id="pdf-split-chunk"
                type="number"
                min={1}
                inputMode="numeric"
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {(() => {
                const n = parseInt(chunkSize, 10);
                if (!Number.isNaN(n) && n >= 1) {
                  const files = Math.ceil(pdf.pages / n);
                  return (
                    <p className="font-mono text-[10px] text-ink/50 mt-1">
                      {files} file{files === 1 ? "" : "s"} of up to {n} page{n === 1 ? "" : "s"} each.
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (mode === "extract") runExtract();
              else if (mode === "single") runSingle();
              else runRanges();
            }}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy
              ? "SPLITTING…"
              : mode === "extract"
              ? "EXTRACT & DOWNLOAD"
              : mode === "single"
              ? "SPLIT INTO SINGLE PAGES (ZIP)"
              : "SPLIT INTO RANGES (ZIP)"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Everything runs on your
        device — your PDF is never uploaded. Multi-file results come as a
        ZIP. Password-protected or corrupted files cannot be read.
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
