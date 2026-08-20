"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolUsed } from "@/lib/analytics";

export default function PercentageCalculatorClient() {
  const [percent, setPercent] = useState("");
  const [value, setValue] = useState("");

  const result =
    percent !== "" && value !== ""
      ? (parseFloat(percent) / 100) * parseFloat(value)
      : null;

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackToolUsed("percentage-calculator", "finance");
  }, []);

  return (
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
  );
}
