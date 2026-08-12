"use client";

import { useState, useMemo } from "react";

type Currency = "USD" | "EUR" | "GBP" | "BRL";

interface TipResult {
  billAmount: number;
  tipAmount: number;
  totalAmount: number;
  perPersonAmount: number;
  numberOfPeople: number;
  effectiveTipPercent: number;
}

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

const TIP_PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const symbol = currencySymbols[currency];

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const result = useMemo<TipResult | null>(() => {
    const bill = parseFloat(billAmount);
    if (isNaN(bill) || bill <= 0) return null;

    const rawTip = bill * (tipPercent / 100);
    let total = bill + rawTip;
    let tipAmount = rawTip;

    if (roundUp) {
      const rounded = Math.ceil(total);
      const extra = rounded - total;
      total = rounded;
      tipAmount = rawTip + extra;
    }

    const perPersonAmount = people > 0 ? total / people : total;
    const effectiveTipPercent = (tipAmount / bill) * 100;

    return {
      billAmount: bill,
      tipAmount,
      totalAmount: total,
      perPersonAmount,
      numberOfPeople: people,
      effectiveTipPercent,
    };
  }, [billAmount, tipPercent, people, roundUp]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Seletor de moeda */}
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

      {/* Bill amount */}
      <div>
        <label
          htmlFor="bill-amount"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          BILL AMOUNT ({symbol})
        </label>
        <input
          id="bill-amount"
          type="number"
          inputMode="decimal"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          placeholder="50.00"
          min="0"
          step="0.01"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Tip preset buttons */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            TIP PERCENTAGE
          </span>
          <span className="font-mono text-sm font-semibold text-accent">
            {tipPercent}%
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {TIP_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTipPercent(preset)}
              className={`font-mono text-xs tracking-widest px-2 py-2.5 rounded-lg transition-colors ${
                tipPercent === preset
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
        {/* Slider para ajuste fino */}
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={tipPercent}
          onChange={(e) => setTipPercent(parseInt(e.target.value))}
          className="w-full accent-accent cursor-pointer"
          aria-label="Fine-tune tip percentage"
        />
        <div className="flex justify-between text-[10px] font-mono text-ink/40 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Split between people */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            SPLIT BETWEEN
          </span>
          <span className="font-mono text-sm font-semibold text-accent">
            {people} {people === 1 ? "person" : "people"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople(Math.max(1, people - 1))}
            className="font-mono text-lg bg-paper text-ink border border-ink/15 hover:border-accent hover:text-accent rounded-lg w-10 h-10 transition-colors flex items-center justify-center"
            aria-label="Decrease number of people"
          >
            −
          </button>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={people}
            onChange={(e) => setPeople(parseInt(e.target.value))}
            className="flex-1 accent-accent cursor-pointer"
            aria-label="Number of people to split between"
          />
          <button
            type="button"
            onClick={() => setPeople(Math.min(20, people + 1))}
            className="font-mono text-lg bg-paper text-ink border border-ink/15 hover:border-accent hover:text-accent rounded-lg w-10 h-10 transition-colors flex items-center justify-center"
            aria-label="Increase number of people"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-ink/40 mt-1">
          <span>1</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>

      {/* Round up toggle */}
      <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3 hover:border-accent transition-colors w-fit mx-auto">
        <input
          type="checkbox"
          checked={roundUp}
          onChange={(e) => setRoundUp(e.target.checked)}
          className="w-4 h-4 accent-accent cursor-pointer"
        />
        <span className="text-sm text-ink select-none">
          Round up total (to nearest whole number)
        </span>
      </label>

      {/* Visor principal — Per person */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          {people === 1 ? "TOTAL AMOUNT" : "PER PERSON"}
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">{symbol}</span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.perPersonAmount)}
            </span>
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {/* Breakdown */}
      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatBlock
              label="BILL"
              value={`${symbol} ${formatMoney(result.billAmount)}`}
            />
            <StatBlock
              label="TIP AMOUNT"
              value={`${symbol} ${formatMoney(result.tipAmount)}`}
              highlight
            />
            <StatBlock
              label="TOTAL"
              value={`${symbol} ${formatMoney(result.totalAmount)}`}
              highlight
            />
          </div>

          {/* Aviso de round-up */}
          {roundUp && result.effectiveTipPercent !== tipPercent && (
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
              <strong className="text-ink">💡 Round up applied:</strong> Your
              effective tip is{" "}
              <strong className="text-accent">
                {result.effectiveTipPercent.toFixed(1)}%
              </strong>{" "}
              (instead of {tipPercent}%). Total rounded to{" "}
              <strong>
                {symbol} {formatMoney(result.totalAmount)}
              </strong>
              .
            </div>
          )}

          {/* Split info */}
          {people > 1 && (
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
              <strong className="text-ink">👥 Split evenly:</strong> Each of
              the {people} people pays{" "}
              <strong className="text-accent">
                {symbol} {formatMoney(result.perPersonAmount)}
              </strong>
              .
            </div>
          )}
        </>
      )}

      {!result && (
        <p className="text-sm text-ink/50 text-center italic">
          Enter the bill amount to calculate the tip.
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