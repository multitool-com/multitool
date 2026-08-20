"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Mode = "remove" | "keep";

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
      for (let p = a; p <= b; p++) pages.push(p);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n < 1 || n > maxPage) {
        return { pages: [], error: `Page ${n} doesn't exist — this PDF has ${maxPage} pages.` };
      }
      pages.push(n);
    } else {
      return { pages: [], error: `"${part}" is not a valid page or range.` };
    }
  }
  return { pages: [...new Set(pages)].sort((a, b) => a - b), error: null };
}

async function hasEncrypt(bytes: ArrayBuffer): Promise<boolean> {
  const head = new Uint8Array(bytes.slice(0, 2048));
  const text = new TextDecoder("latin1").decode(head);
  return text.includes("/Encrypt");
}

export default function PdfRemovePagesClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("remove");
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    setDone("");
    setRanges("");
    try {
      const buf = await f.arrayBuffer();
      if (await hasEncrypt(buf)) {
        setError("This PDF is password-protected. Unlock it first with our PDF Unlock tool.");
        setPageCount(0);
        return;
      }
      const doc = await PDFDocument.load(buf, { ignoreEncryption: false });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read this PDF. Make sure it is a valid, non-corrupted file.");
      setPageCount(0);
    }
  };

  const run = async () => {
    if (!file || pageCount === 0) return;
    const { pages, error: perr } = parseRanges(ranges, pageCount);
    if (perr) {
      setError(perr);
      return;
    }
    const selected = new Set(pages);
    const keepIdx: number[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const keep = mode === "remove" ? !selected.has(i) : selected.has(i);
      if (keep) keepIdx.push(i - 1);
    }
    if (keepIdx.length === 0) {
      setError(
        mode === "remove"
          ? "You can't remove every page — a PDF needs at least one."
          : "No pages selected to keep — type at least one page."
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      trackToolUsed("pdf-remove-pages", "pdf-tools");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keepIdx);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.pdf$/i, "") + `-${mode}d-pages.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
      setDone(
        `${keepIdx.length} page(s) in the new PDF (${pageCount - keepIdx.length} ${
          mode === "remove" ? "removed" : "dropped"
        }).`
      );
      trackDownload("pdf-remove-pages", "pdf-tools");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {file ? file.name.toUpperCase() : "SELECT PDF FILE"}
        </button>

        {file && pageCount > 0 && (
          <div className="mt-5 flex flex-col gap-4">
            <p className="font-mono text-xs text-ink/50">
              {pageCount} PAGES · TYPE PAGES LIKE <code>1,3,5-8</code>
            </p>

            <div className="flex gap-1">
              {(
                [
                  { id: "remove", label: "REMOVE THESE PAGES" },
                  { id: "keep", label: "KEEP ONLY THESE PAGES" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`font-mono text-xs tracking-widest rounded-full px-5 py-1.5 transition-colors ${
                    mode === m.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="e.g. 1,3,5-8"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <button
              onClick={run}
              disabled={busy}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 self-start"
            >
              {busy ? "PROCESSING…" : mode === "remove" ? "REMOVE & DOWNLOAD" : "KEEP & DOWNLOAD"}
            </button>
          </div>
        )}

        {done && (
          <div className="mt-4 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            DONE — {done}
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Your PDF is processed locally — it never leaves your device.
      </p>
    </div>
  );
}
