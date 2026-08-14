"use client";

import { useState } from "react";
import { PDFDocument } from "@cantoo/pdf-lib";

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

/** Password-protected PDFs contain an /Encrypt dictionary — scan the raw bytes for it. */
function isEncryptedPdf(bytes: ArrayBuffer): boolean {
  const u8 = new Uint8Array(bytes);
  const marker = [0x2f, 0x45, 0x6e, 0x63, 0x72, 0x79, 0x70, 0x74]; // "/Encrypt"
  for (let i = 0; i <= u8.length - marker.length; i += 1) {
    let hit = true;
    for (let j = 0; j < marker.length; j += 1) {
      if (u8[i + j] !== marker[j]) {
        hit = false;
        break;
      }
    }
    if (hit) return true;
  }
  return false;
}

export default function PdfUnlockClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setPassword("");
    try {
      const bytes = await file.arrayBuffer();
      if (!isEncryptedPdf(bytes)) {
        setPdf({ file, pages: 0, size: file.size });
        setError(
          "This PDF is not password-protected — it opens without a password, so there is nothing to unlock."
        );
        return;
      }
      const doc = await PDFDocument.load(bytes);
      setPdf({ file, pages: doc.getPageCount(), size: file.size });
    } catch {
      setError("Can't read this file — it may be corrupted or not a valid PDF.");
    }
  };

  const unlock = async () => {
    if (!pdf || busy) return;
    if (!password) {
      setError("Type the password to unlock this PDF.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      let src: Awaited<ReturnType<typeof PDFDocument.load>>;
      try {
        src = await PDFDocument.load(bytes, { password });
      } catch {
        setError("Wrong password. Check for uppercase letters, numbers and spaces — passwords are case-sensitive.");
        setBusy(false);
        return;
      }
      // Copy pages into a brand-new document (no encryption) and save.
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((page) => out.addPage(page));
      const unlockedBytes = await out.save();

      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([unlockedBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-unlocked.pdf`
      );
      setResult(
        `Done — ${src.getPageCount()} page${src.getPageCount() === 1 ? "" : "s"} unlocked. The downloaded file opens without a password.`
      );
    } catch {
      setError("Unlocking failed. Please try again.");
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
          id="pdf-unlock-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-unlock-file"
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
          Choose a password-protected PDF, then type its password to unlock.
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
            <StatBlock label="PAGES" value={pdf.pages > 0 ? String(pdf.pages) : "—"} highlight />
            <StatBlock label="SIZE" value={formatBytes(pdf.size)} />
          </div>

          {pdf.pages > 0 && (
            <>
              <div>
                <label
                  htmlFor="pdf-unlock-password"
                  className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
                >
                  PASSWORD
                </label>
                <input
                  id="pdf-unlock-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="button"
                onClick={unlock}
                disabled={busy}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
              >
                {busy ? "UNLOCKING…" : "UNLOCK & DOWNLOAD"}
              </button>

              {result && (
                <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
                  {result}
                </div>
              )}

              <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
                <strong className="text-ink">Important:</strong> only unlock
                documents you own or have permission to modify. Removing
                protection from files you don't own may violate their terms
                or the law.
              </div>
            </>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Decryption runs entirely
        in your browser — the file and the password never leave your device.
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
