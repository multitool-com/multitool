"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Ratio = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "9:16";

const RATIOS: Record<Exclude<Ratio, "free">, number> = { "1:1": 1, "4:3": 4 / 3, "3:2": 3 / 2, "16:9": 16 / 9, "9:16": 9 / 16 };

export default function ImageCropperClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  imgRef.current = img;

  const VIEW = 360;

  const onFile = (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        setImg(im);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setDone(false);
      };
      im.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setDone(false);
  }, [ratio, zoom, pan]);

  const vw = VIEW;
  const vh = ratio === "free" ? VIEW : Math.round(VIEW / RATIOS[ratio as Exclude<Ratio, "free">]);

  // clamp pan so the image never leaves the crop box completely
  const clampPan = (x: number, y: number) => {
    if (!img) return { x, y };
    const base = Math.min(VIEW / img.width, VIEW / img.height);
    const scale = base * zoom;
    const dispW = img.width * scale;
    const dispH = img.height * scale;
    const maxX = Math.max(0, (dispW - vw) / 2);
    const maxY = Math.max(0, (dispH - vh) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan(clampPan(dragStart.current.px + dx, dragStart.current.py + dy));
  };
  const onPointerUp = () => setDragging(false);

  const crop = () => {
    if (!img || !canvasRef.current) return;
    const c = canvasRef.current;
    c.width = vw;
    c.height = vh;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const base = Math.min(VIEW / img.width, VIEW / img.height);
    const scale = base * zoom;
    const dispW = img.width * scale;
    const dispH = img.height * scale;
    const ox = (vw - dispW) / 2 + pan.x;
    const oy = (vh - dispH) / 2 + pan.y;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(img, ox, oy, dispW, dispH);
    setDone(true);
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = `cropped-${fileName.replace(/\.[^.]+$/, "") || "image"}.png`;
    a.click();
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">UPLOAD IMAGE</label>
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-ink/60 file:mr-3 file:bg-deep file:text-paper file:font-mono file:text-xs file:tracking-widest file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:cursor-pointer hover:file:bg-accent transition-colors" />
      </div>

      {img && (
        <>
          <div className="flex gap-2 flex-wrap justify-center">
            {(["free", "1:1", "4:3", "3:2", "16:9", "9:16"] as Ratio[]).map((r) => (
              <button key={r} type="button" onClick={() => setRatio(r)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${ratio === r ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{r.toUpperCase()}</button>
            ))}
          </div>

          <div>
            <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ZOOM: {zoom.toFixed(1)}×</label>
            <input type="range" min="0.5" max="4" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-accent" />
          </div>

          <div
            ref={viewportRef}
            className="relative mx-auto overflow-hidden border-2 border-accent rounded-xl touch-none select-none bg-paper"
            style={{ width: vw, height: vh, cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {(() => {
              const base = Math.min(VIEW / img.width, VIEW / img.height);
              const scale = base * zoom;
              const dispW = img.width * scale;
              const dispH = img.height * scale;
              const ox = (vw - dispW) / 2 + pan.x;
              const oy = (vh - dispH) / 2 + pan.y;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt="" draggable={false} className="absolute max-w-none pointer-events-none" style={{ width: dispW, height: dispH, left: ox, top: oy }} />
              );
            })()}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border-white/40 border-[0.5px]" />
              ))}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white bg-deep/70 rounded-full px-3 py-1 pointer-events-none">
              DRAG TO POSITION
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button type="button" onClick={crop} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">✂ CROP</button>
            {done && (
              <button type="button" onClick={download} className="bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">⬇ DOWNLOAD PNG</button>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
      <p className="text-xs text-ink/50">Everything runs locally — images are never uploaded.</p>
    </div>
  );
}
