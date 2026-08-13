"use client";

import { useMemo, useState } from "react";

type Mode = "csv-to-json" | "json-to-csv";

const DELIMITERS: { id: string; label: string; value: string }[] = [
  { id: "comma", label: "COMMA (,)", value: "," },
  { id: "semicolon", label: "SEMICOLON (;)", value: ";" },
  { id: "tab", label: "TAB", value: "\t" },
  { id: "pipe", label: "PIPE (|)", value: "|" },
];

const SAMPLE_CSV = `name,email,country,plan
Ana Souza,ana@example.com,Brazil,Free
Bruno Lima,bruno@example.com,Portugal,Pro
"Oliveira, Carlos",carlos@example.com,"United States, NY",Free`;

const SAMPLE_JSON = `[
  {
    "name": "Ana Souza",
    "email": "ana@example.com",
    "country": "Brazil",
    "plan": "Free"
  },
  {
    "name": "Bruno Lima",
    "email": "bruno@example.com",
    "country": "Portugal",
    "plan": "Pro"
  },
  {
    "name": "Oliveira, Carlos",
    "email": "carlos@example.com",
    "country": "United States, NY",
    "plan": "Free"
  }
]`;

/** RFC-4180-style CSV parser: handles quoted fields, escaped quotes and newlines inside quotes. */
function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvToJson(rows: string[][], hasHeader: boolean): string[][] {
  if (!hasHeader || rows.length === 0) return rows;
  return rows.slice(1);
}

function escapeCsvField(value: string, delimiter: string): string {
  if (/["\r\n]/.test(value) || value.includes(delimiter)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

type Result = {
  output: string;
  error: string | null;
  rows: number;
  cols: number;
};

export default function CsvJsonConverterClient() {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!input.trim()) {
      return { output: "", error: null, rows: 0, cols: 0 };
    }

    if (mode === "csv-to-json") {
      const rows = parseCsv(input, delimiter);
      if (rows.length === 0) {
        return { output: "", error: "No rows found in the CSV.", rows: 0, cols: 0 };
      }
      const header = hasHeader ? rows[0] : null;
      const data = header ? rows.slice(1) : rows;
      let output: unknown;
      if (header) {
        output = data.map((row) => {
          const obj: Record<string, string> = {};
          header.forEach((key, idx) => {
            obj[key] = row[idx] ?? "";
          });
          return obj;
        });
      } else {
        output = data;
      }
      const cols = Math.max(
        ...(hasHeader ? rows : rows.slice(1)).map((r) => r.length),
        0
      );
      return {
        output: JSON.stringify(output, null, 2),
        error: null,
        rows: data.length,
        cols,
      };
    }

    // json-to-csv
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid JSON",
        rows: 0,
        cols: 0,
      };
    }
    const items = Array.isArray(parsed)
      ? parsed
      : parsed !== null && typeof parsed === "object"
      ? [parsed]
      : null;
    if (!items) {
      return {
        output: "",
        error: "Input must be a JSON array of objects (or a single object).",
        rows: 0,
        cols: 0,
      };
    }
    if (items.length === 0) {
      return { output: "", error: "The JSON array is empty.", rows: 0, cols: 0 };
    }
    const invalid = items.find(
      (item) => item === null || typeof item !== "object" || Array.isArray(item)
    );
    if (invalid !== undefined) {
      return {
        output: "",
        error: "Every item in the array must be an object with named fields.",
        rows: 0,
        cols: 0,
      };
    }
    const keys: string[] = [];
    items.forEach((item) => {
      Object.keys(item as Record<string, unknown>).forEach((k) => {
        if (!keys.includes(k)) keys.push(k);
      });
    });
    const lines = items.map((item) => {
      const record = item as Record<string, unknown>;
      return keys
        .map((key) => {
          const value = record[key];
          if (value === null || value === undefined) return "";
          if (typeof value === "object") {
            return escapeCsvField(JSON.stringify(value), delimiter);
          }
          return escapeCsvField(String(value), delimiter);
        })
        .join(delimiter);
    });
    const csv = keys.join(delimiter) + "\n" + lines.join("\n");
    return { output: csv, error: null, rows: items.length, cols: keys.length };
  }, [mode, input, delimiter, hasHeader]);

  const copyOutput = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable: ignore
    }
  };

  const downloadOutput = () => {
    if (!result.output) return;
    const isJson = mode === "csv-to-json";
    const blob = new Blob(
      [isJson ? result.output : "\uFEFF" + result.output],
      { type: isJson ? "application/json" : "text/csv;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isJson ? "data.json" : "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = (nextMode: Mode) => {
    setMode(nextMode);
    setInput(nextMode === "csv-to-json" ? SAMPLE_CSV : SAMPLE_JSON);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          DIRECTION
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMode("csv-to-json")}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "csv-to-json"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            CSV → JSON
          </button>
          <button
            type="button"
            onClick={() => setMode("json-to-csv")}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "json-to-csv"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            JSON → CSV
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="csv-json-input"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          {mode === "csv-to-json" ? "CSV INPUT" : "JSON INPUT"}
        </label>
        <textarea
          id="csv-json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {mode === "csv-to-json" && (
        <>
          <div>
            <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              DELIMITER
            </span>
            <div className="flex gap-2 flex-wrap">
              {DELIMITERS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDelimiter(d.value)}
                  className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                    delimiter === d.value
                      ? "bg-deep text-paper"
                      : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm">
              First row is a header (use it as JSON keys)
            </span>
          </label>
        </>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => loadSample("csv-to-json")}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          SAMPLE CSV
        </button>
        <button
          type="button"
          onClick={() => loadSample("json-to-csv")}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          SAMPLE JSON
        </button>
        <button
          type="button"
          onClick={() => setInput("")}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          DATA
        </span>
        {result.rows > 0 ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {result.rows}
            </span>
            <span className="font-mono text-sm text-paper/70">
              rows · {result.cols} columns
            </span>
          </div>
        ) : (
          <span className="font-mono text-5xl font-semibold text-accent">—</span>
        )}
      </div>

      {result.error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {result.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            {mode === "csv-to-json" ? "JSON OUTPUT" : "CSV OUTPUT"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyOutput}
              disabled={!result.output}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
            <button
              type="button"
              onClick={downloadOutput}
              disabled={!result.output}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
            >
              DOWNLOAD
            </button>
          </div>
        </div>
        <textarea
          id="csv-json-output"
          readOnly
          value={result.output}
          rows={8}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y bg-paper"
        />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Standard CSV quoting is
        supported — fields with commas, quotes or line breaks are wrapped in
        double quotes. Downloading CSV adds a BOM so Excel opens accents
        correctly.
      </div>
    </div>
  );
}
