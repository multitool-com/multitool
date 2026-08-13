"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AngleMode = "deg" | "rad";

interface HistoryEntry {
  expr: string;
  result: string;
}

function toRad(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * Math.PI) / 180 : value;
}

function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "Error";
  if (Object.is(value, -0)) return "0";
  if (Number.isInteger(value) && Math.abs(value) < 1e15) {
    return value.toLocaleString("en-US");
  }
  if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-9 && value !== 0)) {
    return value.toExponential(8).replace(/(\.\d*?)0+e/, "$1e");
  }
  let s = value.toPrecision(12);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s;
}

const FUNCTIONS: { label: string; insert: string }[] = [
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "π", insert: "pi" },
  { label: "e", insert: "e" },
  { label: "asin", insert: "asin(" },
  { label: "acos", insert: "acos(" },
  { label: "atan", insert: "atan(" },
  { label: "ln", insert: "ln(" },
  { label: "log", insert: "log(" },
  { label: "√", insert: "sqrt(" },
  { label: "∛", insert: "cbrt(" },
  { label: "x²", insert: "^2" },
  { label: "xʸ", insert: "^" },
  { label: "1/x", insert: "1/(" },
];

type PadKind = "digit" | "op" | "fn" | "eq";

const PAD: { label: string; insert: string; kind: PadKind }[] = [
  { label: "(", insert: "(", kind: "fn" },
  { label: ")", insert: ")", kind: "fn" },
  { label: "C", insert: "__clear__", kind: "fn" },
  { label: "⌫", insert: "__backspace__", kind: "fn" },
  { label: "7", insert: "7", kind: "digit" },
  { label: "8", insert: "8", kind: "digit" },
  { label: "9", insert: "9", kind: "digit" },
  { label: "÷", insert: "÷", kind: "op" },
  { label: "4", insert: "4", kind: "digit" },
  { label: "5", insert: "5", kind: "digit" },
  { label: "6", insert: "6", kind: "digit" },
  { label: "×", insert: "×", kind: "op" },
  { label: "1", insert: "1", kind: "digit" },
  { label: "2", insert: "2", kind: "digit" },
  { label: "3", insert: "3", kind: "digit" },
  { label: "−", insert: "-", kind: "op" },
  { label: "0", insert: "0", kind: "digit" },
  { label: ".", insert: ".", kind: "digit" },
  { label: "+", insert: "+", kind: "op" },
  { label: "=", insert: "__equals__", kind: "eq" },
];

const KIND_CLASS: Record<PadKind, string> = {
  digit: "bg-paper text-ink border border-ink/10 hover:border-accent hover:text-accent",
  fn: "bg-white text-ink/70 border border-ink/10 hover:border-accent hover:text-accent",
  op: "bg-deep text-paper hover:bg-accent",
  eq: "bg-accent text-paper hover:opacity-90",
};

