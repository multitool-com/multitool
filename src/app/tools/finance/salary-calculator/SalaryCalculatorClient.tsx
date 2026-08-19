"use client";

import { useState } from "react";

type Mode = "annual" | "hourly";

export function annualToPeriods(annual: number, hoursPerWeek: number, weeksPerYear: number) {
  if (!isFinite(annual) || annual < 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) return null;
  const hourly = annual / (hoursPerWeek * weeksPerYear);
  const daily = hourly * 8;
  const weekly = hourly * hoursPerWeek;
  const monthly = annual / 12;
  return { hourly, daily, weekly, monthly, annual };
}

export function hourlyToPeriods(hourly: number, hoursPerWeek: number, weeksPerYear: number) {
  if (!isFinite(hourly) || hourly < 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) return null;
  const annual = hourly * hoursPerWeek * weeksPerYear;
  const daily = hourly * 8;
  const weekly = hourly * hoursPerWeek;
  const monthly = annual / 12;
  return { hourly, daily, weekly, monthly, annual };
}

const CURRENCIES = ["$", "€", "£", "R$"];

export default function SalaryCalculatorClient() {
  const [mode, setMode] = useState<Mode>("annual");
  const [annual, setAnnual] = useState("60000");
  const [hourly, setHourly] = useState("28.85");
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("52");
  const [cur, setCur] = useState("$");

  const h = parseFloat(hours) || 0;
  const w = parseFloat(weeks) || 0;
  const res = mode === "annual" ? annualToPeriods(parseFloat(annual), h, w) : hourlyToPeriods(parseFloat(hourly), h, w);

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";
  const fmt = (v: number) => cur + v.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const rows = res
    ? [
        { label: "HOURLY", value: fmt(res.hourly) },
        { label: "DAILY (8h)", value: fmt(res.daily) },
        { label: "WEEKLY", value: fmt(res.weekly) },
        { label: "MONTHLY", value: fmt(res.monthly) },
        { label: "ANNUAL", value: fmt(res.annual) },
      ]
    : [];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setMode("annual")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "annual" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
          💰 I KNOW ANNUAL
        </button>
        <button type="button" onClick={() => setMode("hourly")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "hourly" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>
          ⏱️ I KNOW HOURLY
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            {mode === "annual" ? "ANNUAL SALARY" : "HOURLY RATE"}
          </label>
          <div className="flex items-center gap-2">
            <select value={cur} onChange={(e) => setCur(e.target.value)} className="border border-ink/15 rounded-lg px-2 py-2.5 font-mono text-sm bg-white">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" min="0" value={mode === "annual" ? annual : hourly} onChange={(e) => (mode === "annual" ? setAnnual(e.target.value) : setHourly(e.target.value))} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HOURS / WEEK</label>
          <input type="number" min="1" max="168" value={hours} onChange={(e) => setHours(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">WEEKS / YEAR (paid)</label>
        <input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={inputCls} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.label} className="bg-paper border border-ink/10 rounded-lg px-4 py-4 flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] tracking-widest text-ink/50">{r.label}</span>
            <span className="font-display text-2xl font-bold text-deep">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
