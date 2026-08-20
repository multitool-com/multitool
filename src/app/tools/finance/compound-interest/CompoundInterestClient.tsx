"use client";

import { useMemo, useState, useEffect, useRef} from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";

type Currency = "USD" | "EUR" | "GBP" | "BRL";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

const FREQUENCIES: { id: number; label: string }[] = [
  { id: 1, label: "YEARLY" },
  { id: 2, label: "SEMI-ANNUAL" },
  { id: 4, label: "QUARTERLY" },
  { id: 12, label: "MONTHLY" },
  { id: 365, label: "DAILY" },
];

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parsePositive(value: string): number | null {
  const n = parseFloat(value);
  if (isNaN(n) || n < 0) return null;
  return n;
}

export default function CompoundInterestClient() {

  const [currency, setCurrency] = useState<Currency>("USD");
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [n, setN] = useState(12);
  const [monthly, setMonthly] = useState("0");

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    if (
      currency !== "USD" ||
      principal !== "1000" ||
      rate !== "5" ||
      years !== "10" ||
      n !== 12 ||
      monthly !== "0"
    ) {
      firedRef.current = true;
      trackToolUsed("compound-interest", "finance");
    }
  }, [currency, principal, rate, years, n, monthly]);

  const symbol = currencySymbols[currency];

  const result = useMemo(() => {
    const P = parsePositive(principal);
    const rPct = parsePositive(rate);
    const t = parsePositive(years);
    const pmt = parsePositive(monthly);
    if (P === null || rPct === null || t === null || pmt === null) return null;
    if (t === 0 && pmt === 0) {
      return { future: P, interest: 0, contributed: P };
    }

    const r = rPct / 100;
    const periods = n * t;
    const i = r / n;
    let future = P;

    if (i === 0) {
      future = P + pmt * 12 * t;
    } else {
      future = P * Math.pow(1 + i, periods);
      if (pmt > 0) {
        const months = 12 * t;
        const monthlyRate = r / 12;
        if (monthlyRate === 0) {
          future += pmt * months;
        } else {
          future += pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
      }
    }

    const contributed = P + pmt * 12 * t;
    return {
      future,
      interest: future - contributed,
      contributed,
    };
  }, [principal, rate, years, n, monthly]);

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

      <div className="grid sm:grid-cols-2 gap-3">
        <Field
          id="ci-principal"
          label={`PRINCIPAL (${symbol})`}
          value={principal}
          onChange={setPrincipal}
        />
        <Field
          id="ci-rate"
          label="ANNUAL RATE (%)"
          value={rate}
          onChange={setRate}
        />
        <Field id="ci-years" label="YEARS" value={years} onChange={setYears} />
        <Field
          id="ci-monthly"
          label={`MONTHLY CONTRIBUTION (${symbol})`}
          value={monthly}
          onChange={setMonthly}
        />
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          COMPOUNDS
        </span>
        <div className="flex gap-2 flex-wrap">
          {FREQUENCIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setN(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                n === item.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          FUTURE VALUE
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">{symbol}</span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.future)}
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
            label="INTEREST EARNED"
            value={`${symbol} ${formatMoney(result.interest)}`}
            highlight
          />
          <StatBlock
            label="TOTAL CONTRIBUTED"
            value={`${symbol} ${formatMoney(result.contributed)}`}
          />
          <StatBlock
            label="GROWTH"
            value={
              result.contributed > 0
                ? `${((result.future / result.contributed - 1) * 100).toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 2 }
                  )}%`
                : "—"
            }
            highlight
          />
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Illustration only.
        Does not include taxes, fees or changing rates.
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
      />
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