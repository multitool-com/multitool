"use client";

import { useState, useMemo } from "react";

type UnitSystem = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  categoryDesc: string;
  idealMinKg: number;
  idealMaxKg: number;
}

function getBMICategory(bmi: number): {
  category: string;
  categoryColor: string;
  categoryDesc: string;
} {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      categoryColor: "text-blue-500",
      categoryDesc: "BMI below 18.5",
    };
  } else if (bmi < 25) {
    return {
      category: "Normal weight",
      categoryColor: "text-green-600",
      categoryDesc: "BMI 18.5 – 24.9",
    };
  } else if (bmi < 30) {
    return {
      category: "Overweight",
      categoryColor: "text-yellow-600",
      categoryDesc: "BMI 25 – 29.9",
    };
  } else if (bmi < 35) {
    return {
      category: "Obese Class I",
      categoryColor: "text-orange-600",
      categoryDesc: "BMI 30 – 34.9",
    };
  } else if (bmi < 40) {
    return {
      category: "Obese Class II",
      categoryColor: "text-red-600",
      categoryDesc: "BMI 35 – 39.9",
    };
  } else {
    return {
      category: "Obese Class III",
      categoryColor: "text-red-700",
      categoryDesc: "BMI 40+",
    };
  }
}

export default function BMICalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  // Metric inputs
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  // Imperial inputs
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");

  const result = useMemo<BMIResult | null>(() => {
    let heightM = 0;
    let kg = 0;

    if (unitSystem === "metric") {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
      heightM = h / 100;
      kg = w;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const lb = parseFloat(weightLb);
      if (isNaN(lb) || lb <= 0 || (ft === 0 && inches === 0)) return null;
      const totalInches = ft * 12 + inches;
      heightM = totalInches * 0.0254;
      kg = lb * 0.453592;
    }

    if (heightM <= 0 || kg <= 0) return null;

    const bmi = kg / (heightM * heightM);

    if (!isFinite(bmi) || bmi < 5 || bmi > 100) return null;

    const { category, categoryColor, categoryDesc } = getBMICategory(bmi);

    // Faixa de peso ideal para a altura fornecida (BMI 18.5 – 24.9)
    const idealMinKg = 18.5 * heightM * heightM;
    const idealMaxKg = 24.9 * heightM * heightM;

    return {
      bmi,
      category,
      categoryColor,
      categoryDesc,
      idealMinKg,
      idealMaxKg,
    };
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const kgToLb = (kg: number) => kg * 2.20462;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Toggle de unidades */}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => setUnitSystem("metric")}
          className={`font-mono text-xs tracking-widest px-5 py-2 rounded-full transition-colors ${
            unitSystem === "metric"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          METRIC (KG/CM)
        </button>
        <button
          type="button"
          onClick={() => setUnitSystem("imperial")}
          className={`font-mono text-xs tracking-widest px-5 py-2 rounded-full transition-colors ${
            unitSystem === "imperial"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          IMPERIAL (LB/FT)
        </button>
      </div>

      {/* Inputs */}
      {unitSystem === "metric" ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="height-cm"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              HEIGHT (CM)
            </label>
            <input
              id="height-cm"
              type="number"
              inputMode="decimal"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="175"
              min="50"
              max="300"
              step="0.1"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="weight-kg"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              WEIGHT (KG)
            </label>
            <input
              id="weight-kg"
              type="number"
              inputMode="decimal"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="70"
              min="10"
              max="500"
              step="0.1"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="height-ft"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              HEIGHT (FT)
            </label>
            <input
              id="height-ft"
              type="number"
              inputMode="numeric"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              placeholder="5"
              min="1"
              max="9"
              step="1"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="height-in"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              HEIGHT (IN)
            </label>
            <input
              id="height-in"
              type="number"
              inputMode="decimal"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              placeholder="9"
              min="0"
              max="11"
              step="0.1"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="weight-lb"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              WEIGHT (LB)
            </label>
            <input
              id="weight-lb"
              type="number"
              inputMode="decimal"
              value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)}
              placeholder="154"
              min="10"
              max="1000"
              step="0.1"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      )}

      {/* Visor principal — BMI */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          YOUR BMI
        </span>
        {result ? (
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {result.bmi.toFixed(1)}
            </span>
            <span className="font-mono text-sm text-paper/60">kg/m²</span>
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {/* Categoria + faixa ideal */}
      {result && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
            <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
              CATEGORY
            </span>
            <span className={`font-display font-semibold text-lg ${result.categoryColor}`}>
              {result.category}
            </span>
            <span className="font-mono text-xs text-ink/40 block mt-1">
              {result.categoryDesc}
            </span>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
            <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
              IDEAL WEIGHT RANGE
            </span>
            <span className="font-display font-semibold text-lg text-ink">
              {unitSystem === "metric"
                ? `${result.idealMinKg.toFixed(1)} – ${result.idealMaxKg.toFixed(1)} kg`
                : `${kgToLb(result.idealMinKg).toFixed(1)} – ${kgToLb(result.idealMaxKg).toFixed(1)} lb`}
            </span>
            <span className="font-mono text-xs text-ink/40 block mt-1">
              For your height
            </span>
          </div>
        </div>
      )}

      {!result && (
        <p className="text-sm text-ink/50 text-center italic">
          Enter your height and weight to calculate your BMI.
        </p>
      )}

      {/* Aviso */}
      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-xs text-ink/60">
        <strong className="text-ink">Note:</strong> BMI is a screening tool
        and doesn&apos;t account for muscle mass, bone density or body
        composition. For a complete health assessment, consult a healthcare
        professional.
      </div>
    </div>
  );
}