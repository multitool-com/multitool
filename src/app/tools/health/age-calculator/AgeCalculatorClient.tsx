"use client";

import { useState, useMemo } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  daysUntilBirthday: number;
}

function calculateAge(birthDate: Date, now: Date): AgeResult {
  // Cálculo em anos, meses e dias (com "borrow" correto)
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Dias do mês anterior
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Cálculos totais
  const msDiff = now.getTime() - birthDate.getTime();
  const totalDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(msDiff / (1000 * 60 * 60));
  const totalMinutes = Math.floor(msDiff / (1000 * 60));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Dias até o próximo aniversário
  const nextBirthday = new Date(
    now.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    daysUntilBirthday,
  };
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");

  const result = useMemo<AgeResult | null>(() => {
    if (!birthDate) return null;

    const dateStr = birthTime ? `${birthDate}T${birthTime}` : `${birthDate}T00:00`;
    const birth = new Date(dateStr);
    const now = new Date();

    // Validações
    if (isNaN(birth.getTime())) return null;
    if (birth > now) return null;

    return calculateAge(birth, now);
  }, [birthDate, birthTime]);

  const isInvalidFuture = useMemo(() => {
    if (!birthDate) return false;
    const dateStr = birthTime ? `${birthDate}T${birthTime}` : `${birthDate}T00:00`;
    const birth = new Date(dateStr);
    return !isNaN(birth.getTime()) && birth > new Date();
  }, [birthDate, birthTime]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="birth-date"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            DATE OF BIRTH
          </label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={today}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="birth-time"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            TIME OF BIRTH (OPTIONAL)
          </label>
          <input
            id="birth-time"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {isInvalidFuture && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
          <p className="text-sm text-accent font-medium">
            ⚠️ Date of birth cannot be in the future.
          </p>
        </div>
      )}

      {/* Visor principal */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          YOUR AGE
        </span>
        {result ? (
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-mono text-4xl font-semibold text-accent">
              {result.years}
            </span>
            <span className="text-paper/70 text-sm">years</span>
            <span className="font-mono text-2xl font-semibold text-accent">
              {result.months}
            </span>
            <span className="text-paper/70 text-sm">months</span>
            <span className="font-mono text-2xl font-semibold text-accent">
              {result.days}
            </span>
            <span className="text-paper/70 text-sm">days</span>
          </div>
        ) : (
          <span className="font-mono text-3xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {/* Estatísticas detalhadas */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBlock label="TOTAL MONTHS" value={result.totalMonths.toLocaleString()} />
          <StatBlock label="TOTAL WEEKS" value={result.totalWeeks.toLocaleString()} />
          <StatBlock label="TOTAL DAYS" value={result.totalDays.toLocaleString()} />
          <StatBlock label="TOTAL HOURS" value={result.totalHours.toLocaleString()} />
          <StatBlock label="TOTAL MINUTES" value={result.totalMinutes.toLocaleString()} />
          <StatBlock
            label="NEXT BIRTHDAY"
            value={
              result.daysUntilBirthday === 0
                ? "TODAY! 🎉"
                : `${result.daysUntilBirthday} days`
            }
            highlight={result.daysUntilBirthday === 0}
          />
        </div>
      )}

      {!result && !isInvalidFuture && (
        <p className="text-sm text-ink/50 text-center italic">
          Enter your date of birth to calculate your age.
        </p>
      )}
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