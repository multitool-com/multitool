"use client";

import { useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

type WmType = "text" | "image";
type Position = "center" | "diagonal" | "top" | "bottom";

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

const POSITIONS: { id: Position; label: string }[] = [
  { id: "center", label: "CENTER" },
  { id: "diagonal", label: "DIAGONAL" },
  { id: "top", label: "TOP" },
  { id: "bottom", label: "BOTTOM" },
];

export default function PdfWatermarkClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [wmType, setWmType] = useState<WmType>("text");
  const [text, setText] = useState("DRAFT");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>("diagonal");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(48);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const objectUrls = useRef<string[]>([]);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
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

  const uploadLogo = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const addWatermark = async () => {
    if (!pdf || busy) return;
    if (wmType === "text" && !text.trim()) {
      setError("Type the watermark text first.");
      return;
    }
    if (wmType === "image" && !imageDataUrl) {
      setError("Upload a logo image first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const alpha = opacity / 100;
      const color = rgb(0.6, 0.6, 0.65);

      let logo: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
      if (wmType === "image" && imageDataUrl) {
        const res = await fetch(imageDataUrl);
        const buf = new Uint8Array(await res.arrayBuffer());
        const sig = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
        logo =
          sig === "\u0089PNG"
            ? await doc.embedPng(buf)
            : await doc.embedJpg(buf);
      }

      const pages = doc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        if (wmType === "image" && logo) {
          const logoW = Math.min(width * 0.35, 240);
          const logoH = (logo.height / logo.width) * logoW;
          let x: number, y: number, rot: number;
          if (position === "center") {
            x = (width - logoW) / 2;
            y = (height - logoH) / 2;
            rot = 0;
          } else if (position === "top") {
            x = (width - logoW) / 2;
            y = height - logoH - 40;
            rot = 0;
          } else if (position === "bottom") {
            x = (width - logoW) / 2;
            y = 40;
            rot = 0;
          } else {
            // diagonal: center + rotate -30°
            x = (width - logoW) / 2;
            y = (height - logoH) / 2;
            rot = -30;
          }
          page.drawImage(logo, {
            x,
            y,
            width: logoW,
            height: logoH,
            opacity: alpha,
            rotate: degrees(rot),
          });
        } else {
          const label = text || "WATERMARK";
          const textW = font.widthOfTextAtSize(label, fontSize);
          let x: number, y: number, rot: number;
          if (position === "center") {
            x = (width - textW) / 2;
            y = height / 2;
            rot = 0;
          } else if (position === "top") {
            x = (width - textW) / 2;
            y = height - 90;
            rot = 0;
          } else if (position === "bottom") {
            x = (width - textW) / 2;
            y = 60;
            rot = 0;
          } else {
            x = width / 2 - textW / 2;
            y = height / 2;
            rot = -30;
          }
          page.drawText(label, {
            x,
            y,
            size: fontSize,
            font,
            color,
            opacity: alpha,
            rotate: degrees(rot),
          });
        }
      }

      const outBytes = await doc.save();
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-watermarked.pdf`
      );
      setResult(
        `Done — ${pdf.pages} page${pdf.pages === 1 ? "" : "s"} watermarked. Check your downloads.`
      );
    } catch {
      setError("Watermarking failed. Please try again.");
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
          id="pdf-wm-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-wm-file"
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
          Choose a PDF, then set your watermark (text or logo).
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

          {/* Type */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              WATERMARK TYPE
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setWmType("text")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  wmType === "text"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                TEXT
              </button>
              <button
                type="button"
                onClick={() => setWmType("image")}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                  wmType === "image"
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                LOGO IMAGE
              </button>
            </div>
          </div>

          {wmType === "text" ? (
            <div>
              <label
                htmlFor="pdf-wm-text"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                WATERMARK TEXT
              </label>
              <input
                id="pdf-wm-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="DRAFT / CONFIDENTIAL / your name"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          ) : (
            <div>
              <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                LOGO (PNG WITH TRANSPARENCY WORKS BEST)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  uploadLogo(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
                className="w-full font-mono text-xs file:mr-3 file:font-mono file:text-xs file:tracking-widest file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-deep file:text-paper"
              />
              {imageDataUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest text-accent">
                    LOGO READY
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageDataUrl}
                    alt="Logo preview"
                    className="h-10 bg-white border border-ink/10 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {/* Position */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              POSITION
            </span>
            <div className="flex gap-2 flex-wrap">
              {POSITIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosition(p.id)}
                  className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                    position === p.id
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label
              htmlFor="pdf-wm-opacity"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              OPACITY — {opacity}%
            </label>
            <input
              id="pdf-wm-opacity"
              type="range"
              min={10}
              max={100}
              step={5}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          {/* Font size (text only) */}
          {wmType === "text" && (
            <div>
              <label
                htmlFor="pdf-wm-size"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                TEXT SIZE — {fontSize}pt
              </label>
              <input
                id="pdf-wm-size"
                type="range"
                min={16}
                max={96}
                step={2}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          )}

          <button
            type="button"
            onClick={addWatermark}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "WATERMARKING…" : "ADD WATERMARK & DOWNLOAD"}
          </button>

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> The watermark is drawn
        over a copy — the original content stays intact and selectable.
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
