"use client";

import { useState, useMemo } from "react";

type Scale = "C" | "F" | "K" | "R";

const scaleInfo: Record<Scale, { name: string; symbol: string; full: string }> = {
  C: { name: "Celsius", symbol: "°C", full: "Celsius (°C)" },
  F: { name: "Fahrenheit", symbol: "°F", full: "Fahrenheit (°F)" },
  K: { name: "Kelvin", symbol: "K", full: "Kelvin (K)" },
  R: { name: "Rankine", symbol: "°R", full: "Rankine (°R)" },
};

// Todas as conversões passam por Celsius como base
const toCelsius = (value: number, from: Scale): number => {
  switch (from) {
    case "C": return value;
    case "F": return (value - 32) * (5 / 9);
    case "K": return value - 273.15;
    case "R": return (value - 491.67) * (5 / 9);
  }
};

const fromCelsius = (celsius: number, to: Scale): number => {
  switch (to) {
    case "C": return celsius;
    case "F": return celsius * (9 / 5) + 32;
    case "K": return celsius + 273.15;
    case "R": return (celsius + 273.15) * (9 / 5);
  }
};

export default function TemperatureConverterClient() {
  const [inputValue, setInputValue] = useState("100");
  const [fromScale, setFromScale] = useState<Scale>("C");

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    const celsius = toCelsius(value, fromScale);

    return {
      C: fromCelsius(celsius, "C"),
      F: fromCelsius(celsius, "F"),
      K: fromCelsius(celsius, "K"),
      R: fromCelsius(celsius, "R"),
    };
  }, [inputValue, fromScale]);

  const formatNumber = (n: number) => {
    if (Math.abs(n) < 0.01 && n !== 0) return n.toExponential(2);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  // Referências rápidas
  const references = [
    { label: "Absolute zero", C: -273.15 },
    { label: "Water freezes", C: 0 },
    { label: "Room temperature", C: 20 },
    { label: "Body temperature", C: 37 },
    { label: "Water boils", C: 100 },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Seletor de escala de origem */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          FROM SCALE
        </span>
        <div className="flex gap-2 justify-center flex-wrap">
          {(Object.keys(scaleInfo) as Scale[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFromScale(s)}
              className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
                fromScale === s
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {scaleInfo[s].symbol} {scaleInfo[s].name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label
          htmlFor="temp-input"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          TEMPERATURE ({scaleInfo[fromScale].symbol})
        </label>
        <input
          id="temp-input"
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter temperature"
          step="any"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Visor principal — mostra as 3 outras escalas */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-3">
          CONVERTED VALUES
        </span>
        {result ? (
          <div className="flex flex-col gap-2">
            {(Object.keys(scaleInfo) as Scale[])
              .filter((s) => s !== fromScale)
              .map((s) => (
                <div key={s} className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-mono text-xs text-paper/60 tracking-widest">
                    {scaleInfo[s].full.toUpperCase()}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-semibold text-accent">
                      {formatNumber(result[s])}
                    </span>
                    <span className="font-mono text-sm text-paper/70">
                      {scaleInfo[s].symbol}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <span className="font-mono text-3xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {/* Referências rápidas */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          QUICK REFERENCES (click to load)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {references.map((ref) => (
            <button
              key={ref.label}
              type="button"
              onClick={() => {
                setFromScale("C");
                setInputValue(ref.C.toString());
              }}
              className="bg-paper border border-ink/10 hover:border-accent hover:text-accent transition-colors rounded-lg px-3 py-2 text-left"
            >
              <span className="font-mono text-[10px] tracking-widest text-ink/50 block">
                {ref.label.toUpperCase()}
              </span>
              <span className="font-mono text-sm font-semibold">
                {ref.C}°C
              </span>
            </button>
          ))}
        </div>
      </div>

      {!result && (
        <p className="text-sm text-ink/50 text-center italic">
          Enter a valid number to see conversions.
        </p>
      )}
    </div>
  );
}