"use client";

import { useMemo, useState } from "react";

type Currency = "USD" | "EUR" | "GBP" | "BRL";
type Mode = "net" | "gross";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

const PRESETS = [5, 7, 10, 12, 18, 20, 21, 28];

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function VatCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [mode, setMode] = useState<Mode>("net");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("20");

  const symbol = currencySymbols[currency];

  const result = useMemo(() => {
    const value = parseFloat(amount);
    const r = parseFloat(rate);
    if (isNaN(value) || isNaN(r) || value < 0 || r < 0) return null;

    if (mode === "net") {
      const tax = value * (r / 100);
      return { net: value, tax, gross: value + tax };
    }
    const net = value / (1 + r / 100);
    return { net, tax: value - net, gross: value };
  }, [amount, rate, mode]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(currencySymbols) as Currency[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              currency === c
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            {currencySymbols[c]} {c}
          </button>
        ))}
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          AMOUNT IS
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMode("net")}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              mode === "net"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            NET (TAX EXCLUSIVE)
          </button>
          <button
            type="button"
            onClick={() => setMode("gross")}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              mode === "gross"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            GROSS (TAX INCLUSIVE)
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="vat-amount"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            AMOUNT ({symbol})
          </label>
          <input
            id="vat-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label
            htmlFor="vat-rate"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            TAX RATE (%)
          </label>
          <input
            id="vat-rate"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          PRESETS
        </span>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRate(String(p))}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                rate === String(p)
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          GROSS (WITH TAX)
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">{symbol}</span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.gross)}
            </span>
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBlock
            label="NET"
            value={`${symbol} ${formatMoney(result.net)}`}
          />
          <StatBlock
            label="TAX"
            value={`${symbol} ${formatMoney(result.tax)}`}
            highlight
          />
          <StatBlock
            label="GROSS"
            value={`${symbol} ${formatMoney(result.gross)}`}
            highlight
          />
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Illustration only.
        Confirm the official rate for your country, state and product.
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