"use client";

import JSZip from "jszip";
import { useRef, useState } from "react";
import { trackDownload, trackToolUsed } from "@/lib/analytics";
import { readWordDocument, WordReadError, type WordDocumentModel } from "@/lib/wordDocument";
import {
  DEFAULT_WORD_PDF_OPTIONS,
  modelToPreview,
  renderWordToPdf,
  type MarginId,
  type PageSizeId,
  type WordPdfOptions,
} from "@/lib/wordPdfWriter";

interface ConvertedFile {
  id: string;
  name: string;
  bytes: Uint8Array | null;
  pages: number;
  images: number;
  source: WordDocumentModel["source"] | null;
  preview: string;
  warnings: string[];
  replacedChars: number;
  droppedChars: number;
  words: number;
  error?: string;
}

const PAGE_SIZES: { id: PageSizeId; label: string }[] = [
  { id: "a4", label: "A4" },
  { id: "letter", label: "LETTER" },
  { id: "legal", label: "LEGAL" },
];

const MARGINS: { id: MarginId; label: string }[] = [
  { id: "narrow", label: "NARROW" },
  { id: "normal", label: "NORMAL" },
  { id: "wide", label: "WIDE" },
];

const TOGGLES: { key: keyof WordPdfOptions; label: string; hint: string }[] = [
  { key: "pageNumbers", label: "PAGE NUMBERS", hint: "“1 / 12” at the bottom of every page" },
  { key: "runningHeader", label: "RUNNING HEADER", hint: "Document title on top of every page" },
  { key: "images", label: "EMBED IMAGES", hint: "Include PNG and JPEG figures" },
];

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeName(name: string): string {
  const base = name
    .replace(/\.docx?$/i, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .trim();
  return base || "documento";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-ink/10 rounded-lg px-3 py-2">
      <div className="font-mono text-[10px] tracking-widest text-ink/60">{label}</div>
      <div className="font-mono text-sm text-ink">{value}</div>
    </div>
  );
}