export default function ScientificCalculatorClient() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mode, setMode] = useState<AngleMode>("deg");
  const [error, setError] = useState<string | null>(null);
  const fresh = useRef(false); // true right after "="

  const MAX_LEN = 60;

  const append = useCallback((token: string) => {
    setExpr((current) => {
      let base = current;
      if (fresh.current && /^[0-9.(a-zπ]/.test(token)) {
        base = ""; // start a new calculation after "="
      }
      fresh.current = false;
      if (base.length >= MAX_LEN) return base;
      if (token === "." && /(^|[^0-9])$/.test(base)) return base + "0.";
      if (/[+\-×÷^]/.test(token) && /[+\-×÷^]$/.test(base)) {
        return base.slice(0, -1) + token;
      }
      if (token === "(" && /[0-9)]$/.test(base)) return base + "×(";
      if (/[0-9(]/.test(token) && base.endsWith(")")) return base + "×" + token;
      return base + token;
    });
    setError(null);
  }, []);

  const clear = useCallback(() => {
    setExpr("");
    setResult("");
    setError(null);
  }, []);

  const backspace = useCallback(() => {
    setExpr((current) => current.slice(0, -1));
  }, []);

  // Recursive-descent parser: precedence, unary minus, right-assoc powers,
  // implicit multiplication (2pi, 2(3+4)), functions and constants.
  const evaluate = useCallback(
    (source: string): number => {
      const s = source.replace(/×/g, "*").replace(/÷/g, "/");
      const tokens =
        s.match(
          /(?:\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?|[+\-*/^()]|[a-zA-Z]+)/g
        ) ?? [];
      if (tokens.length === 0) throw new Error("Empty expression");

      let pos = 0;
      const peek = () => tokens[pos];
      const next = () => tokens[pos++];

      const parseExpr = (): number => {
        let value = parseTerm();
        while (peek() === "+" || peek() === "-") {
          const op = next();
          const rhs = parseTerm();
          value = op === "+" ? value + rhs : value - rhs;
        }
        return value;
      };

      const parseTerm = (): number => {
        let value = parseFactor();
        while (
          peek() === "*" ||
          peek() === "/" ||
          (peek() !== undefined &&
            (peek() === "(" || /^[0-9.]/.test(peek()) || /^[a-zA-Z]/.test(peek())))
        ) {
          if (peek() === "*" || peek() === "/") {
            const op = next();
            const rhs = parseFactor();
            value = op === "*" ? value * rhs : value / rhs;
          } else {
            // implicit multiplication: 2pi = 2×π, 2(3) = 6
            value *= parseFactor();
          }
        }
        return value;
      };

      const parseFactor = (): number => {
        const base = parseUnary();
        if (peek() === "^") {
          next();
          // right-associative: 2^3^2 = 2^(3^2) = 512
          return Math.pow(base, parseFactor());
        }
        return base;
      };

      const parseUnary = (): number => {
        if (peek() === "-") {
          next();
          return -parseUnary();
        }
        if (peek() === "+") {
          next();
          return parseUnary();
        }
        return parsePrimary();
      };

      const parsePrimary = (): number => {
        const token = peek();
        if (token === undefined) throw new Error("Unexpected end");
        if (token === "(") {
          next();
          const v = parseExpr();
          if (next() !== ")") throw new Error("Missing closing parenthesis");
          return v;
        }
        if (/^[0-9.]/.test(token)) {
          next();
          const v = Number(token);
          if (Number.isNaN(v)) throw new Error(`Invalid number: ${token}`);
          return v;
        }
        next();
        switch (token) {
          case "pi":
          case "π":
            return Math.PI;
          case "e":
            return Math.E;
          case "sin":
            return Math.sin(toRad(parsePrimary(), mode));
          case "cos":
            return Math.cos(toRad(parsePrimary(), mode));
          case "tan":
            return Math.tan(toRad(parsePrimary(), mode));
          case "asin":
            return (180 / Math.PI) * Math.asin(parsePrimary());
          case "acos":
            return (180 / Math.PI) * Math.acos(parsePrimary());
          case "atan":
            return (180 / Math.PI) * Math.atan(parsePrimary());
          case "ln":
            return Math.log(parsePrimary());
          case "log":
            return Math.log10(parsePrimary());
          case "sqrt":
            return Math.sqrt(parsePrimary());
          case "cbrt":
            return Math.cbrt(parsePrimary());
          default:
            throw new Error(`Unknown: ${token}`);
        }
      };

      const value = parseExpr();
      if (pos !== tokens.length) throw new Error(`Unexpected: ${tokens[pos]}`);
      if (!Number.isFinite(value)) throw new Error("Math error (division by zero?)");
      return value;
    },
    [mode]
  );

  const calculate = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const value = evaluate(expr);
      const formatted = formatResult(value);
      setResult(formatted);
      setHistory((h) => [...h, { expr, result: formatted }].slice(-20));
      setExpr(formatted);
      fresh.current = true;
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid expression");
    }
  }, [expr, evaluate]);

  const handlePad = (insert: string) => {
    if (insert === "__clear__") return clear();
    if (insert === "__backspace__") return backspace();
    if (insert === "__equals__") return calculate();
    append(insert);
  };

  const clearHistory = () => setHistory([]);

  // keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculate();
        return;
      }
      if (e.key === "Backspace") {
        backspace();
        return;
      }
      if (e.key === "Escape") {
        clear();
        return;
      }
      if (/^[0-9.+\-*/^()]$/.test(e.key)) {
        const map: Record<string, string> = { "*": "×", "/": "÷" };
        append(map[e.key] ?? e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [append, calculate, backspace, clear]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
      {/* Display */}
      <div className="bg-deep rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            SCIENTIFIC — {mode === "deg" ? "DEGREES" : "RADIANS"}
          </span>
          <span className="font-mono text-[10px] text-paper/40 tracking-widest">
            KEYBOARD OK
          </span>
        </div>
        <div className="min-h-[4.5rem] flex flex-col justify-end">
          <p className="font-mono text-sm text-paper/60 break-all leading-snug text-right">
            {expr || "\u00A0"}
          </p>
          <p className="font-mono text-4xl font-semibold text-accent break-all leading-tight text-right">
            {result || "0"}
          </p>
        </div>
        {error && (
          <p className="font-mono text-xs text-accent mt-1 text-right">{error}</p>
        )}
      </div>

      {/* Mode pills */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("deg")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "deg"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          DEG
        </button>
        <button
          type="button"
          onClick={() => setMode("rad")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "rad"
              ? "bg-deep text-paper"
              : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          RAD
        </button>
        <span className="font-mono text-[10px] text-ink/40 ml-auto tracking-widest">
          TRIG USES {mode === "deg" ? "DEGREES" : "RADIANS"}
        </span>
      </div>

      {/* Scientific functions — 5 columns × 3 rows */}
      <div className="grid grid-cols-5 gap-2">
        {FUNCTIONS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => append(f.insert)}
            className="h-11 w-full rounded-lg bg-white text-ink/80 border border-ink/10 font-mono text-xs font-semibold hover:border-accent hover:text-accent transition-colors select-none"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Keypad — 4 columns × 5 rows */}
      <div className="grid grid-cols-4 gap-2">
        {PAD.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => handlePad(k.insert)}
            className={`h-12 w-full rounded-lg font-mono text-base font-semibold transition-colors select-none ${KIND_CLASS[k.kind]}`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              HISTORY
            </span>
            <button
              type="button"
              onClick={clearHistory}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
            >
              CLEAR
            </button>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
            {[...history].reverse().map((h, i) => (
              <button
                key={`${h.expr}-${i}`}
                type="button"
                onClick={() => {
                  setExpr(h.expr);
                  fresh.current = false;
                }}
                className="w-full flex items-baseline justify-between gap-3 px-4 py-2 text-left hover:bg-ink/5 transition-colors"
              >
                <span className="font-mono text-xs text-ink/50 break-all">
                  {h.expr}
                </span>
                <span className="font-mono text-sm font-semibold text-accent whitespace-nowrap">
                  = {h.result}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Keyboard supported —
        Enter calculates, Backspace deletes, Escape clears. Trigonometry
        follows the DEG/RAD toggle. After “=”, typing a number starts a new
        calculation.
      </div>
    </div>
  );
}
