"use client";

import { useMemo, useState } from "react";

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MortgageCalculatorClient() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("60000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(down);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(n) || p <= 0 || d < 0 || d >= p || r < 0 || n <= 0) {
      return null;
    }
    const principal = p - d;
    const monthly =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - principal;
    return { principal, monthly, total, interest, downPct: (d / p) * 100 };
  }, [price, down, rate, years]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="mort-price" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            HOME PRICE ($)
          </label>
          <input id="mort-price" type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label htmlFor="mort-down" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            DOWN PAYMENT ($)
          </label>
          <input id="mort-down" type="number" inputMode="decimal" value={down} onChange={(e) => setDown(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label htmlFor="mort-rate" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            ANNUAL INTEREST RATE (%)
          </label>
          <input id="mort-rate" type="number" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label htmlFor="mort-years" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            TERM (YEARS)
          </label>
          <input id="mort-years" type="number" inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          MONTHLY PAYMENT
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">$</span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.monthly)}
            </span>
          </div>
        ) : (
          <span className="font-mono text-5xl font-semibold text-accent">—</span>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBlock label="LOAN" value={`$${formatMoney(result.principal)}`} />
          <StatBlock label="TOTAL PAID" value={`$${formatMoney(result.total)}`} />
          <StatBlock label="TOTAL INTEREST" value={`$${formatMoney(result.interest)}`} highlight />
          <StatBlock label="DOWN %" value={`${result.downPct.toFixed(1)}%`} />
        </div>
      )}

      {result && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <strong className="text-ink">Note:</strong> this estimate excludes
          property taxes, insurance and fees, which vary by location. It is
          a guide, not a quote.
        </div>
      )}
    </div>
  );
}

function StatBlock({
  label, value, highlight = false,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-3 ${highlight ? "bg-accent/10 border-accent/30" : "bg-paper border-ink/10"}`}>
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? "text-accent" : "text-ink"}`}>{value}</span>
    </div>
  );
}