export default function WordToPdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<WordPdfOptions>(DEFAULT_WORD_PDF_OPTIONS);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const current = results[active];

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const words = Array.from(incoming).filter(
      (file) => /\.docx?$/i.test(file.name) || file.type.includes("wordprocessingml")
    );
    if (words.length === 0) {
      setError("Escolha arquivos .docx ou .doc (Word). PDFs e outros formatos não entram aqui.");
      return;
    }
    setError("");
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
      return [...prev, ...words.filter((f) => !seen.has(`${f.name}:${f.size}`))];
    });
  };

  const toggleOption = (key: keyof WordPdfOptions) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  };

  const convert = async () => {
    if (!files.length || busy) return;
    setBusy(true);
    setError("");
    trackToolUsed("word-to-pdf", "pdf-tools");

    const collected: ConvertedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`ARQUIVO ${i + 1}/${files.length} · ${file.name}`);
      const base: ConvertedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        bytes: null,
        pages: 0,
        images: 0,
        source: null,
        preview: "",
        warnings: [],
        replacedChars: 0,
        droppedChars: 0,
        words: 0,
      };

      try {
        const raw = new Uint8Array(await file.arrayBuffer());
        const model = await readWordDocument(raw, file.name);
        setProgress(
          `ARQUIVO ${i + 1}/${files.length} · ${model.source === "docx" ? "DOCX" : "DOC LEGADO"} · ${model.stats.words} PALAVRAS`
        );
        const pdf = await renderWordToPdf(model, options);
        collected.push({
          ...base,
          bytes: pdf.bytes,
          pages: pdf.pages,
          images: model.stats.images,
          source: model.source,
          preview: modelToPreview(model, 900),
          warnings: model.warnings,
          replacedChars: pdf.replacedChars,
          droppedChars: pdf.droppedChars,
          words: model.stats.words,
        });
      } catch (e) {
        collected.push({
          ...base,
          error:
            e instanceof WordReadError
              ? e.message
              : "A conversão falhou neste arquivo. Se ele abre no Word, tente salvar novamente como .docx e converter de novo.",
        });
      }
    }

    setResults(collected);
    setActive(0);
    setProgress("");
    setBusy(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const downloadOne = (item: ConvertedFile) => {
    if (!item.bytes) return;
    const blob = new Blob([item.bytes as unknown as BlobPart], { type: "application/pdf" });
    downloadBlob(blob, `${safeName(item.name)}.pdf`);
    trackDownload("word-to-pdf", "pdf-tools");
  };

  const downloadZip = async () => {
    const usable = results.filter((r) => r.bytes);
    if (!usable.length) return;
    const zip = new JSZip();
    const used = new Set<string>();
    usable.forEach((item) => {
      let name = `${safeName(item.name)}.pdf`;
      let n = 2;
      while (used.has(name)) name = `${safeName(item.name)}-${n++}.pdf`;
      used.add(name);
      zip.file(name, item.bytes as Uint8Array);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "word-para-pdf.zip");
    trackDownload("word-to-pdf", "pdf-tools");
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
            id="word-to-pdf-files"
            type="file"
            accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor="word-to-pdf-files"
            className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            CHOOSE .DOCX OR .DOC FILES
          </label>
          <p className="mt-3 font-mono text-xs text-ink/70">
            OR DRAG &amp; DROP HERE — SEVERAL FILES AT ONCE
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={`${file.name}:${file.size}`}
                className="flex items-center gap-3 bg-paper border border-ink/10 rounded-lg px-3 py-2"
              >
                <span className="font-mono text-xs text-ink/80 truncate flex-1">{file.name}</span>
                <span className="font-mono text-[10px] text-ink/60">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remover ${file.name}`}
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => !(f.name === file.name && f.size === file.size)))
                  }
                  className="font-mono text-xs text-ink/50 hover:text-accent-deep transition-colors px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/70 block mb-2">PAGE SIZE</span>
            <div className="flex flex-wrap gap-2">
              {PAGE_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={options.pageSize === size.id}
                  onClick={() => setOptions((prev) => ({ ...prev, pageSize: size.id }))}
                  className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors ${
                    options.pageSize === size.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-xs tracking-widest text-ink/70 block mb-2">MARGINS</span>
            <div className="flex flex-wrap gap-2">
              {MARGINS.map((margin) => (
                <button
                  key={margin.id}
                  type="button"
                  aria-pressed={options.margins === margin.id}
                  onClick={() => setOptions((prev) => ({ ...prev, margins: margin.id }))}
                  className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors ${
                    options.margins === margin.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep"
                  }`}
                >
                  {margin.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="word-to-pdf-size"
            className="font-mono text-xs tracking-widest text-ink/70 block mb-2"
          >
            BODY TEXT SIZE — {options.bodySize} PT
          </label>
          <input
            id="word-to-pdf-size"
            type="range"
            min={9}
            max={14}
            step={0.5}
            value={options.bodySize}
            onChange={(e) => setOptions((prev) => ({ ...prev, bodySize: Number(e.target.value) }))}
            className="w-full accent-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TOGGLES.map(({ key, label, hint }) => (
            <button
              key={key}
              type="button"
              title={hint}
              aria-pressed={options[key] as boolean}
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={convert}
            disabled={busy || files.length === 0}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "CONVERTING…" : "CONVERT TO PDF"}
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
            <span className="font-mono text-[10px] tracking-widest text-ink/70">{progress}</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs break-words">
            {error}
          </div>
        )}

        {files.length === 0 && results.length === 0 && (
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            The document is read and typeset entirely in your browser: nothing is uploaded, and it
            keeps working offline after the page loads. Both .docx (Word 2007+) and legacy .doc
            files are accepted.
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div
          ref={resultRef}
          className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col gap-4"
        >
          {results.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {results.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors max-w-[14rem] truncate ${
                    index === active
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
              <strong className="font-semibold">{current.name}</strong> — {current.error}
            </div>
          )}

          {current && !current.error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Stat label="PAGES" value={String(current.pages)} />
                <Stat label="WORDS" value={String(current.words)} />
                <Stat label="FIGURES" value={String(current.images)} />
                <Stat label="ORIGIN" value={current.source === "docx" ? ".DOCX" : ".DOC"} />
                <Stat label="SIZE" value={current.bytes ? formatBytes(current.bytes.length) : "—"} />
              </div>

              {current.warnings.map((warning) => (
                <div
                  key={warning}
                  className="bg-accent/10 border border-accent/30 text-ink/80 rounded-lg px-4 py-3 text-sm"
                >
                  {warning}
                </div>
              ))}

              {current.replacedChars > 0 && (
                <p className="text-xs text-ink/60">
                  {current.replacedChars} symbol(s) without a plain-text equivalent were transliterated
                  (✓ → v, → → -&gt;). Nothing was dropped.
                </p>
              )}
              {current.droppedChars > 0 && (
                <p className="text-xs text-ink/60">
                  {current.droppedChars} character(s) that the built-in PDF fonts cannot draw (emoji,
                  CJK) were left out.
                </p>
              )}

              <div>
                <span className="font-mono text-xs tracking-widest text-ink/70 block mb-2">
                  CONTENT READ FROM THE FILE
                </span>
                <pre className="bg-paper border border-ink/10 rounded-lg px-4 py-3 font-mono text-[11px] leading-relaxed text-ink/80 whitespace-pre-wrap max-h-64 overflow-auto">
                  {current.preview || "—"}
                </pre>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => downloadOne(current)}
                  className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  DOWNLOAD {safeName(current.name).toUpperCase().slice(0, 18)}.PDF
                </button>
                {results.filter((r) => r.bytes).length > 1 && (
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
        Everything runs in your browser — your documents never leave your device.
      </p>
    </div>
  );
}
