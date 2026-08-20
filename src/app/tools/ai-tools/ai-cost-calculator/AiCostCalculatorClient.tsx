"use client";

import { useMemo, useState, useEffect, useRef} from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";

type Currency = "USD" | "EUR" | "GBP" | "BRL";
type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-sonnet"
  | "claude-opus"
  | "gemini-flash"
  | "gemini-pro";

interface ModelInfo {
  id: ModelId;
  label: string;
  inputUsd: number;
  outputUsd: number;
}

const MODELS: ModelInfo[] = [
  { id: "gpt-4o", label: "GPT-4O", inputUsd: 2.5, outputUsd: 10 },
  { id: "gpt-4o-mini", label: "GPT-4O MINI", inputUsd: 0.15, outputUsd: 0.6 },
  { id: "claude-sonnet", label: "CLAUDE SONNET", inputUsd: 3, outputUsd: 15 },
  { id: "claude-opus", label: "CLAUDE OPUS", inputUsd: 15, outputUsd: 75 },
  { id: "gemini-flash", label: "GEMINI FLASH", inputUsd: 0.075, outputUsd: 0.3 },
  { id: "gemini-pro", label: "GEMINI PRO", inputUsd: 1.25, outputUsd: 10 },
];

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
};

const usdToCurrency: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BRL: 5.5,
};

const DAYS_PER_MONTH = 30;

