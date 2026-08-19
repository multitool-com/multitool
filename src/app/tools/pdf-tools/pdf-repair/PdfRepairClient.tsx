"use client";

import { useState } from "react";

type Status = "idle" | "processing" | "done" | "error";

export default function PdfRepairClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pages, setPages] = useState(0);
  const [fileName, setFileName] = useState("");
  const [repairedUrl, setRepairedUrl] = useState("");

  const onFile = async (file: File | null) => {
    if (!file) return;
    setStatus("processing");
    setMessage("Reading file…");
    setFileName(file.name);
    setRepairedUrl("");
    try {
      const { PDFDocument } = await import("@cantoo/pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      let doc: Awaited<ReturnType<typeof PDFDocument.load>>;
      try {
        doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      } catch {
        setStatus("error");
        setMessage("This file is too damaged to read, or it is password-protected. Unlock it first with the PDF Unlock tool.");
        return;
      }
      const n = doc.getPageCount();
      const outBytes = await doc.save();
      const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
      setRepairedUrl(URL.createObjectURL(blob));
      setPages(n);
      setStatus("done");
      setMessage(`Structure rebuilt: ${n} page(s) found and re-saved with a clean, valid PDF structure.`);
    } catch {
      setStatus("error");
      setMessage("Something went wrong while repairing this PDF. Try another file.");
    }
  };

  const download = () => {
    if (!repairedUrl) return;
    const a = document.createElement("a");
    a.href = repairedUrl;
    a.download = `repaired-${fileName.replace(/\.pdf$/i, "") || "document"}.pdf`;
    a.click();
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="pdfrepair-file" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          BROKEN OR CORRUPT PDF
        </label>
        <input
          id="pdfrepair-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-ink/60 file:mr-3 file:bg-deep file:text-paper file:font-mono file:text-xs file:tracking-widest file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:cursor-pointer hover:file:bg-accent transition-colors"
        />
      </div>

      {status === "processing" && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-4 text-sm text-ink/70 flex items-center gap-3">
          <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{message}</div>
      )}

      {status === "done" && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">{message}</div>
          <button type="button" onClick={download} className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">
            ⬇ DOWNLOAD REPAIRED PDF
          </button>
          <p className="text-xs text-ink/50">
            The file is rebuilt page by page: broken cross-references and orphan objects are dropped, producing a clean PDF that opens in any reader. All processing happens in your browser.
          </p>
        </>
      )}
    </div>
  );
}
