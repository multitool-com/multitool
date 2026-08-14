"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

interface PdfInfo {
  file: File;
  pages: number;
  size: number;
}

interface PlacedSignature {
  id: number;
  page: number; // 0-based
  x: number; // normalized 0..1 (from left)
  y: number; // normalized 0..1 (from bottom)
  w: number; // normalized width
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

export default function PdfSignClient() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [color, setColor] = useState("#1a1a2e");
  const [penWidth, setPenWidth] = useState(3);
  const [signaturePng, setSignaturePng] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedSignature[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const idRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Page preview rendered client-side (pdf-lib has no renderer; draw a placeholder
  // with the signature positions overlaid). We generate the preview via a hidden
  // canvas only when a PDF is loaded — showing page count and placement spots.
  useEffect(() => {
    if (!pdf) {
      setPreviewUrl(null);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, 600, 800);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(30, 30, 540, 740);
    ctx.strokeStyle = "#cbd5e1";
    ctx.strokeRect(30, 30, 540, 740);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px monospace";
    ctx.fillText(
      `PAGE ${currentPage + 1} OF ${pdf.pages} — PREVIEW`,
      70,
      70
    );
    // signature placements
    placed
      .filter((p) => p.page === currentPage)
      .forEach((p) => {
        const x = 30 + p.x * 540;
        const y = 30 + (1 - p.y) * 740;
        const w = p.w * 540;
        ctx.strokeStyle = "#f97316";
        ctx.strokeRect(x, y, w, w * 0.4);
        ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
        ctx.fillRect(x, y, w, w * 0.4);
      });
    setPreviewUrl(canvas.toDataURL());
  }, [pdf, currentPage, placed]);

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setPlaced([]);
    setCurrentPage(0);
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

  // --- signature drawing ---
  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = getPos(e);
  };

  const moveDraw = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pos = getPos(e);
    if (!pos || !last.current) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last.current = pos;
  };

  const endDraw = () => {
    drawing.current = false;
    last.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignaturePng(null);
  };

