"use client";

import { useEffect, useState } from "react";

export function epochToDate(epoch: number, local: boolean): string | null {
  if (!Number.isFinite(epoch)) return null;
  const d = new Date(epoch * (String(epoch).length <= 10 ? 1000 : 1));
  if (isNaN(d.getTime())) return null;
  return local
    ? d.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    : d.toUTCString();
}

export function dateToEpoch(iso: string): number | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return Math.floor(d.getTime() / 1000);
}

export default function UnixTimestampClient() {
  const [nowEpoch, setNowEpoch] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const t = setInterval(() => setNowEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const [epochInput, setEpochInput] = useState("");
  const [local, setLocal] = useState(true);
  const [isoInput, setIsoInput] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  const ep = parseInt(epochInput, 10);
  const epochDate = epochInput !== "" && Number.isFinite(ep) ? epochToDate(ep, local) : null;
  const isoEpoch = isoInput ? dateToEpoch(isoInput) : null;

  const copy = async (v: string) => {
    try { await navigator.clipboard.writeText(v); } catch { /* noop */ }
  };

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="bg-deep rounded-xl px-6 py-5 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">CURRENT UNIX TIMESTAMP</span>
          <span className="font-mono text-2xl font-bold text-accent tabular-nums">{nowEpoch}</span>
        </div>
        <button type="button" onClick={() => copy(String(nowEpoch))} className="bg-accent text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">COPY</button>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TIMESTAMP → DATE</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={epochInput} onChange={(e) => setEpochInput(e.target.value)} placeholder="1754000000" className={inputCls + " flex-1"} />
          <button type="button" onClick={() => setLocal((l) => !l)} className={`font-mono text-xs tracking-widest px-4 py-2.5 rounded-lg transition-colors ${local ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15"}`}>{local ? "LOCAL TIME" : "UTC"}</button>
        </div>
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 mt-2 font-mono text-sm text-ink/80">
          {epochDate ?? "Enter a valid timestamp (seconds or milliseconds)"}
        </div>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">DATE → TIMESTAMP</label>
        <input type="datetime-local" value={isoInput} onChange={(e) => setIsoInput(e.target.value)} className={inputCls} />
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 mt-2 font-mono text-sm text-ink/80">
          {isoEpoch !== null ? `${isoEpoch} (${isoEpoch * 1000} ms)` : "—"}
        </div>
      </div>
    </div>
  );
}
