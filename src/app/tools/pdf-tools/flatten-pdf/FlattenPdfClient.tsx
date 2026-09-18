"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

export default function FlattenPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    setDone("");
    setInfo("");
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const fields = doc.getForm().getFields();
      setInfo(
        `${doc.getPageCount()} page(s) · ${fields.length} form field(s) detected`
      );
    } catch {
      setError("Could not read this PDF. If it is password-protected, unlock it first.");
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      trackToolUsed("flatten-pdf", "pdf-tools");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const form = doc.getForm();
      const n = form.getFields().length;
      form.flatten();
      const bytes = await doc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.pdf$/i, "") + "-flat.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
      setDone(`DONE — ${n} field(s) baked into the pages.`);
      trackDownload("flatten-pdf", "pdf-tools");
    } catch (e) {
      setError(
        e instanceof Error && /encrypt/i.test(e.message)
          ? "This PDF is encrypted. Unlock it first with our PDF Unlock tool."
          : e instanceof Error
            ? e.message
            : "Could not flatten this PDF."
      );
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

        {file && info && (
          <div className="mt-5 flex flex-col gap-4">
            <p className="font-mono text-xs text-ink/50">{info.toUpperCase()}</p>
            <button
              onClick={run}
              disabled={busy}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 self-start"
            >
              {busy ? "FLATTENING…" : "FLATTEN & DOWNLOAD"}
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
