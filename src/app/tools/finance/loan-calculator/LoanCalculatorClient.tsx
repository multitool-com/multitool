"use client";

import { useState, useMemo } from "react";

type Currency = "USD" | "EUR" | "GBP" | "BRL";
type TermUnit = "years" | "months";

interface LoanResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  principalPercent: number;
  interestPercent: number;
  yearlySchedule: YearlyBreakdown[];
}

interface YearlyBreakdown {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

function calculateLoan(
  principal: number,
  annualRate: number,
  months: number
): LoanResult | null {
  if (principal <= 0 || months <= 0) return null;

  const monthlyRate = annualRate / 100 / 12;
  let monthlyPayment: number;

  if (monthlyRate === 0) {
    // Sem juros: divide igualmente
    monthlyPayment = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  if (!isFinite(monthlyPayment)) return null;

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;

  // Amortização ano a ano
  const yearlySchedule: YearlyBreakdown[] = [];
  let balance = principal;
  const years = Math.ceil(months / 12);

  for (let year = 1; year <= years; year++) {
    let principalThisYear = 0;
    let interestThisYear = 0;
    const monthsThisYear = Math.min(12, months - (year - 1) * 12);

    for (let m = 0; m < monthsThisYear; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      interestThisYear += interestPayment;
      principalThisYear += principalPayment;
      balance -= principalPayment;
    }

    yearlySchedule.push({
      year,
      principalPaid: principalThisYear,
      interestPaid: interestThisYear,
      remainingBalance: Math.max(0, balance),
    });
  }

  const principalPercent = (principal / totalPaid) * 100;
  const interestPercent = (totalInterest / totalPaid) * 100;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    principalPercent,
    interestPercent,
    yearlySchedule,
  };
}

export default function LoanCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [termUnit, setTermUnit] = useState<TermUnit>("years");
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo<LoanResult | null>(() => {
    const p = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseFloat(term);

    if (isNaN(p) || isNaN(r) || isNaN(t)) return null;
    if (p <= 0 || t <= 0 || r < 0) return null;

    const months = termUnit === "years" ? t * 12 : t;
    return calculateLoan(p, r, months);
  }, [amount, rate, term, termUnit]);

  const symbol = currencySymbols[currency];

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="loan-amount"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            LOAN AMOUNT ({symbol})
          </label>
          <input
            id="loan-amount"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="20000"
            min="1"
            step="0.01"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="loan-rate"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            INTEREST RATE (% / YEAR)
          </label>
          <input
            id="loan-rate"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="6"
            min="0"
            max="100"
            step="0.01"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="loan-term"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            LOAN TERM
          </label>
          <input
            id="loan-term"
            type="number"
            inputMode="decimal"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="5"
            min="0"
            step="0.5"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            UNIT
          </label>
          <div className="flex gap-2 h-[46px]">
            <button
              type="button"
              onClick={() => setTermUnit("years")}
              className={`flex-1 font-mono text-xs tracking-widest rounded-lg transition-colors ${
                termUnit === "years"
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              YEARS
            </button>
            <button
              type="button"
              onClick={() => setTermUnit("months")}
              className={`flex-1 font-mono text-xs tracking-widest rounded-lg transition-colors ${
                termUnit === "months"
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              MONTHS
            </button>
          </div>
        </div>
      </div>

      {/* Visor principal — Pagamento mensal */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          MONTHLY PAYMENT
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">{symbol}</span>
            <span className="font-mono text-4xl font-semibold text-accent">
              {formatMoney(result.monthlyPayment)}
            </span>
          </div>
        ) : (
          <span className="font-mono text-4xl font-semibold text-paper/30">
            —
          </span>
        )}
      </div>

      {/* Totais */}
      {result && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
              <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                TOTAL PAID
              </span>
              <span className="font-mono text-lg font-semibold text-ink">
                {symbol} {formatMoney(result.totalPaid)}
              </span>
            </div>
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
              <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                TOTAL INTEREST
              </span>
              <span className="font-mono text-lg font-semibold text-accent">
                {symbol} {formatMoney(result.totalInterest)}
              </span>
            </div>
          </div>

          {/* Barra visual principal vs juros */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs font-mono">
              <span className="text-ink/60">
                PRINCIPAL {result.principalPercent.toFixed(1)}%
              </span>
              <span className="text-accent">
                INTEREST {result.interestPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-ink/10 rounded-full overflow-hidden flex">
              <div
                className="bg-deep"
                style={{ width: `${result.principalPercent}%` }}
              />
              <div
                className="bg-accent"
                style={{ width: `${result.interestPercent}%` }}
              />
            </div>
          </div>

          {/* Toggle da tabela */}
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="font-mono text-xs tracking-widest bg-paper border border-ink/15 hover:border-accent hover:text-accent rounded-full px-5 py-2 mx-auto transition-colors"
          >
            {showSchedule ? "− HIDE" : "+ SHOW"} AMORTIZATION SCHEDULE
          </button>

          {/* Tabela de amortização anual */}
          {showSchedule && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/15">
                    <th className="font-mono text-[10px] tracking-widest text-ink/50 text-left py-2 px-2">
                      YEAR
                    </th>
                    <th className="font-mono text-[10px] tracking-widest text-ink/50 text-right py-2 px-2">
                      PRINCIPAL
                    </th>
                    <th className="font-mono text-[10px] tracking-widest text-ink/50 text-right py-2 px-2">
                      INTEREST
                    </th>
                    <th className="font-mono text-[10px] tracking-widest text-ink/50 text-right py-2 px-2">
                      BALANCE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlySchedule.map((row) => (
                    <tr
                      key={row.year}
                      className="border-b border-ink/5 hover:bg-paper transition-colors"
                    >
                      <td className="font-mono py-2 px-2">{row.year}</td>
                      <td className="font-mono text-right py-2 px-2 text-ink/80">
                        {symbol} {formatMoney(row.principalPaid)}
                      </td>
                      <td className="font-mono text-right py-2 px-2 text-accent">
                        {symbol} {formatMoney(row.interestPaid)}
                      </td>
                      <td className="font-mono text-right py-2 px-2 font-semibold">
                        {symbol} {formatMoney(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!result && (
        <p className="text-sm text-ink/50 text-center italic">
          Enter loan amount, interest rate and term to see your payment.
        </p>
      )}
    </div>
  );
}