function formatMoney(value: number, currency: Currency): string {
  const converted = value * usdToCurrency[currency];
  const digits = converted > 0 && converted < 0.01 ? 4 : 2;
  return converted.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function parsePositive(value: string): number | null {
  const n = parseFloat(value);
  if (isNaN(n) || n < 0) return null;
  return n;
}

export default function AiCostCalculatorClient() {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackToolUsed("ai-cost-calculator", "ai-tools");
  }, []);

  const [currency, setCurrency] = useState<Currency>("USD");
  const [modelId, setModelId] = useState<ModelId>("gpt-4o");
  const [inputTokens, setInputTokens] = useState("1500");
  const [outputTokens, setOutputTokens] = useState("400");
  const [requestsPerDay, setRequestsPerDay] = useState("100");
  const [inputPrice, setInputPrice] = useState("2.50");
  const [outputPrice, setOutputPrice] = useState("10.00");

  const symbol = currencySymbols[currency];

  const handleModelChange = (id: ModelId) => {
    const next = MODELS.find((item) => item.id === id) ?? MODELS[0];
    setModelId(id);
    setInputPrice(next.inputUsd.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""));
    setOutputPrice(
      next.outputUsd.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")
    );
  };

  const result = useMemo(() => {
    const inTok = parsePositive(inputTokens);
    const outTok = parsePositive(outputTokens);
    const reqDay = parsePositive(requestsPerDay);
    const inPrice = parsePositive(inputPrice);
    const outPrice = parsePositive(outputPrice);

    if (
      inTok === null ||
      outTok === null ||
      reqDay === null ||
      inPrice === null ||
      outPrice === null ||
      reqDay === 0
    ) {
      return null;
    }

    const requestsMonth = reqDay * DAYS_PER_MONTH;
    const inputTokensMonth = inTok * requestsMonth;
    const outputTokensMonth = outTok * requestsMonth;
    const inputCostMonth = (inputTokensMonth / 1_000_000) * inPrice;
    const outputCostMonth = (outputTokensMonth / 1_000_000) * outPrice;
    const month = inputCostMonth + outputCostMonth;
    const day = month / DAYS_PER_MONTH;
    const year = month * 12;

    return {
      requestsMonth,
      inputTokensMonth,
      outputTokensMonth,
      inputCostMonth,
      outputCostMonth,
      day,
      month,
      year,
    };
  }, [inputTokens, outputTokens, requestsPerDay, inputPrice, outputPrice]);

  const comparison = useMemo(() => {
    const inTok = parsePositive(inputTokens);
    const outTok = parsePositive(outputTokens);
    const reqDay = parsePositive(requestsPerDay);
    if (inTok === null || outTok === null || reqDay === null || reqDay === 0) {
      return [];
    }
    const requestsMonth = reqDay * DAYS_PER_MONTH;
    return MODELS.map((model) => {
      const inputCost =
        (inTok * requestsMonth / 1_000_000) * model.inputUsd;
      const outputCost =
        (outTok * requestsMonth / 1_000_000) * model.outputUsd;
      return {
        id: model.id,
        label: model.label,
        month: inputCost + outputCost,
      };
    }).sort((a, b) => a.month - b.month);
  }, [inputTokens, outputTokens, requestsPerDay]);

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
          MODEL
        </span>
        <div className="flex gap-2 flex-wrap">
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleModelChange(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                modelId === item.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <NumberField
          id="input-tokens"
          label="INPUT TOKENS / REQUEST"
          value={inputTokens}
          onChange={setInputTokens}
          placeholder="1500"
        />
        <NumberField
          id="output-tokens"
          label="OUTPUT TOKENS / REQUEST"
          value={outputTokens}
          onChange={setOutputTokens}
          placeholder="400"
        />
        <NumberField
          id="requests-day"
          label="REQUESTS PER DAY"
          value={requestsPerDay}
          onChange={setRequestsPerDay}
          placeholder="100"
        />
        <NumberField
          id="input-price"
          label={`INPUT PRICE / 1M (${symbol})`}
          value={inputPrice}
          onChange={setInputPrice}
          placeholder="2.50"
          step="0.001"
        />
        <NumberField
          id="output-price"
          label={`OUTPUT PRICE / 1M (${symbol})`}
          value={outputPrice}
          onChange={setOutputPrice}
          placeholder="10.00"
          step="0.001"
        />
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          ESTIMATED MONTHLY COST
        </span>
        {result ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-paper/70">{symbol}</span>
            <span className="font-mono text-5xl font-semibold text-accent">
              {formatMoney(result.month, currency)}
            </span>
            <span className="font-mono text-sm text-paper/70">/ month</span>
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
            label="PER DAY"
            value={`${symbol} ${formatMoney(result.day, currency)}`}
          />
          <StatBlock
            label="PER YEAR"
            value={`${symbol} ${formatMoney(result.year, currency)}`}
            highlight
          />
          <StatBlock
            label="INPUT COST / MO"
            value={`${symbol} ${formatMoney(result.inputCostMonth, currency)}`}
          />
          <StatBlock
            label="OUTPUT COST / MO"
            value={`${symbol} ${formatMoney(result.outputCostMonth, currency)}`}
          />
          <StatBlock
            label="REQUESTS / MONTH"
            value={result.requestsMonth.toLocaleString("en-US")}
          />
          <StatBlock
            label="TOKENS / MONTH"
            value={(
              result.inputTokensMonth + result.outputTokensMonth
            ).toLocaleString("en-US")}
            sublabel={`${result.inputTokensMonth.toLocaleString("en-US")} in + ${result.outputTokensMonth.toLocaleString("en-US")} out`}
          />
        </div>
      )}

      {comparison.length > 0 && (
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            SAME VOLUME ON OTHER MODELS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {comparison.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg px-3 py-3 ${
                  item.id === modelId
                    ? "bg-accent/10 border-accent/30"
                    : "bg-paper border-ink/10"
                }`}
              >
                <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                  {item.label}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    item.id === modelId ? "text-accent" : "text-ink"
                  }`}
                >
                  {symbol} {formatMoney(item.month, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Defaults are public
        standard API list prices in USD (uncached). Currency conversion uses
        indicative rates. Override the $/1M fields to match your invoice.
        ChatGPT Plus / Claude Pro subscriptions are not included.
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  step = "1",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  step?: string;
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
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}

function StatBlock({
  label,
  value,
  sublabel,
  highlight = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
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
      {sublabel && (
        <span className="font-mono text-[9px] text-ink/40 block mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}