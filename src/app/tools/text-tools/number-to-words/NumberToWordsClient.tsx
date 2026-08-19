"use client";

import { useState } from "react";

type Lang = "en" | "pt";

const ONES_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS_EN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALE_EN = ["", "thousand", "million", "billion", "trillion", "quadrillion"];

const ONES_PT = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const TENS_PT = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const SCALE_PT: { singular: string; plural: string }[] = [
  { singular: "", plural: "" },
  { singular: "mil", plural: "mil" },
  { singular: "milhão", plural: "milhões" },
  { singular: "bilhão", plural: "bilhões" },
  { singular: "trilhão", plural: "trilhões" },
  { singular: "quadrilhão", plural: "quadrilhões" },
];

function threeDigitsEn(n: number): string {
  if (n === 0) return "";
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) parts.push(ONES_EN[hundreds] + " hundred");
  if (rest) {
    if (rest < 20) parts.push(ONES_EN[rest]);
    else {
      const t = Math.floor(rest / 10);
      const o = rest % 10;
      parts.push(TENS_EN[t] + (o ? "-" + ONES_EN[o] : ""));
    }
  }
  return parts.join(" ");
}

function threeDigitsPt(n: number): string {
  if (n === 0) return "";
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) {
    if (hundreds === 1) parts.push(rest === 0 ? "cem" : "cento");
    else if (hundreds === 5) parts.push(rest === 0 ? "quinhentos" : "quinhentos");
    else parts.push(ONES_PT[hundreds] + "centos");
  }
  if (rest) {
    if (rest < 20) parts.push(ONES_PT[rest]);
    else {
      const t = Math.floor(rest / 10);
      const o = rest % 10;
      parts.push(TENS_PT[t] + (o ? " e " + ONES_PT[o] : ""));
    }
  }
  return parts.join(" e ");
}

/** Convert an integer (0..10^18) to words. lang: "en" | "pt". */
export function integerToWords(n: number, lang: Lang = "en"): string {
  if (!isFinite(n)) return lang === "pt" ? "número inválido" : "invalid number";
  const abs = Math.abs(Math.round(n));
  if (abs === 0) return lang === "pt" ? "zero" : "zero";
  const sign = n < 0 ? (lang === "pt" ? "menos " : "negative ") : "";

  const groups: number[] = [];
  let x = abs;
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }

  if (lang === "en") {
    const words: string[] = [];
    for (let i = groups.length - 1; i >= 0; i--) {
      if (groups[i] === 0) continue;
      const g = threeDigitsEn(groups[i]);
      words.push(g + (SCALE_EN[i] ? " " + SCALE_EN[i] : ""));
    }
    return sign + words.join(" ");
  }

  // Portuguese
  const words: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const g = threeDigitsPt(groups[i]);
    const sc = SCALE_PT[i];
    if (i === 0) {
      words.push(g);
    } else if (i === 1) {
      // mil: "um mil" é raro; normalmente só "mil"
      words.push(g === "um" ? "mil" : g + " mil");
    } else {
      const plural = groups[i] > 1;
      words.push(g + " " + (plural ? sc.plural : sc.singular));
    }
  }
  return sign + words.join(" e ");
}

const DIGIT_NAMES_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const DIGIT_NAMES_PT = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];

/** Convert any numeric string (decimals, negatives) to words. */
export function numberToWords(input: string, lang: Lang = "en"): string {
  const clean = input.trim().replace(/\s+/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(clean)) {
    return lang === "pt" ? "Digite um número válido." : "Enter a valid number.";
  }
  const num = parseFloat(clean);
  if (!isFinite(num)) return lang === "pt" ? "Número muito grande." : "Number too large.";
  const isNeg = clean.startsWith("-");
  const [intPart, decPart] = clean.replace("-", "").split(".");

  let out = integerToWords(parseFloat(intPart), lang);
  if (isNeg) out = (lang === "pt" ? "menos " : "negative ") + out;
  if (decPart) {
    const sep = lang === "pt" ? " vírgula " : " point ";
    const digits = decPart
      .split("")
      .map((d) => (lang === "pt" ? DIGIT_NAMES_PT[parseInt(d, 10)] : DIGIT_NAMES_EN[parseInt(d, 10)]))
      .join(" ");
    out += sep + digits;
  }
  return out;
}

export default function NumberToWordsClient() {
  const [input, setInput] = useState("1234567.89");
  const [lang, setLang] = useState<Lang>("en");
  const [copied, setCopied] = useState(false);

  const result = numberToWords(input, lang);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            lang === "en" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🇬🇧 ENGLISH
        </button>
        <button
          type="button"
          onClick={() => setLang("pt")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            lang === "pt" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🇧🇷 PORTUGUÊS
        </button>
      </div>

      <div>
        <label htmlFor="ntw-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          NUMBER
        </label>
        <input
          id="ntw-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1234.56"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col gap-3">
        <span className="font-mono text-xs tracking-widest text-ink/60">
          IN WORDS ({lang === "en" ? "ENGLISH" : "PORTUGUÊS"})
        </span>
        <p className="font-display text-xl font-semibold text-deep leading-relaxed min-h-[3rem]">
          {result}
        </p>
        <button
          type="button"
          onClick={copy}
          className="self-start bg-deep text-paper font-mono text-xs tracking-widest px-5 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          {copied ? "✓ COPIED" : "📋 COPY"}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[0, 42, 100, 101, 999, 1000, 2500, 1000000].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setInput(String(v))}
            className="font-mono text-xs px-3 py-1.5 rounded-full bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
          >
            {v.toLocaleString("en-US")}
          </button>
        ))}
      </div>
    </div>
  );
}
