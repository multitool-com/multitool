"use client";

import { useState } from "react";

export function healthyBmiRange(heightCm: number) {
  if (!isFinite(heightCm) || heightCm <= 0) return null;
  const h = heightCm / 100;
  return { min: 18.5 * h * h, max: 24.9 * h * h };
}

export function bmi(weightKg: number, heightCm: number) {
  if (!isFinite(weightKg) || !isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) return null;
  return weightKg / (heightCm / 100) ** 2;
}

export const FORMULAS = {
  Devine: (male: boolean, heightCm: number) => (male ? 50 : 45.5) + 2.3 * ((heightCm - 152.4) / 2.54),
  Robinson: (male: boolean, heightCm: number) => (male ? 52 : 49) + 1.9 * ((heightCm - 152.4) / 2.54),
  Miller: (male: boolean, heightCm: number) => (male ? 56.2 : 53.1) + 1.41 * ((heightCm - 152.4) / 2.54),
  Hamwi: (male: boolean, heightCm: number) => (male ? 48 : 45.5) + 2.7 * ((heightCm - 152.4) / 2.54),
};

export default function IdealWeightClient() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");

  const h = parseFloat(height);
  const range = healthyBmiRange(h);
  const curBmi = bmi(parseFloat(weight), h);

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";
  const male = gender === "male";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => setGender("male")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${male ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>♂ MALE</button>
        <button type="button" onClick={() => setGender("female")} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${!male ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>♀ FEMALE</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HEIGHT (cm)</label>
          <input type="number" min="50" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">YOUR WEIGHT (kg)</label>
          <input type="number" min="20" max="400" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
        </div>
      </div>

      {range && curBmi !== null && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <strong className="text-ink">Healthy BMI range (18.5–24.9):</strong>{" "}
          {range.min.toFixed(1)} – {range.max.toFixed(1)} kg · Your BMI:{" "}
          <strong className={curBmi >= 18.5 && curBmi <= 24.9 ? "text-accent" : "text-red-500"}>
            {curBmi.toFixed(1)}
          </strong>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {(Object.keys(FORMULAS) as (keyof typeof FORMULAS)[]).map((name) => {
          const v = h > 0 ? FORMULAS[name](male, h) : null;
          return (
            <div key={name} className="bg-paper border border-ink/10 rounded-lg px-4 py-4 flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-ink/50">{name}</span>
              <span className="font-display text-xl font-bold text-deep">{v ? v.toFixed(1) + " kg" : "—"}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-ink/50">
        Formulas: Devine, Robinson, Miller and Hamwi — classic estimates for ideal body weight. They do not account for muscle mass; use as a rough guide.
      </p>
    </div>
  );
}
