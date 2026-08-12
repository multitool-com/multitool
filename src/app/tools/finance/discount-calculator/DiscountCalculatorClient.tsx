"use client";

import { useState, useMemo } from "react";

type Currency = "USD" | "EUR" | "GBP" | "BRL";
type Mode = "standard" | "reverse";

interface StandardResult {
  originalPrice: number;
  discountAmount: number;
  salePrice: number;
  effectiveDiscount: number;
  savings: number;
}

interface ReverseResult {
  originalPrice: number;
  salePrice: number;
  discountAmount: number;
  discountPercent: number;
}

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

export default function DiscountCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [mode, setMode] = useState<Mode>("standard");
  const [doubleDiscount, setDoubleDiscount] = useState(false);

  // Standard mode
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount1, setDiscount1] = useState("");
  const [discount2, setDiscount2] = useState("");

  // Reverse mode
  const [reverseOriginal, setReverseOriginal] = useState("");
  const [reverseSale, setReverseSale] = useState("");

  const symbol = currencySymbols[currency];

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Standard calculation
  const standardResult = useMemo<StandardResult | null>(() => {
    const p = parseFloat(originalPrice);
    const d1 = parseFloat(discount1);

    if (isNaN(p) || isNaN(d1) || p <= 0 || d1 < 0 || d1 > 100) return null;

    let salePrice = p * (1 - d1 / 100);

    if (doubleDiscount) {
      const d2 = parseFloat(discount2);
      if (isNaN(d2) || d2 < 0 || d2 > 100) return null;
      salePrice = salePrice * (1 - d2 / 100);
    }

    const discountAmount = p - salePrice;
    const effectiveDiscount = (discountAmount / p) * 100;

    return {
      originalPrice: p,
      discountAmount,
      salePrice,
      effectiveDiscount,
      savings: discountAmount,
    };
  }, [originalPrice, discount1, discount2, doubleDiscount]);

  // Reverse calculation
  const reverseResult = useMemo<ReverseResult | null>(() => {
    const orig = parseFloat(reverseOriginal);
    const sale = parseFloat(reverseSale);

    if (isNaN(orig) || isNaN(sale) || orig <= 0 || sale < 0 || sale > orig)
      return null;

    const discountAmount = orig - sale;
    const discountPercent = (discountAmount / orig) * 100;

    return {
      originalPrice: orig,
      salePrice: sale,
      discountAmount,
      discountPercent,
    };
  }, [reverseOriginal, reverseSale]);

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

      {/* Toggle de modo */}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => setMode("standard")}
          className={`font-mono text-xs tracking-widest px-5 py-2 rounded-full transition-colors ${
            mode === "standard"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          STANDARD
        </button>
        <button
          type="button"
          onClick={() => setMode("reverse")}
          className={`font-mono text-xs tracking-widest px-5 py-2 rounded-full transition-colors ${
            mode === "reverse"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          REVERSE (FIND %)
        </button>
      </div>

      {/* ==================== STANDARD MODE ==================== */}
      {mode === "standard" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="orig-price"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                ORIGINAL PRICE ({symbol})
              </label>
              <input
                id="orig-price"
                type="number"
                inputMode="decimal"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="disc-1"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                {doubleDiscount ? "FIRST DISCOUNT (%)" : "DISCOUNT (%)"}
              </label>
              <input
                id="disc-1"
                type="number"
                inputMode="decimal"
                value={discount1}
                onChange={(e) => setDiscount1(e.target.value)}
                placeholder="25"
                min="0"
                max="100"
                step="0.1"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Toggle double discount */}
          <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3 hover:border-accent transition-colors w-fit mx-auto">
            <input
              type="checkbox"
              checked={doubleDiscount}
              onChange={(e) => setDoubleDiscount(e.target.checked)}
              className="w-4 h-4 accent-accent cursor-pointer"
            />
            <span className="text-sm text-ink select-none">
              Apply a second discount (stacked promotion)
            </span>
          </label>

          {doubleDiscount && (
            <div>
              <label
                htmlFor="disc-2"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                SECOND DISCOUNT (%)
              </label>
              <input
                id="disc-2"
                type="number"
                inputMode="decimal"
                value={discount2}
                onChange={(e) => setDiscount2(e.target.value)}
                placeholder="20"
                min="0"
                max="100"
                step="0.1"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {/* Visor principal — Preço final */}
          <div className="bg-deep rounded-lg px-5 py-4">
            <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
              FINAL PRICE
            </span>
            {standardResult ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-sm text-paper/70">
                  {symbol}
                </span>
                <span className="font-mono text-5xl font-semibold text-accent">
                  {formatMoney(standardResult.salePrice)}
                </span>
              </div>
            ) : (
              <span className="font-mono text-4xl font-semibold text-paper/30">
                —
              </span>
            )}
          </div>

          {/* Detalhes */}
          {standardResult && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatBlock
                  label="ORIGINAL"
                  value={`${symbol} ${formatMoney(standardResult.originalPrice)}`}
                />
                <StatBlock
                  label="YOU SAVE"
                  value={`${symbol} ${formatMoney(standardResult.savings)}`}
                  highlight
                />
                <StatBlock
                  label="EFFECTIVE DISCOUNT"
                  value={`${standardResult.effectiveDiscount.toFixed(1)}%`}
                  highlight
                />
              </div>

              {/* Aviso de double discount */}
              {doubleDiscount &&
                standardResult.effectiveDiscount > 0 &&
                discount1 &&
                discount2 && (
                  <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
                    <strong className="text-ink">💡 Did you know?</strong>{" "}
                    Stacking {discount1}% + {discount2}% is{" "}
                    <strong className="text-accent">
                      {standardResult.effectiveDiscount.toFixed(1)}%
                    </strong>{" "}
                    total (not{" "}
                    {(
                      parseFloat(discount1) + parseFloat(discount2)
                    ).toFixed(1)}
                    %). Discounts multiply, they don&apos;t add.
                  </div>
                )}
            </>
          )}

          {!standardResult && (
            <p className="text-sm text-ink/50 text-center italic">
              Enter the original price and discount percentage to calculate.
            </p>
          )}
        </>
      )}

      {/* ==================== REVERSE MODE ==================== */}
      {mode === "reverse" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rev-orig"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                ORIGINAL PRICE ({symbol})
              </label>
              <input
                id="rev-orig"
                type="number"
                inputMode="decimal"
                value={reverseOriginal}
                onChange={(e) => setReverseOriginal(e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="rev-sale"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                SALE PRICE ({symbol})
              </label>
              <input
                id="rev-sale"
                type="number"
                inputMode="decimal"
                value={reverseSale}
                onChange={(e) => setReverseSale(e.target.value)}
                placeholder="75"
                min="0"
                step="0.01"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Visor principal — % de desconto */}
          <div className="bg-deep rounded-lg px-5 py-4">
            <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
              DISCOUNT PERCENTAGE
            </span>
            {reverseResult ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-5xl font-semibold text-accent">
                  {reverseResult.discountPercent.toFixed(1)}
                </span>
                <span className="font-mono text-2xl text-paper/70">%</span>
                <span className="font-mono text-sm text-paper/60 ml-2">
                  OFF
                </span>
              </div>
            ) : (
              <span className="font-mono text-4xl font-semibold text-paper/30">
                —
              </span>
            )}
          </div>

          {reverseResult && (
            <div className="grid grid-cols-2 gap-3">
              <StatBlock
                label="YOU SAVE"
                value={`${symbol} ${formatMoney(reverseResult.discountAmount)}`}
                highlight
              />
              <StatBlock
                label="YOU PAY"
                value={`${symbol} ${formatMoney(reverseResult.salePrice)}`}
              />
            </div>
          )}

          {!reverseResult && (
            <p className="text-sm text-ink/50 text-center italic">
              Enter both prices to find the discount percentage.
            </p>
          )}
        </>
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