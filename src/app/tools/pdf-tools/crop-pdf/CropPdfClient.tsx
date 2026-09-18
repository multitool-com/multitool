"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

export default function CropPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [margins, setMargins] = useState({ top: 8, right: 8, bottom: 8, left: 8 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    setDone("");
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), {
        ignoreEncryption: true,
      });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read this PDF. If it is password-protected, unlock it first.");
      setPageCount(0);
    }
  };

  const run = async () => {
    if (!file || pageCount === 0) return;
    setBusy(true);
    setError("");
    try {
      trackToolUsed("crop-pdf", "pdf-tools");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const l = (width * margins.left) / 100;
        const r = (width * margins.right) / 100;
        const t = (height * margins.top) / 100;
        const b = (height * margins.bottom) / 100;
        const w = width - l - r;
        const h = height - t - b;
        if (w > 10 && h > 10) {
          page.setCropBox(l, b, w, h);
        }
        out.addPage(page);
      });
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.pdf$/i, "") + "-cropped.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
      setDone(`DONE — ${pageCount} page(s) cropped.`);
      trackDownload("crop-pdf", "pdf-tools");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not crop this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const field = (label: string, key: keyof typeof margins) => (
    <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
      {label} {margins[key]}%
      <input
        type="range"
        min={0}
        max={30}
        step={1}
        value={margins[key]}
        onChange={(e) => setMargins((m) => ({ ...m, [key]: Number(e.target.value) }))}
        className="accent-accent"
      />
    </label>
  );

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
              {pageCount} PAGES · MARGINS ARE % OF PAGE SIZE
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {field("TOP", "top")}
              {field("RIGHT", "right")}
              {field("BOTTOM", "bottom")}
              {field("LEFT", "left")}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "NONE", v: { top: 0, right: 0, bottom: 0, left: 0 } },
                { label: "LIGHT 5%", v: { top: 5, right: 5, bottom: 5, left: 5 } },
                { label: "STANDARD 10%", v: { top: 10, right: 10, bottom: 10, left: 10 } },
                { label: "AGGRESSIVE 15%", v: { top: 15, right: 15, bottom: 15, left: 15 } },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setMargins(p.v)}
                  className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs rounded-full px-4 py-1.5 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={run}
              disabled={busy}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 self-start"
            >
              {busy ? "CROPPING…" : "CROP & DOWNLOAD"}
            </button>
          </div>
        )}

        {done && (
          <div className="mt-4 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            {done}
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
