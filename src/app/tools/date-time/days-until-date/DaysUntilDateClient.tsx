"use client";

import { useMemo, useState } from "react";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const AVG_DAYS_PER_MONTH = 365.25 / 12;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextOccurrence(month: number, day: number, from: Date): Date {
  const candidate = new Date(from.getFullYear(), month, day);
  if (startOfDay(candidate) < startOfDay(from)) {
    return new Date(from.getFullYear() + 1, month, day);
  }
  return candidate;
}

export default function DaysUntilDateClient() {
  const today = startOfDay(new Date());
  const defaultTarget = new Date(today);
  defaultTarget.setDate(defaultTarget.getDate() + 30);

  const [targetValue, setTargetValue] = useState(toInputValue(defaultTarget));

  const presets = useMemo(() => {
    const plus7 = new Date(today);
    plus7.setDate(plus7.getDate() + 7);
    const plus30 = new Date(today);
    plus30.setDate(plus30.getDate() + 30);
    const plus365 = new Date(today);
    plus365.setFullYear(plus365.getFullYear() + 1);

    return [
      { label: "NEW YEAR", date: nextOccurrence(0, 1, today) },
      { label: "VALENTINE'S", date: nextOccurrence(1, 14, today) },
      { label: "HALLOWEEN", date: nextOccurrence(9, 31, today) },
      { label: "CHRISTMAS", date: nextOccurrence(11, 25, today) },
      { label: "+ 7 DAYS", date: plus7 },
      { label: "+ 30 DAYS", date: plus30 },
      { label: "+ 1 YEAR", date: plus365 },
    ];
  }, [today]);

  const result = useMemo(() => {
    if (!targetValue) return null;
    const target = startOfDay(new Date(`${targetValue}T00:00:00`));
    if (isNaN(target.getTime())) return null;

    const diffMs = target.getTime() - today.getTime();
    const dayDiff = Math.round(diffMs / MS_PER_DAY);
    const isPast = dayDiff < 0;
    const absDays = Math.abs(dayDiff);

    return {
      isPast,
      isToday: dayDiff === 0,
      days: absDays,
      weeks: absDays / 7,
      months: absDays / AVG_DAYS_PER_MONTH,
      hours: absDays * 24,
      weekday: target.toLocaleDateString("en-US", { weekday: "long" }),
      pretty: target.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }, [targetValue, today]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="target-date"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          TARGET DATE
        </label>
        <input
          id="target-date"
          type="date"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          PRESETS
        </span>
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setTargetValue(toInputValue(preset.date))}
              className="font-mono text-xs tracking-widest px-3 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          {result?.isToday
            ? "THAT DATE IS"
            : result?.isPast
              ? "DAYS SINCE"
              : "DAYS UNTIL"}
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {result.isToday ? "TODAY" : result.days.toLocaleString("en-US")}
            </span>
            {!result.isToday && (
              <span className="font-mono text-sm text-paper/70">
                {result.days === 1 ? "day" : "days"}
              </span>
            )}
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
        {result && (
          <p className="font-mono text-xs text-paper/50 mt-2">{result.pretty}</p>
        )}
      </div>

      {result && !result.isToday && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBlock
            label="WEEKS"
            value={result.weeks.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          />
          <StatBlock
            label="MONTHS (AVG)"
            value={result.months.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          />
          <StatBlock
            label="HOURS"
            value={result.hours.toLocaleString("en-US")}
            highlight
          />
          <StatBlock label="WEEKDAY" value={result.weekday} highlight />
          <StatBlock
            label="STATUS"
            value={result.isPast ? "PAST" : "UPCOMING"}
          />
          <StatBlock
            label="TODAY"
            value={today.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          />
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Counts use your
        device timezone and whole calendar days. Month figures use an
        average month (30.44 days).
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