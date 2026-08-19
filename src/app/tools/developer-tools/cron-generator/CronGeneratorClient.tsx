"use client";

import { useState } from "react";

export function describeCron(minute: string, hour: string, dom: string, month: string, dow: string): string {
  const m = minute === "*" ? "every minute" : `minute ${minute}`;
  const h = hour === "*" ? "every hour" : `at ${hour}:00`;
  const parts: string[] = [];
  if (dom === "*" && dow === "*") {
    parts.push(m === "every minute" ? (h === "every hour" ? "Every minute, every hour" : `Every hour, ${h}`) : m === "every minute" ? `Every minute, ${h}` : `${h} and ${m}`);
  } else {
    parts.push(`${h} on ${m}`);
    if (dom !== "*") parts.push(`day ${dom} of month`);
    if (dow !== "*") parts.push(dow === "0" ? "Sunday" : dow === "1" ? "Monday" : dow === "2" ? "Tuesday" : dow === "3" ? "Wednesday" : dow === "4" ? "Thursday" : dow === "5" ? "Friday" : "Saturday");
    if (month !== "*") parts.push(`in month ${month}`);
  }
  return parts.join(", ") || "Every minute";
}

export default function CronGeneratorClient() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [copied, setCopied] = useState(false);

  const cron = `${minute} ${hour} ${dom} ${month} ${dow}`;

  const applyPreset = (m: string, h: string, d: string, mo: string, dw: string) => {
    setMinute(m); setHour(h); setDom(d); setMonth(mo); setDow(dw);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  const selectCls = "border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent";

  const minuteOpts = ["*", "0", "5", "10", "15", "30", "45"];
  const hourOpts = ["*", "0", "1", "2", "3", "6", "9", "12", "15", "18", "21", "23"];
  const domOpts = ["*", "1", "2", "5", "10", "15", "20", "25", "31"];
  const monthOpts = ["*", "1", "2", "3", "4", "6", "9", "12"];
  const dowOpts = ["*", "0", "1", "2", "3", "4", "5", "6"];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => applyPreset("*", "*", "*", "*", "*")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">EVERY MINUTE</button>
        <button type="button" onClick={() => applyPreset("*/5", "*", "*", "*", "*")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">EVERY 5 MIN</button>
        <button type="button" onClick={() => applyPreset("0", "*", "*", "*", "*")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">HOURLY</button>
        <button type="button" onClick={() => applyPreset("0", "9", "*", "*", "*")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">DAILY 9AM</button>
        <button type="button" onClick={() => applyPreset("0", "9", "*", "*", "1")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">MONDAYS 9AM</button>
        <button type="button" onClick={() => applyPreset("0", "0", "1", "*", "*")} className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors">MONTHLY 1ST</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "MINUTE", val: minute, set: setMinute, opts: minuteOpts },
          { label: "HOUR", val: hour, set: setHour, opts: hourOpts },
          { label: "DAY OF MONTH", val: dom, set: setDom, opts: domOpts },
          { label: "MONTH", val: month, set: setMonth, opts: monthOpts },
          { label: "DAY OF WEEK", val: dow, set: setDow, opts: dowOpts },
        ].map((f) => (
          <div key={f.label}>
            <label className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">{f.label}</label>
            <select value={f.val} onChange={(e) => f.set(e.target.value)} className={selectCls + " w-full"}>
              {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest text-paper/60">CRON EXPRESSION (5-FIELD)</span>
        <code className="font-mono text-2xl sm:text-3xl font-bold text-accent break-all">{cron}</code>
        <span className="font-mono text-xs text-paper/70 text-center max-w-md">{describeCron(minute, hour, dom, month, dow)}</span>
        <button type="button" onClick={copy} className="mt-2 bg-accent text-paper font-mono text-xs tracking-widest px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">{copied ? "✓ COPIED" : "📋 COPY"}</button>
      </div>
      <p className="text-xs text-ink/50">Standard 5-field cron (minute hour day-of-month month day-of-week), compatible with Linux crontab, AWS, GitHub Actions schedules and most schedulers.</p>
    </div>
  );
}
