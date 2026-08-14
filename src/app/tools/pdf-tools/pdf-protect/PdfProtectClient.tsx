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

export default function PdfProtectClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [restrictPrint, setRestrictPrint] = useState(false);
  const [restrictCopy, setRestrictCopy] = useState(false);
  const [restrictEdit, setRestrictEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setPassword("");
    setConfirm("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPdf({ file, pages: doc.getPageCount(), size: file.size });
    } catch {
      setError(
        "Can't read this file — it may already be password-protected or corrupted."
      );
    }
  };

  const protect = async () => {
    if (!pdf || busy) return;
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match. Type the same password twice.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: restrictPrint ? false : "highResolution",
          copying: !restrictCopy,
          modifying: !restrictEdit,
        },
      });
      const protectedBytes = await doc.save();

      // Self-check: reload the output with the password to confirm it works.
      const check = await PDFDocument.load(protectedBytes, {
        password,
      });
      if (check.getPageCount() !== pdf.pages) {
        throw new Error("Verification failed");
      }

      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([protectedBytes as unknown as BlobPart], {
          type: "application/pdf",
        }),
        `${baseName}-protected.pdf`
      );
      setResult(
        `Done — your PDF is now protected and verified. Open the downloaded file and type the password to confirm.`
      );
    } catch {
      setError(
        "Protection failed. The file may be already encrypted or corrupted."
      );
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
          id="pdf-protect-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-protect-file"
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
          Choose a PDF, then set the password you want to protect it with.
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

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="pdf-protect-password"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PASSWORD (MIN 4 CHARACTERS)
              </label>
              <input
                id="pdf-protect-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="pdf-protect-confirm"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="pdf-protect-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          {confirm && password !== confirm && (
            <p className="font-mono text-[10px] text-accent -mt-2">
              Passwords do not match yet.
            </p>
          )}

          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              RESTRICTIONS (OPTIONAL)
            </span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  checked={restrictPrint}
                  onChange={(e) => setRestrictPrint(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm">Prevent printing</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  checked={restrictCopy}
                  onChange={(e) => setRestrictCopy(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm">Prevent copying text</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  checked={restrictEdit}
                  onChange={(e) => setRestrictEdit(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm">Prevent editing</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={protect}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "PROTECTING…" : "PROTECT & DOWNLOAD"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}

          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            <strong className="text-ink">Important:</strong> there is no way
            to recover a forgotten password — not even we can. Save it in a
            password manager before downloading.
          </div>
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Standard AES-256 PDF
        encryption, applied in your browser — the file and the password
        never leave your device.
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
