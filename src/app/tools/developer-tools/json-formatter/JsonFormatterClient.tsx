"use client";

import { useState } from "react";

type Mode = "beautify" | "minify";

interface JsonResult {
  output: string;
  valid: boolean;
  error?: string;
  originalSize?: number;
  outputSize?: number;
}

const SAMPLE_JSON = `{
  "name": "MultiTool",
  "version": 1.0,
  "features": ["fast", "free", "private"],
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "active": true
}`;

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("beautify");
  const [indent, setIndent] = useState(2);
  const [result, setResult] = useState<JsonResult | null>(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) {
      setResult({
        output: "",
        valid: false,
        error: "Please paste some JSON to process.",
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const output =
        mode === "beautify"
          ? JSON.stringify(parsed, null, indent)
          : JSON.stringify(parsed);

      setResult({
        output,
        valid: true,
        originalSize: new Blob([input]).size,
        outputSize: new Blob([output]).size,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setResult({
        output: "",
        valid: false,
        error: message,
      });
    }
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setResult(null);
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
  };

  const copyOutput = async () => {
    if (!result?.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const downloadOutput = () => {
    if (!result?.output) return;
    const blob = new Blob([result.output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "minify" ? "data.min.json" : "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Mode selector */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          MODE
        </span>
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => setMode("beautify")}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "beautify"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            BEAUTIFY
          </button>
          <button
            type="button"
            onClick={() => setMode("minify")}
            className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
              mode === "minify"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            MINIFY
          </button>
        </div>
      </div>

      {/* Indent (only for beautify) */}
      {mode === "beautify" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              INDENT SIZE
            </span>
            <span className="font-mono text-sm font-semibold text-accent">
              {indent} spaces
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[2, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIndent(n)}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-lg transition-colors ${
                  indent === n
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="json-input"
            className="font-mono text-xs tracking-widest text-ink/60"
          >
            INPUT JSON
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="font-mono text-[10px] tracking-widest text-ink/50 hover:text-accent transition-colors"
            >
              LOAD SAMPLE
            </button>
            <span className="text-ink/20">|</span>
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] tracking-widest text-ink/50 hover:text-accent transition-colors"
            >
              CLEAR
            </button>
          </div>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here, e.g. {"name":"John","age":30}'
          rows={8}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={process}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
      >
        {mode === "beautify" ? "BEAUTIFY JSON" : "MINIFY JSON"}
      </button>

      {/* Result — Success */}
      {result?.valid && (
        <>
          <div className="bg-deep rounded-lg px-5 py-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs text-paper/50 tracking-widest">
                ✓ VALID JSON — OUTPUT
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyOutput}
                  className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent transition-colors"
                >
                  {copied ? "✓ COPIED" : "COPY"}
                </button>
                <span className="text-paper/20">|</span>
                <button
                  type="button"
                  onClick={downloadOutput}
                  className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent transition-colors"
                >
                  DOWNLOAD
                </button>
              </div>
            </div>
            <pre className="font-mono text-xs text-accent overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
              {result.output}
            </pre>
          </div>

          {/* Size stats */}
          {result.originalSize !== undefined && result.outputSize !== undefined && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatBlock
                label="ORIGINAL SIZE"
                value={formatBytes(result.originalSize)}
              />
              <StatBlock
                label="OUTPUT SIZE"
                value={formatBytes(result.outputSize)}
              />
              <StatBlock
                label="DIFFERENCE"
                value={
                  result.outputSize > result.originalSize
                    ? `+${formatBytes(result.outputSize - result.originalSize)}`
                    : `−${formatBytes(result.originalSize - result.outputSize)}`
                }
                highlight
              />
            </div>
          )}
        </>
      )}

      {/* Result — Error */}
      {result && !result.valid && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span className="font-mono text-xs tracking-widest text-red-700 block mb-1">
            ✗ INVALID JSON
          </span>
          <span className="font-mono text-sm text-red-800">
            {result.error}
          </span>
        </div>
      )}

      {!result && (
        <p className="text-sm text-ink/50 text-center italic">
          Paste your JSON and click the button to process.
        </p>
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