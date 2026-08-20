"use client";

import { useState, useEffect, useCallback } from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

interface StrengthInfo {
  label: string;
  color: string;
  bgColor: string;
  width: string;
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?/~",
  ambiguous: "l1IO0",
};

function getCharPool(opts: PasswordOptions): string {
  let pool = "";
  if (opts.uppercase) pool += CHAR_SETS.uppercase;
  if (opts.lowercase) pool += CHAR_SETS.lowercase;
  if (opts.numbers) pool += CHAR_SETS.numbers;
  if (opts.symbols) pool += CHAR_SETS.symbols;

  if (opts.excludeAmbiguous) {
    pool = pool
      .split("")
      .filter((c) => !CHAR_SETS.ambiguous.includes(c))
      .join("");
  }

  return pool;
}

function generatePassword(opts: PasswordOptions): string {
  const pool = getCharPool(opts);
  if (pool.length === 0) return "";

  // Usa Web Crypto API (criptograficamente seguro)
  const array = new Uint32Array(opts.length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < opts.length; i++) {
    password += pool[array[i] % pool.length];
  }

  return password;
}

function calculateStrength(password: string, opts: PasswordOptions): StrengthInfo {
  if (!password) {
    return { label: "—", color: "text-ink/40", bgColor: "bg-ink/10", width: "0%" };
  }

  const pool = getCharPool(opts);
  // Entropia em bits: log2(pool^length)
  const entropy = password.length * Math.log2(pool.length || 1);

  if (entropy < 40) {
    return { label: "WEAK", color: "text-red-600", bgColor: "bg-red-500", width: "25%" };
  } else if (entropy < 60) {
    return {
      label: "FAIR",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500",
      width: "50%",
    };
  } else if (entropy < 80) {
    return {
      label: "STRONG",
      color: "text-green-600",
      bgColor: "bg-green-500",
      width: "75%",
    };
  } else {
    return {
      label: "VERY STRONG",
      color: "text-accent",
      bgColor: "bg-accent",
      width: "100%",
    };
  }
}

export default function PasswordGeneratorClient() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });

  const [password, setPassword] = useState("");
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    trackToolUsed("password-generator", "generators");
    setPassword(generatePassword(options));
    setBulkPasswords([]);
    setCopied(false);
  }, [options]);

  const generateBulk = () => {
    const list = Array.from({ length: 10 }, () => generatePassword(options));
    setBulkPasswords(list);
    setPassword("");
  };

  // Gera automaticamente ao abrir/alterar opções
  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = async (text: string, index: number | null = null) => {
    trackCopy("password-generator", "generators");
    try {
      await navigator.clipboard.writeText(text);
      if (index === null) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch {
      // Fallback silencioso — alguns navegadores restringem clipboard
    }
  };

  const noneSelected =
    !options.uppercase &&
    !options.lowercase &&
    !options.numbers &&
    !options.symbols;

  const strength = calculateStrength(password, options);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Visor principal com senha */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            YOUR PASSWORD
          </span>
          <button
            type="button"
            onClick={generate}
            className="font-mono text-[10px] tracking-widest text-accent hover:text-paper transition-colors"
            aria-label="Regenerate password"
          >
            ↻ REGENERATE
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-lg md:text-xl font-semibold text-accent break-all flex-1 min-w-0">
            {password || "—"}
          </span>
          {password && (
            <button
              type="button"
              onClick={() => copyToClipboard(password)}
              className={`font-mono text-xs tracking-widest rounded-full px-4 py-2 transition-colors whitespace-nowrap ${
                copied
                  ? "bg-accent text-paper"
                  : "bg-paper text-ink hover:bg-accent hover:text-paper"
              }`}
            >
              {copied ? "✓ COPIED" : "📋 COPY"}
            </button>
          )}
        </div>
      </div>

      {noneSelected && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
          <p className="text-sm text-accent font-medium">
            ⚠️ Select at least one character type below.
          </p>
        </div>
      )}

      {/* Indicador de força */}
      {password && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] tracking-widest text-ink/50">
              STRENGTH
            </span>
            <span className={`font-mono text-xs font-semibold ${strength.color}`}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.bgColor} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      )}

      {/* Slider de tamanho */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="length-slider"
            className="font-mono text-xs tracking-widest text-ink/60"
          >
            LENGTH
          </label>
          <span className="font-mono text-sm font-semibold text-accent">
            {options.length}
          </span>
        </div>
        <input
          id="length-slider"
          type="range"
          min="8"
          max="128"
          value={options.length}
          onChange={(e) =>
            setOptions({ ...options, length: parseInt(e.target.value) })
          }
          className="w-full accent-accent cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-ink/40 mt-1">
          <span>8</span>
          <span>32</span>
          <span>64</span>
          <span>128</span>
        </div>
      </div>

      {/* Checkboxes de tipos de caractere */}
      <div className="grid sm:grid-cols-2 gap-2">
        <CheckboxOption
          label="Uppercase (A-Z)"
          checked={options.uppercase}
          onChange={(v) => setOptions({ ...options, uppercase: v })}
        />
        <CheckboxOption
          label="Lowercase (a-z)"
          checked={options.lowercase}
          onChange={(v) => setOptions({ ...options, lowercase: v })}
        />
        <CheckboxOption
          label="Numbers (0-9)"
          checked={options.numbers}
          onChange={(v) => setOptions({ ...options, numbers: v })}
        />
        <CheckboxOption
          label="Symbols (!@#$...)"
          checked={options.symbols}
          onChange={(v) => setOptions({ ...options, symbols: v })}
        />
        <CheckboxOption
          label="Exclude ambiguous (l, 1, I, O, 0)"
          checked={options.excludeAmbiguous}
          onChange={(v) => setOptions({ ...options, excludeAmbiguous: v })}
          fullWidth
        />
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={generate}
          disabled={noneSelected}
          className="font-mono text-xs tracking-widest bg-deep text-paper hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-full px-6 py-3"
        >
          ↻ GENERATE NEW
        </button>
        <button
          type="button"
          onClick={generateBulk}
          disabled={noneSelected}
          className="font-mono text-xs tracking-widest bg-paper text-ink border border-ink/15 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-full px-6 py-3"
        >
          + GENERATE 10 AT ONCE
        </button>
      </div>

      {/* Lista em massa */}
      {bulkPasswords.length > 0 && (
        <div className="border-t border-ink/10 pt-4">
          <p className="font-mono text-xs tracking-widest text-ink/50 mb-3">
            10 PASSWORDS GENERATED
          </p>
          <div className="space-y-2">
            {bulkPasswords.map((pw, i) => (
              <div
                key={i}
                className="bg-paper border border-ink/10 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="font-mono text-xs text-ink/40 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm text-ink flex-1 break-all">
                  {pw}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pw, i)}
                  className={`font-mono text-[10px] tracking-widest rounded-full px-3 py-1 transition-colors whitespace-nowrap ${
                    copiedIndex === i
                      ? "bg-accent text-paper"
                      : "bg-white text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {copiedIndex === i ? "✓" : "COPY"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
  fullWidth = false,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  fullWidth?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-3 py-2.5 hover:border-accent transition-colors ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent cursor-pointer"
      />
      <span className="text-sm text-ink select-none">{label}</span>
    </label>
  );
}