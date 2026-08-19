"use client";

import { useState } from "react";

export function workDaysBetween(a: Date, b: Date, holidays: string[] = []): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const dir = end >= start ? 1 : -1;
  let count = 0;
  const cur = new Date(start);
  while (dir === 1 ? cur <= end : cur >= end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) {
      const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
      if (!holidays.includes(iso)) count++;
    }
    cur.setDate(cur.getDate() + dir);
  }
  return count;
}

export default function WorkDaysCalculatorClient() {
  const now = new Date();
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const [d1, setD1] = useState(iso(now));
  const [d2, setD2] = useState(iso(new Date(now.getTime() + 21 * 24 * 3600 * 1000)));
  const [holidays, setHolidays] = useState("");
  const [includeEnds, setIncludeEnds] = useState(true);

  const a = new Date(d1 + "T00:00:00"), b = new Date(d2 + "T00:00:00");
  const hols = holidays.split(",").map((s) => s.trim()).filter(Boolean);
  const valid = !isNaN(a.getTime()) && !isNaN(b.getTime());
  const wd = valid ? workDaysBetween(a, b, hols) : null;
  const total = valid ? Math.abs(daysRaw(a, b)) : null;

  function daysRaw(x: Date, y: Date) {
    return Math.round((new Date(y.getFullYear(), y.getMonth(), y.getDate()).getTime() - new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()) / 86400000);
  }

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">START</label>
          <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">END</label>
          <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HOLIDAYS (optional, YYYY-MM-DD, comma separated)</label>
        <input type="text" value={holidays} onChange={(e) => setHolidays(e.target.value)} placeholder="2026-12-25, 2026-01-01" className={inputCls} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer select-none">
        <input type="checkbox" checked={includeEnds} onChange={(e) => setIncludeEnds(e.target.checked)} className="accent-accent w-4 h-4" />
        Count the start and end days if they are weekdays
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-deep rounded-xl px-4 py-5 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">WORK DAYS</span>
          <span className="font-display text-4xl font-bold text-accent">{wd !== null ? wd : "—"}</span>
          <span className="font-mono text-[10px] text-paper/60">Mon–Fri{hols.length ? ` · ${hols.length} holiday(s) excluded` : ""}</span>
        </div>
        <div className="bg-paper border border-ink/10 rounded-xl px-4 py-5 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">CALENDAR DAYS</span>
          <span className="font-display text-4xl font-bold text-deep">{total !== null ? total : "—"}</span>
          <span className="font-mono text-[10px] text-ink/50">including weekends</span>
        </div>
      </div>
    </div>
  );
}
