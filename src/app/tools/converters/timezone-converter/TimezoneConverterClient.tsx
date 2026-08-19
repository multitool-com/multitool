"use client";

import { useEffect, useState } from "react";

export const ZONES: { tz: string; label: string }[] = [
  { tz: "UTC", label: "UTC" },
  { tz: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { tz: "America/Denver", label: "Denver (MT)" },
  { tz: "America/Chicago", label: "Chicago (CT)" },
  { tz: "America/New_York", label: "New York (ET)" },
  { tz: "America/Sao_Paulo", label: "São Paulo" },
  { tz: "Europe/London", label: "London" },
  { tz: "Europe/Lisbon", label: "Lisbon" },
  { tz: "Europe/Paris", label: "Paris / Berlin" },
  { tz: "Europe/Moscow", label: "Moscow" },
  { tz: "Asia/Dubai", label: "Dubai" },
  { tz: "Asia/Kolkata", label: "Mumbai (IST)" },
  { tz: "Asia/Shanghai", label: "Beijing" },
  { tz: "Asia/Tokyo", label: "Tokyo" },
  { tz: "Asia/Seoul", label: "Seoul" },
  { tz: "Australia/Sydney", label: "Sydney" },
  { tz: "Pacific/Auckland", label: "Auckland" },
];

export function formatInZone(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(new Date(iso));
}

export function zoneOffsetMinutes(iso: string, tz: string): number {
  // offset via diff between the zone-formatted parts and UTC parts
  const d = new Date(iso);
  const utcMs = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const localMs = Date.UTC(+get("year"), +get("month") - 1, +get("day"), +get("hour"), +get("minute"));
  return Math.round((localMs - utcMs) / 60000);
}

export default function TimezoneConverterClient() {
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const [datetime, setDatetime] = useState(iso);
  const [from, setFrom] = useState("UTC");
  const [to, setTo] = useState("America/Sao_Paulo");

  useEffect(() => {
    const t = setInterval(() => {
      setDatetime((d) => {
        const n = new Date();
        const v = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}T${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
        return d === v ? d : v;
      });
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // interpreta o datetime como hora local do fuso "from"
  const utcDate = from === "UTC" ? new Date(datetime + ":00Z") : new Date(datetime);
  const asUtc = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
  const utcMs = asUtc(utcDate) - (from === "UTC" ? 0 : zoneOffsetMinutes(datetime, from) * 60000);
  const targetIso = new Date(utcMs).toISOString();

  const fromOffset = from === "UTC" ? 0 : zoneOffsetMinutes(datetime, from);
  const toOffset = zoneOffsetMinutes(targetIso, to);

  const selectCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="tz-dt" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">DATE & TIME</label>
        <input id="tz-dt" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">FROM</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectCls}>
            {ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}
          </select>
        </div>
        <div className="text-center pb-2">
          <button type="button" onClick={() => { setFrom(to); setTo(from); }} className="font-mono text-xl text-ink/40 hover:text-accent transition-colors" title="Swap">⇄</button>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TO</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={selectCls}>
            {ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-paper border border-ink/10 rounded-xl px-4 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">{from} (UTC{fromOffset >= 0 ? "+" : ""}{fromOffset / 60})</span>
          <span className="font-display text-lg font-bold text-deep">{formatInZone(targetIso, from)}</span>
        </div>
        <div className="bg-deep rounded-xl px-4 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">{to} (UTC{toOffset >= 0 ? "+" : ""}{toOffset / 60})</span>
          <span className="font-display text-lg font-bold text-accent">{formatInZone(targetIso, to)}</span>
        </div>
      </div>
      <p className="text-xs text-ink/50">DST-aware: offsets update automatically for zones with daylight saving (e.g. New York, London).</p>
    </div>
  );
}