  const captureSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // trim to content bounds
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = img.data;
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let hasInk = false;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const i = (y * canvas.width + x) * 4;
        // alpha > 0 means ink (canvas is transparent before drawing)
        if (data[i + 3] > 20) {
          hasInk = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!hasInk) {
      setError("Draw a signature first — the box is empty.");
      return;
    }
    const pad = 8;
    const w = maxX - minX + pad * 2;
    const h = maxY - minY + pad * 2;
    const crop = document.createElement("canvas");
    crop.width = w;
    crop.height = h;
    const cctx = crop.getContext("2d");
    if (!cctx) return;
    cctx.drawImage(
      canvas,
      minX - pad,
      minY - pad,
      w,
      h,
      0,
      0,
      w,
      h
    );
    const png = crop.toDataURL("image/png");
    setSignaturePng(png);
    setError(null);
    setResult("Signature ready — choose a page and click where to place it.");
  };

  const uploadSignature = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setSignaturePng(dataUrl);
      // also draw onto the canvas for editing
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(300 / img.width, 120 / img.height, 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
      };
      img.src = dataUrl;
      setResult("Signature image loaded.");
    };
    reader.readAsDataURL(file);
  };

  // --- placement ---
  const placeSignature = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!signaturePng || !pdf) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    setPlaced((prev) => [
      ...prev,
      { id: idRef.current++, page: currentPage, x, y, w: 0.22 },
    ]);
    setResult("Signature placed — drag or download below.");
  };

  const removePlacement = (id: number) => {
    setPlaced((prev) => prev.filter((p) => p.id !== id));
  };

  const signPdf = async () => {
    if (!pdf || busy) return;
    if (placed.length === 0) {
      setError("Place at least one signature on a page before downloading.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await pdf.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pngBytes = await (async () => {
        const res = await fetch(signaturePng!);
        return new Uint8Array(await res.arrayBuffer());
      })();
      const pngImage = await doc.embedPng(pngBytes);
      for (const p of placed) {
        const page = doc.getPage(p.page);
        const { width, height } = page.getSize();
        const sigW = p.w * width;
        const sigH = (pngImage.height / pngImage.width) * sigW;
        page.drawImage(pngImage, {
          x: p.x * width,
          y: p.y * height - sigH / 2,
          width: sigW,
          height: sigH,
        });
      }
      const signedBytes = await doc.save();
      const baseName = pdf.file.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(
        new Blob([signedBytes as unknown as BlobPart], { type: "application/pdf" }),
        `${baseName}-signed.pdf`
      );
      setResult(`Done — ${placed.length} signature${placed.length === 1 ? "" : "s"} placed. Check your downloads.`);
    } catch {
      setError("Signing failed. Please try again.");
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
          id="pdf-sign-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            loadFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="pdf-sign-file"
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
          Choose a PDF, draw your signature, then place it on the page.
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

          {/* Signature drawing */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              DRAW YOUR SIGNATURE
            </span>
            <div className="flex flex-wrap gap-3">
              <div>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={120}
                  onPointerDown={startDraw}
                  onPointerMove={moveDraw}
                  onPointerUp={endDraw}
                  onPointerLeave={endDraw}
                  className="border-2 border-dashed border-ink/20 rounded-lg bg-white touch-none"
                  style={{ width: 300, height: 120 }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={captureSignature}
                    className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-deep text-paper hover:bg-accent transition-colors"
                  >
                    USE SIGNATURE
                  </button>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
                  >
                    CLEAR
                  </button>
                  <label className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent cursor-pointer transition-colors">
                    UPLOAD IMAGE
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        uploadSignature(e.target.files?.[0] ?? null);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label
                    htmlFor="sig-color"
                    className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1"
                  >
                    COLOR
                  </label>
                  <input
                    id="sig-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-8 rounded border border-ink/15 cursor-pointer"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sig-width"
                    className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1"
                  >
                    THICKNESS — {penWidth}px
                  </label>
                  <input
                    id="sig-width"
                    type="range"
                    min={1}
                    max={8}
                    value={penWidth}
                    onChange={(e) => setPenWidth(Number(e.target.value))}
                    className="w-32 accent-accent"
                  />
                </div>
              </div>
            </div>
            {signaturePng && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-widest text-accent">
                  SIGNATURE READY
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signaturePng}
                  alt="Signature preview"
                  className="h-10 bg-white border border-ink/10 rounded"
                />
              </div>
            )}
          </div>

          {/* Page picker */}
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              PAGE
            </span>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: pdf.pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={`font-mono text-xs px-3 py-2 rounded-full transition-colors ${
                    currentPage === i
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Placement area */}
          {signaturePng && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                CLICK ON THE PAGE TO PLACE THE SIGNATURE
              </span>
              {previewUrl && (
                <div
                  onClick={placeSignature}
                  className="relative border border-ink/10 rounded-lg overflow-hidden cursor-crosshair bg-paper"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Page preview" className="w-full" />
                  {placed
                    .filter((p) => p.page === currentPage)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="absolute bg-accent/20 border-2 border-accent rounded flex items-center justify-center"
                        style={{
                          left: `${p.x * 100}%`,
                          top: `${(1 - p.y) * 100}%`,
                          width: `${p.w * 100}%`,
                          height: `${p.w * 0.4 * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlacement(p.id);
                          }}
                          className="font-mono text-[9px] bg-deep text-paper rounded-full w-4 h-4 leading-none"
                          aria-label="Remove signature"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              )}
              <p className="font-mono text-[10px] text-ink/40">
                Signature count on this page:{" "}
                {placed.filter((p) => p.page === currentPage).length}
              </p>
            </div>
          )}

          {result && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent">
              {result}
            </div>
          )}

          <button
            type="button"
            onClick={signPdf}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
          >
            {busy ? "SIGNING…" : "DOWNLOAD SIGNED PDF"}
          </button>
        </>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> This is a visual
        signature — not a qualified electronic signature with a certificate.
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
