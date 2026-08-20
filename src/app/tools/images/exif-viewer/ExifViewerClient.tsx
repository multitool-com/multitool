"use client";

import { useRef, useState } from "react";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

type Tags = Record<string, unknown>;

interface Group {
  title: string;
  tags: Tags;
}

const FRIENDLY: Record<string, string> = {
  Make: "Camera brand",
  Model: "Camera model",
  LensModel: "Lens",
  DateTimeOriginal: "Date taken",
  CreateDate: "Created",
  ModifyDate: "Modified",
  ExposureTime: "Exposure time",
  FNumber: "Aperture",
  ISO: "ISO",
  FocalLength: "Focal length",
  Orientation: "Orientation",
  Software: "Software",
  ImageWidth: "Width",
  ImageHeight: "Height",
  latitude: "GPS latitude",
  longitude: "GPS longitude",
  GPSAltitude: "GPS altitude",
};

function fmtValue(k: string, v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  if (Array.isArray(v)) return v.map((x) => fmtValue(k, x)).join(", ");
  return String(v);
}

function groupTags(tags: Tags): Group[] {
  const groups: Group[] = [];
  const gpsKeys = ["latitude", "longitude", "GPSAltitude", "GPSLatitude", "GPSLongitude"];
  const camKeys = ["Make", "Model", "LensModel", "LensMake", "Software", "BodySerialNumber"];
  const photoKeys = [
    "DateTimeOriginal", "CreateDate", "ModifyDate", "ExposureTime", "FNumber",
    "ISO", "FocalLength", "Orientation", "ImageWidth", "ImageHeight", "ColorSpace", "Flash",
  ];
  const pick = (keys: string[]): Tags => {
    const out: Tags = {};
    for (const k of keys) if (tags[k] !== undefined) out[k] = tags[k];
    return out;
  };
  const camera = pick(camKeys);
  const photo = pick(photoKeys);
  const gps = pick(gpsKeys);
  const used = new Set([...Object.keys(camera), ...Object.keys(photo), ...Object.keys(gps)]);
  const other: Tags = {};
  for (const [k, v] of Object.entries(tags)) {
    if (!used.has(k) && typeof v !== "object") other[k] = v;
  }
  if (Object.keys(camera).length) groups.push({ title: "Camera", tags: camera });
  if (Object.keys(photo).length) groups.push({ title: "Photo", tags: photo });
  if (Object.keys(gps).length) groups.push({ title: "GPS location", tags: gps });
  if (Object.keys(other).length) groups.push({ title: "Other", tags: other });
  return groups;
}

export default function ExifViewerClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [none, setNone] = useState(false);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState(0.95);
  const [busy, setBusy] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setGroups(null);
    setNone(false);
    setError("");
    setCleaned(false);
    try {
      const { parse } = await import("exifr");
      const tags = (await parse(f, {
        tiff: true,
        exif: true,
        gps: true,
        translateValues: true,
      })) as Tags | undefined;
      if (!tags || Object.keys(tags).length === 0) {
        setNone(true);
      } else {
        const g = groupTags(tags);
        setGroups(g.length ? g : null);
        if (g.length === 0) setNone(true);
        trackToolUsed("exif-viewer", "images");
      }
    } catch {
      setError("Could not read metadata from this file. JPG, HEIC and TIFF photos are supported.");
    }
  };

  const clean = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not available.");
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/jpeg", quality)
      );
      if (!blob) throw new Error("Could not create the clean copy.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.[^.]+$/i, "") + "-clean.jpg";
      a.click();
      URL.revokeObjectURL(a.href);
      setCleaned(true);
      trackDownload("exif-viewer", "images");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this image.");
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
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ink/15 hover:border-accent rounded-lg py-8 font-mono text-xs tracking-widest text-ink/50 hover:text-accent transition-colors"
        >
          {file ? file.name.toUpperCase() : "SELECT A PHOTO (JPG · HEIC · TIFF)"}
        </button>

        {none && (
          <div className="mt-4 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            NO EXIF METADATA FOUND — this file is already clean.
          </div>
        )}

        {groups && groups.length > 0 && (
          <div className="mt-5 flex flex-col gap-4">
            {groups.map((g) => (
              <div key={g.title}>
                <h3 className="font-display font-semibold text-sm mb-2">
                  {g.title}
                  {g.title === "GPS location" && (
                    <span className="ml-2 font-mono text-[10px] bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                      LOCATION EXPOSED
                    </span>
                  )}
                </h3>
                <div className="border border-ink/10 rounded-lg overflow-hidden">
                  {Object.entries(g.tags).map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex justify-between gap-3 px-3 py-2 text-xs font-mono ${i % 2 ? "bg-paper/60" : "bg-white"}`}
                    >
                      <span className="text-ink/50">{FRIENDLY[k] ?? k}</span>
                      <span className="text-right break-all">{fmtValue(k, v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-4">
              <label className="flex items-center gap-2 text-xs font-mono text-ink/60">
                QUALITY {Math.round(quality * 100)}%
                <input
                  type="range"
                  min={0.7}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <button
                onClick={clean}
                disabled={busy}
                className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "CREATING…" : "DOWNLOAD CLEAN COPY"}
              </button>
            </div>
            {cleaned && (
              <div className="bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
                CLEAN JPG DOWNLOADED — zero metadata inside.
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Metadata is read locally in your browser — the photo never leaves your device.
      </p>
    </div>
  );
}
