"use client";

import { useEffect, useState } from "react";

export function splitRemaining(target: Date, now = new Date()) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function CountdownTimerClient() {
  const target = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  const iso = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}T${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;
  const [dateTime, setDateTime] = useState(iso);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const t = new Date(dateTime);
  const r = dateTime && !isNaN(t.getTime()) ? splitRemaining(t, new Date(now)) : null;
  const label = t.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const cells = r
    ? [
        { v: r.days, l: "DAYS" },
        { v: r.hours, l: "HOURS" },
        { v: r.minutes, l: "MINUTES" },
        { v: r.seconds, l: "SECONDS" },
      ]
    : [];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="cd-dt" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">TARGET DATE & TIME</label>
        <input id="cd-dt" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      {r ? (
        <>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {cells.map((c) => (
              <div key={c.l} className="bg-deep rounded-xl px-2 py-5 flex flex-col items-center gap-1">
                <span className="font-display text-3xl sm:text-4xl font-bold text-accent tabular-nums">{String(c.v).padStart(2, "0")}</span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-paper/60">{c.l}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-ink/50">Counting down to {label}</p>
        </>
      ) : (
        <div className="bg-paper border border-ink/10 rounded-xl px-6 py-6 text-center">
          <span className="font-display text-2xl font-bold text-deep">🎉 Time has come!</span>
          <p className="text-sm text-ink/60 mt-1">Pick a future date to start a new countdown.</p>
        </div>
      )}
    </div>
  );
}
