"use client";

import { useMemo, useState } from "react";

type CategoryId = "length" | "weight" | "volume" | "area" | "speed" | "data";

interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  toBase: number;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "length", label: "LENGTH" },
  { id: "weight", label: "WEIGHT" },
  { id: "volume", label: "VOLUME" },
  { id: "area", label: "AREA" },
  { id: "speed", label: "SPEED" },
  { id: "data", label: "DATA" },
];

const UNITS: Record<CategoryId, UnitDef[]> = {
  length: [
    { id: "mm", label: "Millimetre", symbol: "mm", toBase: 0.001 },
    { id: "cm", label: "Centimetre", symbol: "cm", toBase: 0.01 },
    { id: "m", label: "Metre", symbol: "m", toBase: 1 },
    { id: "km", label: "Kilometre", symbol: "km", toBase: 1000 },
    { id: "in", label: "Inch", symbol: "in", toBase: 0.0254 },
    { id: "ft", label: "Foot", symbol: "ft", toBase: 0.3048 },
    { id: "yd", label: "Yard", symbol: "yd", toBase: 0.9144 },
    { id: "mi", label: "Mile", symbol: "mi", toBase: 1609.344 },
  ],
  weight: [
    { id: "mg", label: "Milligram", symbol: "mg", toBase: 0.000001 },
    { id: "g", label: "Gram", symbol: "g", toBase: 0.001 },
    { id: "kg", label: "Kilogram", symbol: "kg", toBase: 1 },
    { id: "t", label: "Metric ton", symbol: "t", toBase: 1000 },
    { id: "oz", label: "Ounce", symbol: "oz", toBase: 0.028349523125 },
    { id: "lb", label: "Pound", symbol: "lb", toBase: 0.45359237 },
    { id: "st", label: "Stone", symbol: "st", toBase: 6.35029318 },
  ],
  volume: [
    { id: "ml", label: "Millilitre", symbol: "ml", toBase: 0.001 },
    { id: "l", label: "Litre", symbol: "l", toBase: 1 },
    { id: "tsp", label: "Teaspoon (US)", symbol: "tsp", toBase: 0.00492892159375 },
    { id: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", toBase: 0.01478676478125 },
    { id: "cup", label: "Cup (US)", symbol: "cup", toBase: 0.2365882365 },
    { id: "floz", label: "Fluid ounce (US)", symbol: "fl oz", toBase: 0.0295735295625 },
    { id: "gal", label: "Gallon (US)", symbol: "gal", toBase: 3.785411784 },
  ],
  area: [
    { id: "cm2", label: "Square centimetre", symbol: "cm²", toBase: 0.0001 },
    { id: "m2", label: "Square metre", symbol: "m²", toBase: 1 },
    { id: "km2", label: "Square kilometre", symbol: "km²", toBase: 1_000_000 },
    { id: "ft2", label: "Square foot", symbol: "ft²", toBase: 0.09290304 },
    { id: "ac", label: "Acre", symbol: "ac", toBase: 4046.8564224 },
    { id: "ha", label: "Hectare", symbol: "ha", toBase: 10000 },
  ],
  speed: [
    { id: "ms", label: "Metres / second", symbol: "m/s", toBase: 1 },
    { id: "kmh", label: "Kilometres / hour", symbol: "km/h", toBase: 1 / 3.6 },
    { id: "mph", label: "Miles / hour", symbol: "mph", toBase: 0.44704 },
    { id: "kn", label: "Knot", symbol: "kn", toBase: 0.514444 },
  ],
  data: [
    { id: "b", label: "Byte", symbol: "B", toBase: 1 },
    { id: "kb", label: "Kilobyte", symbol: "KB", toBase: 1000 },
    { id: "mb", label: "Megabyte", symbol: "MB", toBase: 1_000_000 },
    { id: "gb", label: "Gigabyte", symbol: "GB", toBase: 1_000_000_000 },
    { id: "tb", label: "Terabyte", symbol: "TB", toBase: 1_000_000_000_000 },
  ],
};

function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 0.0001 || abs >= 1_000_000_000)) {
    return n.toExponential(4);
  }
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return n.toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<CategoryId>("length");
  const [fromId, setFromId] = useState("cm");
  const [toId, setToId] = useState("in");
  const [inputValue, setInputValue] = useState("100");

  const units = UNITS[category];

  const handleCategory = (id: CategoryId) => {
    const next = UNITS[id];
    setCategory(id);
    setFromId(next[0].id);
    setToId(next[1]?.id ?? next[0].id);
  };

  const fromUnit = units.find((u) => u.id === fromId) ?? units[0];
  const toUnit = units.find((u) => u.id === toId) ?? units[1] ?? units[0];

  const parsed = parseFloat(inputValue);
  const valid = !isNaN(parsed);

  const result = useMemo(() => {
    if (!valid) return null;
    const base = parsed * fromUnit.toBase;
    return base / toUnit.toBase;
  }, [valid, parsed, fromUnit, toUnit]);

  const table = useMemo(() => {
    if (!valid) return [];
    const base = parsed * fromUnit.toBase;
    return units.map((u) => ({
      ...u,
      value: base / u.toBase,
    }));
  }, [valid, parsed, fromUnit, units]);

  const swap = () => {
    setFromId(toUnit.id);
    setToId(fromUnit.id);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          CATEGORY
        </span>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCategory(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                category === item.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label
            htmlFor="unit-from-value"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            FROM
          </label>
          <input
            id="unit-from-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent mb-2"
          />
          <select
            value={fromUnit.id}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-4 py-3 rounded-lg hover:bg-accent h-fit"
        >
          SWAP
        </button>

        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            TO
          </span>
          <div className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg bg-paper mb-2 min-h-[48px]">
            {result === null ? "—" : formatNumber(result)}
          </div>
          <select
            value={toUnit.id}
            onChange={(e) => setToId(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          RESULT
        </span>
        {result === null ? (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatNumber(result)}
            </span>
            <span className="font-mono text-sm text-paper/70">
              {toUnit.symbol}
            </span>
          </div>
        )}
        {valid && (
          <p className="font-mono text-xs text-paper/50 mt-2">
            {formatNumber(parsed)} {fromUnit.symbol} = {formatNumber(result ?? 0)}{" "}
            {toUnit.symbol}
          </p>
        )}
      </div>

      {table.length > 0 && (
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            ALL UNITS IN THIS CATEGORY
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {table.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setToId(row.id)}
                className={`text-left border rounded-lg px-3 py-3 ${
                  row.id === toUnit.id
                    ? "bg-accent/10 border-accent/30"
                    : "bg-paper border-ink/10 hover:border-accent"
                }`}
              >
                <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                  {row.symbol}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    row.id === toUnit.id ? "text-accent" : "text-ink"
                  }`}
                >
                  {formatNumber(row.value)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Length uses the
        international inch (exactly 2.54 cm). Volume uses US liquid
        measures. Data uses decimal SI (1 KB = 1,000 bytes).
      </div>
    </div>
  );
}