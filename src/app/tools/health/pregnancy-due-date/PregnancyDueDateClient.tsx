"use client";

import { useState } from "react";

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

export function dueDateFromLmp(lmp: Date): Date {
  return addDays(lmp, 280);
}

export function pregnancyWeek(lmp: Date, today = new Date()): number {
  const ms = today.getTime() - lmp.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / (7 * 24 * 3600 * 1000));
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PregnancyDueDateClient() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [lmp, setLmp] = useState(iso);

  const d = lmp ? new Date(lmp + "T00:00:00") : null;
  const valid = d && !isNaN(d.getTime());
  const edd = valid ? dueDateFromLmp(d) : null;
  const week = valid ? pregnancyWeek(d) : null;
  const trimester = week !== null ? (week <= 13 ? 1 : week <= 26 ? 2 : 3) : null;
  const remaining = edd && valid ? Math.max(0, Math.ceil((edd.getTime() - Date.now()) / (24 * 3600 * 1000))) : null;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="preg-lmp" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          FIRST DAY OF LAST MENSTRUAL PERIOD (LMP)
        </label>
        <input id="preg-lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      {valid && edd && week !== null && (
        <>
          <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-widest text-paper/60">ESTIMATED DUE DATE</span>
            <span className="font-display text-4xl font-bold text-accent">{fmtDate(edd)}</span>
            <span className="font-mono text-xs text-paper/70">{remaining !== null ? `${remaining} days to go` : ""}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-paper border border-ink/10 rounded-lg px-3 py-4 flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] tracking-widest text-ink/50">CURRENT WEEK</span>
              <span className="font-display text-2xl font-bold text-deep">{Math.min(week, 42)}</span>
            </div>
            <div className="bg-paper border border-ink/10 rounded-lg px-3 py-4 flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] tracking-widest text-ink/50">TRIMESTER</span>
              <span className="font-display text-2xl font-bold text-deep">{trimester}</span>
            </div>
            <div className="bg-paper border border-ink/10 rounded-lg px-3 py-4 flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] tracking-widest text-ink/50">CONCEPTION ~</span>
              <span className="font-display text-lg font-bold text-deep">{fmtDate(addDays(d, 14))}</span>
            </div>
          </div>
          <p className="text-xs text-ink/50">
            Based on Naegele&apos;s rule: LMP + 280 days (40 weeks). Only ~5% of babies arrive exactly on the due date — treat it as a guide.
          </p>
        </>
      )}
    </div>
  );
}
