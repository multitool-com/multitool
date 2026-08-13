"use client";

import { useEffect, useMemo, useState } from "react";

type Code =
  | "USD"
  | "EUR"
  | "GBP"
  | "BRL"
  | "INR"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "MXN"
  | "CNY";

const CURRENCIES: { code: Code; label: string; symbol: string }[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "MXN", label: "Mexican Peso", symbol: "MX$" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
];

const FALLBACK_USD: Record<Code, number> = {
  USD: 1,
  EUR: 0.86,
  GBP: 0.74,
  BRL: 5.45,
  INR: 83.5,
  JPY: 147,
  CAD: 1.37,
  AUD: 1.53,
  CHF: 0.8,
  MXN: 18.2,
  CNY: 7.2,
};

function formatMoney(value: number, code: Code): string {
  const digits = code === "JPY" ? 0 : value >= 100 ? 2 : 4;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: code === "JPY" ? 0 : 2,
    maximumFractionDigits: digits,
  });
}

export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<Code>("USD");
  const [to, setTo] = useState<Code>("BRL");
  const [usdRates, setUsdRates] = useState<Record<Code, number>>(FALLBACK_USD);
  const [source, setSource] = useState<"live" | "fallback">("fallback");
  const [asOf, setAsOf] = useState("built-in table");

  useEffect(() => {
    let cancelled = false;

    fetch("https://api.frankfurter.app/latest?from=USD")
      .then((res) => {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.rates) return;
        const next: Record<Code, number> = { ...FALLBACK_USD, USD: 1 };
        (Object.keys(FALLBACK_USD) as Code[]).forEach((code) => {
          if (code === "USD") return;
          if (typeof data.rates[code] === "number") {
            next[code] = data.rates[code];
          }
        });
        setUsdRates(next);
        setSource("live");
        setAsOf(data.date || "live");
      })
      .catch(() => {
        if (!cancelled) {
          setSource("fallback");
          setAsOf("built-in table");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const parsed = parseFloat(amount);
  const valid = !isNaN(parsed) && parsed >= 0;

  const result = useMemo(() => {
    if (!valid) return null;
    const inUsd = parsed / usdRates[from];
    const converted = inUsd * usdRates[to];
    const rate = usdRates[to] / usdRates[from];
    return { converted, rate };
  }, [valid, parsed, from, to, usdRates]);

  const fromMeta = CURRENCIES.find((c) => c.code === from)!;
  const toMeta = CURRENCIES.find((c) => c.code === to)!;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          QUICK PAIR
        </span>
        <div className="flex gap-2 flex-wrap">
          {(["USD", "EUR", "GBP", "BRL", "INR"] as Code[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setFrom(code)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                from === code
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="fx-amount"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          AMOUNT
        </label>
        <input
          id="fx-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label
            htmlFor="fx-from"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            FROM
          </label>
          <select
            id="fx-from"
            value={from}
            onChange={(e) => setFrom(e.target.value as Code)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-4 py-3 rounded-lg hover:bg-accent h-fit"
        >
          SWAP
        </button>

        <div>
          <label
            htmlFor="fx-to"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            TO
          </label>
          <select
            id="fx-to"
            value={to}
            onChange={(e) => setTo(e.target.value as Code)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          CONVERTED AMOUNT
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">
              {toMeta.symbol}
            </span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.converted, to)}
            </span>
            <span className="font-mono text-sm text-paper/70">{to}</span>
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
            label="RATE"
            value={`1 ${from} = ${result.rate.toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })} ${to}`}
            highlight
          />
          <StatBlock label="FROM" value={`${fromMeta.symbol} ${from}`} />
          <StatBlock label="TO" value={`${toMeta.symbol} ${to}`} highlight />
          <StatBlock
            label="RATES"
            value={source === "live" ? "LIVE (ECB)" : "FALLBACK"}
          />
          <StatBlock label="AS OF" value={asOf} />
          <StatBlock
            label="AMOUNT"
            value={`${fromMeta.symbol} ${formatMoney(parsed, from)}`}
          />
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Indicative mid-market
        rates, not a bank quote. Your amount stays in the browser. Live
        rates come from the ECB (Frankfurter) when the request succeeds.
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