"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { trackCopy, trackDownload, trackToolUsed } from "@/lib/analytics";
import {
  DEFAULT_PDF_TO_MARKDOWN_OPTIONS,
  convertPdfTextToMarkdown,
  type PdfPageText,
  type PdfTextItem,
  type PdfToMarkdownNote,
  type PdfToMarkdownOptions,
  type PdfToMarkdownStats,
} from "@/lib/pdfToMarkdown";

// pdf.js is loaded dynamically (client-only): it relies on browser APIs that do
// not exist during the server prerender.
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

interface ExtractedFile {
  id: string;
  name: string;
  markdown: string;
  stats: PdfToMarkdownStats | null;
  notes: PdfToMarkdownNote[];
  error?: string;
}

const OPTION_LABELS: {
  key: keyof PdfToMarkdownOptions;
  label: string;
  hint: string;
}[] = [
  {
    key: "headings",
    label: "HEADINGS",
    hint: "Guess # / ## / ### from font size",
  },
  { key: "lists", label: "LISTS", hint: "Turn • and 1. leads into Markdown lists" },
  { key: "code", label: "CODE BLOCKS", hint: "Fence monospace lines as ``` code" },
  {
    key: "joinWrapped",
    label: "JOIN WRAPPED LINES",
    hint: "Rebuild paragraphs that PDFs break per line",
  },
  {
    key: "stripRunningHeads",
    label: "DROP HEADERS/FOOTERS",
    hint: "Remove text repeated on every page and page numbers",
  },
  {
    key: "pageBreaks",
    label: "PAGE BREAKS (---)",
    hint: "Insert a horizontal rule between pages",
  },
  {
    key: "frontMatter",
    label: "YAML FRONT MATTER",
    hint: "Prepend title, source file and page count",
  },
];

const NOTE_TEXT: Record<PdfToMarkdownNote, string> = {
  "no-text-layer":
    "No selectable text found. This PDF is probably a scan (images only), so there is nothing to extract — OCR cannot run offline in your browser. Nothing was sent anywhere; the file stayed on your device.",
  "possibly-multi-column":
    "Multi-column layout detected. Text from the columns may interleave — keep “join wrapped lines” off and fix the order in the preview if needed.",
  "possibly-table":
    "Table-like rows detected. Cells are exported as plain text lines, not as Markdown tables — that is the honest limit of text extraction.",
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeName(name: string): string {
  const base = name.replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]+/g, "-").trim();
  return base || "document";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Read every page of a PDF and normalise the items for the engine. */
async function extractPages(
  file: File,
  onProgress: (page: number, total: number) => void
): Promise<PdfPageText[]> {
  const pdfjsLib = await getPdfJs();
  const bytes = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
  const doc = await task.promise;
  const pages: PdfPageText[] = [];

  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items: PdfTextItem[] = [];

      for (const item of content.items) {
        if (!("str" in item)) continue; // marked-content entries carry no text
        const style = content.styles[item.fontName];
        items.push({
          str: item.str,
          x: item.transform[4],
          y: viewport.height - item.transform[5], // top-down reading order
          width: item.width,
          height: Math.abs(item.height) || 10,
          fontName: `${style?.fontFamily ?? ""} ${item.fontName}`.trim(),
        });
      }

      pages.push({ items, width: viewport.width, height: viewport.height });
      onProgress(n, doc.numPages);
    }
  } finally {
    // Releases the pdf.js worker as soon as the file is done.
    await task.destroy();
  }

  return pages;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-ink/10 rounded-lg px-3 py-2">
      <div className="font-mono text-[10px] tracking-widest text-ink/60">
        {label}
      </div>
      <div className="font-mono text-sm text-ink">{value}</div>
    </div>
  );
}

