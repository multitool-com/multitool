"use client";

import { useState } from "react";

export function mifflinStJeor(gender: "male" | "female", weightKg: number, heightCm: number, age: number): number | null {
  if (!isFinite(weightKg) || !isFinite(heightCm) || !isFinite(age) || weightKg <= 0 || heightCm <= 0 || age <= 0) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export const ACTIVITY = [
  { id: "sed", label: "Sedentary (little/no exercise)", mult: 1.2 },
  { id: "light", label: "Light (1-3 days/week)", mult: 1.375 },
  { id: "mod", label: "Moderate (3-5 days/week)", mult: 1.55 },
  { id: "high", label: "Active (6-7 days/week)", mult: 1.725 },
  { id: "ath", label: "Very active (physical job)", mult: 1.9 },
];

export default function CalorieCalculatorClient() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("75");
  const [act, setAct] = useState("mod");
  const [goal, setGoal] = useState<"cut" | "maintain" | "bulk">("maintain");

  const bmr = mifflinStJeor(gender, parseFloat(weight), parseFloat(height), parseFloat(age));
  const mult = ACTIVITY.find((a) => a.id === act)?.mult ?? 1.55;
  const tdee = bmr ? bmr * mult : null;
  const goalCal = tdee ? (goal === "cut" ? tdee - 500 : goal === "bulk" ? tdee + 300 : tdee) : null;

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setGender("male")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${gender === "male" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>♂ MALE</button>
        <button type="button" onClick={() => setGender("female")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${gender === "female" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>♀ FEMALE</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">AGE</label>
          <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HEIGHT (cm)</label>
          <input type="number" min="50" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">WEIGHT (kg)</label>
          <input type="number" min="20" max="400" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ACTIVITY LEVEL</div>
        <div className="flex flex-col gap-1.5">
          {ACTIVITY.map((a) => (
            <button key={a.id} type="button" onClick={() => setAct(a.id)} className={`text-left font-mono text-xs px-4 py-2 rounded-lg border transition-colors ${act === a.id ? "bg-deep text-paper border-deep" : "bg-paper text-ink/70 border-ink/15 hover:border-accent"}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">GOAL</div>
        <div className="flex gap-2 flex-wrap">
          {([["cut", "🔥 Lose weight (-500)"], ["maintain", "⚖️ Maintain"], ["bulk", "💪 Gain (+300)"]] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setGoal(id)} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${goal === id ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">BMR (Mifflin-St Jeor)</span>
          <span className="font-display text-2xl font-bold text-deep">{bmr ? Math.round(bmr).toLocaleString() : "—"}</span>
          <span className="font-mono text-[10px] text-ink/50">kcal/day at rest</span>
        </div>
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-ink/50">DAILY CALORIES</span>
          <span className="font-display text-2xl font-bold text-accent">{goalCal ? Math.round(goalCal).toLocaleString() : "—"}</span>
          <span className="font-mono text-[10px] text-ink/50">kcal/day for goal</span>
        </div>
      </div>
    </div>
  );
}
