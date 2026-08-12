"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [percent, setPercent] = useState("");
  const [value, setValue] = useState("");

  const result =
    percent !== "" && value !== ""
      ? (parseFloat(percent) / 100) * parseFloat(value)
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        FINANCE / CALCULATOR
      </p>
      <h1 className="font-display text-3xl font-bold mb-2">
        Percentage Calculator
      </h1>
      <p className="text-ink/60 mb-8">
        Quickly calculate what percentage of a number is. Enter a percentage
        and a value below to get an instant result.
      </p>

      <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap text-lg">
          <span>What is</span>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="10"
            className="w-24 border border-ink/15 rounded-lg px-3 py-2 text-center font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <span>% of</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="200"
            className="w-28 border border-ink/15 rounded-lg px-3 py-2 text-center font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <span>?</span>
        </div>

        {/* VISOR ESTILO LCD */}
        <div className="bg-deep rounded-lg px-5 py-4 flex items-center justify-between">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            RESULT
          </span>
          <span className="font-mono text-3xl font-semibold text-accent">
            {result !== null ? result.toLocaleString() : "—"}
          </span>
        </div>
      </div>

      <div className="mt-10 max-w-none text-ink/80 leading-relaxed">
        <h2 className="font-display text-xl font-semibold mb-2">
          How to calculate a percentage
        </h2>
        <p className="mb-4">
          To find what a percentage of a number is, multiply the number by
          the percentage and divide by 100. For example, to find 10% of 200,
          you calculate (10 / 100) × 200, which equals 20.
        </p>
        <p>
          Percentages are used everywhere: calculating discounts while
          shopping, figuring out tips at a restaurant, understanding interest
          rates on loans, or tracking progress toward a goal. This calculator
          removes the manual math so you get an instant, accurate answer.
        </p>
      </div>
    </div>
  );
}