export default function PdfToMarkdownClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<PdfToMarkdownOptions>(
    DEFAULT_PDF_TO_MARKDOWN_OPTIONS
  );
  const [results, setResults] = useState<ExtractedFile[]>([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = results[active];
  const totalBytes = useMemo(
    () => files.reduce((acc, f) => acc + f.size, 0),
    [files]
  );

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
    );
    if (pdfs.length === 0) {
      setError("Please choose PDF files (.pdf).");
      return;
    }
    setError("");
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
      return [...prev, ...pdfs.filter((f) => !seen.has(`${f.name}:${f.size}`))];
    });
  };

  const toggleOption = (key: keyof PdfToMarkdownOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const convert = async () => {
    if (!files.length || busy) return;
    setBusy(true);
    setError("");
    setCopied(false);
    trackToolUsed("pdf-to-markdown", "pdf-tools");

    const collected: ExtractedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`FILE ${i + 1}/${files.length} · ${file.name}`);
      try {
        const pages = await extractPages(file, (pageNo, total) =>
          setProgress(
            `FILE ${i + 1}/${files.length} · PAGE ${pageNo}/${total}`
          )
        );
        const { markdown, stats, notes } = convertPdfTextToMarkdown(
          pages,
          options,
          {
            fileName: file.name,
            date: new Date().toISOString().slice(0, 10),
          }
        );
        collected.push({
          id: `${Date.now()}-${i}`,
          name: file.name,
          markdown,
          stats,
          notes,
        });
      } catch (e) {
        const name = (e as { name?: string })?.name ?? "";
        collected.push({
          id: `${Date.now()}-${i}`,
          name: file.name,
          markdown: "",
          stats: null,
          notes: [],
          error:
            name === "PasswordException"
              ? "This PDF is password-protected — remove the password first with our PDF Unlock tool, then convert it here."
              : "Could not read this file. It may be corrupted or use an unsupported PDF feature.",
        });
      }
    }

    setResults(collected);
    setActive(0);
    setProgress("");
    setBusy(false);
    setTimeout(
      () => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80
    );
  };

  const updateMarkdown = (value: string) => {
    setResults((prev) =>
      prev.map((r, i) => (i === active ? { ...r, markdown: value } : r))
    );
  };

  const copyMarkdown = async () => {
    if (!current?.markdown) return;
    try {
      await navigator.clipboard.writeText(current.markdown);
      setCopied(true);
      trackCopy("pdf-to-markdown", "pdf-tools");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Your browser blocked clipboard access — select the text and copy manually.");
    }
  };

  const downloadOne = (item: ExtractedFile) => {
    downloadBlob(
      new Blob([item.markdown], { type: "text/markdown;charset=utf-8" }),
      `${safeName(item.name)}.md`
    );
    trackDownload("pdf-to-markdown", "pdf-tools");
  };

  const downloadZip = async () => {
    if (!results.length) return;
    const zip = new JSZip();
    const used = new Set<string>();
    results.forEach((item) => {
      if (!item.markdown) return;
      let name = `${safeName(item.name)}.md`;
      let n = 2;
      while (used.has(name)) name = `${safeName(item.name)}-${n++}.md`;
      used.add(name);
      zip.file(name, item.markdown);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "markdown-from-pdf.zip");
    trackDownload("pdf-to-markdown", "pdf-tools");
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setActive(0);
    setError("");
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ---------------- upload + options ---------------- */}
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
            dragging ? "border-accent bg-accent/5" : "border-ink/15 bg-paper"
          }`}
        >
          <input
            ref={inputRef}
            id="pdf-to-markdown-files"
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor="pdf-to-markdown-files"
            className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            CHOOSE PDF FILES
          </label>
          <p className="mt-3 font-mono text-xs text-ink/70">
            OR DRAG &amp; DROP HERE — MULTIPLE FILES AT ONCE
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={`${file.name}:${file.size}`}
                className="flex items-center gap-3 bg-paper border border-ink/10 rounded-lg px-3 py-2"
              >
                <span className="font-mono text-xs text-ink/80 truncate flex-1">
                  {file.name}
                </span>
                <span className="font-mono text-[10px] text-ink/60">
                  {formatBytes(file.size)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() =>
                    setFiles((prev) =>
                      prev.filter(
                        (f) => !(f.name === file.name && f.size === file.size)
                      )
                    )
                  }
                  className="font-mono text-xs text-ink/50 hover:text-accent-deep transition-colors px-1"
                >
                  ✕
                </button>
              </div>
            ))}
            <p className="font-mono text-[10px] text-ink/60">
              {files.length} FILE{files.length > 1 ? "S" : ""} SELECTED ·{" "}
              {formatBytes(totalBytes)} TOTAL
            </p>
          </div>
        )}

        <div>
          <span className="font-mono text-xs tracking-widest text-ink/70 block mb-2">
            EXTRACTION OPTIONS
          </span>
          <div className="flex flex-wrap gap-2">
            {OPTION_LABELS.map(({ key, label, hint }) => (
              <button
                key={key}
                type="button"
                title={hint}
                aria-pressed={options[key]}
                onClick={() => toggleOption(key)}
                className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors ${
                  options[key]
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep"
                }`}
              >
                {options[key] ? "✓ " : ""}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={convert}
            disabled={busy || files.length === 0}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "EXTRACTING…" : "EXTRACT MARKDOWN"}
          </button>
          {(files.length > 0 || results.length > 0) && (
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep font-mono text-xs tracking-widest px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              CLEAR
            </button>
          )}
          {progress && (
            <span className="font-mono text-[10px] tracking-widest text-ink/70">
              {progress}
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs break-words">
            {error}
          </div>
        )}

        {files.length === 0 && results.length === 0 && (
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            Drop one or more PDFs to get clean Markdown with headings, lists
            and code blocks. Everything runs locally — no upload, no account,
            no watermark.
          </div>
        )}
      </div>

      {/* ---------------- results ---------------- */}
      {results.length > 0 && (
        <div
          ref={cardRef}
          className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col gap-4"
        >
          {results.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {results.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors max-w-[14rem] truncate ${
                    i === active
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          {current?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <strong className="font-semibold">{current.name}</strong> —{" "}
              {current.error}{" "}
              <Link
                href="/tools/pdf-tools/pdf-unlock"
                className="underline underline-offset-2 font-medium"
              >
                Open PDF Unlock
              </Link>
            </div>
          )}

          {current && !current.error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Stat label="PAGES" value={String(current.stats?.pages ?? 0)} />
                <Stat label="WORDS" value={String(current.stats?.words ?? 0)} />
                <Stat
                  label="HEADINGS"
                  value={String(current.stats?.headings ?? 0)}
                />
                <Stat label="LIST ITEMS" value={String(current.stats?.listItems ?? 0)} />
                <Stat
                  label="CODE BLOCKS"
                  value={String(current.stats?.codeBlocks ?? 0)}
                />
              </div>

              {current.notes.map((note) => (
                <div
                  key={note}
                  className="bg-accent/10 border border-accent/30 text-ink/80 rounded-lg px-4 py-3 text-sm"
                >
                  {NOTE_TEXT[note]}
                </div>
              ))}

              <label
                htmlFor="pdf-to-markdown-output"
                className="font-mono text-xs tracking-widest text-ink/70"
              >
                MARKDOWN OUTPUT — EDIT BEFORE DOWNLOADING IF YOU WANT
              </label>
              <textarea
                id="pdf-to-markdown-output"
                value={current.markdown}
                onChange={(e) => updateMarkdown(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => downloadOne(current)}
                  disabled={!current.markdown}
                  className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  DOWNLOAD {safeName(current.name).slice(0, 18).toUpperCase()}.MD
                </button>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  disabled={!current.markdown}
                  className="bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep font-mono text-xs tracking-widest px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {copied ? "COPIED ✓" : "COPY MARKDOWN"}
                </button>
                {results.filter((r) => r.markdown).length > 1 && (
                  <button
                    type="button"
                    onClick={downloadZip}
                    className="bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep font-mono text-xs tracking-widest px-4 py-2.5 rounded-lg transition-colors"
                  >
                    DOWNLOAD ALL (.ZIP)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-ink/50 font-mono text-center">
        Everything runs in your browser — your PDF never leaves your device.
      </p>
    </div>
  );
}
