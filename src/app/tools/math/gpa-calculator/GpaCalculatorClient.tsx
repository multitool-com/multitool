"use client";

import { useState } from "react";

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0.0,
};

export function calcGpa(courses: { grade: string; credits: number }[]): { gpa: number; totalCredits: number } | null {
  let sum = 0, creds = 0;
  for (const c of courses) {
    const p = GRADE_POINTS[c.grade];
    if (p === undefined || !isFinite(c.credits) || c.credits <= 0) return null;
    sum += p * c.credits;
    creds += c.credits;
  }
  if (creds === 0) return null;
  return { gpa: sum / creds, totalCredits: creds };
}

type Row = { grade: string; credits: string };

export default function GpaCalculatorClient() {
  const [rows, setRows] = useState<Row[]>([
    { grade: "A", credits: "3" },
    { grade: "B+", credits: "4" },
    { grade: "C", credits: "3" },
  ]);

  const parsed = rows.map((r) => ({ grade: r.grade, credits: parseFloat(r.credits) }));
  const res = calcGpa(parsed);
  const gpa = res?.gpa ?? null;
  const scale = gpa === null ? null : gpa >= 3.7 ? "Excellent" : gpa >= 3.0 ? "Good" : gpa >= 2.0 ? "Satisfactory" : "Needs improvement";

  const update = (i: number, field: keyof Row, v: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [field]: v } : r)));
  const add = () => setRows((rs) => [...rs, { grade: "B", credits: "3" }]);
  const remove = (i: number) => setRows((rs) => rs.filter((_, j) => j !== i));

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="font-mono text-[10px] tracking-widest text-ink/50">
              <th className="text-left pb-2">COURSE</th>
              <th className="text-left pb-2">GRADE</th>
              <th className="text-left pb-2">CREDITS</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-ink/5">
                <td className="py-2 pr-2 font-mono text-xs text-ink/70">Course {i + 1}</td>
                <td className="py-2 pr-2">
                  <select value={r.grade} onChange={(e) => update(i, "grade", e.target.value)} className="border border-ink/15 rounded-lg px-2 py-2 font-mono text-xs bg-white">
                    {Object.keys(GRADE_POINTS).map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min="0" step="0.5" value={r.credits} onChange={(e) => update(i, "credits", e.target.value)} className="w-20 border border-ink/15 rounded-lg px-2 py-2 font-mono text-xs" />
                </td>
                <td className="py-2 text-right">
                  <button type="button" onClick={() => remove(i)} disabled={rows.length <= 1} className="font-mono text-xs text-red-400 hover:text-red-600 disabled:opacity-30">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={add} className="self-start bg-paper border border-ink/15 font-mono text-xs tracking-widest px-4 py-2 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">
        + ADD COURSE
      </button>

      <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] tracking-widest text-paper/60">GPA (4.0 SCALE)</span>
        <span className="font-display text-5xl font-bold text-accent">{gpa !== null ? gpa.toFixed(2) : "—"}</span>
        <span className="font-mono text-xs text-paper/70">
          {gpa !== null ? `${scale} · ${res?.totalCredits} credits` : "Enter valid grades and credits"}
        </span>
      </div>
    </div>
  );
}
